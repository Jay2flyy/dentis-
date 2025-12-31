"""
FastAPI Main Application
Voice Appointment Booking System with ElevenLabs AI Integration
"""

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
import os
from datetime import datetime

from config.settings import settings
from routers import tools, webhooks
from models.schemas import HealthCheckResponse
from utils.logger import app_logger

# Initialize FastAPI app
app = FastAPI(
    title="Voice Appointment System",
    description="AI-powered appointment booking with ElevenLabs",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Request logging middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    """Log all incoming requests"""
    app_logger.info(f"{request.method} {request.url.path}")
    
    try:
        response = await call_next(request)
        return response
    except Exception as e:
        app_logger.error(f"Request error: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={"detail": "Internal server error"}
        )


# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Handle all unhandled exceptions"""
    app_logger.error(f"Unhandled exception: {str(exc)}", exc_info=True)
    
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "Internal server error"}
    )


# Include routers
app.include_router(tools.router)
app.include_router(webhooks.router)


# Root endpoint
@app.get("/")
async def root():
    """Root endpoint with API info"""
    return {
        "service": "Voice Appointment System",
        "version": "1.0.0",
        "status": "running",
        "endpoints": {
            "health": "/health",
            "tools": {
                "check_availability": "POST /tools/check-availability",
                "book_appointment": "POST /tools/book-appointment",
                "cancel_appointment": "POST /tools/cancel-appointment",
                "reschedule_appointment": "POST /tools/reschedule-appointment"
            },
            "webhooks": {
                "elevenlabs": "POST /webhooks/elevenlabs"
            }
        }
    }


@app.get("/health", response_model=HealthCheckResponse)
async def health_check():
    """Health check endpoint"""
    return HealthCheckResponse(
        status="healthy",
        environment=settings.app_env,
        timestamp=datetime.now().isoformat()
    )


# Mount frontend static files if they exist
frontend_path = os.path.join(os.path.dirname(__file__), "../frontend")
if os.path.exists(frontend_path):
    app.mount("/", StaticFiles(directory=frontend_path, html=True), name="frontend")


if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=settings.app_port,
        reload=settings.is_development
    )
