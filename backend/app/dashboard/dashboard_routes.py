from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import JSONResponse
import logging
from jose import jwt
from app.config import JWT_SECRET, ALGORITHM
from datetime import datetime, timedelta

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

# Mock data for dashboard
MOCK_EVENTS = [
    {"id": "1", "title": "College Annual Fest", "date": "2026-02-20", "daysRemaining": 9, "type": "event"},
    {"id": "2", "title": "Guest Lecture - Cloud Computing", "date": "2026-02-18", "daysRemaining": 7, "type": "event"},
]

MOCK_QUIZZES = [
    {"id": "1", "title": "Complete Java Lab Assignment", "date": "2026-02-11", "priority": "High", "type": "quiz"},
]

MOCK_TASKS = [
    {"id": "1", "title": "Complete Java Lab Assignment", "date": "Today", "priority": "High", "status": "Today", "type": "task"},
    {"id": "2", "title": "Review OS Documentation", "date": "Tomorrow", "priority": "Medium", "status": "Tomorrow", "type": "task"},
]

MOCK_ASSIGNMENTS = [
    {"id": "1", "title": "Economics Research Paper", "date": "2026-02-22", "type": "assignment"},
]

MOCK_SUBJECTS = [
    {
        "id": "java",
        "name": "Java",
        "icon": "Code2",
        "assignments": 3,
        "quizzes": 1,
        "progress": 65,
    },
    {
        "id": "os",
        "name": "Operating System",
        "icon": "Cpu",
        "assignments": 2,
        "quizzes": 2,
        "progress": 45,
    },
    {
        "id": "economics",
        "name": "Economics",
        "icon": "TrendingUp",
        "assignments": 1,
        "quizzes": 1,
        "progress": 20,
    },
    {
        "id": "environmental",
        "name": "Environmental Studies",
        "icon": "Leaf",
        "assignments": 2,
        "quizzes": 1,
        "progress": 75,
    },
    {
        "id": "iot",
        "name": "Internet of Things",
        "icon": "Wifi",
        "assignments": 1,
        "quizzes": 0,
        "progress": 55,
    },
]


@router.get("/data")
async def get_dashboard_data(request: Request):
    """Get dashboard data including events, quizzes, tasks, and assignments."""
    try:
        # Optional: extract user from token if provided
        token = request.headers.get("authorization", "").replace("Bearer ", "")
        user = "public"
        
        if token:
            try:
                payload = jwt.decode(token, JWT_SECRET, algorithms=[ALGORITHM])
                user = payload.get("sub", "public")
            except Exception:
                pass  # Allow public access if token is invalid

        # Calculate days remaining for events
        today = datetime.now().date()
        events = []
        for event in MOCK_EVENTS:
            event_date = datetime.strptime(event["date"], "%Y-%m-%d").date()
            days_remaining = (event_date - today).days
            event_data = event.copy()
            event_data["daysRemaining"] = max(0, days_remaining)
            events.append(event_data)

        return {
            "stats": {
                "totalSubjects": len(MOCK_SUBJECTS),
                "pendingAssignments": sum(s["assignments"] for s in MOCK_SUBJECTS),
                "upcomingEvents": len(events),
                "completedTasks": 4,
            },
            "subjects": MOCK_SUBJECTS,
            "upcomingEvents": events,
            "quizzes": MOCK_QUIZZES,
            "tasks": MOCK_TASKS,
            "assignments": MOCK_ASSIGNMENTS,
        }
    except Exception as e:
        logging.exception("Error fetching dashboard data")
        return JSONResponse(status_code=500, content={"error": str(e)})
