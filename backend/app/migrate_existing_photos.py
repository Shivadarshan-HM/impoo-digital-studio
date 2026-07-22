import os
import sys
import logging
import cloudinary.uploader
from pathlib import Path
from sqlalchemy.orm import Session

# Import backend modules
from app.core import cloudinary_config  # Initializes Cloudinary SDK
from app.core.database import SessionLocal
from app.models.category import Category
from app.models.photo import Photo

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("migrate_photos")

# Human-readable display name mapping for subfolders
DEFAULT_DISPLAY_NAMES = {
    "wedding": "Wedding",
    "haldi": "Haldi",
    "reception": "Reception",
    "baby-shoot": "Baby Shoot",
    "awards-recognition": "Awards & Recognition",
}


def get_display_name(folder_name: str) -> str:
    """Returns exact display name for category or titleizes fallback."""
    if folder_name.lower() in DEFAULT_DISPLAY_NAMES:
        return DEFAULT_DISPLAY_NAMES[folder_name.lower()]
    # Fallback titleize (e.g. pre-wedding -> Pre Wedding)
    words = folder_name.replace("-", " ").replace("_", " ").split()
    return " ".join(w.capitalize() for w in words)


def find_portfolio_dir() -> Path | None:
    """Locates website/public/portfolio directory across common project paths."""
    cwd = Path.cwd()
    candidates = [
        cwd / "website" / "public" / "portfolio",
        cwd / "Website" / "public" / "portfolio",
        cwd.parent / "website" / "public" / "portfolio",
        cwd.parent / "Website" / "public" / "portfolio",
        Path("d:/IMPO DIGITAL STUDIO/impo-digital-studio/website/public/portfolio"),
        Path("d:/IMPO DIGITAL STUDIO/impo-digital-studio/Website/public/portfolio"),
    ]
    for p in candidates:
        if p.exists() and p.is_dir():
            return p
    return None


def migrate_photos():
    portfolio_dir = find_portfolio_dir()
    if not portfolio_dir:
        logger.error("❌ Could not locate website/public/portfolio directory!")
        sys.exit(1)

    logger.info(f"📂 Found portfolio directory at: {portfolio_dir}")

    db: Session = SessionLocal()

    categories_created = 0
    categories_matched = 0
    photos_uploaded = 0
    photos_skipped = 0

    try:
        # Get all subdirectories (categories)
        subfolders = [f for f in portfolio_dir.iterdir() if f.is_dir()]
        subfolders.sort(key=lambda x: x.name)

        logger.info(f"Found {len(subfolders)} category folders to process.")

        for folder_idx, folder in enumerate(subfolders, start=1):
            slug = folder.name.lower().strip()
            display_name = get_display_name(slug)

            # 1. Match or Create Category
            category = db.query(Category).filter(Category.slug == slug).first()
            if not category:
                category = Category(
                    name=display_name,
                    slug=slug,
                    display_order=folder_idx,
                    is_published=True,
                )
                db.add(category)
                db.commit()
                db.refresh(category)
                categories_created += 1
                logger.info(f"✨ Created Category: '{display_name}' (slug: {slug})")
            else:
                categories_matched += 1
                logger.info(f"📁 Matched existing Category: '{category.name}' (slug: {slug})")

            # Get existing photo URLs for this category to check for duplicates
            existing_photos = db.query(Photo).filter(Photo.category_id == category.id).all()
            existing_urls = [p.image_url for p in existing_photos]

            # Get image files in folder
            valid_extensions = {".jpg", ".jpeg", ".png", ".webp"}
            image_files = [
                f for f in folder.iterdir() if f.is_file() and f.suffix.lower() in valid_extensions
            ]

            # Sort files so cover images are processed first
            image_files.sort(key=lambda x: (0 if "cover" in x.name.lower() else 1, x.name))

            logger.info(f"  Found {len(image_files)} image files in '{folder.name}'")

            for photo_idx, img_path in enumerate(image_files, start=1):
                filename = img_path.name
                stem = img_path.stem.lower()

                # Check if photo already uploaded (match filename in existing photo URLs)
                already_uploaded = any(
                    filename.lower() in url.lower() or stem in url.lower()
                    for url in existing_urls
                    if "cloudinary.com" in url
                )

                if already_uploaded:
                    photos_skipped += 1
                    logger.info(f"  ⏭️ Skipping '{filename}' (already uploaded to Cloudinary)")
                    continue

                # Upload image file to Cloudinary under folder impo-digital-studio/{slug}
                cloudinary_folder = f"impo-digital-studio/{slug}"
                logger.info(f"  ⬆️ Uploading '{filename}' to Cloudinary folder '{cloudinary_folder}'...")

                with open(img_path, "rb") as f:
                    upload_res = cloudinary.uploader.upload(
                        f,
                        folder=cloudinary_folder,
                        resource_type="image",
                    )

                secure_url = upload_res.get("secure_url")
                if not secure_url:
                    logger.error(f"  ❌ Failed to upload '{filename}' to Cloudinary!")
                    continue

                is_cover_file = "cover" in filename.lower()
                is_first_photo = photo_idx == 1 and not category.cover_image_url

                set_as_cover = is_cover_file or is_first_photo

                # Create Photo DB Record
                photo_record = Photo(
                    category_id=category.id,
                    image_url=secure_url,
                    display_order=photo_idx,
                    is_cover=set_as_cover,
                    is_published=True,
                )

                if set_as_cover:
                    # Unset previous cover flag on other photos if setting new cover
                    db.query(Photo).filter(
                        Photo.category_id == category.id, Photo.is_cover.is_(True)
                    ).update({"is_cover": False})

                    category.cover_image_url = secure_url

                db.add(photo_record)
                db.commit()
                db.refresh(photo_record)

                existing_urls.append(secure_url)
                photos_uploaded += 1
                logger.info(f"  ✅ Created Photo #{photo_record.id} (Cover={set_as_cover}): {secure_url}")

        # Final Summary
        print("\n" + "=" * 60)
        print("🎉 MIGRATION COMPLETED SUCCESSFULLY")
        print("=" * 60)
        print(f"• Categories Created : {categories_created}")
        print(f"• Categories Matched : {categories_matched}")
        print(f"• Photos Uploaded    : {photos_uploaded}")
        print(f"• Photos Skipped     : {photos_skipped}")
        print("=" * 60 + "\n")

    except Exception as e:
        logger.error(f"❌ Error during photo migration: {e}")
        db.rollback()
        sys.exit(1)
    finally:
        db.close()


if __name__ == "__main__":
    migrate_photos()
