from app.core.config import settings
import re
import logging
import cloudinary
import cloudinary.uploader

logger = logging.getLogger(__name__)

CLOUD_NAME = settings.CLOUDINARY_CLOUD_NAME.strip()
API_KEY = settings.CLOUDINARY_API_KEY.strip()
API_SECRET = settings.CLOUDINARY_API_SECRET.strip()

def init_cloudinary():
    """
    Validates Cloudinary credentials and initializes the Cloudinary Python SDK.
    Logs warning in development or raises RuntimeError in production if credentials are missing.
    """
    if not CLOUD_NAME or not API_KEY or not API_SECRET:
        msg = "Cloudinary credentials missing in environment (.env) — check CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET."
        if settings.ENVIRONMENT.lower() == "production":
            raise RuntimeError(f"CRITICAL: {msg}")
        else:
            logger.warning(f"⚠️ {msg} Image upload endpoints will fail until configured.")
            return

    cloudinary.config(
        cloud_name=CLOUD_NAME,
        api_key=API_KEY,
        api_secret=API_SECRET,
        secure=True,
    )
    logger.info("✅ Cloudinary SDK initialized successfully.")

# Run initialization on import
init_cloudinary()


def extract_public_id_from_url(url: str) -> str | None:
    """
    Extracts Cloudinary public_id from a secure Cloudinary URL.
    Example URL: https://res.cloudinary.com/dpavqhtee/image/upload/v1234567/impo-digital-studio/sample.jpg
    Extracted Public ID: impo-digital-studio/sample
    """
    if not url or "cloudinary.com" not in url:
        return None
    
    try:
        match = re.search(r"/upload/(?:v\d+/)?(.+?)(?:\.[a-zA-Z0-9]+)?$", url)
        if match:
            return match.group(1)
    except Exception as err:
        logger.warning(f"Failed to parse public_id from Cloudinary URL '{url}': {err}")
    return None


def delete_cloudinary_image(public_id_or_url: str) -> bool:
    """
    Best-effort helper to delete an image asset from Cloudinary by public_id or URL.
    Does not raise exceptions on failure — logs warnings instead.
    """
    if not public_id_or_url or not CLOUD_NAME:
        return False

    public_id = public_id_or_url
    if "cloudinary.com" in public_id_or_url:
        extracted = extract_public_id_from_url(public_id_or_url)
        if extracted:
            public_id = extracted

    try:
        res = cloudinary.uploader.destroy(public_id)
        result_status = res.get("result")
        if result_status == "ok":
            logger.info(f"✅ Cloudinary image deleted successfully: {public_id}")
            return True
        else:
            logger.warning(f"⚠️ Cloudinary delete returned status '{result_status}' for public_id: {public_id}")
            return False
    except Exception as e:
        logger.error(f"❌ Best-effort Cloudinary deletion failed for '{public_id}': {e}")
        return False
