from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from ...database import get_db
from ...models.user import User, RoleEnum
from ...schemas.auth import RegisterRequest, LoginResponse, UserOut
from ...core.security import get_password_hash, verify_password, create_access_token, decode_token
import uuid

router = APIRouter(prefix="/auth", tags=["Authentication"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    payload = decode_token(token)
    if not payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    user = db.query(User).filter(User.email == payload.get("sub")).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user


@router.post("/register", response_model=UserOut, status_code=201)
def register(data: RegisterRequest, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == data.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    user = User(
        id=str(uuid.uuid4()),
        email=data.email,
        hashed_password=get_password_hash(data.password),
        role=RoleEnum[data.role.value],
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # Auto-create profile
    from ...models.profiles import StudentProfile, RecruiterProfile, InstitutionProfile
    try:
        if user.role == RoleEnum.STUDENT:
            db.add(StudentProfile(id=str(uuid.uuid4()), user_id=user.id, first_name="New", last_name="Student"))
        elif user.role == RoleEnum.RECRUITER:
            db.add(RecruiterProfile(id=str(uuid.uuid4()), user_id=user.id, company_name="New Company"))
        elif user.role == RoleEnum.TEACHER:
            db.add(InstitutionProfile(id=str(uuid.uuid4()), user_id=user.id, name="New Teacher"))
        db.commit()
    except Exception as e:
        db.rollback()
        print(f"Failed to create profile: {e}")

    return user


@router.post("/login", response_model=LoginResponse)
def login(form: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form.username).first()
    if not user or not verify_password(form.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect credentials")
    token = create_access_token({"sub": user.email, "role": user.role.value})
    return {"access_token": token, "token_type": "bearer"}


@router.get("/me", response_model=UserOut)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user
