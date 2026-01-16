
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const GMAIL_USER = Deno.env.get("GMAIL_USER")!;
const GMAIL_PASSWORD = Deno.env.get("GMAIL_APP_PASSWORD")!;
const DENTIST_EMAIL = "mudimbujustin2@gmail.com";

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const client = new SmtpClient();

const sendEmail = async (to: string, subject: string, htmlContent: string) => {
  try {
    await client.connectTLS({
      hostname: "smtp.gmail.com",
      port: 465,
      username: GMAIL_USER,
      password: GMAIL_PASSWORD,
    });

    await client.send({
      from: `Makhanda Smiles <${GMAIL_USER}>`,
      to: to,
      subject: subject,
      content: htmlContent,
      html: htmlContent,
    });

    await client.close();
    return true;
  } catch (error) {
    console.error("Email Sent Error:", error);
    return false;
  }
};

interface AppointmentWebhook {
  id: string;
  patient_name: string;
  patient_email: string;
  patient_phone: string;
  appointment_date: string;
  appointment_time: string;
  service_type: string;
  status: string;
}

serve(async (req: Request) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

  try {
    const body = await req.json();
    const appointment: AppointmentWebhook = body.record;

    if (body.type === "INSERT") {
      // 1. Send Patient Confirmation
      const patientHtml = `
        <h2>Appointment Confirmed</h2>
        <p>Dear ${appointment.patient_name},</p>
        <p>Your appointment for <strong>${appointment.service_type}</strong> has been booked successfully.</p>
        <p><strong>Date:</strong> ${appointment.appointment_date}</p>
        <p><strong>Time:</strong> ${appointment.appointment_time}</p>
        <p>See you soon!</p>
        <p>- Makhanda Smiles Team</p>
      `;
      await sendEmail(appointment.patient_email, "Appointment Confirmation - Makhanda Smiles", patientHtml);

      // 2. Send Dentist Notification (Real-Time)
      const dentistHtml = `
        <h2>🔔 New Booking Alert</h2>
        <p>A new appointment has just been booked.</p>
        <ul>
            <li><strong>Patient:</strong> ${appointment.patient_name} (${appointment.patient_email})</li>
            <li><strong>Service:</strong> ${appointment.service_type}</li>
            <li><strong>Date:</strong> ${appointment.appointment_date}</li>
            <li><strong>Time:</strong> ${appointment.appointment_time}</li>
        </ul>
      `;
      await sendEmail(DENTIST_EMAIL, "New Booking Alert", dentistHtml);

      // 3. Schedule Reminders (DB Trigger handles this usually, but we can do extra logic here if needed)
      // For now, we rely on the DB trigger for inserting into 'appointment_reminders' table.

      return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({ success: true, message: "Not an INSERT event" }), { headers: { "Content-Type": "application/json" } });

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: String(error) }), { status: 500 });
  }
});
