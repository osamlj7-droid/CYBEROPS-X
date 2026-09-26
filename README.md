# CYBEROPS X - Unified Cybersecurity Operations & Incident Response Platform

CyberOps X is a centralized cybersecurity operations platform that allows security analysts to monitor security events, correlate alerts, manage incidents, and run safe simulated attacks.

## Project Structure (Modular Monolith)
- `frontend/`: React + Vite SPA
- `backend/`: FastAPI + SQLAlchemy Python Backend
- `database/`: Database schema, migrations, and seed scripts
- `docs/`: Architecture and documentation

## Development
To start the entire application using Docker Compose:
```bash
docker-compose up -d
```
This will start:
- PostgreSQL database on port `5432`
- FastAPI backend on `http://localhost:8000`
- React frontend on `http://localhost:3000`

### Local Setup
Please see the `README.md` files inside the `frontend/` and `backend/` folders for setting up the environments locally.
