"""
Example usage of the Dental Practice Automation System
Demonstrates how to use the workflow engine and scheduler
"""

import asyncio
import logging
from datetime import datetime, timedelta
from automation.workflow_engine import (
    WorkflowEngine, Customer, Appointment, SupportTicket,
    EmailService, SMSService, AppointmentStatus, SupportTicketStatus
)
from automation.scheduler import TaskScheduler, ReminderScheduler, FollowUpScheduler, MaintenanceScheduler

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


async def main():
    """Main example function"""
    
    # Initialize services
    email_service = EmailService(
        smtp_server="smtp.gmail.com",
        smtp_port=587,
        sender_email="your_email@gmail.com",
        sender_password="your_app_password"  # Use app-specific password
    )
    
    sms_service = SMSService(
        api_key="your_twilio_api_key",
        api_url="https://api.twilio.com"
    )
    
    # Initialize workflow engine
    workflow_engine = WorkflowEngine()
    workflow_engine.email_service = email_service
    workflow_engine.sms_service = sms_service
    
    # Initialize scheduler
    scheduler = TaskScheduler()
    reminder_scheduler = ReminderScheduler(scheduler, workflow_engine)
    follow_up_scheduler = FollowUpScheduler(scheduler, workflow_engine)
    maintenance_scheduler = MaintenanceScheduler(scheduler)
    
    # Start the scheduler
    await scheduler.start()
    
    try:
        # Create sample customer
        customer = Customer(
            id="cust_001",
            name="John Doe",
            email="john@example.com",
            phone="+1234567890",
            created_at=datetime.now(),
            loyalty_points=0,
            preferences={"notification_method": "email_and_sms"}
        )
        workflow_engine.add_customer(customer)
        
        # Create sample appointment
        appointment_time = datetime.now() + timedelta(days=7, hours=10)
        appointment = Appointment(
            id="apt_001",
            customer_id="cust_001",
            service_type="Teeth Cleaning",
            scheduled_time=appointment_time,
            duration_minutes=60,
            status=AppointmentStatus.PENDING_CONFIRMATION,
            dentist="Dr. Sarah Johnson",
            notes="First time patient"
        )
        workflow_engine.add_appointment(appointment)
        
        # Execute appointment booking workflow
        print("\n" + "="*60)
        print("EXECUTING: Appointment Booking Workflow")
        print("="*60)
        
        result = await workflow_engine.schedule_appointment_workflow(
            customer,
            appointment,
            email_service
        )
        
        print(f"\nWorkflow Status: {result['status']}")
        print(f"Tasks Executed: {result['tasks_executed']}")
        print(f"Tasks Successful: {result['tasks_successful']}")
        
        for task_result in result['results']:
            print(f"  - {task_result['task']}: {task_result['success']}")
        
        # Schedule appointment reminders
        print("\n" + "="*60)
        print("SCHEDULING: Appointment Reminders")
        print("="*60)
        
        # Schedule 24-hour reminder
        reminder_id_24 = await reminder_scheduler.schedule_reminder(
            "apt_001",
            "cust_001",
            reminder_minutes_before=1440  # 24 hours
        )
        print(f"\n24-hour reminder scheduled: {reminder_id_24}")
        
        # Schedule 2-hour reminder
        reminder_id_2 = await reminder_scheduler.schedule_reminder(
            "apt_001",
            "cust_001",
            reminder_minutes_before=120  # 2 hours
        )
        print(f"2-hour reminder scheduled: {reminder_id_2}")
        
        # Schedule follow-up
        print("\n" + "="*60)
        print("SCHEDULING: Post-Appointment Follow-up")
        print("="*60)
        
        follow_up_id = await follow_up_scheduler.schedule_follow_up(
            "apt_001",
            "cust_001",
            days_after=3
        )
        print(f"\nFollow-up scheduled: {follow_up_id}")
        
        # Get scheduled reminders
        print("\n" + "="*60)
        print("SCHEDULED REMINDERS STATUS")
        print("="*60)
        
        reminders = reminder_scheduler.get_scheduled_reminders()
        for reminder in reminders:
            print(f"\nReminder: {reminder['name']}")
            print(f"  Execute At: {reminder['execute_at']}")
            print(f"  Active: {reminder['is_active']}")
        
        # Create and handle support ticket
        print("\n" + "="*60)
        print("EXECUTING: Support Ticket Workflow")
        print("="*60)
        
        ticket = SupportTicket(
            id="ticket_001",
            customer_id="cust_001",
            subject="Question about practice hours",
            description="What are your practice hours on weekends?",
            status=SupportTicketStatus.OPEN,
            created_at=datetime.now(),
            updated_at=datetime.now(),
            priority="normal"
        )
        workflow_engine.add_ticket(ticket)
        
        ticket_result = await workflow_engine.handle_support_ticket_workflow(
            customer,
            ticket,
            email_service
        )
        
        print(f"\nWorkflow Status: {ticket_result['status']}")
        for task_result in ticket_result['results']:
            print(f"  - {task_result['task']}: {task_result['success']}")
        
        # Get system statistics
        print("\n" + "="*60)
        print("SYSTEM STATISTICS")
        print("="*60)
        
        stats = workflow_engine.get_statistics()
        print(f"\nTotal Customers: {stats['total_customers']}")
        print(f"Total Appointments: {stats['total_appointments']}")
        print(f"Total Support Tickets: {stats['total_support_tickets']}")
        print(f"Total Workflows Executed: {stats['total_workflows_executed']}")
        print(f"Successful Workflows: {stats['successful_workflows']}")
        print(f"Failed Workflows: {stats['failed_workflows']}")
        
        # Get workflow history
        print("\n" + "="*60)
        print("WORKFLOW EXECUTION HISTORY")
        print("="*60)
        
        for i, workflow in enumerate(workflow_engine.get_workflow_history(), 1):
            print(f"\n{i}. {workflow['workflow_name']}")
            print(f"   Status: {workflow['status']}")
            print(f"   Started: {workflow['started_at']}")
            print(f"   Completed: {workflow['completed_at']}")
            if workflow['duration_seconds']:
                print(f"   Duration: {workflow['duration_seconds']:.2f} seconds")
        
        # Simulate task execution for a few seconds
        print("\n" + "="*60)
        print("RUNNING SCHEDULER (5 seconds)")
        print("="*60)
        print("\nScheduler is running in background...")
        await asyncio.sleep(5)
        
        # Get task status
        print("\n" + "="*60)
        print("SCHEDULER TASK STATUS")
        print("="*60)
        
        all_tasks = scheduler.get_all_tasks_status()
        print(f"\nTotal Tasks: {len(all_tasks)}")
        for task in all_tasks:
            print(f"\nTask: {task['name']}")
            print(f"  ID: {task['id']}")
            print(f"  Active: {task['is_active']}")
            print(f"  Next Execution: {task['execute_at']}")
        
    finally:
        # Stop the scheduler
        await scheduler.stop()
        print("\n" + "="*60)
        print("SCHEDULER STOPPED")
        print("="*60)


