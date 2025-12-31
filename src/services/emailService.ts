import emailjs from '@emailjs/browser';

// Initialize EmailJS
emailjs.init('service_yawbxfr');

export type EmailTemplateType = 
  | 'appointment_confirmation' 
  | 'appointment_reminder_24h' 
  | 'appointment_reminder_2h' 
  | 'appointment_followup' 
  | 'support_ticket_response'
  | 'contact_form_confirmation'
  | 'lead_response';

interface EmailData {
  to_email: string;
  to_name: string;
  subject: string;
  template_type: EmailTemplateType;
  appointment_date?: string;
  appointment_time?: string;
  service_type?: string;
  dentist_name?: string;
  practice_phone?: string;
  practice_address?: string;
  appointment_duration?: string;
  loyalty_points?: number;
  message_body?: string;
  ticket_id?: string;
  follow_up_message?: string;
  custom_content?: string;
  [key: string]: any;
}

/**
 * Universal EmailJS Service
 * Single template ID: dentist_email
 * Dynamically adapts to all email types
 */
export class EmailJSService {
  private readonly TEMPLATE_ID = 'dentist_email';
  private readonly SERVICE_ID = 'service_yawbxfr';

  /**
   * Send appointment confirmation
   */
  async sendAppointmentConfirmation(
    patientName: string,
    patientEmail: string,
    appointmentDate: string,
    appointmentTime: string,
    serviceType: string,
    dentistName: string,
    duration: number = 60
  ): Promise<boolean> {
    return this.sendEmail({
      to_email: patientEmail,
      to_name: patientName,
      subject: 'Appointment Confirmation - Makhanda Smiles',
      template_type: 'appointment_confirmation',
      appointment_date: appointmentDate,
      appointment_time: appointmentTime,
      service_type: serviceType,
      dentist_name: dentistName,
      appointment_duration: `${duration} minutes`,
      practice_phone: '+27 (0)123 456 7890',
      practice_address: 'Makhanda, South Africa',
      custom_content: `Your ${serviceType} appointment has been confirmed.`,
    });
  }

  /**
   * Send 24-hour reminder
   */
  async sendReminder24h(
    patientName: string,
    patientEmail: string,
    appointmentDate: string,
    appointmentTime: string,
    serviceType: string
  ): Promise<boolean> {
    return this.sendEmail({
      to_email: patientEmail,
      to_name: patientName,
      subject: 'Reminder: Your Appointment Tomorrow',
      template_type: 'appointment_reminder_24h',
      appointment_date: appointmentDate,
      appointment_time: appointmentTime,
      service_type: serviceType,
      practice_phone: '+27 (0)123 456 7890',
      custom_content: `This is a friendly reminder that your ${serviceType} appointment is scheduled for tomorrow at ${appointmentTime}. Please arrive 10 minutes early.`,
    });
  }

  /**
   * Send 2-hour reminder
   */
  async sendReminder2h(
    patientName: string,
    patientEmail: string,
    appointmentTime: string,
    serviceType: string
  ): Promise<boolean> {
    return this.sendEmail({
      to_email: patientEmail,
      to_name: patientName,
      subject: 'Reminder: Your Appointment in 2 Hours',
      template_type: 'appointment_reminder_2h',
      appointment_time: appointmentTime,
      service_type: serviceType,
      practice_phone: '+27 (0)123 456 7890',
      custom_content: `Don't forget! Your ${serviceType} appointment is in 2 hours at ${appointmentTime}. We're looking forward to seeing you!`,
    });
  }

  /**
   * Send follow-up email (3 days after appointment)
   */
  async sendFollowUp(
    patientName: string,
    patientEmail: string,
    serviceType: string,
    loyaltyPoints: number = 0
  ): Promise<boolean> {
    const loyaltyMessage = loyaltyPoints > 0 
      ? `You've also earned ${loyaltyPoints} loyalty points!`
      : '';

    return this.sendEmail({
      to_email: patientEmail,
      to_name: patientName,
      subject: 'Thank You - How Was Your Visit?',
      template_type: 'appointment_followup',
      service_type: serviceType,
      loyalty_points: loyaltyPoints,
      practice_phone: '+27 (0)123 456 7890',
      follow_up_message: loyaltyMessage,
      custom_content: `Thank you for choosing Makhanda Smiles for your ${serviceType}. We hope you had an excellent experience. If you have any questions or concerns, please don't hesitate to contact us.`,
    });
  }

  /**
   * Send support ticket response
   */
  async sendSupportResponse(
    customerName: string,
    customerEmail: string,
    ticketId: string,
    responseMessage: string
  ): Promise<boolean> {
    return this.sendEmail({
      to_email: customerEmail,
      to_name: customerName,
      subject: `Support Response - Ticket #${ticketId}`,
      template_type: 'support_ticket_response',
      ticket_id: ticketId,
      message_body: responseMessage,
      practice_phone: '+27 (0)123 456 7890',
      custom_content: responseMessage,
    });
  }

  /**
   * Send contact form confirmation
   */
  async sendContactFormConfirmation(
    name: string,
    email: string,
    subject: string
  ): Promise<boolean> {
    return this.sendEmail({
      to_email: email,
      to_name: name,
      subject: 'Thank You - We Received Your Message',
      template_type: 'contact_form_confirmation',
      message_body: subject,
      practice_phone: '+27 (0)123 456 7890',
      custom_content: `Thank you for contacting Makhanda Smiles. We have received your message and will get back to you as soon as possible.`,
    });
  }

  /**
   * Send lead response email
   */
  async sendLeadResponse(
    leadName: string,
    leadEmail: string,
    message: string
  ): Promise<boolean> {
    return this.sendEmail({
      to_email: leadEmail,
      to_name: leadName,
      subject: 'Welcome to Makhanda Smiles',
      template_type: 'lead_response',
      message_body: message,
      practice_phone: '+27 (0)123 456 7890',
      custom_content: message,
    });
  }

  /**
   * Core email sending method
   * Sends to the universal EmailJS template
   */
  private async sendEmail(data: EmailData): Promise<boolean> {
    try {
      const response = await emailjs.send(
        this.SERVICE_ID,
        this.TEMPLATE_ID,
        {
          to_email: data.to_email,
          to_name: data.to_name,
          subject: data.subject,
          template_type: data.template_type,
          appointment_date: data.appointment_date || 'N/A',
          appointment_time: data.appointment_time || 'N/A',
          appointment_duration: data.appointment_duration || 'N/A',
          service_type: data.service_type || 'N/A',
          dentist_name: data.dentist_name || 'Makhanda Smiles Team',
          practice_phone: data.practice_phone || '+27 (0)123 456 7890',
          practice_address: data.practice_address || 'Makhanda, South Africa',
          loyalty_points: data.loyalty_points || 0,
          message_body: data.message_body || '',
          ticket_id: data.ticket_id || '',
          follow_up_message: data.follow_up_message || '',
          custom_content: data.custom_content || '',
        }
      );

      console.log('Email sent successfully:', response.status);
      return true;
    } catch (error) {
      console.error('Email sending failed:', error);
      return false;
    }
  }

  /**
   * Batch send emails
   */
  async sendBatch(emails: EmailData[]): Promise<{ sent: number; failed: number }> {
    let sent = 0;
    let failed = 0;

    for (const email of emails) {
      const result = await this.sendEmail(email);
      if (result) {
        sent++;
      } else {
        failed++;
      }
      // Rate limiting: wait 100ms between emails
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    return { sent, failed };
  }
}

// Create singleton instance
export const emailService = new EmailJSService();
