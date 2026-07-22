from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, DateTime
from app.core.database import Base


class StudioSettings(Base):
    __tablename__ = "studio_settings"

    id = Column(Integer, primary_key=True, index=True)
    studio_name = Column(String(255), nullable=False, default="IMPO Digital Studio")
    phone = Column(String(50), nullable=False, default="+91 98765 43210")
    email = Column(String(255), nullable=False, default="contact@impodigitalstudio.com")
    address = Column(
        String(500),
        nullable=False,
        default="N.G Complex, Belaganahalli Road, Opposite Police Station, Heggadadevanakote, Karnataka – 571114",
    )
    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
