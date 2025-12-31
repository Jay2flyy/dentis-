"""
Email Service - EmailJS Integration with Retry Logic
"""

import requests
from tenacity import retry, stop_after_attempt, wait_exponential
from config.settings import settings
from utils.logger import app_logger
from typing import Optional


class EmailService:
    """Handle email sending via EmailJS with retry logic"""
    
    EMAILJS_API_URL = "https://api.emailjs.com/api/v1.0/email/send"
    
    @staticmethod
    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=2, max=10)
    )
    async def send_email(
        to_email: str,
        to_name: str,
        subject: str,
        email_type: str,
        **template_params
    ) -> bool:
        """
        Send email via EmailJS
        
        Args:
            to_email: Recipient email
            to_name: Recipient name
            subject: Email subject
            email_type: Type of email (booking_confirmation, cancellation, etc.)
            **template_params: Additional template parameters
        
        Returns:
            True if successful, False otherwise
        """
        try:
            payload = {
                "service_id": settings.emailjs_service_id,
                "template_id": settings.emailjs_template_id,
                "user_id": settings.emailjs_public_key,
                "template_params": {
                    "to_email": to_email,
                    "to_name": to_name,
                    "subject": subject,
                    "email_type": email_type,
                    **template_params
                }
            }
            
            response = requests.post(
                EmailService.EMAILJS_API_URL,
                json=payload,
                timeout=10
            )
            
            if response.status_code == 200:
                app_logger.info(
                    f"Email sent successfully to {to_email}",
                )
                return True
            else:
                app_logger.error(
                    f"Email sending failed: {response.status_code} - {response.text}"
                )
                return False
        except Exception as e:
            app_logger.error(f"Error sending email: {str(e)}")
            raise
    
    @staticmethod
    async def send_booking_confirmation(
        customer_name: str,
        customer_email: str,
        appointment_date: str,
        appointment_time: str,
        service_type: str
    ) -> bool:
        """Send appointment confirmation email"""
        return await EmailService.send_email(
            to_email=customer_email,
            to_name=customer_name,
            subject="Appointment Confirmation - Makhanda Smiles",
            email_type="booking_confirmation",
            appointment_date=appointment_date,
            appointment_time=appointment_time,
            service_type=service_type,
            practice_phone="+27 (0)123 456 7890",
            practice_address="Makhanda, South Africa"
        )
    
    @staticmethod
    async def send_cancellation_email(
        customer_name: str,
        customer_email: str,
        appointment_date: str,
        appointment_time: str,
        service_type: str
    ) -> bool:
        """Send appointment cancellation email"""
        return await EmailService.send_email(
            to_email=customer_email,
            to_name=customer_name,
            subject="Appointment Cancelled - Makhanda Smiles",
            email_type="cancellation",
            appointment_date=appointment_date,
            appointment_time=appointment_time,
            service_type=service_type,
            practice_phone="+27 (0)123 456 7890"
        )
    
    @staticmethod
    async def send_reschedule_email(
        customer_name: str,
        customer_email: str,
        old_date: str,
        old_time: str,
        new_date: str,
        new_time: str,
        service_type: str
    ) -> bool:
        """Send appointment reschedule email"""
        return await EmailService.send_email(
            to_email=customer_email,
            to_name=customer_name,
            subject="Appointment Rescheduled - Makhanda Smiles",
            email_type="rescheduling",
            old_date=old_date,
            old_time=old_time,
            new_date=new_date,
            new_time=new_time,
            service_type=service_type,
            practice_phone="+27 (0)123 456 7890"
        )
    
    @staticmethod
    async def send_auto_response(
        customer_name: str,
        customer_email: str,
        inquiry_subject: str
    ) -> bool:
        """Send auto-response email for inquiries"""
        return await EmailService.send_email(
            to_email=customer_email,
            to_name=customer_name,
            subject="Thank you for contacting Makhanda Smiles",
            email_type="auto_response",
            inquiry_subject=inquiry_subject,
            practice_phone="+27 (0)123 456 7890",
            business_hours="Monday-Friday: 8AM-6PM, Saturday: 9AM-1PM"
        )
