from __future__ import annotations

from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import (
    BigInteger,
    CheckConstraint,
    Identity,
    Text,
    UniqueConstraint,
    func,
)
from sqlalchemy.dialects.postgresql import TIMESTAMP
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base

if TYPE_CHECKING:
    from .resource_chunk import ResourceChunk


class Resource(Base):
    """One PTK-approved source document with a title and citation URL."""

    __tablename__ = "resource"
    __table_args__ = (
        UniqueConstraint("doc_id", name="uq_resource_doc_id"),
        CheckConstraint(
            "length(trim(title, ' \t\n\r\f\v')) > 0",
            name="ck_resource_title_present",
        ),
        CheckConstraint(
            "length(trim(source_url, ' \t\n\r\f\v')) > 0",
            name="ck_resource_source_url_present",
        ),
    )

    id: Mapped[int] = mapped_column(BigInteger, Identity(always=True), primary_key=True)

    # Documents have unique export IDs and can share a citation URL.
    doc_id: Mapped[str] = mapped_column(Text, nullable=False)
    title: Mapped[str] = mapped_column(Text, nullable=False)
    source_url: Mapped[str] = mapped_column(Text, nullable=False)
    content_hash: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=True), nullable=False, server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=True),
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )

    chunks: Mapped[list[ResourceChunk]] = relationship(
        back_populates="resource",
        order_by="ResourceChunk.chunk_index",
        cascade="all, delete-orphan",
        # The database cascades deletes to chunks the session has yet to load.
        passive_deletes=True,
    )
