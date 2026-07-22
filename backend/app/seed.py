import sys
import logging
from app.core.database import SessionLocal
from app.models.category import Category
from app.models.photo import Photo
from app.models.settings import StudioSettings

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def seed_database() -> None:
    db = SessionLocal()
    try:
        logger.info("Initializing database seed operation...")

        # 1. Seed Singleton StudioSettings (Skip if ANY settings row exists)
        existing_settings = db.query(StudioSettings).first()
        if existing_settings:
            logger.info("ℹ️ StudioSettings configuration already initialized, skipping.")
        else:
            studio_settings = StudioSettings(
                studio_name="IMPO Digital Studio",
                phone="+91 98765 43210",
                email="contact@impodigitalstudio.com",
                address="N.G Complex, Belaganahalli Road, Opposite Police Station, Heggadadevanakote, Karnataka – 571114",
            )
            db.add(studio_settings)
            db.commit()
            logger.info("✅ Created default StudioSettings configuration.")

        # 2. Seed Sample Categories & Photos (Skip if ANY category already exists)
        if db.query(Category).count() > 0:
            logger.info("ℹ️ Categories already exist, skipping sample data.")
        else:
            wedding_cat = Category(
                name="Wedding",
                slug="wedding",
                cover_image_url="/portfolio/wedding/cover.jpg",
                display_order=1,
                is_published=True,
            )
            db.add(wedding_cat)
            db.commit()
            db.refresh(wedding_cat)

            photo1 = Photo(
                category_id=wedding_cat.id,
                image_url="/portfolio/wedding/cover.jpg",
                display_order=1,
                is_cover=True,
                is_published=True,
            )
            photo2 = Photo(
                category_id=wedding_cat.id,
                image_url="/portfolio/wedding/photo-1.jpg",
                display_order=2,
                is_cover=False,
                is_published=True,
            )
            db.add_all([photo1, photo2])
            db.commit()

            haldi_cat = Category(
                name="Haldi",
                slug="haldi",
                cover_image_url="/portfolio/haldi/cover.jpg",
                display_order=2,
                is_published=True,
            )
            db.add(haldi_cat)
            db.commit()
            db.refresh(haldi_cat)

            photo3 = Photo(
                category_id=haldi_cat.id,
                image_url="/portfolio/haldi/cover.jpg",
                display_order=1,
                is_cover=True,
                is_published=True,
            )
            db.add(photo3)
            db.commit()

            logger.info("✅ Seeded initial sample Categories & Photos.")

        logger.info("🎉 Database seeding check completed successfully!")
    except Exception as e:
        logger.error(f"❌ Error seeding database: {e}")
        db.rollback()
        sys.exit(1)
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
