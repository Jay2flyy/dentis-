"""
Background Task Scheduler for Dental Practice Automation
Handles scheduled tasks like appointment reminders, follow-ups, etc.
"""

import asyncio
import logging
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Callable, Any
from dataclasses import dataclass
from enum import Enum
from abc import ABC, abstractmethod
import json

logger = logging.getLogger(__name__)


class ScheduleType(Enum):
    """Type of schedule"""
    ONCE = "once"
    DAILY = "daily"
    WEEKLY = "weekly"
    MONTHLY = "monthly"
    INTERVAL = "interval"


@dataclass
class ScheduledTask:
    """Represents a scheduled task"""
    id: str
    name: str
    callback: Callable
    schedule_type: ScheduleType
    execute_at: datetime
    interval_seconds: Optional[int] = None
    is_active: bool = True
    last_executed: Optional[datetime] = None
    next_execution: datetime = None
    retry_count: int = 0
    max_retries: int = 3


class TaskScheduler:
    """Background task scheduler"""

    def __init__(self):
        self.tasks: Dict[str, ScheduledTask] = {}
        self.running = False
        self.executor_task = None

    def add_task(self, task: ScheduledTask) -> None:
        """Add a task to the scheduler"""
        self.tasks[task.id] = task
        logger.info(f"Task added: {task.name} (ID: {task.id})")

    def remove_task(self, task_id: str) -> bool:
        """Remove a task from the scheduler"""
        if task_id in self.tasks:
            del self.tasks[task_id]
            logger.info(f"Task removed: {task_id}")
            return True
        return False

    def pause_task(self, task_id: str) -> bool:
        """Pause a task"""
        if task_id in self.tasks:
            self.tasks[task_id].is_active = False
            logger.info(f"Task paused: {task_id}")
            return True
        return False

    def resume_task(self, task_id: str) -> bool:
        """Resume a paused task"""
        if task_id in self.tasks:
            self.tasks[task_id].is_active = True
            logger.info(f"Task resumed: {task_id}")
            return True
        return False

    async def start(self) -> None:
        """Start the scheduler"""
        self.running = True
        logger.info("Task scheduler started")
        self.executor_task = asyncio.create_task(self._execute_loop())

    async def stop(self) -> None:
        """Stop the scheduler"""
        self.running = False
        if self.executor_task:
            await self.executor_task
        logger.info("Task scheduler stopped")

    async def _execute_loop(self) -> None:
        """Main execution loop"""
        while self.running:
            try:
                now = datetime.now()
                
                for task_id, task in list(self.tasks.items()):
                    if not task.is_active:
                        continue

                    if now >= task.execute_at:
                        await self._execute_task(task)
                        self._update_next_execution(task)

                # Check every second
                await asyncio.sleep(1)

            except Exception as e:
                logger.error(f"Scheduler loop error: {str(e)}")
                await asyncio.sleep(1)

    async def _execute_task(self, task: ScheduledTask) -> None:
        """Execute a single task"""
        try:
            logger.info(f"Executing task: {task.name}")
            
            if asyncio.iscoroutinefunction(task.callback):
                await task.callback()
            else:
                task.callback()
            
            task.last_executed = datetime.now()
            task.retry_count = 0
            logger.info(f"Task completed: {task.name}")

        except Exception as e:
            task.retry_count += 1
            logger.error(f"Task failed: {task.name} - {str(e)} (Attempt {task.retry_count}/{task.max_retries})")
            
            if task.retry_count >= task.max_retries:
                task.is_active = False
                logger.warning(f"Task disabled after {task.max_retries} failures: {task.name}")

    def _update_next_execution(self, task: ScheduledTask) -> None:
        """Update next execution time based on schedule type"""
        if task.schedule_type == ScheduleType.ONCE:
            task.is_active = False
        elif task.schedule_type == ScheduleType.DAILY:
            task.execute_at = task.execute_at + timedelta(days=1)
        elif task.schedule_type == ScheduleType.WEEKLY:
            task.execute_at = task.execute_at + timedelta(weeks=1)
        elif task.schedule_type == ScheduleType.MONTHLY:
            task.execute_at = task.execute_at + timedelta(days=30)
        elif task.schedule_type == ScheduleType.INTERVAL:
            if task.interval_seconds:
                task.execute_at = datetime.now() + timedelta(seconds=task.interval_seconds)

    def get_task_status(self, task_id: str) -> Optional[Dict[str, Any]]:
        """Get status of a specific task"""
        if task_id not in self.tasks:
            return None

        task = self.tasks[task_id]
        return {
            'id': task.id,
            'name': task.name,
            'schedule_type': task.schedule_type.value,
            'is_active': task.is_active,
            'execute_at': task.execute_at.isoformat(),
            'last_executed': task.last_executed.isoformat() if task.last_executed else None,
            'retry_count': task.retry_count,
            'max_retries': task.max_retries
        }

    def get_all_tasks_status(self) -> List[Dict[str, Any]]:
        """Get status of all tasks"""
        return [self.get_task_status(task_id) for task_id in self.tasks]


