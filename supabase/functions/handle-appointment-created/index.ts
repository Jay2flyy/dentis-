import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const emailjsServiceId = "service_yawbxfr";
const emailjsTemplateId = "dentist_email";
const emailjsPublicKey = Deno.env.get("EMAILJS_PUBLIC_KEY") || "YOUR_PUBLIC_KEY";

const supabase = createClient(supabaseUrl, supabaseServiceKey);

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

/**
 * Send email via EmailJS from Edge Function
 */
async function sendEmailViaEmailJS(emailData: Record<string, any>): Promise<boolean> {
  try {
    const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        service_id: emailjsServiceId,
        template_id: emailjsTemplateId,
        user_id: emailjsPublicKey,
        template_params: emailData,
      }),
    });

    if (response.ok) {
      console.log("Email sent via EmailJS");
      return true;
    } else {
      console.error("EmailJS error:", await response.text());
      return false;
    }
  } catch (error) {
    console.error("Failed to send email:", error);
    return false;
  }
}

/**
 * Handle appointment confirmation workflow
 */
async function handleAppointmentConfirmation(appointment: AppointmentWebhook) {
  try {
    // 1. Send confirmation email
    const emailSent = await sendEmailViaEmailJS({
      to_email: appointment.patient_email,
      to_name: appointment.patient_name,
      subject: "Appointment Confirmation - Makhanda Smiles",
      template_type: "appointment_confirmation",
      appointment_date: appointment.appointment_date,
      appointment_time: appointment.appointment_time,
      service_type: appointment.service_type,
      dentist_name: "Makhanda Smiles Team",
      appointment_duration: "60 minutes",
      practice_phone: "+27 (0)123 456 7890",
      practice_address: "Makhanda, South Africa",
      custom_content: `Your ${appointment.service_type} appointment has been confirmed.`,
    });

    // 2. Log email
    if (emailSent) {
      await supabase.from("email_logs").insert({
        recipient_email: appointment.patient_email,
        subject: "Appointment Confirmation - Makhanda Smiles",
        template_type: "appointment_confirmation",
        appointment_id: appointment.id,
        status: "sent",
        sent_at: new Date().toISOString(),
      });
    }

    // 3. Schedule 24-hour reminder
    const appointmentDateTime = new Date(
      `${appointment.appointment_date}T${appointment.appointment_time}`
    );
    const reminder24h = new Date(appointmentDateTime.getTime() - 24 * 60 * 60 * 1000);

    await supabase.from("appointment_reminders").insert({
      appointment_id: appointment.id,
      reminder_type: "24h",
      scheduled_time: reminder24h.toISOString(),
      status: "pending",
    });

    // 4. Schedule 2-hour reminder
    const reminder2h = new Date(appointmentDateTime.getTime() - 2 * 60 * 60 * 1000);

    await supabase.from("appointment_reminders").insert({
      appointment_id: appointment.id,
      reminder_type: "2h",
      scheduled_time: reminder2h.toISOString(),
      status: "pending",
    });

    // 5. Log workflow execution
    await supabase.from("workflow_executions").insert({
      workflow_name: "AppointmentConfirmation",
      workflow_type: "appointment",
      appointment_id: appointment.id,
      status: "completed",
      context: appointment,
      results: { email_sent: emailSent, reminders_scheduled: 2 },
    });

    return { success: true, message: "Appointment confirmation workflow completed" };
  } catch (error) {
    console.error("Error in appointment confirmation workflow:", error);

    await supabase.from("workflow_executions").insert({
      workflow_name: "AppointmentConfirmation",
      workflow_type: "appointment",
      appointment_id: appointment.id,
      status: "failed",
      context: appointment,
      results: { error: String(error) },
    });

    return { success: false, error: String(error) };
  }
}

serve(async (req: Request) => {
  // Enable CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  try {
    if (req.method === "POST") {
      const body = await req.json();
      const appointment: AppointmentWebhook = body.record;

      if (body.type === "INSERT") {
        // New appointment created
        const result = await handleAppointmentConfirmation(appointment);

        return new Response(JSON.stringify(result), {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        });
      }
    }

    return new Response(JSON.stringify({ error: "Invalid request" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Edge Function error:", error);
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
