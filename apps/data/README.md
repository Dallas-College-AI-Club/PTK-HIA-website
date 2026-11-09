# PTK Python Data Pipeline

Python prepares PTK-approved resources and imports them into PostgreSQL.
Next.js handles the website and API endpoints.

This initial setup does not connect to a database, define tables, or import data.

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
- `ptk_data/models/`: Reserved for future SQLAlchemy database models.
- `ptk_data/pipeline/`: Reserved for future preparation and import steps.
- `pyproject.toml`: Project metadata and required dependencies.
- `uv.lock`: Resolved dependency versions for reproducible installations.
- `.python-version`: Python version selected for development.
- `.env.example`: Shareable configuration template with no credentials.
- `.venv/`: Local Python environment created by uv; ignored by Git.