class ReminderScheduler:
    """Manages appointment reminders"""

    def __init__(self, scheduler: TaskScheduler, workflow_engine):
        self.scheduler = scheduler
        self.workflow_engine = workflow_engine
        self.reminders: Dict[str, ScheduledTask] = {}

    async def schedule_reminder(self, appointment_id: str, customer_id: str, 
                               reminder_minutes_before: int = 1440) -> str:
        """Schedule an appointment reminder (default: 24 hours before)"""
        
        appointment = self.workflow_engine.appointments.get(appointment_id)
        customer = self.workflow_engine.customers.get(customer_id)

        if not appointment or not customer:
            logger.error(f"Appointment or customer not found")
            return None

        reminder_time = appointment.scheduled_time - timedelta(minutes=reminder_minutes_before)
        reminder_id = f"reminder_{appointment_id}_{reminder_minutes_before}"

        async def send_reminder():
            await self.workflow_engine.schedule_reminder_workflow(
                customer,
                appointment,
                self.workflow_engine.email_service,
                self.workflow_engine.sms_service,
                hours_before=reminder_minutes_before // 60
            )

        task = ScheduledTask(
            id=reminder_id,
            name=f"Reminder for {customer.name} - {appointment.service_type}",
            callback=send_reminder,
            schedule_type=ScheduleType.ONCE,
            execute_at=reminder_time
        )

        self.scheduler.add_task(task)
        self.reminders[reminder_id] = task
        logger.info(f"Reminder scheduled for {customer.name} at {reminder_time}")

        return reminder_id

    def cancel_reminder(self, reminder_id: str) -> bool:
        """Cancel a scheduled reminder"""
        if reminder_id in self.reminders:
            self.scheduler.remove_task(reminder_id)
            del self.reminders[reminder_id]
            logger.info(f"Reminder cancelled: {reminder_id}")
            return True
        return False

    def get_scheduled_reminders(self) -> List[Dict[str, Any]]:
        """Get all scheduled reminders"""
        return [self.scheduler.get_task_status(rid) for rid in self.reminders]


