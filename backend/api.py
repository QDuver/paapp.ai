from config import CONFIG, COLLECTION_CLASS_MAPPING
from dags.endpoints import router as dags_router
from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from models.users import User


app = FastAPI()
origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(dags_router)

@app.head("/health")
def health_check():
    return {"status": "healthy"}

@app.get("/warmup")
def warmup_user_connection(user: User = Depends(User.from_firebase_token)):
    CONFIG.USER_FS.collection('_warmup').document('_warmup').get()
    return {}

@app.post("/build-with-ai/{collection}/{id}")
def build_with_ai(collection: str, id: str, request: dict, user: User = Depends(User.from_firebase_token)):
    instance = COLLECTION_CLASS_MAPPING[collection](id=id)
    instance = instance.build_with_ai(**request)
    return instance.model_dump()

# ALWAYS KEEP LAST ---------------

@app.get("/{collection}/{document}")
def get_document(collection: str, document: str, user: User = Depends(User.from_firebase_token)):
    instance, uniques = COLLECTION_CLASS_MAPPING[collection](id=document).query()
    return {**instance.model_dump(), 'uniques': uniques}

@app.post("/{collection}/{document}")
def overwrite_with_format(collection: str, document: str, request: dict, user: User = Depends(User.from_firebase_token)):
    validated_data = COLLECTION_CLASS_MAPPING[collection](**request)
    data = validated_data.model_dump()
    print('data', data)
    CONFIG.USER_FS.collection(collection).document(document).set(data)


