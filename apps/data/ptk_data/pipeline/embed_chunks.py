"""
Embed Dallas College resource chunks into multilingual vector embeddings.

Shared Multilingual Model: multilingual-e5-small (384 dimensions)
Ingestion format: "passage: <chunk_text>"
Query format: "query: <student_query>"
"""

from __future__ import annotations

import argparse
from datetime import datetime, timezone
import hashlib
import json
import math
from pathlib import Path
import sys
from typing import Any, Sequence

import numpy as np

# Contract defaults
DEFAULT_MODEL = "multilingual-e5-small"
EMBEDDING_DIMENSIONS = 384
DEFAULT_BATCH_SIZE = 32
E5_PASSAGE_PREFIX = "passage: "
E5_QUERY_PREFIX = "query: "

# Whitelist of models strictly adhering to the 384-dimensional multilingual contract
SUPPORTED_MODELS = {
    "multilingual-e5-small": {
        "engine": "onnx",
        "repo_id": "Xenova/multilingual-e5-small",
        "dimensions": EMBEDDING_DIMENSIONS,
        "prefix_passage": E5_PASSAGE_PREFIX,
        "prefix_query": E5_QUERY_PREFIX,
    },
    "intfloat/multilingual-e5-small": {
        "engine": "onnx",
        "repo_id": "Xenova/multilingual-e5-small",
        "dimensions": EMBEDDING_DIMENSIONS,
        "prefix_passage": E5_PASSAGE_PREFIX,
        "prefix_query": E5_QUERY_PREFIX,
    },
    "xenova/multilingual-e5-small": {
        "engine": "onnx",
        "repo_id": "Xenova/multilingual-e5-small",
        "dimensions": EMBEDDING_DIMENSIONS,
        "prefix_passage": E5_PASSAGE_PREFIX,
        "prefix_query": E5_QUERY_PREFIX,
    },
    "sentence-transformers/paraphrase-multilingual-minilm-l12-v2": {
        "engine": "fastembed",
        "repo_id": "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2",
        "dimensions": EMBEDDING_DIMENSIONS,
        "prefix_passage": "",
        "prefix_query": "",
    },
}


