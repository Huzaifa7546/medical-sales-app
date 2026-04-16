from pydantic import BaseModel
from datetime import date, datetime
from typing import List, Optional

class UserBase(BaseModel):
    username: str
    email: Optional[str] = None
    role: str

class UserCreate(UserBase):
    password: str
    confirm_password: Optional[str] = None

class MedicineBase(BaseModel):
    name: str
    price: float
    gst_percent: float
    discount_percent: float
    expiry_date: date

class MedicineCreate(MedicineBase):
    pass

class MedicineResponse(MedicineBase):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

class SaleCreate(BaseModel):
    medicine_id: int
    quantity: int
    sale_date: date

class SaleResponse(BaseModel):
    id: int
    medicine_name: str
    quantity: int
    total_amount: float
    sale_date: date
    class Config:
        from_attributes = True

class DailyReport(BaseModel):
    medicine_name: str
    quantity: int
    total_amount: float
    sale_date: date

class MonthlyReport(BaseModel):
    month: str
    total_sales: float
    total_quantity: int
