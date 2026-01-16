
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";

const GMAIL_USER = Deno.env.get("GMAIL_USER")!;
const GMAIL_PASSWORD = Deno.env.get("GMAIL_APP_PASSWORD")!;
const DENTIST_EMAIL = "mudimbujustin2@gmail.com";

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
    appointment_date: string;
    appointment_time: string;
    service_type: string;
}

serve(async (req: Request) => {
    if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

    try {
        const body = await req.json();
        const newData: AppointmentWebhook = body.record;
        const oldData: AppointmentWebhook = body.old_record;

        // Only proceed if date or time changed
        if (body.type === "UPDATE" && (newData.appointment_date !== oldData.appointment_date || newData.appointment_time !== oldData.appointment_time)) {

            // 1. Send Patient Reschedule Success
            const patientHtml = `
        <h2>Appointment Rescheduled</h2>
        <p>Dear ${newData.patient_name},</p>
        <p>Your appointment has been successfully rescheduled.</p>
        <p><strong>Old Time:</strong> ${oldData.appointment_date} at ${oldData.appointment_time}</p>
        <p><strong>New Time:</strong> ${newData.appointment_date} at ${newData.appointment_time}</p>
        <p>See you then!</p>
      `;
            await sendEmail(newData.patient_email, "Reschedule Success - Makhanda Smiles", patientHtml);

            // 2. Send Dentist Notification
            const dentistHtml = `
        <h2>⚠️ Appointment Rescheduled</h2>
        <p>A patient has rescheduled their appointment.</p>
        <ul>
            <li><strong>Patient:</strong> ${newData.patient_name}</li>
            <li><strong>Was:</strong> ${oldData.appointment_date} @ ${oldData.appointment_time}</li>
            <li><strong>Now:</strong> ${newData.appointment_date} @ ${newData.appointment_time}</li>
        </ul>
      `;
            await sendEmail(DENTIST_EMAIL, "Appointment Rescheduled Alert", dentistHtml);

            return new Response(JSON.stringify({ success: true, action: "Reschedule emails sent" }), { headers: { "Content-Type": "application/json" } });
        }

        return new Response(JSON.stringify({ success: true, message: "No relevant change" }), { headers: { "Content-Type": "application/json" } });

    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: String(error) }), { status: 500 });
    }
});
