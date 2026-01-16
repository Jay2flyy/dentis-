import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

// Email Templates
export const EMAIL_TEMPLATES = {
  patientConfirmation: (details: {
    name: string;
    date: string;
    time: string;
    service: string;
  }) => ({
    subject: `✅ Appointment Confirmed - Makhanda Smiles`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
          .container { padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .info-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
          .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          ul { padding-left: 20px; }
          li { margin: 8px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🦷 Appointment Confirmed!</h1>
          </div>
          <div class="content">
            <p>Hi <strong>${details.name}</strong>,</p>
            <p>Great news! Your dental appointment has been confirmed at <strong>Makhanda Smiles</strong>.</p>
            
            <div class="info-box">
              <h3>📅 Appointment Details</h3>
              <p><strong>Date:</strong> ${new Date(details.date).toLocaleDateString('en-ZA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <p><strong>Time:</strong> ${details.time}</p>
              <p><strong>Service:</strong> ${details.service}</p>
              <p><strong>Location:</strong> Makhanda Smiles, Grahamstown</p>
            </div>

            <h3>📋 Before Your Visit:</h3>
            <ul>
              <li>Arrive 10 minutes early for paperwork</li>
              <li>Bring your ID and medical aid card (if applicable)</li>
              <li>List any medications you're currently taking</li>
              <li>Brush and floss before your appointment</li>
            </ul>

            <h3>❓ Need to Reschedule?</h3>
            <p>No problem! Just reply to this email or contact us at least 24 hours in advance.</p>

            <p style="margin-top:30px">Looking forward to seeing you soon!</p>
            <p><strong>The Makhanda Smiles Team</strong><br>
            📞 Phone: ${process.env.PRACTICE_PHONE || '(046) 622-xxxx'}<br>
            📧 Email: appointments@makhandasmiles.co.za<br>
            📍 Address: ${process.env.PRACTICE_ADDRESS || 'Grahamstown, Eastern Cape'}</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),

  patientReschedule: (details: {
    name: string;
    newDate: string;
    newTime: string;
    oldDate?: string;
    oldTime?: string;
    service: string;
  }) => ({
    subject: `📅 Appointment Rescheduled - Makhanda Smiles`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
          .container { padding: 20px; }
          .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .info-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📅 Appointment Rescheduled</h1>
          </div>
          <div class="content">
            <p>Hi <strong>${details.name}</strong>,</p>
            <p>Your appointment has been successfully rescheduled.</p>
            
            <div class="info-box">
              <h3>📅 New Appointment Details</h3>
              <p><strong>New Date:</strong> ${new Date(details.newDate).toLocaleDateString('en-ZA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <p><strong>New Time:</strong> ${details.newTime}</p>
              <p><strong>Service:</strong> ${details.service}</p>
            </div>

            ${details.oldDate ? `
            <p style="color:#6b7280"><em>Previous appointment: ${new Date(details.oldDate).toLocaleDateString('en-ZA')} at ${details.oldTime}</em></p>
            ` : ''}

            <p style="margin-top:30px">See you on your new date!</p>
            <p><strong>The Makhanda Smiles Team</strong><br>
            📞 Phone: ${process.env.PRACTICE_PHONE || '(046) 622-xxxx'}</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),

  patientReminder: (details: {
    name: string;
    time: string;
    service: string;
  }) => ({
    subject: `🔔 Reminder: Your Appointment Today at ${details.time}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
          .container { padding: 20px; }
          .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .info-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981; }
          .urgent { background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔔 Appointment Reminder</h1>
          </div>
          <div class="content">
            <p>Hi <strong>${details.name}</strong>,</p>
            <p>This is a friendly reminder about your dental appointment <strong>today</strong>!</p>
            
            <div class="info-box">
              <h3>📅 Today's Appointment</h3>
              <p><strong>Time:</strong> ${details.time}</p>
              <p><strong>Service:</strong> ${details.service}</p>
              <p><strong>Location:</strong> Makhanda Smiles, Grahamstown</p>
            </div>

            <div class="urgent">
              <p><strong>⏰ Please arrive 10 minutes early for paperwork.</strong></p>
            </div>
            
            <p>Need to cancel? Please call us as soon as possible at <strong>${process.env.PRACTICE_PHONE || '(046) 622-xxxx'}</strong>.</p>
            
            <p style="margin-top:30px">See you soon!</p>
            <p><strong>The Makhanda Smiles Team</strong></p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),

  doctorNotification: (
    details: any,
    type: 'new' | 'rescheduled'
  ) => ({
    subject:
      type === 'new'
        ? `🆕 New Appointment: ${details.name} - ${details.date} at ${details.time}`
        : `🔄 Rescheduled: ${details.name} - ${details.newDate} at ${details.newTime}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
          .container { padding: 20px; }
          .header { background: #1f2937; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 20px; border-radius: 0 0 8px 8px; }
          .info-table { width: 100%; background: white; border-radius: 8px; overflow: hidden; margin: 20px 0; border-collapse: collapse; }
          .info-table td { padding: 12px; border-bottom: 1px solid #e5e7eb; }
          .info-table td:first-child { font-weight: bold; background: #f3f4f6; width: 140px; }
          .status-confirmed { color: #10b981; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>${type === 'new' ? '🆕 New Appointment Booked' : '🔄 Appointment Rescheduled'}</h2>
            <p style="margin:0;font-size:14px;opacity:0.9">Via Thandi AI Assistant</p>
          </div>
          <div class="content">
            <table class="info-table">
              <tr><td>Patient Name</td><td>${details.name}</td></tr>
              <tr><td>Email</td><td>${details.email}</td></tr>
              <tr><td>Phone</td><td>${details.phone || 'Not provided'}</td></tr>
              <tr><td>${type === 'new' ? 'Date' : 'New Date'}</td><td>${new Date(type === 'new' ? details.date : details.newDate).toLocaleDateString('en-ZA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</td></tr>
              <tr><td>${type === 'new' ? 'Time' : 'New Time'}</td><td>${type === 'new' ? details.time : details.newTime}</td></tr>
              <tr><td>Service</td><td>${details.service}</td></tr>
              <tr><td>Status</td><td class="status-confirmed">Confirmed</td></tr>
            </table>
            ${type === 'rescheduled' && details.oldDate
        ? `<p style="color:#6b7280;font-size:14px"><em>Previous: ${new Date(details.oldDate).toLocaleDateString('en-ZA')} at ${details.oldTime}</em></p>`
        : ''
      }
            <p style="margin-top:20px;font-size:12px;color:#6b7280">This is an automated notification from Thandi AI Assistant. Patient has been sent a confirmation email.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),
};

// Send Email Function
export async function sendEmail(to: string, subject: string, html: string) {
  try {
    await transporter.sendMail({
      from: `"${process.env.PRACTICE_NAME || 'Makhanda Smiles'}" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`✅ Email sent to ${to}`);
    return { success: true };
  } catch (error) {
    console.error('❌ Email error:', error);
    return { success: false, error };
  }
}
