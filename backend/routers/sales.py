from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import get_db
from models import Sale, Medicine
from schemas import SaleCreate, DailyReport, MonthlyReport
from datetime import date
from typing import List

router = APIRouter(prefix="/sales", tags=["sales"])

@router.post("/")
def add_sale(sale: SaleCreate, db: Session = Depends(get_db)):
    medicine = db.query(Medicine).filter(Medicine.id == sale.medicine_id).first()
    if not medicine:
        raise HTTPException(status_code=404, detail="Medicine not found")
    
    if medicine.expiry_date < date.today():
        raise HTTPException(status_code=400, detail="Cannot sell expired medicine")
    
    total_amount = medicine.price * sale.quantity
    db_sale = Sale(**sale.dict(), total_amount=total_amount)
    db.add(db_sale)
    db.commit()
    return {"message": "Sale recorded", "total_amount": total_amount}

@router.get("/daily", response_model=List[DailyReport])
def get_daily_sales(sale_date: date, db: Session = Depends(get_db)):
    sales = db.query(Sale).filter(Sale.sale_date == sale_date).all()
    result = []
    for s in sales:
        result.append({
            "medicine_name": s.medicine.name,
            "quantity": s.quantity,
            "total_amount": s.total_amount,
            "sale_date": s.sale_date
        })
    return result

@router.get("/monthly", response_model=List[MonthlyReport])
def get_monthly_sales(db: Session = Depends(get_db)):
    # Group by month (format YYYY-MM)
    stats = db.query(
        func.strftime('%Y-%m', Sale.sale_date).label("month"),
        func.sum(Sale.total_amount).label("total_sales"),
        func.sum(Sale.quantity).label("total_quantity")
    ).group_by("month").all()
    
    return [{"month": s[0], "total_sales": s[1], "total_quantity": s[2]} for s in stats]
