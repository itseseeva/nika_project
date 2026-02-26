from pydantic import BaseModel, EmailStr
from typing import List, Optional, Dict, Any
from datetime import datetime

class CategoryBase(BaseModel):
    name: str
    slug: str
    is_hidden: Optional[bool] = False

class CategoryCreate(CategoryBase):
    pass

class Category(CategoryBase):
    id: int

    model_config = {"from_attributes": True}

class ProductBase(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None
    price: float
    image_urls: Optional[List[str]] = None
    attributes: Optional[Dict[str, Any]] = None
    is_hidden: Optional[bool] = False
    category_id: Optional[int] = None

class ProductCreate(ProductBase):
    pass

class Product(ProductBase):
    id: int
    category: Optional[Category] = None

    model_config = {"from_attributes": True}

class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    google_id: Optional[str] = None

class User(UserBase):
    id: int
    is_active: bool
    is_admin: bool
    google_id: Optional[str] = None
    created_at: datetime

    model_config = {"from_attributes": True}

class Token(BaseModel):
    access_token: str
    token_type: str

class AuthCodeRequest(BaseModel):
    email: EmailStr

class AuthCodeVerify(BaseModel):
    email: EmailStr
    code: str

class SetPassword(BaseModel):
    email: EmailStr
    code: str
    password: str

class LoginWithPassword(BaseModel):
    email: EmailStr
    password: str
