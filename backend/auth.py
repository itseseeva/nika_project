import os
import random
import string
import jwt
import hashlib
import hmac
from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import aiosmtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import httpx

import schemas
import models
from database import get_db

SECRET_KEY = os.getenv("SECRET_KEY", "super-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7 # 7 days

HASH_ITERATIONS = 260000

def _hash_password(password: str) -> str:
    salt = os.urandom(16).hex()
    dk = hashlib.pbkdf2_hmac('sha256', password.encode(), salt.encode(), HASH_ITERATIONS)
    return f"{salt}${dk.hex()}"

def _verify_password(password: str, stored: str) -> bool:
    try:
        salt, dk_hex = stored.split('$', 1)
        dk = hashlib.pbkdf2_hmac('sha256', password.encode(), salt.encode(), HASH_ITERATIONS)
        return hmac.compare_digest(dk.hex(), dk_hex)
    except Exception:
        return False

router = APIRouter(prefix="/auth", tags=["auth"])

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def send_email(to_email: str, subject: str, html_body: str, plain_body: str = ""):
    message = MIMEMultipart("alternative")
    message["Subject"] = subject
    message["From"] = os.getenv("DEFAULT_FROM_EMAIL")
    message["To"] = to_email

    if plain_body:
        message.attach(MIMEText(plain_body, "plain", "utf-8"))
    message.attach(MIMEText(html_body, "html", "utf-8"))

    host = os.getenv("EMAIL_HOST")
    port = int(os.getenv("EMAIL_PORT", 2525))
    use_tls = os.getenv("EMAIL_USE_TLS", "True").lower() == "true"
    user = os.getenv("EMAIL_HOST_USER")
    password = os.getenv("EMAIL_HOST_PASSWORD")

    try:
        if port == 465 or str(port) == '465':
            await aiosmtplib.send(
                message,
                hostname=host,
                port=port,
                use_tls=True,
                username=user,
                password=password,
            )
        else:
            await aiosmtplib.send(
                message,
                hostname=host,
                port=port,
                start_tls=use_tls,
                username=user,
                password=password,
            )
    except Exception as e:
        print(f"Failed to send email: {e}")
        raise HTTPException(status_code=500, detail="Failed to send email")

@router.post("/send-code")
async def send_verification_code(request: schemas.AuthCodeRequest, db: AsyncSession = Depends(get_db)):
    code = ''.join(random.choices(string.digits, k=6))
    
    # Store code in db
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=10)
    
    # Invalidate older codes for this email
    result = await db.execute(select(models.AuthCode).where(models.AuthCode.email == request.email, models.AuthCode.used == False))
    old_codes = result.scalars().all()
    for oc in old_codes:
        oc.used = True
        
    auth_code = models.AuthCode(email=request.email, code=code, expires_at=expires_at)
    db.add(auth_code)
    await db.commit()
    
    # Send HTML email
    subject = "Ваш код авторизации — ООО «НИКА»"
    plain_body = f"Ваш код для входа: {code}\nКод действителен 10 минут.\n\nЕсли вы не запрашивали код — проигнорируйте это письмо."
    html_body = f"""
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Код авторизации</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:40px 16px;">
    <tr><td align="center">
      <table width="540" cellpadding="0" cellspacing="0" style="max-width:540px;width:100%;">

        <!-- Шапка -->
        <tr>
          <td style="background:linear-gradient(135deg,#0c1445 0%,#1e3a8a 60%,#1e40af 100%);border-radius:16px 16px 0 0;padding:36px 40px;text-align:center;">
            <div style="margin-bottom: 20px;">
              <img src="http://localhost/logo.jpg" alt="НИКА" style="width: 120px; height: auto; display: block; margin: 0 auto; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));" />
            </div>
            <div style="display:inline-block;background:rgba(255,255,255,0.12);border:1px solid rgba(255,255,255,0.2);border-radius:12px;padding:10px 16px;margin-bottom:16px;">
              <span style="color:#ffffff;font-size:18px;font-weight:800;letter-spacing:0.5px;">ООО «НИКА»</span>
            </div>
            <p style="color:#bfdbfe;margin:0;font-size:14px;">Профессиональные B2B поставки</p>
          </td>
        </tr>

        <!-- Тело -->
        <tr>
          <td style="background:#ffffff;padding:40px 40px 36px;">
            <h1 style="margin:0 0 8px;font-size:24px;font-weight:700;color:#0f172a;">Ваш код для входа</h1>
            <p style="margin:0 0 32px;font-size:15px;color:#64748b;line-height:1.6;">Используйте следующий код для авторизации в партнёрском кабинете НИКА. Код действителен <strong>10 минут</strong>.</p>

            <!-- Большой код -->
            <div style="background:#f8fafc;border:2px solid #e2e8f0;border-radius:16px;padding:28px 20px;text-align:center;margin-bottom:32px;">
              <p style="margin:0 0 8px;font-size:12px;font-weight:600;color:#94a3b8;letter-spacing:2px;text-transform:uppercase;">Код подтверждения</p>
              <p style="margin:0;font-size:48px;font-weight:800;letter-spacing:12px;color:#1e3a8a;font-family:'Courier New',monospace;">{code}</p>
            </div>

            <!-- Предупреждение -->
            <div style="background:#eff6ff;border-left:4px solid #3b82f6;border-radius:0 8px 8px 0;padding:14px 16px;margin-bottom:32px;">
              <p style="margin:0;font-size:13px;color:#1e40af;line-height:1.5;">🔒 Если вы не запрашивали этот код, просто проигнорируйте письмо. Ваш аккаунт в безопасности.</p>
            </div>

            <p style="margin:0;font-size:13px;color:#94a3b8;text-align:center;">Это письмо отправлено автоматически, не отвечайте на него.</p>
          </td>
        </tr>

        <!-- Футер -->
        <tr>
          <td style="background:#f8fafc;border-radius:0 0 16px 16px;border-top:1px solid #e2e8f0;padding:24px 40px;text-align:center;">
            <p style="margin:0 0 6px;font-size:13px;font-weight:600;color:#475569;">ООО «НИКА»</p>
            <p style="margin:0;font-size:12px;color:#94a3b8;">г. Санкт-Петербург, ул. Савушкина, д. 89 лит А&nbsp;&nbsp;·&nbsp;&nbsp;8 (965) 008-79-46</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>
"""
    await send_email(request.email, subject, html_body, plain_body)
    
    return {"message": "Verification code sent"}

