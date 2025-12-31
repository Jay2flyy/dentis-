"""
Dental Practice Automation Workflow Engine
Automates customer support, appointment management, and related processes
"""

import asyncio
import json
import smtplib
import logging
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any, Callable
from dataclasses import dataclass, asdict
from enum import Enum
from abc import ABC, abstractmethod
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import re
import requests

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class WorkflowStatus(Enum):
    """Workflow execution status"""
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    PAUSED = "paused"


class AppointmentStatus(Enum):
    """Appointment status"""
    SCHEDULED = "scheduled"
    CONFIRMED = "confirmed"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    NO_SHOW = "no_show"
    PENDING_CONFIRMATION = "pending_confirmation"


class SupportTicketStatus(Enum):
    """Support ticket status"""
    OPEN = "open"
    IN_PROGRESS = "in_progress"
    RESOLVED = "resolved"
    CLOSED = "closed"
    PENDING = "pending"


@dataclass
class Customer:
    """Customer information"""
    id: str
    name: str
    email: str
    phone: str
    created_at: datetime
    last_visit: Optional[datetime] = None
    loyalty_points: int = 0
    preferences: Dict[str, Any] = None

    def to_dict(self) -> dict:
        data = asdict(self)
        data['created_at'] = self.created_at.isoformat()
        data['last_visit'] = self.last_visit.isoformat() if self.last_visit else None
        return data


@dataclass
class Appointment:
    """Appointment information"""
    id: str
    customer_id: str
    service_type: str
    scheduled_time: datetime
    duration_minutes: int
    status: AppointmentStatus
    dentist: Optional[str] = None
    notes: Optional[str] = None
    reminders_sent: List[str] = None

    def to_dict(self) -> dict:
        data = asdict(self)
        data['scheduled_time'] = self.scheduled_time.isoformat()
        data['status'] = self.status.value
        return data


@dataclass
class SupportTicket:
    """Support ticket information"""
    id: str
    customer_id: str
    subject: str
    description: str
    status: SupportTicketStatus
    created_at: datetime
    updated_at: datetime
    assigned_to: Optional[str] = None
    priority: str = "normal"  # low, normal, high, urgent
    messages: List[Dict[str, str]] = None

    def to_dict(self) -> dict:
        data = asdict(self)
        data['created_at'] = self.created_at.isoformat()
        data['updated_at'] = self.updated_at.isoformat()
        data['status'] = self.status.value
        return data


class EmailService:
    """Handle email communications"""

    def __init__(self, smtp_server: str, smtp_port: int, sender_email: str, sender_password: str):
        self.smtp_server = smtp_server
        self.smtp_port = smtp_port
        self.sender_email = sender_email
        self.sender_password = sender_password

    def send_email(self, recipient_email: str, subject: str, body: str, html: bool = False) -> bool:
        """Send email to recipient"""
        try:
            msg = MIMEMultipart('alternative')
            msg['Subject'] = subject
            msg['From'] = self.sender_email
            msg['To'] = recipient_email

            if html:
                msg.attach(MIMEText(body, 'html'))
            else:
                msg.attach(MIMEText(body, 'plain'))

            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                server.starttls()
                server.login(self.sender_email, self.sender_password)
                server.send_message(msg)

            logger.info(f"Email sent to {recipient_email}")
            return True
        except Exception as e:
            logger.error(f"Failed to send email to {recipient_email}: {str(e)}")
            return False

    def send_appointment_confirmation(self, customer: Customer, appointment: Appointment) -> bool:
        """Send appointment confirmation email"""
        subject = f"Appointment Confirmation - {appointment.service_type}"
        html_body = f"""
        <html>
            <body style="font-family: Arial, sans-serif;">
                <h2>Appointment Confirmation</h2>
                <p>Dear {customer.name},</p>
                <p>Your appointment has been confirmed:</p>
                <ul>
                    <li><strong>Service:</strong> {appointment.service_type}</li>
                    <li><strong>Date & Time:</strong> {appointment.scheduled_time.strftime('%Y-%m-%d %H:%M')}</li>
                    <li><strong>Duration:</strong> {appointment.duration_minutes} minutes</li>
                    {f'<li><strong>Dentist:</strong> {appointment.dentist}</li>' if appointment.dentist else ''}
                </ul>
                <p>If you need to reschedule, please contact us at least 24 hours before your appointment.</p>
                <p>Best regards,<br>Makhanda Smiles Dental Practice</p>
            </body>
        </html>
        """
        return self.send_email(customer.email, subject, html_body, html=True)

    def send_appointment_reminder(self, customer: Customer, appointment: Appointment, hours_before: int) -> bool:
        """Send appointment reminder email"""
        subject = f"Reminder: Your appointment is in {hours_before} hours"
        html_body = f"""
        <html>
            <body style="font-family: Arial, sans-serif;">
                <h2>Appointment Reminder</h2>
                <p>Dear {customer.name},</p>
                <p>This is a friendly reminder about your upcoming appointment:</p>
                <ul>
                    <li><strong>Service:</strong> {appointment.service_type}</li>
                    <li><strong>Date & Time:</strong> {appointment.scheduled_time.strftime('%Y-%m-%d %H:%M')}</li>
                    <li><strong>Duration:</strong> {appointment.duration_minutes} minutes</li>
                </ul>
                <p>Please arrive 10 minutes early. If you need to cancel or reschedule, contact us immediately.</p>
                <p>Best regards,<br>Makhanda Smiles Dental Practice</p>
            </body>
        </html>
        """
        return self.send_email(customer.email, subject, html_body, html=True)

    def send_support_ticket_response(self, customer: Customer, ticket: SupportTicket, response: str) -> bool:
        """Send support ticket response email"""
        subject = f"Re: {ticket.subject} - Support Ticket #{ticket.id}"
        html_body = f"""
        <html>
            <body style="font-family: Arial, sans-serif;">
                <h2>Support Ticket Response</h2>
                <p>Dear {customer.name},</p>
                <p>Thank you for contacting us. Here's our response:</p>
                <div style="background-color: #f5f5f5; padding: 15px; border-left: 4px solid #007bff; margin: 20px 0;">
                    {response}
                </div>
                <p>If you have any further questions, please reply to this email.</p>
                <p>Best regards,<br>Support Team - Makhanda Smiles</p>
            </body>
        </html>
        """
        return self.send_email(customer.email, subject, html_body, html=True)


