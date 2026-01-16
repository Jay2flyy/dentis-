import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabaseAdmin } from '../src/lib/supabase';
import { sendEmail } from '../src/lib/email';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Security check
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Get date range (last 7 days in SAST)
    const now = new Date();
    const sastNow = new Date(now.getTime() + (2 * 60 * 60 * 1000));
    const endDate = sastNow;
    const startDate = new Date(sastNow);
    startDate.setDate(startDate.getDate() - 7);

    const startStr = startDate.toISOString().split('T')[0];
    const endStr = endDate.toISOString().split('T')[0];

    console.log(`📊 Generating weekly report: ${startStr} to ${endStr}`);

    // Get appointments for the week
    const { data: appointments } = await supabaseAdmin
      .from('appointments')
      .select('*')
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString())
      .order('created_at', { ascending: false });

    // Get conversations for the week
    const { data: conversations } = await supabaseAdmin
      .from('conversations')
      .select('*')
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString());

    // Calculate statistics
    const stats = {
      totalAppointments: appointments?.length || 0,
      confirmed: appointments?.filter((a) => a.status === 'confirmed').length || 0,
      cancelled: appointments?.filter((a) => a.status === 'cancelled').length || 0,
      completed: appointments?.filter((a) => a.status === 'completed').length || 0,
      totalConversations: conversations?.length || 0,
      uniquePatients: new Set(appointments?.map((a) => a.patient_email)).size,
      serviceBreakdown: {} as Record<string, number>
    };

    // Calculate service breakdown
    appointments?.forEach(appt => {
      const service = appt.service_type || 'Not specified';
      stats.serviceBreakdown[service] = (stats.serviceBreakdown[service] || 0) + 1;
    });

    // Generate HTML report
    const reportHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; }
          .container { padding: 20px; }
          .header { background: linear-gradient(135deg, #1f2937 0%, #374151 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .stat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin: 20px 0; }
          .stat-card { background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
          .stat-number { font-size: 36px; font-weight: bold; color: #667eea; margin: 0; }
          .stat-label { color: #6b7280; margin: 5px 0 0 0; font-size: 14px; }
          table { width: 100%; background: white; border-radius: 8px; overflow: hidden; margin: 20px 0; border-collapse: collapse; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
          th { background: #f3f4f6; padding: 12px; text-align: left; font-weight: bold; color: #374151; }
          td { padding: 12px; border-bottom: 1px solid #e5e7eb; }
          .status-confirmed { color: #10b981; font-weight: 600; }
          .status-cancelled { color: #ef4444; font-weight: 600; }
          .status-completed { color: #3b82f6; font-weight: 600; }
          h2 { color: #1f2937; border-bottom: 2px solid #667eea; padding-bottom: 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📊 Weekly Performance Report</h1>
            <p style="margin:10px 0 0 0;font-size:16px;opacity:0.9">${process.env.PRACTICE_NAME || 'Makhanda Smiles'}</p>
            <p style="margin:5px 0 0 0;font-size:14px;opacity:0.8">Period: ${startDate.toLocaleDateString('en-ZA')} - ${endDate.toLocaleDateString('en-ZA')}</p>
          </div>
          <div class="content">
            <h2>📈 Summary Statistics</h2>
            
            <div class="stat-grid">
              <div class="stat-card">
                <p class="stat-number">${stats.totalAppointments}</p>
                <p class="stat-label">Total Appointments</p>
              </div>
              <div class="stat-card">
                <p class="stat-number">${stats.confirmed}</p>
                <p class="stat-label">Confirmed</p>
              </div>
              <div class="stat-card">
                <p class="stat-number">${stats.completed}</p>
                <p class="stat-label">Completed</p>
              </div>
              <div class="stat-card">
                <p class="stat-number">${stats.cancelled}</p>
                <p class="stat-label">Cancelled</p>
              </div>
              <div class="stat-card">
                <p class="stat-number">${stats.uniquePatients}</p>
                <p class="stat-label">Unique Patients</p>
              </div>
              <div class="stat-card">
                <p class="stat-number">${stats.totalConversations}</p>
                <p class="stat-label">AI Conversations</p>
              </div>
            </div>

            <h2>🦷 Service Breakdown</h2>
            <table>
              <thead>
                <tr>
                  <th>Service Type</th>
                  <th style="text-align:right">Count</th>
                  <th style="text-align:right">Percentage</th>
                </tr>
              </thead>
              <tbody>
                ${Object.entries(stats.serviceBreakdown)
        .sort(([, a], [, b]) => b - a)
        .map(([service, count]) => `
                    <tr>
                      <td>${service}</td>
                      <td style="text-align:right;font-weight:600">${count}</td>
                      <td style="text-align:right">${((count / stats.totalAppointments) * 100).toFixed(1)}%</td>
                    </tr>
                  `).join('')}
              </tbody>
            </table>

            <h2>📅 Recent Appointments</h2>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Patient</th>
                  <th>Service</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${appointments
        ?.slice(0, 20)
        .map(
          (a) => `
                  <tr>
                    <td>${new Date(a.appointment_date).toLocaleDateString('en-ZA', { month: 'short', day: 'numeric' })}</td>
                    <td>${a.appointment_time}</td>
                    <td>${a.patient_name}</td>
                    <td>${a.service_type || 'Not specified'}</td>
                    <td class="status-${a.status}">${a.status}</td>
                  </tr>
                `
        )
        .join('') || '<tr><td colspan="5" style="text-align:center;color:#6b7280">No appointments this week</td></tr>'}
              </tbody>
            </table>

            <p style="margin-top:40px;padding-top:20px;border-top:1px solid #e5e7eb;font-size:12px;color:#6b7280;text-align:center">
              This automated report was generated by Thandi AI Assistant<br>
              Generated on: ${new Date().toLocaleString('en-ZA')}
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send to doctor
    await sendEmail(
      process.env.DOCTOR_EMAIL!,
      `📊 Weekly Report: ${stats.totalAppointments} Appointments (${startDate.toLocaleDateString('en-ZA', { month: 'short', day: 'numeric' })} - ${endDate.toLocaleDateString('en-ZA', { month: 'short', day: 'numeric' })})`,
      reportHtml
    );

    console.log('✅ Weekly report sent to doctor');

    return res.status(200).json({
      success: true,
      stats,
      period: { start: startStr, end: endStr }
    });

  } catch (error) {
    console.error('Weekly report error:', error);
    return res.status(500).json({
      error: 'Failed to generate report',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
