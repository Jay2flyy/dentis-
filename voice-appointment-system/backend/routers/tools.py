"""
ElevenLabs Tools Router
Provides 4 endpoints for voice assistant appointment booking
"""

from fastapi import APIRouter, HTTPException, status
from models.schemas import (
    CheckAvailabilityRequest, BookAppointmentRequest,
    CancelAppointmentRequest, RescheduleAppointmentRequest,
    ElevenLabsToolResponse, AppointmentCreate
)
from services.calendar_service import CalendarService
from services.database_service import DatabaseService
from services.email_service import EmailService
from utils.logger import app_logger

router = APIRouter(prefix="/tools", tags=["appointment_tools"])


@router.post("/check-availability", response_model=ElevenLabsToolResponse)
async def check_availability(request: CheckAvailabilityRequest) -> ElevenLabsToolResponse:
    """
    Check if appointment slot is available
    ElevenLabs Tool: Check Availability
    """
    try:
        app_logger.info(f"Checking availability for {request.date} at {request.time}")
        
        availability = await CalendarService.check_availability(
            request.date,
            request.time
        )
        
        return ElevenLabsToolResponse(
            success=availability.get("available", False),
            message=availability.get("message") or availability.get("reason", "Unknown error"),
            data={"available": availability.get("available", False)}
        )
    except Exception as e:
        app_logger.error(f"Error checking availability: {str(e)}")
        return ElevenLabsToolResponse(
            success=False,
            message="Error checking availability. Please try again.",
            data={}
        )


@router.post("/book-appointment", response_model=ElevenLabsToolResponse)
async def book_appointment(request: BookAppointmentRequest) -> ElevenLabsToolResponse:
    """
    Book a new appointment
    ElevenLabs Tool: Book Appointment
    Flow: Check availability → Create calendar event → Save to DB → Send email
    """
    try:
        app_logger.info(f"Booking appointment for {request.customer_name}")
        
        # 1. Check availability
        availability = await CalendarService.check_availability(
            request.date,
            request.time
        )
        
        if not availability.get("available"):
            return ElevenLabsToolResponse(
                success=False,
                message=availability.get("reason", "Time slot not available"),
                data={}
            )
        
        # 2. Create calendar event
        google_event_id = await CalendarService.create_event(
            request.customer_name,
            request.customer_email,
            request.date,
            request.time,
            request.service_type
        )
        
        # 3. Save to database
        appointment_data = AppointmentCreate(
            customer_name=request.customer_name,
            customer_email=request.customer_email,
            customer_phone=request.customer_phone,
            appointment_date=request.date,
            appointment_time=request.time,
            service_type=request.service_type
        )
        
        appointment = await DatabaseService.create_appointment(
            appointment_data,
            google_event_id
        )
        
        if not appointment:
            return ElevenLabsToolResponse(
                success=False,
                message="Failed to save appointment. Please try again.",
                data={}
            )
        
        # 4. Send confirmation email
        await EmailService.send_booking_confirmation(
            request.customer_name,
            request.customer_email,
            request.date,
            request.time,
            request.service_type
        )
        
        return ElevenLabsToolResponse(
            success=True,
            message=f"Perfect! Your appointment for {request.service_type} on {request.date} at {request.time} has been confirmed. A confirmation email has been sent to {request.customer_email}.",
            data={
                "appointment_id": appointment.id,
                "confirmation": True
            }
        )
    except Exception as e:
        app_logger.error(f"Error booking appointment: {str(e)}")
        return ElevenLabsToolResponse(
            success=False,
            message="Error booking appointment. Please try again.",
            data={}
        )