class MultilingualEmbedder:
    """
    Multilingual embedding engine configured for 384-dimensional unit-norm vectors.
    Supports Xenova/multilingual-e5-small ONNX runtime as well as FastEmbed models.
    """

    def __init__(self, model_name: str = DEFAULT_MODEL):
        model_key = model_name.strip().lower()
        if model_key not in SUPPORTED_MODELS:
            supported_names = ", ".join(f"'{m}'" for m in sorted(SUPPORTED_MODELS.keys()))
            raise ValueError(
                f"Unsupported model '{model_name}'. Shared contract requires a 384-dimensional "
                f"multilingual model. Supported models: {supported_names}"
            )

        self.model_name = model_name
        self.config = SUPPORTED_MODELS[model_key]
        self.dimensions = self.config["dimensions"]
        self.prefix_passage = self.config["prefix_passage"]
        self.prefix_query = self.config["prefix_query"]

        self._session = None
        self._tokenizer = None
        self._fastembed_model = None

        self._init_model()

    def _init_model(self) -> None:
        """Initializes the underlying inference engine."""
        if self.config["engine"] == "onnx":
            from huggingface_hub import hf_hub_download
            import onnxruntime as ort
            from tokenizers import Tokenizer

            hub_repo = self.config["repo_id"]
            tok_path = hf_hub_download(repo_id=hub_repo, filename="tokenizer.json")
            onnx_path = hf_hub_download(repo_id=hub_repo, filename="onnx/model_quantized.onnx")

            self._tokenizer = Tokenizer.from_file(tok_path)
            self._tokenizer.enable_truncation(max_length=512)
            self._tokenizer.enable_padding()

            opts = ort.SessionOptions()
            opts.graph_optimization_level = ort.GraphOptimizationLevel.ORT_ENABLE_ALL
            self._session = ort.InferenceSession(onnx_path, sess_options=opts)
        elif self.config["engine"] == "fastembed":
            from fastembed import TextEmbedding

            hub_repo = self.config["repo_id"]
            self._fastembed_model = TextEmbedding(model_name=hub_repo)

    def embed_passages(self, texts: Sequence[str], batch_size: int = DEFAULT_BATCH_SIZE) -> list[list[float]]:
        """
        Embeds a sequence of resource passage chunks, applying passage prefix if configured.
        Returns a list of 384-dimensional unit-norm float arrays.
        """
        prefix = self.prefix_passage
        prefixed = [
            f"{prefix}{t}" if prefix and not t.startswith(prefix) else t
            for t in texts
        ]
        return self._embed_batches(prefixed, batch_size=batch_size)

    def embed_queries(self, queries: Sequence[str], batch_size: int = DEFAULT_BATCH_SIZE) -> list[list[float]]:
        """
        Embeds a sequence of user search queries, applying query prefix if configured.
        Returns a list of 384-dimensional unit-norm float arrays.
        """
        prefix = self.prefix_query
        prefixed = [
            f"{prefix}{q}" if prefix and not q.startswith(prefix) else q
            for q in queries
        ]
        return self._embed_batches(prefixed, batch_size=batch_size)

    def _embed_batches(self, texts: Sequence[str], batch_size: int = DEFAULT_BATCH_SIZE) -> list[list[float]]:
        if not isinstance(batch_size, int) or batch_size <= 0:
            raise ValueError(f"batch_size must be a positive integer, got {batch_size}")

        if not texts:
            return []

        all_vectors: list[list[float]] = []

        for i in range(0, len(texts), batch_size):
            batch = list(texts[i : i + batch_size])
            if self._session is not None and self._tokenizer is not None:
                vectors = self._embed_batch_onnx(batch)
            else:
                vectors = self._embed_batch_fastembed(batch)
            all_vectors.extend(vectors)

        return all_vectors

    def _embed_batch_onnx(self, batch_texts: list[str]) -> list[list[float]]:
        encodings = self._tokenizer.encode_batch(batch_texts)
        input_ids = np.array([e.ids for e in encodings], dtype=np.int64)
        attention_mask = np.array([e.attention_mask for e in encodings], dtype=np.int64)
        token_type_ids = np.array([e.type_ids for e in encodings], dtype=np.int64)

        outputs = self._session.run(
            None,
            {
                "input_ids": input_ids,
                "attention_mask": attention_mask,
                "token_type_ids": token_type_ids,
            },
        )
        token_embeddings = outputs[0]  # [batch_size, seq_len, dimensions]

        # Mean pooling over attention mask
        mask = np.expand_dims(attention_mask, -1)
        sum_embeddings = np.sum(token_embeddings * mask, axis=1)
        sum_mask = np.clip(mask.sum(axis=1), a_min=1e-9, a_max=None)
        pooled = sum_embeddings / sum_mask

        # L2 normalization to unit vectors
        norm = np.linalg.norm(pooled, axis=1, keepdims=True)
        norm = np.clip(norm, a_min=1e-12, a_max=None)
        normalized = pooled / norm

        # Validate dimensions and return as regular float lists
        result = []
        for vec in normalized:
            vec_list = [float(v) for v in vec]
            validate_vector(vec_list, expected_dim=self.dimensions)
            result.append(vec_list)

        return result

    def _embed_batch_fastembed(self, batch_texts: list[str]) -> list[list[float]]:
        generator = self._fastembed_model.embed(batch_texts)
        result = []
        for raw_vec in generator:
            vec_arr = np.array(raw_vec, dtype=np.float32)
            norm = float(np.linalg.norm(vec_arr))
            if norm > 0:
                vec_arr = vec_arr / norm
            vec_list = [float(v) for v in vec_arr]
            validate_vector(vec_list, expected_dim=self.dimensions)
            result.append(vec_list)
        return result


def validate_vector(vector: Sequence[float], expected_dim: int = EMBEDDING_DIMENSIONS) -> None:
    """Asserts that the vector is a finite, numeric, unit-norm vector of expected dimensions."""
    if not isinstance(vector, (list, tuple)):
        raise ValueError(f"Vector must be a list of floats, got {type(vector)}")
    if len(vector) != expected_dim:
        raise ValueError(f"Vector dimension {len(vector)} does not match expected {expected_dim}")
    if any(not isinstance(x, (int, float)) or not math.isfinite(x) for x in vector):
        raise ValueError("Vector contains non-numeric or non-finite values (NaN / Inf)")
    norm = math.hypot(*vector)
    if not (0.98 <= norm <= 1.02):
        raise ValueError(f"Vector must be unit norm (expected ~1.0, got {norm:.4f})")