class SMSService:
    """Handle SMS communications"""

    def __init__(self, api_key: str, api_url: str = "https://api.twilio.com"):
        self.api_key = api_key
        self.api_url = api_url

    def send_sms(self, phone_number: str, message: str) -> bool:
        """Send SMS message"""
        try:
            # Example using Twilio API
            payload = {
                "to": phone_number,
                "body": message,
                "from": "+1234567890"  # Your Twilio number
            }
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            }
            
            response = requests.post(
                f"{self.api_url}/messages",
                json=payload,
                headers=headers,
                timeout=10
            )
            
            if response.status_code in [200, 201]:
                logger.info(f"SMS sent to {phone_number}")
                return True
            else:
                logger.error(f"Failed to send SMS: {response.text}")
                return False
        except Exception as e:
            logger.error(f"SMS service error: {str(e)}")
            return False

    def send_appointment_reminder_sms(self, phone_number: str, appointment: Appointment) -> bool:
        """Send appointment reminder via SMS"""
        message = f"Reminder: Your {appointment.service_type} appointment is on {appointment.scheduled_time.strftime('%m/%d at %H:%M')}. Reply CONFIRM to confirm or CANCEL to cancel."
        return self.send_sms(phone_number, message)


class WorkflowTask(ABC):
    """Base class for workflow tasks"""

    @abstractmethod
    async def execute(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """Execute the task"""
        pass

    @abstractmethod
    def get_name(self) -> str:
        """Get task name"""
        pass


class SendAppointmentConfirmationTask(WorkflowTask):
    """Send appointment confirmation email"""

    def __init__(self, email_service: EmailService):
        self.email_service = email_service

    async def execute(self, context: Dict[str, Any]) -> Dict[str, Any]:
        customer = context.get('customer')
        appointment = context.get('appointment')

        if not customer or not appointment:
            return {'success': False, 'error': 'Missing customer or appointment data'}

        result = self.email_service.send_appointment_confirmation(customer, appointment)
        return {
            'success': result,
            'task': self.get_name(),
            'timestamp': datetime.now().isoformat()
        }

    def get_name(self) -> str:
        return "SendAppointmentConfirmation"


class SendAppointmentReminderTask(WorkflowTask):
    """Send appointment reminder"""

    def __init__(self, email_service: EmailService, sms_service: Optional[SMSService] = None):
        self.email_service = email_service
        self.sms_service = sms_service

    async def execute(self, context: Dict[str, Any]) -> Dict[str, Any]:
        customer = context.get('customer')
        appointment = context.get('appointment')
        hours_before = context.get('hours_before', 24)

        if not customer or not appointment:
            return {'success': False, 'error': 'Missing customer or appointment data'}

        email_result = self.email_service.send_appointment_reminder(customer, appointment, hours_before)
        
        sms_result = True
        if self.sms_service:
            sms_result = self.sms_service.send_appointment_reminder_sms(customer.phone, appointment)

        return {
            'success': email_result and sms_result,
            'task': self.get_name(),
            'email_sent': email_result,
            'sms_sent': sms_result,
            'timestamp': datetime.now().isoformat()
        }

    def get_name(self) -> str:
        return "SendAppointmentReminder"


class ResolveSupportTicketTask(WorkflowTask):
    """Auto-resolve common support tickets"""

    def __init__(self, email_service: EmailService):
        self.email_service = email_service
        self.common_responses = {
            'hours': "Our practice hours are Monday-Friday 8am-5pm, Saturday 9am-1pm, and we're closed on Sundays.",
            'payment': "We accept all major credit cards, cash, and insurance. Please contact our billing department for payment plans.",
            'cancellation': "To cancel an appointment, please call us at least 24 hours in advance.",
            'emergency': "For dental emergencies, please call our emergency line available 24/7.",
        }

    async def execute(self, context: Dict[str, Any]) -> Dict[str, Any]:
        ticket = context.get('ticket')
        customer = context.get('customer')

        if not ticket or not customer:
            return {'success': False, 'error': 'Missing ticket or customer data'}

        # Determine response based on ticket content
        response = self._get_response(ticket.description.lower())
        
        if response:
            result = self.email_service.send_support_ticket_response(customer, ticket, response)
            return {
                'success': result,
                'task': self.get_name(),
                'auto_resolved': True,
                'response_sent': result,
                'timestamp': datetime.now().isoformat()
            }

        return {
            'success': False,
            'task': self.get_name(),
            'auto_resolved': False,
            'message': 'Ticket requires manual review',
            'timestamp': datetime.now().isoformat()
        }

    def _get_response(self, description: str) -> Optional[str]:
        """Match description to common responses"""
        for keyword, response in self.common_responses.items():
            if keyword in description:
                return response
        return None

    def get_name(self) -> str:
        return "ResolveSupportTicket"


class UpdateLoyaltyPointsTask(WorkflowTask):
    """Update customer loyalty points after appointment"""

    async def execute(self, context: Dict[str, Any]) -> Dict[str, Any]:
        customer = context.get('customer')
        appointment = context.get('appointment')
        points_per_service = context.get('points_per_service', {})

        if not customer or not appointment:
            return {'success': False, 'error': 'Missing customer or appointment data'}

        points_earned = points_per_service.get(appointment.service_type, 10)
        customer.loyalty_points += points_earned

        return {
            'success': True,
            'task': self.get_name(),
            'points_earned': points_earned,
            'total_points': customer.loyalty_points,
            'timestamp': datetime.now().isoformat()
        }

    def get_name(self) -> str:
        return "UpdateLoyaltyPoints"


class NotifyStaffTask(WorkflowTask):
    """Notify staff of upcoming appointments or issues"""

    def __init__(self, email_service: EmailService):
        self.email_service = email_service

    async def execute(self, context: Dict[str, Any]) -> Dict[str, Any]:
        appointment = context.get('appointment')
        staff_email = context.get('staff_email')
        notification_type = context.get('notification_type', 'appointment')

        if not appointment or not staff_email:
            return {'success': False, 'error': 'Missing appointment or staff email'}

        subject = f"Staff Notification: {notification_type.title()} - {appointment.service_type}"
        body = f"Appointment ID: {appointment.id}\nService: {appointment.service_type}\nTime: {appointment.scheduled_time}"

        result = self.email_service.send_email(staff_email, subject, body)

        return {
            'success': result,
            'task': self.get_name(),
            'notification_sent': result,
            'timestamp': datetime.now().isoformat()
        }

    def get_name(self) -> str:
        return "NotifyStaff"


class Workflow:
    """Workflow execution engine"""

    def __init__(self, name: str, tasks: List[WorkflowTask]):
        self.name = name
        self.tasks = tasks
        self.status = WorkflowStatus.PENDING
        self.results = []
        self.created_at = datetime.now()
        self.started_at = None
        self.completed_at = None

    async def execute(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """Execute all workflow tasks"""
        self.status = WorkflowStatus.RUNNING
        self.started_at = datetime.now()
        self.results = []

        logger.info(f"Starting workflow: {self.name}")

        try:
            for task in self.tasks:
                logger.info(f"Executing task: {task.get_name()}")
                
                try:
                    result = await task.execute(context)
                    self.results.append(result)
                    
                    if not result.get('success', False):
                        logger.warning(f"Task {task.get_name()} failed: {result.get('error', 'Unknown error')}")
                except Exception as e:
                    logger.error(f"Task {task.get_name()} error: {str(e)}")
                    self.results.append({
                        'success': False,
                        'task': task.get_name(),
                        'error': str(e),
                        'timestamp': datetime.now().isoformat()
                    })

            self.status = WorkflowStatus.COMPLETED
            self.completed_at = datetime.now()
            logger.info(f"Workflow {self.name} completed")

        except Exception as e:
            self.status = WorkflowStatus.FAILED
            self.completed_at = datetime.now()
            logger.error(f"Workflow {self.name} failed: {str(e)}")

        return self.get_summary()

    def get_summary(self) -> Dict[str, Any]:
        """Get workflow execution summary"""
        return {
            'workflow_name': self.name,
            'status': self.status.value,
            'created_at': self.created_at.isoformat(),
            'started_at': self.started_at.isoformat() if self.started_at else None,
            'completed_at': self.completed_at.isoformat() if self.completed_at else None,
            'duration_seconds': (self.completed_at - self.started_at).total_seconds() if self.started_at and self.completed_at else None,
            'tasks_executed': len(self.results),
            'tasks_successful': sum(1 for r in self.results if r.get('success', False)),
            'results': self.results
        }


class WorkflowEngine:
    """Main workflow automation engine"""

    def __init__(self):
        self.workflows: Dict[str, Workflow] = {}
        self.customers: Dict[str, Customer] = {}
        self.appointments: Dict[str, Appointment] = {}
        self.tickets: Dict[str, SupportTicket] = {}
        self.executed_workflows: List[Dict[str, Any]] = []

    async def schedule_appointment_workflow(self, customer: Customer, appointment: Appointment, 
                                          email_service: EmailService) -> Dict[str, Any]:
        """Execute workflow for new appointment"""
        tasks = [
            SendAppointmentConfirmationTask(email_service),
            UpdateLoyaltyPointsTask(),
            NotifyStaffTask(email_service)
        ]

        workflow = Workflow("AppointmentScheduled", tasks)
        context = {
            'customer': customer,
            'appointment': appointment,
            'points_per_service': {
                'General Checkup': 10,
                'Teeth Cleaning': 15,
                'Teeth Whitening': 25,
                'Dental Fillings': 20,
                'Root Canal': 50,
                'Dental Crown': 60,
                'Dental Implants': 100
            },
            'staff_email': 'staff@makhanda-smiles.com'
        }

        result = await workflow.execute(context)
        self.executed_workflows.append(result)
        return result

    async def schedule_reminder_workflow(self, customer: Customer, appointment: Appointment,
                                        email_service: EmailService,
                                        sms_service: Optional[SMSService] = None,
                                        hours_before: int = 24) -> Dict[str, Any]:
        """Execute workflow for appointment reminders"""
        tasks = [
            SendAppointmentReminderTask(email_service, sms_service)
        ]

        workflow = Workflow("AppointmentReminder", tasks)
        context = {
            'customer': customer,
            'appointment': appointment,
            'hours_before': hours_before
        }

        result = await workflow.execute(context)
        self.executed_workflows.append(result)
        return result

    async def handle_support_ticket_workflow(self, customer: Customer, ticket: SupportTicket,
                                           email_service: EmailService) -> Dict[str, Any]:
        """Execute workflow for support ticket handling"""
        tasks = [
            ResolveSupportTicketTask(email_service)
        ]

        workflow = Workflow("SupportTicketHandling", tasks)
        context = {
            'customer': customer,
            'ticket': ticket
        }

        result = await workflow.execute(context)
        self.executed_workflows.append(result)
        return result

    def add_customer(self, customer: Customer) -> bool:
        """Add customer to system"""
        self.customers[customer.id] = customer
        logger.info(f"Customer added: {customer.name}")
        return True

    def add_appointment(self, appointment: Appointment) -> bool:
        """Add appointment to system"""
        self.appointments[appointment.id] = appointment
        logger.info(f"Appointment added: {appointment.id}")
        return True

    def add_ticket(self, ticket: SupportTicket) -> bool:
        """Add support ticket to system"""
        self.tickets[ticket.id] = ticket
        logger.info(f"Support ticket added: {ticket.id}")
        return True

    def get_workflow_history(self) -> List[Dict[str, Any]]:
        """Get executed workflow history"""
        return self.executed_workflows

    def get_statistics(self) -> Dict[str, Any]:
        """Get system statistics"""
        return {
            'total_customers': len(self.customers),
            'total_appointments': len(self.appointments),
            'total_support_tickets': len(self.tickets),
            'total_workflows_executed': len(self.executed_workflows),
            'successful_workflows': sum(1 for w in self.executed_workflows if w['status'] == 'completed'),
            'failed_workflows': sum(1 for w in self.executed_workflows if w['status'] == 'failed')
        }
