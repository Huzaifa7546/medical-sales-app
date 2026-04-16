from sqlalchemy import Column, Integer, String, Float, Date, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    role = Column(String) # 'admin' or 'operator'

class Medicine(Base):
    __tablename__ = "medicines"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    price = Column(Float)
    gst_percent = Column(Float, default=0.0)
    discount_percent = Column(Float, default=0.0)
    expiry_date = Column(Date)
    created_at = Column(DateTime, default=datetime.utcnow)
    sales = relationship("Sale", back_populates="medicine")

class Sale(Base):
    __tablename__ = "sales"
    id = Column(Integer, primary_key=True, index=True)
    medicine_id = Column(Integer, ForeignKey("medicines.id"))
    quantity = Column(Integer)
    total_amount = Column(Float)
    sale_date = Column(Date)
    
    medicine = relationship("Medicine", back_populates="sales")
