# PTK Python Data Pipeline

Python prepares PTK-approved resources and imports them into PostgreSQL.
Next.js handles the website and API endpoints.

The setup steps below do not connect to a database, create tables, or import data.

## Setup

Install uv: https://docs.astral.sh/uv/getting-started/installation/

From the repository root, run:

```bash
cd apps/data
uv sync
cp .env.example .env
```

The `.python-version` file selects Python 3.13.
Leave `DATABASE_URL` empty for this initial setup.
No database connection or AI credentials are required.

The local `.env` file is ignored by Git. Never commit credentials.

## Verify

Run these commands from `apps/data`:

```bash
uv run python --version
uv run python -c "import ptk_data; import sqlalchemy; import psycopg; import dotenv; print('Imports OK')"
```

Expect Python 3.13.x and `Imports OK`.

## Files and folders

- `ptk_data/`: Python package for resource preparation and imports.
- `ptk_data/models/`: Shared SQLAlchemy base, PTK resource models, and copied Success Coach models.
- `ptk_data/pipeline/`: Data ingestion, chunking, and embedding pipelines:
  - `convert_to_markdown.py`: Scrapes and converts Dallas College resource pages and PDFs into clean Markdown (#10).
  - `chunk_resources.py`: Extracts and chunks Markdown files into structured JSON records with stable `doc_id` and SHA-256 hashes (#39).
  - `embed_chunks.py`: Generates 384-dimensional multilingual vector embeddings using `Xenova/multilingual-e5-small` (#45).
- `pyproject.toml`: Project metadata and required dependencies.
- `uv.lock`: Resolved dependency versions for reproducible installations.
- `.python-version`: Python version selected for development.
- `.env.example`: Shareable configuration template with no credentials.
- `.venv/`: Local Python environment created by uv; ignored by Git.

## Success Coach models import

The files in `ptk_data/models/` are copied from the [Success Coach models folder](https://github.com/Dallas-College-AI-Club/success-coach-chatbot/tree/180e4a43dbcf847ddd7db9341520f4919b3c75e9/apps/data/dallasai/models).
The original `KnowledgeEntry` model uses PostgreSQL-specific types and the
Python `pgvector` package, installed by `uv sync`.

To check the copied models, run this command from `apps/data`:

```bash
uv run python -c "from ptk_data.models import ChatSession, KnowledgeEntry; print('Models OK')"
```

In VS Code, use **Python: Select Interpreter** and choose
`apps/data/.venv/bin/python`.

## PTK resource schema

`Resource` describes one source document. `ResourceChunk` holds a section of
that document and the embedding used to retrieve it. To find the citation for
a retrieved chunk, read `chunk.resource.source_url`.

| `resource` field | Meaning |
|---|---|
| `id` | Database-generated primary key. |
| `doc_id` | Unique identifier from the export, based on the document's relative path. Renaming the file can change this identifier. |
| `title` | Required title from the export's chunk records. |
| `source_url` | Required citation URL from the chunk records. Several documents can cite the same URL. |
| `content_hash` | The manifest's `source_hash`, used to detect changes to the document. |
| `created_at`, `updated_at` | Timezone-aware timestamps set on insert. SQLAlchemy refreshes `updated_at` when it updates the resource row. |

| `resource_chunk` field | Meaning |
|---|---|
| `id` | Database-generated primary key. |
| `resource_id` | Required, indexed foreign key to `resource.id`. |
| `chunk_index` | Zero-based position from the export. Each position can appear once per resource. |
| `content` | The export's `chunk_text`. Empty or whitespace-only text is rejected. |
| `embedding` | Required 384-value vector from the multilingual E5 export, stored as PostgreSQL `HALFVEC(384)`. |
| `created_at` | Timezone-aware creation timestamp set by the database. |

Join the export's `manifest` and `chunks` by `doc_id`. A resource's chunks load
in index order. Deleting a resource deletes all its chunks through the database
foreign key. Removing a chunk from the resource's SQLAlchemy collection also
deletes that chunk when the session flushes.

The model imports only register table definitions. Schema initialization in
#16 needs the PostgreSQL `vector` extension and should pass only
`Resource.__table__` and `ResourceChunk.__table__` to the shared metadata,
which also holds the Success Coach tables.

Run the focused schema tests from `apps/data` without credentials.

```bash
uv run python -m unittest discover -s tests -v
```

The tests use an in-memory SQLite database for relationships and constraints
and compile the table definitions with the PostgreSQL dialect to check the
vector type and timezone-aware timestamps.

## Markdown Chunking Pipeline

The chunking pipeline extracts scraped Markdown files into structured JSON records with stable document identity, source hashes, and chunk hashes.

### Running the pipeline

```bash
cd apps/data
# Standard envelope output (authoritative manifest + chunks)
uv run python -m ptk_data.pipeline.chunk_resources -i "<path_to_markdowns>" -o "<path_to_output.json>"

# Flat list output (compatibility mode without manifest envelope)
uv run python -m ptk_data.pipeline.chunk_resources -i "<path_to_markdowns>" -o "<path_to_output.json>" --format list
```

### Running unit tests

```bash
cd apps/data
uv run pytest
```

## Importer Reconciliation Guide

Use this reconciliation strategy when importing exported chunks into PostgreSQL.
The SQL examples below show the copied `KnowledgeEntry` schema. For the PTK models,
use the [PTK resource schema](#ptk-resource-schema) and the import contract in #47.

### 1. Document Identity (`doc_id`) & Versioning
Each document is assigned a stable `doc_id` derived from its POSIX path relative to the input folder (e.g., `esl/night-classes`). Even if two files share the same basename in different subdirectories, their `doc_id` values remain unique and stable across runs.

Each export payload also contains:
* `pipeline_version`: Version of the chunking engine (e.g., `"1.0.0"`).
* `source_hash`: Full SHA-256 fingerprint of the raw source markdown file.
* `content_hash`: Per-chunk SHA-256 fingerprint of `chunk_text`.
* `manifest`: An authoritative list of all processed documents and their chunk counts.

### 2. Output Formats & Pruning Safety
* **Envelope format (`--format envelope`, default):** Contains the authoritative `manifest`, metadata flags (`is_complete_run`, `allow_prune`), and the array of `chunks`. Pruning/reconciliation is only permitted when `allow_prune: True` and `is_complete_run: True`.
* **Flat list format (`--format list`):** Outputs a bare array of chunk records for simple consumers. Because it omits the authoritative manifest, **pruning is strictly disabled** when consuming list format exports.
* **Empty-scan safeguard:** If 0 markdown files are discovered, `chunk_resources.py` aborts with an error to prevent accidental deletion. Passing `--allow-empty` forces `is_complete_run: False` and `allow_prune: False` so downstream importers will never trigger mass pruning.

### 3. Fast-Path (Skip Unchanged Documents)
Before re-processing or re-embedding chunks, the importer should check:
```sql
SELECT metadata->>'source_hash' AS source_hash, metadata->>'pipeline_version' AS pipeline_version
FROM knowledge_entry
WHERE metadata->>'doc_id' = :doc_id
LIMIT 1;
```
If both `source_hash` and `pipeline_version` match the export record, the importer can safely skip the document without recomputing vector embeddings.

### 4. Safe Transactional Upsert & Stale Chunk Cleanup
When a document's `source_hash` differs or it is new:
1. Open a database transaction.
2. Delete all existing chunks for that `doc_id`:
   ```sql
   DELETE FROM knowledge_entry WHERE metadata->>'doc_id' = :doc_id;
   ```
3. If the document produced `chunk_count > 0`, insert the new chunks with ordered `chunk_index` (0 to N-1).
4. If a document produced `chunk_count = 0` (e.g., an empty markdown file), the deletion in Step 2 ensures stale chunks are removed, and no new rows are inserted.
5. Commit the transaction.

### 5. Authoritative Deletion of Removed Files
If the export manifest represents a complete, authoritative scan of the knowledge base (`is_complete_run: True` and `allow_prune: True`), any `doc_id` currently stored in PostgreSQL that does not appear in `manifest` can be deleted transactionally. Never delete missing documents from partial, single-file, or flat list runs.

### 6. Database Constraint Analysis: `doc_id` vs `(source_url, chunk_index)`
The legacy Success Coach `KnowledgeEntry` model enforces:
```python
UniqueConstraint("source_url", "chunk_index", name="uq_knowledge_entry_source_chunk")
```
* **Constraint Reality:** PostgreSQL enforces table constraints on table columns (`source_url`, `chunk_index`). Adding `doc_id` into the JSONB `metadata` column **does not alter or satisfy** this constraint.
* **Collision Risk:** If two distinct documents share the same real Dallas College citation URL (e.g., `esl/night.md` and `esl/weekend.md` both citing `https://www.dallascollege.edu/study/esl/`), both will produce chunks at `chunk_index = 0`. Inserting the second document will trigger a database `UniqueViolation`.
* **PTK schema:** `ResourceChunk` scopes chunk positions to the resource using `UniqueConstraint("resource_id", "chunk_index")`.



## Multilingual Vector Embedding Pipeline

The embedding pipeline generates 384-dimensional multilingual vector embeddings for Dallas College resource chunks, allowing queries in English, Spanish, Arabic, Burmese, and Swahili to semantically match campus resources.

### Dataset Status (Issue #45)

- **Input Chunks:** `Resources/Json/extracted_chunks.json` (120 chunks with authoritative manifest envelope)
- **Embedded Vectors Output:** `Resources/Json/extracted_chunks_embedded.json` (120 chunks, each with 384 unit-norm floats)
- **Storage:** Persisted locally in `Resources/Json/` (git-ignored) and synced to the team shared Google Drive folder.

### Running the pipeline

```bash
cd apps/data
# Standard execution (reads extracted_chunks.json, outputs extracted_chunks_embedded.json)
uv run python -m ptk_data.pipeline.embed_chunks -i "<path_to_extracted_chunks.json>" -o "<path_to_embedded_output.json>"

# Custom batch size and model with cross-lingual sanity verification
uv run python -m ptk_data.pipeline.embed_chunks -i "Resources/Json/extracted_chunks.json" -o "Resources/Json/extracted_chunks_embedded.json" -b 32 --sanity-check
```

### Shared Multilingual Model Contract (Issue #45)

* **Model:** `intfloat/multilingual-e5-small` / `Xenova/multilingual-e5-small`
* **Output Dimensions:** `384` floats (aligns with `ResourceChunk.embedding`, stored as `HALFVEC(384)`)
* **Normalization:** Unit L2 norm (`norm = 1.0`, enabling fast cosine similarity via dot product)
* **Ingestion Prefix:** Chunks must be prefixed with `passage: ` before embedding:
  ```python
  text_to_embed = f"passage: {chunk_text}"
  ```
* **Search Query Prefix (Next.js Retrieval):** Student queries must be prefixed with `query: `:
  ```typescript
  const queryToEmbed = `query: ${studentQuery}`;
  ```

### Next.js `/api/chat` Integration Guide

When implementing RAG search in Next.js (`/api/chat`):

```typescript
import { pipeline } from "@huggingface/transformers";

const extractor = await pipeline("feature-extraction", "Xenova/multilingual-e5-small", {
   dtype: "int8", // or "fp32"
});

export async function embedQuery(query: string): Promise<number[]> {
   const output = await extractor(`query: ${query}`, {
      pooling: "mean",
      normalize: true,
   });
   return Array.from(output.data);
}
```

In SQL vector search (pgvector):
```sql
SELECT id, title, chunk_text, 1 - (embedding <=> :query_vector) AS cosine_similarity
FROM knowledge_entry
ORDER BY embedding <=> :query_vector
LIMIT 5;
```

### Running unit tests

```bash
cd apps/data
uv run pytest
```