@router.post("/cancel-appointment", response_model=ElevenLabsToolResponse)
async def cancel_appointment(request: CancelAppointmentRequest) -> ElevenLabsToolResponse:
    """
    Cancel an existing appointment
    ElevenLabs Tool: Cancel Appointment
    Flow: Get appointment → Delete calendar event → Update DB status → Send email
    """
    try:
        app_logger.info(f"Cancelling appointment: {request.appointment_id}")
        
        # 1. Get appointment details
        appointment = await DatabaseService.get_appointment(request.appointment_id)
        
        if not appointment:
            return ElevenLabsToolResponse(
                success=False,
                message="Appointment not found.",
                data={}
            )
        
        # 2. Delete calendar event if exists
        if appointment.google_calendar_event_id:
            await CalendarService.delete_event(appointment.google_calendar_event_id)
        
        # 3. Update DB status to cancelled
        updated = await DatabaseService.update_appointment(
            request.appointment_id,
            {"status": "cancelled"}
        )
        
        if not updated:
            return ElevenLabsToolResponse(
                success=False,
                message="Failed to cancel appointment.",
                data={}
            )
        
        # 4. Send cancellation email
        await EmailService.send_cancellation_email(
            appointment.customer_name,
            appointment.customer_email,
            appointment.appointment_date,
            appointment.appointment_time,
            appointment.service_type
        )
        
        return ElevenLabsToolResponse(
            success=True,
            message=f"Your appointment on {appointment.appointment_date} at {appointment.appointment_time} has been cancelled. A cancellation confirmation has been sent to {appointment.customer_email}.",
            data={"cancelled": True}
        )
    except Exception as e:
        app_logger.error(f"Error cancelling appointment: {str(e)}")
        return ElevenLabsToolResponse(
            success=False,
            message="Error cancelling appointment. Please try again.",
            data={}
        )


@router.post("/reschedule-appointment", response_model=ElevenLabsToolResponse)
async def reschedule_appointment(request: RescheduleAppointmentRequest) -> ElevenLabsToolResponse:
    """
    Reschedule an existing appointment
    ElevenLabs Tool: Reschedule Appointment
    Flow: Check new availability → Update calendar → Update DB → Send email
    """
    try:
        app_logger.info(f"Rescheduling appointment: {request.appointment_id}")
        
        # 1. Check new availability
        availability = await CalendarService.check_availability(
            request.new_date,
            request.new_time
        )
        
        if not availability.get("available"):
            return ElevenLabsToolResponse(
                success=False,
                message=availability.get("reason", "New time slot not available"),
                data={}
            )
        
        # 2. Get appointment details
        appointment = await DatabaseService.get_appointment(request.appointment_id)
        
        if not appointment:
            return ElevenLabsToolResponse(
                success=False,
                message="Appointment not found.",
                data={}
            )
        
        # 3. Update calendar event
        if appointment.google_calendar_event_id:
            await CalendarService.update_event(
                appointment.google_calendar_event_id,
                request.new_date,
                request.new_time
            )
        
        # 4. Update database
        updated = await DatabaseService.update_appointment(
            request.appointment_id,
            {
                "appointment_date": request.new_date,
                "appointment_time": request.new_time,
                "status": "scheduled"
            }
        )
        
        if not updated:
            return ElevenLabsToolResponse(
                success=False,
                message="Failed to reschedule appointment.",
                data={}
            )
        
        # 5. Send reschedule email
        await EmailService.send_reschedule_email(
            appointment.customer_name,
            appointment.customer_email,
            appointment.appointment_date,
            appointment.appointment_time,
            request.new_date,
            request.new_time,
            appointment.service_type
        )
        
        return ElevenLabsToolResponse(
            success=True,
            message=f"Your appointment has been rescheduled to {request.new_date} at {request.new_time}. Confirmation email sent to {appointment.customer_email}.",
            data={
                "rescheduled": True,
                "old_date": appointment.appointment_date,
                "old_time": appointment.appointment_time,
                "new_date": request.new_date,
                "new_time": request.new_time
            }
        )
    except Exception as e:
        app_logger.error(f"Error rescheduling appointment: {str(e)}")
        return ElevenLabsToolResponse(
            success=False,
            message="Error rescheduling appointment. Please try again.",
            data={}
        )