class FollowUpScheduler:
    """Manages post-appointment follow-ups"""

    def __init__(self, scheduler: TaskScheduler, workflow_engine):
        self.scheduler = scheduler
        self.workflow_engine = workflow_engine
        self.follow_ups: Dict[str, ScheduledTask] = {}

    async def schedule_follow_up(self, appointment_id: str, customer_id: str, 
                                days_after: int = 3) -> str:
        """Schedule a post-appointment follow-up"""
        
        appointment = self.workflow_engine.appointments.get(appointment_id)
        customer = self.workflow_engine.customers.get(customer_id)

        if not appointment or not customer:
            logger.error(f"Appointment or customer not found")
            return None

        follow_up_time = appointment.scheduled_time + timedelta(days=days_after)
        follow_up_id = f"followup_{appointment_id}_{days_after}d"

        async def send_follow_up():
            # Create and send follow-up message
            subject = f"How was your {appointment.service_type} appointment?"
            html_body = f"""
            <html>
                <body style="font-family: Arial, sans-serif;">
                    <h2>Follow-up</h2>
                    <p>Dear {customer.name},</p>
                    <p>We hope your {appointment.service_type} appointment went well!</p>
                    <p>If you have any questions or concerns, please don't hesitate to contact us.</p>
                    <p>We'd love to hear your feedback. Please reply to this email or call us.</p>
                    <p>Best regards,<br>Makhanda Smiles Dental Practice</p>
                </body>
            </html>
            """
            self.workflow_engine.email_service.send_email(
                customer.email,
                subject,
                html_body,
                html=True
            )

        task = ScheduledTask(
            id=follow_up_id,
            name=f"Follow-up for {customer.name}",
            callback=send_follow_up,
            schedule_type=ScheduleType.ONCE,
            execute_at=follow_up_time
        )

        self.scheduler.add_task(task)
        self.follow_ups[follow_up_id] = task
        logger.info(f"Follow-up scheduled for {customer.name} on {follow_up_time}")

        return follow_up_id

    def cancel_follow_up(self, follow_up_id: str) -> bool:
        """Cancel a scheduled follow-up"""
        if follow_up_id in self.follow_ups:
            self.scheduler.remove_task(follow_up_id)
            del self.follow_ups[follow_up_id]
            logger.info(f"Follow-up cancelled: {follow_up_id}")
            return True
        return False

    def get_scheduled_follow_ups(self) -> List[Dict[str, Any]]:
        """Get all scheduled follow-ups"""
        return [self.scheduler.get_task_status(fid) for fid in self.follow_ups]


class MaintenanceScheduler:
    """Manages system maintenance tasks"""

    def __init__(self, scheduler: TaskScheduler):
        self.scheduler = scheduler
        self.maintenance_tasks: Dict[str, ScheduledTask] = {}

    async def schedule_database_backup(self, backup_function: Callable, interval_hours: int = 24) -> str:
        """Schedule regular database backups"""
        backup_id = f"backup_{int(datetime.now().timestamp())}"

        async def perform_backup():
            logger.info("Starting database backup")
            try:
                await backup_function()
                logger.info("Database backup completed")
            except Exception as e:
                logger.error(f"Database backup failed: {str(e)}")

        task = ScheduledTask(
            id=backup_id,
            name="Database Backup",
            callback=perform_backup,
            schedule_type=ScheduleType.INTERVAL,
            execute_at=datetime.now() + timedelta(hours=interval_hours),
            interval_seconds=interval_hours * 3600
        )

        self.scheduler.add_task(task)
        self.maintenance_tasks[backup_id] = task
        logger.info(f"Database backup scheduled every {interval_hours} hours")

        return backup_id

    async def schedule_cleanup_cancelled_appointments(self, cleanup_function: Callable, 
                                                     run_time: str = "02:00") -> str:
        """Schedule cleanup of cancelled appointments"""
        cleanup_id = f"cleanup_{int(datetime.now().timestamp())}"

        async def perform_cleanup():
            logger.info("Starting cleanup of cancelled appointments")
            try:
                await cleanup_function()
                logger.info("Cleanup completed")
            except Exception as e:
                logger.error(f"Cleanup failed: {str(e)}")

        # Parse time (format: HH:MM)
        hour, minute = map(int, run_time.split(':'))
        now = datetime.now()
        execute_at = now.replace(hour=hour, minute=minute, second=0)
        
        if execute_at < now:
            execute_at += timedelta(days=1)

        task = ScheduledTask(
            id=cleanup_id,
            name="Cleanup Cancelled Appointments",
            callback=perform_cleanup,
            schedule_type=ScheduleType.DAILY,
            execute_at=execute_at
        )

        self.scheduler.add_task(task)
        self.maintenance_tasks[cleanup_id] = task
        logger.info(f"Cleanup scheduled daily at {run_time}")

        return cleanup_id

    def get_maintenance_status(self) -> List[Dict[str, Any]]:
        """Get status of all maintenance tasks"""
        return [self.scheduler.get_task_status(mid) for mid in self.maintenance_tasks]
