"""
Dental Practice Automation Module
Complete automation system for customer support, appointment management, and more
"""

from .workflow_engine import (
    WorkflowEngine,
    Workflow,
    WorkflowTask,
    WorkflowStatus,
    Customer,
    Appointment,
    AppointmentStatus,
    SupportTicket,
    SupportTicketStatus,
    EmailService,
    SMSService,
    SendAppointmentConfirmationTask,
    SendAppointmentReminderTask,
    ResolveSupportTicketTask,
    UpdateLoyaltyPointsTask,
    NotifyStaffTask,
)

from .scheduler import (
    TaskScheduler,
    ScheduledTask,
    ScheduleType,
    ReminderScheduler,
    FollowUpScheduler,
    MaintenanceScheduler,
)

__all__ = [
    # Workflow Engine
    'WorkflowEngine',
    'Workflow',
    'WorkflowTask',
    'WorkflowStatus',
    'Customer',
    'Appointment',
    'AppointmentStatus',
    'SupportTicket',
    'SupportTicketStatus',
    'EmailService',
    'SMSService',
    'SendAppointmentConfirmationTask',
    'SendAppointmentReminderTask',
    'ResolveSupportTicketTask',
    'UpdateLoyaltyPointsTask',
    'NotifyStaffTask',
    # Scheduler
    'TaskScheduler',
    'ScheduledTask',
    'ScheduleType',
    'ReminderScheduler',
    'FollowUpScheduler',
    'MaintenanceScheduler',
]

__version__ = '1.0.0'
__author__ = 'Dental Practice Automation Team'
