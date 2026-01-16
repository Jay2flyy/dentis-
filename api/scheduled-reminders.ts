import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabaseAdmin } from '../src/lib/supabase';
import { sendEmail, EMAIL_TEMPLATES } from '../src/lib/email';

export default async function handler(
    req: VercelRequest,
    res: VercelResponse
) {
    // Security check - verify this is a cron job
    const authHeader = req.headers.authorization;
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        // Get current date in SAST (UTC+2)
        const now = new Date();
        const sastDate = new Date(now.getTime() + (2 * 60 * 60 * 1000)); // Add 2 hours for UTC+2
        const todayStr = sastDate.toISOString().split('T')[0];

        console.log(`📅 Running daily reminders for ${todayStr}`);

        // Get all confirmed appointments for today that haven't been reminded
        const { data: appointments, error } = await supabaseAdmin
            .from('appointments')
            .select('*')
            .eq('appointment_date', todayStr)
            .eq('status', 'confirmed')
            .or('reminder_sent.is.null,reminder_sent.eq.false');

        if (error) {
            console.error('Database error:', error);
            throw error;
        }

        if (!appointments || appointments.length === 0) {
            console.log('No appointments to remind today');
            return res.status(200).json({
                success: true,
                message: 'No reminders to send',
                date: todayStr
            });
        }

        console.log(`Found ${appointments.length} appointments to remind`);

        // Send reminder emails
        const results = await Promise.allSettled(
            appointments.map(async (appt) => {
                // Generate email template
                const template = EMAIL_TEMPLATES.patientReminder({
                    name: appt.patient_name,
                    time: appt.appointment_time,
                    service: appt.service_type || 'General Checkup',
                });

                // Send email
                const emailResult = await sendEmail(
                    appt.patient_email,
                    template.subject,
                    template.html
                );

                if (emailResult.success) {
                    // Mark reminder as sent
                    await supabaseAdmin
                        .from('appointments')
                        .update({ reminder_sent: true })
                        .eq('id', appt.id);
                }

                return {
                    id: appt.id,
                    email: appt.patient_email,
                    success: emailResult.success
                };
            })
        );

        const successful = results.filter((r) => r.status === 'fulfilled').length;
        const failed = results.filter((r) => r.status === 'rejected');

        console.log(`✅ Sent ${successful}/${appointments.length} reminders`);

        if (failed.length > 0) {
            console.error('Failed reminders:', failed);
        }

        return res.status(200).json({
            success: true,
            date: todayStr,
            sent: successful,
            total: appointments.length,
            failed: failed.length
        });

    } catch (error) {
        console.error('Reminder job error:', error);
        return res.status(500).json({
            error: 'Failed to send reminders',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}
