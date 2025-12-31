"""
Database Service - Supabase CRUD Operations
"""

from config.supabase_client import supabase
from models.schemas import AppointmentCreate, AppointmentResponse
from utils.logger import app_logger
from typing import Optional, List
from datetime import datetime


class DatabaseService:
    """Handle all database operations"""
    
    TABLE_NAME = "appointments"
    
    @staticmethod
    async def create_appointment(
        appointment_data: AppointmentCreate,
        google_event_id: Optional[str] = None
    ) -> Optional[AppointmentResponse]:
        """Create a new appointment"""
        try:
            data = {
                "customer_name": appointment_data.customer_name,
                "customer_email": appointment_data.customer_email,
                "customer_phone": appointment_data.customer_phone,
                "appointment_date": appointment_data.appointment_date,
                "appointment_time": appointment_data.appointment_time,
                "service_type": appointment_data.service_type,
                "status": "scheduled",
                "google_calendar_event_id": google_event_id,
            }
            
            response = supabase.table(DatabaseService.TABLE_NAME).insert(data).execute()
            
            if response.data and len(response.data) > 0:
                appointment = response.data[0]
                app_logger.info(f"Appointment created: {appointment['id']}")
                return AppointmentResponse(**appointment)
            
            return None
        except Exception as e:
            app_logger.error(f"Error creating appointment: {str(e)}")
            return None
    
    @staticmethod
    async def get_appointment(appointment_id: str) -> Optional[AppointmentResponse]:
        """Get appointment by ID"""
        try:
            response = supabase.table(DatabaseService.TABLE_NAME).select(
                "*"
            ).eq("id", appointment_id).execute()
            
            if response.data and len(response.data) > 0:
                return AppointmentResponse(**response.data[0])
            return None
        except Exception as e:
            app_logger.error(f"Error getting appointment: {str(e)}")
            return None
    
    @staticmethod
    async def list_appointments(
        limit: int = 50,
        offset: int = 0
    ) -> tuple[int, List[AppointmentResponse]]:
        """List all appointments"""
        try:
            response = supabase.table(DatabaseService.TABLE_NAME).select(
                "*"
            ).order("created_at", desc=True).range(offset, offset + limit - 1).execute()
            
            # Get total count
            count_response = supabase.table(DatabaseService.TABLE_NAME).select(
                "id", count="exact"
            ).execute()
            
            total = count_response.count or 0
            appointments = [AppointmentResponse(**apt) for apt in response.data]
            
            return total, appointments
        except Exception as e:
            app_logger.error(f"Error listing appointments: {str(e)}")
            return 0, []
    
    @staticmethod
    async def update_appointment(
        appointment_id: str,
        updates: dict
    ) -> Optional[AppointmentResponse]:
        """Update an appointment"""
        try:
            updates["updated_at"] = datetime.now().isoformat()
            response = supabase.table(DatabaseService.TABLE_NAME).update(
                updates
            ).eq("id", appointment_id).execute()
            
            if response.data and len(response.data) > 0:
                app_logger.info(f"Appointment updated: {appointment_id}")
                return AppointmentResponse(**response.data[0])
            return None
        except Exception as e:
            app_logger.error(f"Error updating appointment: {str(e)}")
            return None
    
    @staticmethod
    async def delete_appointment(appointment_id: str) -> bool:
        """Delete an appointment"""
        try:
            supabase.table(DatabaseService.TABLE_NAME).delete().eq(
                "id", appointment_id
            ).execute()
            app_logger.info(f"Appointment deleted: {appointment_id}")
            return True
        except Exception as e:
            app_logger.error(f"Error deleting appointment: {str(e)}")
            return False
    
    @staticmethod
    async def get_appointments_by_date(date: str) -> List[AppointmentResponse]:
        """Get all appointments for a specific date"""
        try:
            response = supabase.table(DatabaseService.TABLE_NAME).select(
                "*"
            ).eq("appointment_date", date).eq("status", "scheduled").execute()
            
            return [AppointmentResponse(**apt) for apt in response.data]
        except Exception as e:
            app_logger.error(f"Error getting appointments by date: {str(e)}")
            return []
