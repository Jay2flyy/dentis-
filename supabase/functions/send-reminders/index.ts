import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const emailjsServiceId = "service_yawbxfr";
const emailjsTemplateId = "dentist_email";
const emailjsPublicKey = Deno.env.get("EMAILJS_PUBLIC_KEY") || "YOUR_PUBLIC_KEY";

const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Send email via EmailJS
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

    return response.ok;
  } catch (error) {
    console.error("Failed to send email:", error);
    return false;
  }
}

/**
 * Process all due reminders
 */
async function processDueReminders() {
  try {
    // Get all pending reminders that are due
    const { data: reminders, error } = await supabase
      .from("appointment_reminders")
      .select(
        `
        id,
        reminder_type,
        appointment_id,
        appointments (
          id,
          patient_name,
          patient_email,
          appointment_date,
          appointment_time,
          service_type
        )
      `
      )
      .eq("status", "pending")
      .lte("scheduled_time", new Date().toISOString())
      .limit(50);

    if (error) {
      console.error("Error fetching reminders:", error);
      return { processed: 0, sent: 0, failed: 0 };
    }

    let sent = 0;
    let failed = 0;

    for (const reminder of reminders || []) {
      try {
        const appointment = reminder.appointments[0];
        let emailData: Record<string, any> = {
          to_email: appointment.patient_email,
          to_name: appointment.patient_name,
          appointment_date: appointment.appointment_date,
          appointment_time: appointment.appointment_time,
          service_type: appointment.service_type,
          dentist_name: "Makhanda Smiles Team",
          practice_phone: "+27 (0)123 456 7890",
        };

        if (reminder.reminder_type === "24h") {
          emailData = {
            ...emailData,
            subject: "Reminder: Your Appointment Tomorrow",
            template_type: "appointment_reminder_24h",
            appointment_duration: "60 minutes",
            custom_content: `This is a friendly reminder that your ${appointment.service_type} appointment is scheduled for tomorrow at ${appointment.appointment_time}. Please arrive 10 minutes early.`,
          };
        } else if (reminder.reminder_type === "2h") {
          emailData = {
            ...emailData,
            subject: "Reminder: Your Appointment in 2 Hours",
            template_type: "appointment_reminder_2h",
            custom_content: `Don't forget! Your ${appointment.service_type} appointment is in 2 hours at ${appointment.appointment_time}. We're looking forward to seeing you!`,
          };
        }

        const emailSent = await sendEmailViaEmailJS(emailData);

        // Update reminder status
        const { error: updateError } = await supabase
          .from("appointment_reminders")
          .update({
            status: emailSent ? "sent" : "failed",
            sent_at: emailSent ? new Date().toISOString() : null,
          })
          .eq("id", reminder.id);

        if (!updateError) {
          // Log email
          await supabase.from("email_logs").insert({
            recipient_email: appointment.patient_email,
            subject: emailData.subject,
            template_type: emailData.template_type,
            appointment_id: appointment.id,
            status: emailSent ? "sent" : "failed",
            sent_at: emailSent ? new Date().toISOString() : null,
          });

          if (emailSent) {
            sent++;
          } else {
            failed++;
          }
        }
      } catch (reminderError) {
        console.error("Error processing reminder:", reminderError);
        failed++;
      }
    }

    return {
      processed: reminders?.length || 0,
      sent,
      failed,
    };
  } catch (error) {
    console.error("Error in processDueReminders:", error);
    return { processed: 0, sent: 0, failed: 0 };
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
      const result = await processDueReminders();

      return new Response(JSON.stringify(result), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
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
