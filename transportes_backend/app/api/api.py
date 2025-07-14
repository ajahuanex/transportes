# app/api/api.py
from fastapi import APIRouter
from app.api.v1.endpoints.api import api_router as v1_router

api_router = APIRouter()
api_router.include_router(v1_router) # Si tuvieras v2, v3, etc., las incluirías aquí
