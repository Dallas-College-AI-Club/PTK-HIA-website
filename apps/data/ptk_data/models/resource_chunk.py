from __future__ import annotations

from datetime import datetime
from typing import TYPE_CHECKING

from pgvector.sqlalchemy import HALFVEC
from sqlalchemy import (
    BigInteger,
    CheckConstraint,
    ForeignKey,
    Identity,
    Index,
    Integer,
    Text,
    UniqueConstraint,
    func,
)
from sqlalchemy.dialects.postgresql import TIMESTAMP
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base

if TYPE_CHECKING:
    from .resource import Resource


class ResourceChunk(Base):
    """An ordered section of a resource and its search embedding."""

    __tablename__ = "resource_chunk"
    __table_args__ = (
        UniqueConstraint("resource_id", "chunk_index", name="uq_resource_chunk_position"),
        CheckConstraint("chunk_index >= 0", name="ck_resource_chunk_nonnegative_index"),
        CheckConstraint(
            "length(trim(content, ' \t\n\r\f\v')) > 0",
            name="ck_resource_chunk_content_present",
        ),
        Index("ix_resource_chunk_resource_id", "resource_id"),
    )

    id: Mapped[int] = mapped_column(BigInteger, Identity(always=True), primary_key=True)
    resource_id: Mapped[int] = mapped_column(
        ForeignKey("resource.id", name="fk_resource_chunk_resource_id", ondelete="CASCADE"),
        nullable=False,
    )
    chunk_index: Mapped[int] = mapped_column(Integer, nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    # Match the 384-value multilingual embedding export used by issue #47.
    embedding: Mapped[list[float]] = mapped_column(HALFVEC(384), nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=True), nullable=False, server_default=func.now()
    )

    resource: Mapped[Resource] = relationship(back_populates="chunks")