@router.post("/verify-code", response_model=schemas.Token)
async def verify_code(request: schemas.AuthCodeVerify, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(models.AuthCode)
        .where(
            models.AuthCode.email == request.email,
            models.AuthCode.code == request.code,
            models.AuthCode.used == False,
            models.AuthCode.expires_at > datetime.now(timezone.utc)
        )
    )
    auth_code = result.scalar_one_or_none()
    
    if not auth_code:
        raise HTTPException(status_code=400, detail="Invalid or expired code")
        
    auth_code.used = True
    
    # Get or create user
    user_result = await db.execute(select(models.User).where(models.User.email == request.email))
    user = user_result.scalar_one_or_none()
    
    if not user:
        user = models.User(email=request.email)
        db.add(user)
    
    await db.commit()
    await db.refresh(user)
    
    # Generate token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.id)}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/set-password", response_model=schemas.Token)
async def set_password(request: schemas.SetPassword, db: AsyncSession = Depends(get_db)):
    """Проверяет код из письма, устанавливает пароль, возвращает токен"""
    # Verify the code
    result = await db.execute(
        select(models.AuthCode)
        .where(
            models.AuthCode.email == request.email,
            models.AuthCode.code == request.code,
            models.AuthCode.used == False,
            models.AuthCode.expires_at > datetime.now(timezone.utc)
        )
    )
    auth_code = result.scalar_one_or_none()

    if not auth_code:
        raise HTTPException(status_code=400, detail="Неверный или просроченный код")

    auth_code.used = True

    # Get or create user
    user_result = await db.execute(select(models.User).where(models.User.email == request.email))
    user = user_result.scalar_one_or_none()

    if not user:
        user = models.User(email=request.email)
        db.add(user)

    # Set hashed password
    user.hashed_password = _hash_password(request.password)

    await db.commit()
    await db.refresh(user)

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.id)}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/login", response_model=schemas.Token)
async def login_with_password(request: schemas.LoginWithPassword, db: AsyncSession = Depends(get_db)):
    """Вход по email и паролю"""
    user_result = await db.execute(select(models.User).where(models.User.email == request.email))
    user = user_result.scalar_one_or_none()

    if not user or not user.hashed_password or not _verify_password(request.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Неверный email или пароль")

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.id)}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

