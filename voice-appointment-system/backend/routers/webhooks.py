"""
Webhooks Router
Handles ElevenLabs webhook events and other integrations
"""

from fastapi import APIRouter, Request, HTTPException
from services.database_service import DatabaseService
from utils.logger import app_logger

router = APIRouter(prefix="/webhooks", tags=["webhooks"])


@router.post("/elevenlabs")
async def handle_elevenlabs_webhook(request: Request):
    """
    Handle ElevenLabs webhook events
    This endpoint is called by ElevenLabs to notify about conversation events
    """
    try:
        payload = await request.json()
        app_logger.info(f"ElevenLabs webhook received: {payload.get('event_type', 'unknown')}")
        
        event_type = payload.get("event_type")
        
        if event_type == "conversation_ended":
            # Handle conversation ended event
            # TODO: Process any post-conversation analytics
            pass
        
        return {"status": "received"}
    except Exception as e:
        app_logger.error(f"Error handling webhook: {str(e)}")
        raise HTTPException(status_code=500, detail="Webhook processing error")


@router.get("/health")
async def health_check():
    """Health check endpoint for monitoring"""
    return {
        "status": "healthy",
        "service": "voice-appointment-system",
        "timestamp": __import__("datetime").datetime.now().isoformat()
    }
