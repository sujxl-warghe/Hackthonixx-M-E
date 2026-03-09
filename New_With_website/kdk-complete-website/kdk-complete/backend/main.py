from fastapi import FastAPI, HTTPException, UploadFile, File, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
import os
from datetime import datetime, timedelta
import hashlib

app = FastAPI(title="KDK College AI Assistant API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
client = AsyncIOMotorClient(MONGODB_URL)
db = client.kdk_college_db

COLLEGE_KNOWLEDGE = {
    "name": "KDK College of Engineering",
    "location": "Nagpur, Maharashtra, India",
    "established": 1998,
    "departments": ["Computer Science & Engineering","Mechanical Engineering","Electrical Engineering","Civil Engineering","Electronics & Communication Engineering"],
    "admissions": {
        "eligibility": "12th with PCM, minimum 50% marks",
        "entrance_exams": ["MHT-CET", "JEE Main"],
        "total_seats": 480,
        "application_start": "May 2026",
        "fee_structure": {"tuition_fee": "₹95,000 per year","hostel_fee": "₹60,000 per year"},
    },
    "facilities": ["Central Library with 50,000+ books","24/7 High-speed WiFi Campus","Separate Boys & Girls Hostels","Modern Computer Labs with latest software","Sports Complex with indoor & outdoor facilities","Hygienic Cafeteria","Transport Facility from major city points","Medical Center with doctor on call"],
    "placements": {"placement_rate": "95%","highest_package": "42 LPA (2025)","average_package": "6.5 LPA","top_recruiters": ["TCS","Infosys","Wipro","Tech Mahindra","L&T","Capgemini","Cognizant","Amazon"]},
    "accreditation": ["NAAC A Grade","NBA Accredited","AICTE Approved"],
    "contact": {"phone": "+91-712-1234567","email": "info@kdkcollege.edu.in","address": "MIDC Area, Hingna Road, Nagpur - 440016, Maharashtra"},
}

class SignupRequest(BaseModel):
    email: EmailStr
    password: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class ChatRequest(BaseModel):
    message: str
    user_id: str | None = None

class UserResponse(BaseModel):
    id: str
    email: str

class ChatResponse(BaseModel):
    answer: str

class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str

def hash_password(p): return hashlib.sha256(p.encode()).hexdigest()

def object_id_to_str(doc):
    if doc and "_id" in doc:
        doc["id"] = str(doc["_id"])
        del doc["_id"]
    return doc

ADMIN_EMAIL = "admin@kdkcollege.edu.in"
_admin_pw_hash = hash_password("admin123")

@app.get("/")
async def root():
    return {"message": "KDK College AI Assistant API", "version": "2.0"}

@app.post("/auth/signup", response_model=UserResponse)
async def signup(request: SignupRequest):
    if await db.users.find_one({"email": request.email}):
        raise HTTPException(status_code=400, detail="Email already registered")
    result = await db.users.insert_one({"email": request.email,"password": hash_password(request.password),"created_at": datetime.utcnow()})
    return UserResponse(id=str(result.inserted_id), email=request.email)

@app.post("/auth/login", response_model=UserResponse)
async def login(request: LoginRequest):
    user = await db.users.find_one({"email": request.email,"password": hash_password(request.password)})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return UserResponse(id=str(user["_id"]), email=user["email"])

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    msg = request.message.lower()
    await db.chats.insert_one({"user_id": request.user_id,"message": request.message,"timestamp": datetime.utcnow()})
    ck = COLLEGE_KNOWLEDGE
    if any(w in msg for w in ["admission","apply","eligibility","entrance","join"]):
        answer = f"🎓 **Admissions Information:**\n\n📅 Applications start in {ck['admissions']['application_start']}.\n\n✅ **Eligibility:** {ck['admissions']['eligibility']}\n\n📝 **Entrance Exams:** {', '.join(ck['admissions']['entrance_exams'])}\n\n💺 **Total Seats:** {ck['admissions']['total_seats']}\n\n💰 **Tuition Fee:** {ck['admissions']['fee_structure']['tuition_fee']}\n\nVisit our [Admissions Page](/admissions) for complete details!"
    elif any(w in msg for w in ["placement","job","salary","package","recruiter","hire"]):
        answer = f"💼 **Placement Statistics:**\n\n📊 Placement Rate: **{ck['placements']['placement_rate']}**\n\n💰 Average Package: **{ck['placements']['average_package']}**\n\n🚀 Highest Package: **{ck['placements']['highest_package']}**\n\n🏢 Top Recruiters: {', '.join(ck['placements']['top_recruiters'][:5])}, and more!\n\nCheck our [Placements Page](/placements)!"
    elif any(w in msg for w in ["hostel","accommodation","stay","room","boarding"]):
        answer = f"🏨 **Hostel Facilities:**\n\nSeparate hostels for boys and girls with:\n✅ 24/7 Security\n✅ WiFi\n✅ Mess facility\n✅ Recreation & Study rooms\n\n💰 Hostel Fee: {ck['admissions']['fee_structure']['hostel_fee']}\n\nVisit [Facilities Page](/facilities)!"
    elif any(w in msg for w in ["department","branch","course","program","cse","mechanical","civil","electrical","electronics"]):
        answer = "📚 **Academic Programs:**\n\nWe offer B.Tech in:\n" + "\n".join([f"• {d}" for d in ck["departments"]]) + "\n\nAll programs are NBA Accredited & RTMNU Affiliated (4 years).\n\nVisit [Academics Page](/academics)!"
    elif any(w in msg for w in ["location","address","where","reach","contact","direction"]):
        answer = f"📍 **Contact Information:**\n\n🏢 {ck['name']}\n📫 {ck['contact']['address']}\n📞 {ck['contact']['phone']}\n📧 {ck['contact']['email']}\n🕒 Mon–Sat, 9 AM – 5 PM\n\nVisit [Contact Page](/contact)!"
    elif any(w in msg for w in ["facility","facilities","lab","library","sports","wifi","cafeteria"]):
        answer = "🏛️ **Campus Facilities:**\n\n" + "\n".join([f"✅ {f}" for f in ck["facilities"]]) + "\n\nExplore [Facilities Page](/facilities)!"
    elif any(w in msg for w in ["fee","cost","fees","tuition","price"]):
        answer = f"💰 **Fee Structure:**\n\n📚 Tuition: **{ck['admissions']['fee_structure']['tuition_fee']}**\n🏨 Hostel: **{ck['admissions']['fee_structure']['hostel_fee']}** (optional)\n\nFull details on [Admissions Page](/admissions)!"
    elif any(w in msg for w in ["accreditation","naac","nba","approved","recognized"]):
        answer = "🏆 **Accreditation:**\n\n" + "\n".join([f"✅ {a}" for a in ck["accreditation"]]) + f"\n\nEstablished {ck['established']}. Learn more on [About Page](/about)!"
    else:
        answer = "👋 I'm the **KDK College AI Assistant**!\n\nI can help with:\n• 🎓 Admissions • 📚 Academics • 💼 Placements\n• 🏛️ Facilities • 📍 Contact • 💰 Fee Structure\n\nWhat would you like to know?"
    return ChatResponse(answer=answer)

@app.post("/documents/upload")
async def upload_document(file: UploadFile = File(...), user_id: str = Query(...)):
    try:
        user = await db.users.find_one({"_id": ObjectId(user_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid user ID")
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    content = await file.read()
    result = await db.documents.insert_one({"user_id": user_id,"filename": file.filename,"content_type": file.content_type,"size": len(content),"uploaded_at": datetime.utcnow()})
    return {"id": str(result.inserted_id),"filename": file.filename,"message": "File uploaded successfully"}

@app.post("/admin/login")
async def admin_login(request: LoginRequest):
    if request.email == ADMIN_EMAIL and hash_password(request.password) == _admin_pw_hash:
        return {"id": "admin","email": ADMIN_EMAIL,"role": "admin"}
    raise HTTPException(status_code=401, detail="Invalid admin credentials")

@app.get("/admin/stats")
async def get_admin_stats():
    users_count = await db.users.count_documents({})
    chats_count = await db.chats.count_documents({})
    docs_count = await db.documents.count_documents({})
    recent_users = await db.users.find().sort("created_at", -1).limit(5).to_list(5)
    recent_chats = await db.chats.find().sort("timestamp", -1).limit(5).to_list(5)
    for c in recent_chats:
        uid = c.get("user_id")
        if uid:
            try:
                u = await db.users.find_one({"_id": ObjectId(uid)})
                c["user_email"] = u["email"] if u else "Unknown"
            except: c["user_email"] = "Unknown"
        else: c["user_email"] = "Guest"
    return {"stats":{"users":users_count,"chats":chats_count,"documents":docs_count},"recent_users":[object_id_to_str(u) for u in recent_users],"recent_chats":[object_id_to_str(c) for c in recent_chats]}

@app.get("/admin/users")
async def get_all_users(page: int = 1, limit: int = 10, search: str = None):
    skip = (page-1)*limit
    query = {"email":{"$regex":search,"$options":"i"}} if search else {}
    users = await db.users.find(query).sort("created_at",-1).skip(skip).limit(limit).to_list(limit)
    total = await db.users.count_documents(query)
    return {"users":[object_id_to_str(u) for u in users],"total":total,"page":page,"pages":max(1,(total+limit-1)//limit)}

@app.get("/admin/chats")
async def get_all_chats(page: int = 1, limit: int = 10, filter: str = "all"):
    skip = (page-1)*limit
    query = {}
    if filter=="today": query["timestamp"]={"$gte":datetime.utcnow().replace(hour=0,minute=0,second=0,microsecond=0)}
    elif filter=="week": query["timestamp"]={"$gte":datetime.utcnow()-timedelta(days=7)}
    elif filter=="month": query["timestamp"]={"$gte":datetime.utcnow()-timedelta(days=30)}
    chats = await db.chats.find(query).sort("timestamp",-1).skip(skip).limit(limit).to_list(limit)
    total = await db.chats.count_documents(query)
    for c in chats:
        uid = c.get("user_id")
        if uid:
            try:
                u = await db.users.find_one({"_id":ObjectId(uid)})
                c["user_email"] = u["email"] if u else "Unknown"
            except: c["user_email"] = "Unknown"
        else: c["user_email"] = "Guest"
    return {"chats":[object_id_to_str(c) for c in chats],"total":total,"page":page,"pages":max(1,(total+limit-1)//limit)}

@app.get("/admin/documents")
async def get_all_documents(page: int = 1, limit: int = 10):
    skip = (page-1)*limit
    docs = await db.documents.find().sort("uploaded_at",-1).skip(skip).limit(limit).to_list(limit)
    total = await db.documents.count_documents({})
    for d in docs:
        try:
            u = await db.users.find_one({"_id":ObjectId(d["user_id"])})
            d["user_email"] = u["email"] if u else "Unknown"
        except: d["user_email"] = "Unknown"
    return {"documents":[object_id_to_str(d) for d in docs],"total":total,"page":page,"pages":max(1,(total+limit-1)//limit)}

@app.delete("/admin/users/{user_id}")
async def delete_user(user_id: str):
    try: result = await db.users.delete_one({"_id":ObjectId(user_id)})
    except: raise HTTPException(status_code=400,detail="Invalid user ID")
    if not result.deleted_count: raise HTTPException(status_code=404,detail="User not found")
    await db.chats.delete_many({"user_id":user_id})
    await db.documents.delete_many({"user_id":user_id})
    return {"message":"User deleted successfully"}

@app.delete("/admin/chats/{chat_id}")
async def delete_chat(chat_id: str):
    try: result = await db.chats.delete_one({"_id":ObjectId(chat_id)})
    except: raise HTTPException(status_code=400,detail="Invalid chat ID")
    if not result.deleted_count: raise HTTPException(status_code=404,detail="Chat not found")
    return {"message":"Chat deleted successfully"}

@app.delete("/admin/documents/{doc_id}")
async def delete_document(doc_id: str):
    try: result = await db.documents.delete_one({"_id":ObjectId(doc_id)})
    except: raise HTTPException(status_code=400,detail="Invalid document ID")
    if not result.deleted_count: raise HTTPException(status_code=404,detail="Document not found")
    return {"message":"Document deleted successfully"}

@app.post("/admin/change-password")
async def change_admin_password(request: ChangePasswordRequest):
    global _admin_pw_hash
    if hash_password(request.current_password) != _admin_pw_hash:
        raise HTTPException(status_code=401,detail="Current password is incorrect")
    _admin_pw_hash = hash_password(request.new_password)
    return {"message":"Password changed successfully"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
