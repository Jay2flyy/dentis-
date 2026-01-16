
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const GMAIL_USER = Deno.env.get("GMAIL_USER")!;
const GMAIL_PASSWORD = Deno.env.get("GMAIL_APP_PASSWORD")!;

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

serve(async (req: Request) => {
  try {
    // 1. Get Due Reminders
    const { data: reminders, error } = await supabase
      .from("appointment_reminders")
      .select(`
        id, reminder_type,
        appointments (
          patient_name, patient_email, appointment_date, appointment_time, service_type
        )
      `)
      .eq("status", "pending")
      .lte("scheduled_time", new Date().toISOString())
      .limit(20);

    if (error) throw error;
    if (!reminders || reminders.length === 0) return new Response(JSON.stringify({ message: "No reminders due" }), { headers: { "Content-Type": "application/json" } });

    let sentCount = 0;

    for (const r of reminders) {
      const apt = r.appointments;
      if (!apt) continue;

      let subject = "";
      let content = "";

      if (r.reminder_type === '24h') {
        subject = "Reminder: Appointment Tomorrow";
        content = `<p>Hi ${apt.patient_name},</p><p>This is a reminder for your <strong>${apt.service_type}</strong> appointment tomorrow at <strong>${apt.appointment_time}</strong>.</p>`;
      } else if (r.reminder_type === 'day_of') {
        subject = "Reminder: Appointment Today";
        content = `<p>Hi ${apt.patient_name},</p><p>You have an appointment today at <strong>${apt.appointment_time}</strong> for ${apt.service_type}. We look forward to seeing you!</p>`;
      } else if (r.reminder_type === '2h') {
        subject = "Reminder: Appointment in 2 Hours";
        content = `<p>Hi ${apt.patient_name},</p><p>See you in 2 hours!</p>`;
      }

      const sent = await sendEmail(apt.patient_email, subject, content);

      // Update status
      await supabase.from("appointment_reminders").update({
        status: sent ? 'sent' : 'failed',
        sent_at: new Date().toISOString()
      }).eq('id', r.id);

      if (sent) sentCount++;
    }

    return new Response(JSON.stringify({ processed: reminders.length, sent: sentCount }), { headers: { "Content-Type": "application/json" } });

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: String(error) }), { status: 500 });
  }
});
