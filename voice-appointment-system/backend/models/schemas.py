"""
Pydantic Data Models and Validation Schemas
"""

from pydantic import BaseModel, EmailStr, Field
from typing import Optional, Dict, Any
from datetime import datetime


class AppointmentCreate(BaseModel):
    """Create appointment request"""
    customer_name: str = Field(..., min_length=1, max_length=255)
    customer_email: EmailStr
    customer_phone: str = Field(..., min_length=10, max_length=20)
    appointment_date: str = Field(..., description="Date in YYYY-MM-DD format")
    appointment_time: str = Field(..., description="Time in HH:MM format")
    service_type: str = Field(..., min_length=1, max_length=100)


class AppointmentResponse(BaseModel):
    """Appointment response model"""
    id: str
    customer_name: str
    customer_email: str
    customer_phone: str
    appointment_date: str
    appointment_time: str
    service_type: str
    status: str
    google_calendar_event_id: Optional[str] = None
    created_at: str
    updated_at: str


class CheckAvailabilityRequest(BaseModel):
    """Check availability request"""
    date: str = Field(..., description="Date in YYYY-MM-DD format")
    time: str = Field(..., description="Time in HH:MM format")


class BookAppointmentRequest(BaseModel):
    """Book appointment request"""
    customer_name: str = Field(..., min_length=1, max_length=255)
    customer_email: EmailStr
    customer_phone: str = Field(..., min_length=10, max_length=20)
    date: str = Field(..., description="Date in YYYY-MM-DD format")
    time: str = Field(..., description="Time in HH:MM format")
    service_type: str = Field(..., min_length=1, max_length=100)


class CancelAppointmentRequest(BaseModel):
    """Cancel appointment request"""
    appointment_id: str = Field(..., min_length=1)


class RescheduleAppointmentRequest(BaseModel):
    """Reschedule appointment request"""
    appointment_id: str = Field(..., min_length=1)
    new_date: str = Field(..., description="Date in YYYY-MM-DD format")
    new_time: str = Field(..., description="Time in HH:MM format")


class ElevenLabsToolResponse(BaseModel):
    """Standard response format for ElevenLabs tools"""
    success: bool
    message: str
    data: Dict[str, Any] = Field(default_factory=dict)


class ListAppointmentsResponse(BaseModel):
    """List appointments response"""
    total: int
    appointments: list[AppointmentResponse]


class HealthCheckResponse(BaseModel):
    """Health check response"""
    status: str
    environment: str
    timestamp: str
