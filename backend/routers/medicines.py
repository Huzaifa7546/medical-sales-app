from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Medicine
from schemas import MedicineCreate, MedicineResponse
from datetime import date
from typing import List

router = APIRouter(prefix="/medicines", tags=["medicines"])

@router.post("/", response_model=MedicineResponse)
def add_medicine(medicine: MedicineCreate, db: Session = Depends(get_db)):
    if medicine.price <= 0:
        raise HTTPException(status_code=400, detail="Price must be positive")
    db_med = Medicine(**medicine.dict())
    db.add(db_med)
    db.commit()
    db.refresh(db_med)
    return db_med

@router.get("/", response_model=List[MedicineResponse])
def get_medicines(db: Session = Depends(get_db)):
    # Auto-delete expired medicines as per requirement
    today = date.today()
    db.query(Medicine).filter(Medicine.expiry_date < today).delete()
    db.commit()
    return db.query(Medicine).all()

@router.put("/{id}", response_model=MedicineResponse)
def update_medicine(id: int, medicine: MedicineCreate, db: Session = Depends(get_db)):
    db_med = db.query(Medicine).filter(Medicine.id == id).first()
    if not db_med:
        raise HTTPException(status_code=404, detail="Medicine not found")
    for key, value in medicine.dict().items():
        setattr(db_med, key, value)
    db.commit()
    db.refresh(db_med)
    return db_med

@router.delete("/{id}")
def delete_medicine(id: int, db: Session = Depends(get_db)):
    db_med = db.query(Medicine).filter(Medicine.id == id).first()
    if not db_med:
        raise HTTPException(status_code=404, detail="Medicine not found")
    db.delete(db_med)
    db.commit()
    return {"message": "Medicine deleted"}
