import sys
import logging
from alembic.config import Config
from alembic import command
from app.seed import seed_database

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def main():
    try:
        logger.info("Executing Alembic migration upgrade to 'head'...")
        alembic_cfg = Config("alembic.ini")
        command.upgrade(alembic_cfg, "head")
        logger.info("✅ Alembic migration completed successfully!")

        logger.info("Executing database seed...")
        seed_database()
        logger.info("✅ Database seed completed successfully!")
    except Exception as e:
        logger.error(f"❌ Error during migration/seed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