def example_basic_automation():
    """Simple example without async"""
    
    print("=" * 60)
    print("BASIC AUTOMATION EXAMPLE")
    print("=" * 60)
    
    # Create workflow engine
    engine = WorkflowEngine()
    
    # Create customers and appointments
    customers = [
        Customer(
            id=f"cust_{i:03d}",
            name=f"Patient {i}",
            email=f"patient{i}@example.com",
            phone=f"+123456789{i}",
            created_at=datetime.now()
        )
        for i in range(1, 4)
    ]
    
    for customer in customers:
        engine.add_customer(customer)
        print(f"Added customer: {customer.name}")
    
    # Create appointments
    for i, customer in enumerate(customers, 1):
        appointment = Appointment(
            id=f"apt_{i:03d}",
            customer_id=customer.id,
            service_type="General Checkup" if i % 2 == 0 else "Teeth Cleaning",
            scheduled_time=datetime.now() + timedelta(days=i),
            duration_minutes=60,
            status=AppointmentStatus.SCHEDULED
        )
        engine.add_appointment(appointment)
        print(f"Added appointment for {customer.name}")
    
    # Get statistics
    stats = engine.get_statistics()
    print("\n" + "-" * 60)
    print("Statistics:")
    print(f"  Total Customers: {stats['total_customers']}")
    print(f"  Total Appointments: {stats['total_appointments']}")


if __name__ == "__main__":
    print("Dental Practice Automation System")
    print("=" * 60)
    print("\nStarting async example...\n")
    
    # Run the async example
    asyncio.run(main())
    
    print("\n\nRunning basic example...\n")
    example_basic_automation()