from fastapi import Request
from fastapi.responses import RedirectResponse

@router.get("/google/url")
async def google_login_url():
    client_id = os.getenv("GOOGLE_CLIENT_ID")
    redirect_uri = os.getenv("GOOGLE_REDIRECT_URI")
    scope = "openid email profile"
    url = f"https://accounts.google.com/o/oauth2/v2/auth?client_id={client_id}&response_type=code&redirect_uri={redirect_uri}&scope={scope}&access_type=offline"
    return {"url": url}

@router.get("/google/callback")
async def google_callback(code: str, db: AsyncSession = Depends(get_db)):
    client_id = os.getenv("GOOGLE_CLIENT_ID")
    client_secret = os.getenv("GOOGLE_CLIENT_SECRET")
    redirect_uri = os.getenv("GOOGLE_REDIRECT_URI")
    
    token_url = "https://oauth2.googleapis.com/token"
    async with httpx.AsyncClient() as client:
        token_response = await client.post(token_url, data={
            "code": code,
            "client_id": client_id,
            "client_secret": client_secret,
            "redirect_uri": redirect_uri,
            "grant_type": "authorization_code",
        })
        
        if token_response.status_code != 200:
            raise HTTPException(status_code=400, detail="Failed to fetch token from Google")
            
        token_data = token_response.json()
        access_token = token_data.get("access_token")
        
        # Fetch user info
        user_info_response = await client.get(
            "https://www.googleapis.com/oauth2/v1/userinfo",
            headers={"Authorization": f"Bearer {access_token}"}
        )
        
        if user_info_response.status_code != 200:
            raise HTTPException(status_code=400, detail="Failed to fetch user info from Google")
            
        user_info = user_info_response.json()
        email = user_info.get("email")
        google_id = user_info.get("id")
        
        if not email:
            raise HTTPException(status_code=400, detail="Email not provided by Google")
            
        # Get or create user
        user_result = await db.execute(select(models.User).where((models.User.email == email) | (models.User.google_id == google_id)))
        user = user_result.scalar_one_or_none()
        
        if not user:
            user = models.User(email=email, google_id=google_id)
            db.add(user)
        else:
            if not user.google_id:
                user.google_id = google_id
                
        await db.commit()
        await db.refresh(user)
        
        # Generate our JWT token
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        jwt_token = create_access_token(
            data={"sub": str(user.id)}, expires_delta=access_token_expires
        )
        
        # Redirect to frontend with token
        frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5555")
        # Ensure it has no trailing slash to avoid double slashes
        frontend_url = frontend_url.rstrip("/")
        return RedirectResponse(url=f"{frontend_url}/?token={jwt_token}")

from fastapi.security import OAuth2PasswordBearer

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/token", auto_error=False)

async def get_current_user(token: str = Depends(oauth2_scheme), db: AsyncSession = Depends(get_db)):
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
        
    result = await db.execute(select(models.User).where(models.User.id == int(user_id)))
    user = result.scalar_one_or_none()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user

async def get_current_user_optional(token: str = Depends(oauth2_scheme), db: AsyncSession = Depends(get_db)):
    if not token:
        return None
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            return None
    except jwt.PyJWTError:
        return None
        
    result = await db.execute(select(models.User).where(models.User.id == int(user_id)))
    user = result.scalar_one_or_none()
    return user

@router.get("/me", response_model=schemas.User)
async def read_users_me(current_user: models.User = Depends(get_current_user)):
    return current_user