def run_cross_lingual_sanity_check(embedder: MultilingualEmbedder) -> dict[str, float]:
    """
    Verifies semantic alignment across languages by checking cosine similarity
    between an English resource passage and cross-lingual student queries (Spanish,
    English, Swahili) against an unrelated query.
    """
    passage = [
        "Dallas College offers free English as a Second Language classes at night and on weekends for adult learners."
    ]
    queries = {
        "es_query": "¿Dónde puedo tomar clases de inglés gratis por la noche o fines de semana?",
        "en_query": "How do I register for free evening and weekend ESL courses?",
        "sw_query": "Ninawezaje kujiandikisha kwa madarasa ya bure ya Kiingereza usiku?",
        "unrelated": "What are the ingredients and instructions for baking chocolate chip cookies?",
    }

    passage_vec = np.array(embedder.embed_passages(passage)[0])

    scores = {}
    for label, query_text in queries.items():
        query_vec = np.array(embedder.embed_queries([query_text])[0])
        cosine_sim = float(np.dot(passage_vec, query_vec))
        scores[label] = cosine_sim

    # Sanity criteria: English, Spanish, and Swahili should all have high similarity (>= 0.70)
    # and significantly outperform the unrelated distractor.
    unrelated_score = scores["unrelated"]
    for lang_key, min_threshold in [("es_query", 0.70), ("en_query", 0.70), ("sw_query", 0.70)]:
        score = scores[lang_key]
        if score < min_threshold:
            raise ValueError(
                f"Cross-lingual sanity check failed: {lang_key} similarity {score:.4f} is below {min_threshold:.2f} threshold"
            )
        if score <= unrelated_score:
            raise ValueError(
                f"Cross-lingual sanity check failed: {lang_key} ({score:.4f}) did not outperform unrelated ({unrelated_score:.4f})"
            )

    return scores


