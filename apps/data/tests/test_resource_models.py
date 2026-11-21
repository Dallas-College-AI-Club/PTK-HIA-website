import unittest

from sqlalchemy import create_engine, delete, select
from sqlalchemy.dialects import postgresql
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from sqlalchemy.schema import CreateIndex, CreateTable

from ptk_data.models import Base, ChatSession, KnowledgeEntry, Resource, ResourceChunk


CITATION = "https://www.dallascollege.edu/students/dreamers/"
EMBEDDING = [1.0] + [0.0] * 383


class ResourceSchemaTests(unittest.TestCase):
    def test_models_share_the_existing_base(self):
        for model in (ChatSession, KnowledgeEntry, Resource, ResourceChunk):
            with self.subTest(model=model.__name__):
                self.assertTrue(issubclass(model, Base))
                self.assertIs(model.__table__.metadata, Base.metadata)

    def test_postgresql_schema_defines_embedding_timestamps_and_lookup_index(self):
        dialect = postgresql.dialect()
        resource_ddl = str(CreateTable(Resource.__table__).compile(dialect=dialect))
        chunk_ddl = str(CreateTable(ResourceChunk.__table__).compile(dialect=dialect))
        index_statements = [
            str(CreateIndex(index).compile(dialect=dialect))
            for index in ResourceChunk.__table__.indexes
        ]

        self.assertIn("embedding HALFVEC(384) NOT NULL", chunk_ddl)
        self.assertIn("created_at TIMESTAMP WITH TIME ZONE", chunk_ddl)
        self.assertIn("created_at TIMESTAMP WITH TIME ZONE", resource_ddl)
        self.assertIn("updated_at TIMESTAMP WITH TIME ZONE", resource_ddl)
        self.assertIn(
            "CREATE INDEX ix_resource_chunk_resource_id ON resource_chunk (resource_id)",
            index_statements,
        )


class ResourceConstraintTests(unittest.TestCase):
    def setUp(self):
        self.engine = create_engine("sqlite://")
        self.addCleanup(self.engine.dispose)
        with self.engine.begin() as connection:
            connection.exec_driver_sql("PRAGMA foreign_keys = ON")
            Base.metadata.create_all(
                connection, tables=[Resource.__table__, ResourceChunk.__table__]
            )

        # Use explicit IDs for SQLite, which only auto-generates INTEGER primary keys.
        with Session(self.engine) as session:
            session.add_all([
                Resource(
                    id=1,
                    doc_id="community-resources",
                    title="Community Resources",
                    source_url=CITATION,
                    content_hash="community-hash",
                    chunks=[
                        ResourceChunk(
                            id=1, chunk_index=1, content="Local services.", embedding=EMBEDDING
                        ),
                        ResourceChunk(
                            id=2, chunk_index=0, content="Campus services.", embedding=EMBEDDING
                        ),
                    ],
                ),
                Resource(
                    id=2,
                    doc_id="dreamers-community-resources",
                    title="Dreamers - Community Resources",
                    source_url=CITATION,
                    content_hash="dreamers-hash",
                    chunks=[
                        ResourceChunk(
                            id=3, chunk_index=0, content="Student support.", embedding=EMBEDDING
                        ),
                    ],
                ),
            ])
            session.commit()

    def test_documents_can_share_a_citation_and_each_have_a_chunk_at_index_zero(self):
        with Session(self.engine) as session:
            index_zero = select(ResourceChunk).where(ResourceChunk.chunk_index == 0)
            chunks = session.scalars(index_zero.order_by(ResourceChunk.resource_id)).all()

            self.assertEqual(
                [chunk.resource.doc_id for chunk in chunks],
                ["community-resources", "dreamers-community-resources"],
            )
            self.assertEqual([chunk.resource.source_url for chunk in chunks], [CITATION, CITATION])
            self.assertEqual([chunk.chunk_index for chunk in chunks[0].resource.chunks], [0, 1])

    def test_duplicate_index_is_rejected_for_either_document(self):
        for resource_id in (1, 2):
            with self.subTest(resource_id=resource_id):
                self.assert_insert_rejected(ResourceChunk(
                    id=4,
                    resource_id=resource_id,
                    chunk_index=0,
                    content="Duplicate position.",
                    embedding=EMBEDDING,
                ))

    def test_invalid_resource_fields_are_rejected(self):
        for invalid in (
            {"doc_id": "community-resources"},
            {"title": None},
            {"title": " "},
            {"source_url": None},
            {"source_url": " "},
        ):
            with self.subTest(invalid=invalid):
                fields = {
                    "doc_id": "new-resource",
                    "title": "New resource",
                    "source_url": CITATION,
                    "content_hash": "new-hash",
                }
                fields.update(invalid)
                self.assert_insert_rejected(Resource(id=3, **fields))

    def test_invalid_chunk_fields_are_rejected(self):
        for invalid in (
            {"resource_id": None},
            {"resource_id": 999},
            {"chunk_index": -1},
            {"content": None},
            {"content": ""},
            {"content": " \t\n"},
            {"embedding": None},
        ):
            with self.subTest(invalid=invalid):
                fields = {
                    "resource_id": 1,
                    "chunk_index": 2,
                    "content": "Another section.",
                    "embedding": EMBEDDING,
                }
                fields.update(invalid)
                self.assert_insert_rejected(ResourceChunk(id=4, **fields))

    def test_deleting_a_resource_removes_its_chunks_in_the_database(self):
        with self.engine.begin() as connection:
            connection.execute(delete(Resource).where(Resource.id == 1))

        with Session(self.engine) as session:
            self.assertEqual(session.scalars(select(ResourceChunk.resource_id)).all(), [2])

    def assert_insert_rejected(self, record):
        with Session(self.engine) as session:
            session.add(record)
            with self.assertRaises(IntegrityError):
                session.flush()
