from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Any
from datetime import datetime, timedelta

from api.deps import get_db, get_current_active_user
from models.event import SecurityEvent
from models.alert import Alert
from models.incident import Incident
from models.asset import Asset
from models.user import User

router = APIRouter()

@router.get("/summary")
def get_dashboard_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    # Get last 24h events
    last_24h = datetime.utcnow() - timedelta(hours=24)
    
    events_today = db.query(SecurityEvent).count() # Simply total for now since demo data might be older
    critical_alerts = db.query(Alert).filter(Alert.severity == 'CRITICAL', Alert.status != 'RESOLVED').count()
    open_incidents = db.query(Incident).filter(Incident.status.in_(['NEW', 'INVESTIGATING'])).count()
    total_assets = db.query(Asset).count()
    
    return {
        "events_today": events_today,
        "critical_alerts": critical_alerts,
        "open_incidents": open_incidents,
        "monitored_assets": total_assets
    }
