from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Any, Optional
from sqlalchemy import desc

from api.deps import get_db, get_current_active_user
from models.event import SecurityEvent
from models.user import User
from schemas.event import EventResponse

router = APIRouter()

@router.get("/", response_model=List[EventResponse])
def get_events(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 50,
    severity: Optional[str] = None,
    current_user: User = Depends(get_current_active_user)
) -> Any:
    query = db.query(SecurityEvent)
    if severity:
        query = query.filter(SecurityEvent.severity == severity)
        
    events = query.order_by(desc(SecurityEvent.timestamp)).offset(skip).limit(limit).all()
    return events
