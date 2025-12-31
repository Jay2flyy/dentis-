"""
Settings configuration using Pydantic Settings
Loads environment variables from .env file
"""

from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    """Application Settings"""
    
    # Supabase
    supabase_url: str
    supabase_anon_key: str
    supabase_service_key: str
    
    # Google Calendar
    google_calendar_id: str
    google_calendar_timezone: str = "Africa/Johannesburg"
    
    # EmailJS
    emailjs_service_id: str
    emailjs_template_id: str
    emailjs_public_key: str
    
    # ElevenLabs
    elevenlabs_agent_id: str
    elevenlabs_branch_id: str
    elevenlabs_api_key: str
    
    # App Config
    app_env: str = "development"
    app_port: int = 8000
    allowed_origins: str = "http://localhost:3000,http://localhost:8000"
    business_start_hour: int = 8
    business_end_hour: int = 18
    business_days: str = "Monday,Tuesday,Wednesday,Thursday,Friday"
    appointment_duration_minutes: int = 30
    
    class Config:
        env_file = ".env"
        case_sensitive = False
    
    @property
    def cors_origins(self) -> List[str]:
        """Parse CORS origins from comma-separated string"""
        return [origin.strip() for origin in self.allowed_origins.split(",")]
    
    @property
    def business_days_list(self) -> List[str]:
        """Parse business days from comma-separated string"""
        return [day.strip() for day in self.business_days.split(",")]
    
    @property
    def is_development(self) -> bool:
        """Check if running in development mode"""
        return self.app_env.lower() == "development"


# Load settings
settings = Settings()  # type: ignore
