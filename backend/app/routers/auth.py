from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import (
    verify_password,
    get_password_hash,
    create_access_token,
    get_current_admin,
)
from app.models.admin import Admin
from app.schemas.auth import (
    LoginRequest,
    RegisterRequest,
    RegisterStatusResponse,
    ChangePasswordRequest,
    TokenResponse,
    AdminResponse,
)

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.get(
    "/register-status",
    response_model=RegisterStatusResponse,
    summary="Check if Admin Registration is Available",
    description="Returns whether registration is open (true if no admin exists, false if an admin already exists).",
)
def get_register_status(db: Session = Depends(get_db)):
    admin_exists = db.query(Admin).first() is not None
    return RegisterStatusResponse(registration_open=not admin_exists)


@router.post(
    "/register",
    status_code=status.HTTP_201_CREATED,
    summary="Register Initial Single Admin Account",
    description="Allows one-time registration of the single admin account. Permanently disabled once an admin exists.",
)
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    # Database-level strict single-admin enforcement:
    if db.query(Admin).first() is not None:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Registration is closed — an admin account already exists.",
        )

    # Password match validation
    if payload.password != payload.confirm_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Passwords do not match.",
        )

    email_clean = payload.email.lower().strip()

    admin = Admin(
        email=email_clean,
        hashed_password=get_password_hash(payload.password),
    )
    db.add(admin)
    db.commit()
    db.refresh(admin)

    return {"message": "Admin account created successfully. Please log in."}


@router.post(
    "/login",
    response_model=TokenResponse,
    summary="Authenticate Admin User",
    description="Accepts admin email & password, verifies credentials, and returns a signed JWT access token.",
)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    admin = db.query(Admin).filter(Admin.email == payload.email.lower().strip()).first()
    if not admin or not verify_password(payload.password, admin.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(data={"sub": admin.email})
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        email=admin.email,
    )


@router.get(
    "/me",
    response_model=AdminResponse,
    summary="Get Current Admin Profile",
    description="Protected route returning current authenticated admin user profile.",
)
def get_current_admin_profile(
    current_admin: Admin = Depends(get_current_admin),
):
    return current_admin


@router.put(
    "/change-password",
    summary="Change Admin Password",
    description="Updates the currently authenticated admin password after verifying current password.",
)
def change_password(
    payload: ChangePasswordRequest,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    if not verify_password(payload.current_password, current_admin.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect",
        )

    current_admin.hashed_password = get_password_hash(payload.new_password)
    db.commit()

    return {"message": "Password updated successfully"}
