import logging
import cloudinary.uploader
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status

from app.core.security import get_current_admin
from app.models.admin import Admin

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/admin/upload", tags=["Admin Upload"])


@router.post(
    "",
    status_code=status.HTTP_201_CREATED,
    summary="Upload Image File to Cloudinary",
)
async def upload_image(
    file: UploadFile = File(...),
    current_admin: Admin = Depends(get_current_admin),
):
    """
    Accepts multipart file upload, uploads it directly to Cloudinary
    under the 'impo-digital-studio' folder, and returns secure_url & public_id.
    """
    if not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File must be an image (e.g. JPEG, PNG, WebP).",
        )

    try:
        # Read file contents and upload to Cloudinary
        contents = await file.read()
        upload_result = cloudinary.uploader.upload(
            contents,
            folder="impo-digital-studio",
            resource_type="image",
        )

        secure_url = upload_result.get("secure_url")
        public_id = upload_result.get("public_id")

        if not secure_url:
            raise Exception("Cloudinary did not return a secure URL.")

        logger.info(f"✅ Image uploaded to Cloudinary: {public_id} -> {secure_url}")
        return {
            "secure_url": secure_url,
            "public_id": public_id,
        }

    except Exception as e:
        logger.error(f"❌ Cloudinary upload failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to upload image to Cloudinary: {str(e)}",
        )
