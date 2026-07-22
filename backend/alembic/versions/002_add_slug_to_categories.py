"""Add slug column to categories table with safe data backfill

Revision ID: 002_add_slug_to_categories
Revises: 001_initial_migration
Create Date: 2026-07-22 00:00:00.000000

"""
import re
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '002_add_slug_to_categories'
down_revision: Union[str, None] = '001_initial_migration'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def slugify(text: str) -> str:
    if not text:
        return ""
    text = text.lower().strip()
    text = re.sub(r'[^a-z0-9]+', '-', text)
    return text.strip('-')


def upgrade() -> None:
    # 1. Add column as nullable=True first so existing rows won't fail
    op.add_column('categories', sa.Column('slug', sa.String(length=255), nullable=True))

    # 2. Safely backfill existing rows (if any exist) before enforcing NOT NULL / UNIQUE
    bind = op.get_bind()
    categories = bind.execute(sa.text("SELECT id, name FROM categories WHERE slug IS NULL")).fetchall()

    existing_slugs = set()
    for cat_id, cat_name in categories:
        base_slug = slugify(cat_name) or f"category-{cat_id}"
        slug = base_slug
        counter = 1
        while slug in existing_slugs:
            slug = f"{base_slug}-{counter}"
            counter += 1
        existing_slugs.add(slug)
        bind.execute(
            sa.text("UPDATE categories SET slug = :slug WHERE id = :id"),
            {"slug": slug, "id": cat_id}
        )

    # 3. Enforce NOT NULL constraint now that all rows are guaranteed to have valid unique slugs
    op.alter_column('categories', 'slug', nullable=False)

    # 4. Create unique index on slug
    op.create_index(op.f('ix_categories_slug'), 'categories', ['slug'], unique=True)


def downgrade() -> None:
    op.drop_index(op.f('ix_categories_slug'), table_name='categories')
    op.drop_column('categories', 'slug')