def process_extracted_chunks(
    input_path: Path,
    output_path: Path,
    batch_size: int = DEFAULT_BATCH_SIZE,
    model_name: str = DEFAULT_MODEL,
    run_sanity: bool = False,
) -> dict | list:
    """
    Loads chunked JSON (envelope or flat list), calculates multilingual embeddings
    for every chunk, validates output, and writes enriched data to output_path.
    """
    if not isinstance(batch_size, int) or batch_size <= 0:
        raise ValueError(f"batch_size must be a positive integer, got {batch_size}")

    if not input_path.exists():
        raise FileNotFoundError(f"Input file not found at: {input_path}")

    raw_text = input_path.read_text(encoding="utf-8")
    data = json.loads(raw_text)

    is_envelope = isinstance(data, dict) and "chunks" in data
    chunks: list[dict[str, Any]] = data["chunks"] if is_envelope else data

    if not isinstance(chunks, list):
        raise ValueError("Input JSON must contain a 'chunks' list or be a list of chunk objects")

    # Validate chunk records and metadata before embedding
    for idx, chunk in enumerate(chunks):
        if not isinstance(chunk, dict):
            raise ValueError(
                f"Chunk at index {idx} must be a JSON object (dict), got {type(chunk).__name__}"
            )
        if "metadata" in chunk and chunk["metadata"] is not None and not isinstance(chunk["metadata"], dict):
            raise ValueError(
                f"Chunk at index {idx} metadata must be a JSON object (dict), got {type(chunk['metadata']).__name__}"
            )
        chunk_text = chunk.get("chunk_text")
        if not isinstance(chunk_text, str) or not chunk_text.strip():
            raise ValueError(f"Chunk at index {idx} contains empty or missing 'chunk_text'")

    print(f"[*] Initializing multilingual embedding model: {model_name} (dimensions={EMBEDDING_DIMENSIONS})")
    embedder = MultilingualEmbedder(model_name=model_name)

    if run_sanity:
        print("[*] Running cross-lingual sanity check...")
        sanity_scores = run_cross_lingual_sanity_check(embedder)
        print(f"    [✓] Sanity check passed!")
        for lang, score in sanity_scores.items():
            print(f"        - {lang}: {score:.4f}")

    if not chunks:
        print("[!] Input contains 0 chunks. Writing empty output.")
        output_data = data if is_envelope else []
        output_path.parent.mkdir(parents=True, exist_ok=True)
        output_path.write_text(json.dumps(output_data, indent=2, ensure_ascii=False), encoding="utf-8")
        return output_data

    print(f"[*] Processing {len(chunks)} chunks in batches of {batch_size}...")
    chunk_texts = [c["chunk_text"] for c in chunks]

    # Generate embeddings
    vectors = embedder.embed_passages(chunk_texts, batch_size=batch_size)

    if len(vectors) != len(chunks):
        raise RuntimeError(
            f"Embedding model returned {len(vectors)} vectors for {len(chunks)} chunks (count mismatch)"
        )

    # Attach vectors and metadata provenance
    for idx, chunk in enumerate(chunks):
        vector = vectors[idx]
        chunk["embedding"] = vector

        meta = chunk.setdefault("metadata", {})
        meta["embedding_model"] = model_name
        meta["embedding_dimensions"] = EMBEDDING_DIMENSIONS
        meta["embedding_text_sha256"] = hashlib.sha256(chunk["chunk_text"].encode("utf-8")).hexdigest()

    now_iso = datetime.now(timezone.utc).isoformat()

    if is_envelope:
        data["embedding_model"] = model_name
        data["embedding_dimensions"] = EMBEDDING_DIMENSIONS
        data["embedded_at"] = now_iso
        data["total_chunks"] = len(chunks)

        # Update manifest if present
        if "manifest" in data and isinstance(data["manifest"], list):
            for doc in data["manifest"]:
                if isinstance(doc, dict):
                    doc["embedding_model"] = model_name

        output_data = data
    else:
        output_data = chunks

    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(
        json.dumps(output_data, indent=2, ensure_ascii=False),
        encoding="utf-8",
    )

    print(f"[✓] Embedding pipeline completed successfully!")
    print(f"    - Total chunks embedded: {len(chunks)}")
    print(f"    - Embedding dimensions:  {EMBEDDING_DIMENSIONS}")
    print(f"    - Model used:            {model_name}")
    print(f"    - Output saved to:       {output_path}")

    return output_data


def positive_int(value: str) -> int:
    try:
        ivalue = int(value)
    except ValueError:
        raise argparse.ArgumentTypeError(f"Batch size must be an integer, got '{value}'")
    if ivalue <= 0:
        raise argparse.ArgumentTypeError(f"Batch size must be greater than 0, got {ivalue}")
    return ivalue


def main(argv: Sequence[str] | None = None) -> None:
    parser = argparse.ArgumentParser(
        description="Generate 384-dimensional multilingual vector embeddings for Dallas College resource chunks."
    )
    parser.add_argument(
        "-i", "--input",
        type=Path,
        default=Path("Resources/Json/extracted_chunks.json"),
        help="Path to input extracted_chunks.json (default: Resources/Json/extracted_chunks.json)",
    )
    parser.add_argument(
        "-o", "--output",
        type=Path,
        default=Path("Resources/Json/extracted_chunks_embedded.json"),
        help="Path for output embedded JSON file (default: Resources/Json/extracted_chunks_embedded.json)",
    )
    parser.add_argument(
        "-b", "--batch-size",
        type=positive_int,
        default=DEFAULT_BATCH_SIZE,
        help=f"Number of chunks per embedding batch (default: {DEFAULT_BATCH_SIZE})",
    )
    parser.add_argument(
        "-m", "--model",
        type=str,
        default=DEFAULT_MODEL,
        help=f"Embedding model identifier (default: {DEFAULT_MODEL})",
    )
    parser.add_argument(
        "--sanity-check",
        action="store_true",
        help="Execute cross-lingual cosine similarity sanity verification",
    )

    args = parser.parse_args(argv)

    try:
        process_extracted_chunks(
            input_path=args.input,
            output_path=args.output,
            batch_size=args.batch_size,
            model_name=args.model,
            run_sanity=args.sanity_check,
        )
    except Exception as e:
        print(f"[!] Error: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
