import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sendEmail, EMAIL_TEMPLATES } from '../src/lib/email';

export default async function handler(
    req: VercelRequest,
    res: VercelResponse
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { type, to, details, notificationType } = req.body;

    if (!type) {
        return res.status(400).json({ error: 'Missing email type' });
    }

    try {
        let emailContent;
        let targetTo = to;

        switch (type) {
            case 'patient_confirmation':
                emailContent = EMAIL_TEMPLATES.patientConfirmation(details);
                break;
            case 'patient_reschedule':
                emailContent = EMAIL_TEMPLATES.patientReschedule(details);
                break;
            case 'patient_reminder':
                emailContent = EMAIL_TEMPLATES.patientReminder(details);
                break;
            case 'doctor_notification':
                emailContent = EMAIL_TEMPLATES.doctorNotification(details, notificationType);
                targetTo = process.env.DOCTOR_EMAIL;
                break;
            default:
                return res.status(400).json({ error: 'Invalid email type' });
        }

        const result = await sendEmail(targetTo || details.email, emailContent.subject, emailContent.html);

        if (result.success) {
            return res.status(200).json({ success: true });
        } else {
            return res.status(500).json({ error: 'Failed to send email' });
        }
    } catch (error) {
        console.error('Email API error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
