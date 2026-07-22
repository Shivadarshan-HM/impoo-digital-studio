import enum
from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, Date, DateTime, Enum
from app.core.database import Base


class LeadStatusEnum(str, enum.Enum):
    new = "new"
    contacted = "contacted"
    closed = "closed"


class Lead(Base):
    __tablename__ = "leads"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    phone = Column(String(50), nullable=False)
    email = Column(String(255), nullable=False, index=True)
    event_type = Column(String(100), nullable=False)
    event_date = Column(Date, nullable=True)
    message = Column(Text, nullable=False)
    status = Column(
        Enum(LeadStatusEnum),
        default=LeadStatusEnum.new,
        nullable=False,
        index=True,
    )
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
