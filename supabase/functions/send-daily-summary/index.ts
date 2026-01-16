
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const GMAIL_USER = Deno.env.get("GMAIL_USER")!;
const GMAIL_PASSWORD = Deno.env.get("GMAIL_APP_PASSWORD")!;
const RECIPIENT_EMAIL = "mudimbujustin2@gmail.com";

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
            from: `Thandi AI <${GMAIL_USER}>`,
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
        // 1. Fetch conversations from the last 24 hours
        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

        const { data: messages, error } = await supabase
            .from('chat_messages')
            .select('*')
            .gte('created_at', yesterday)
            .order('created_at', { ascending: true });

        if (error) throw error;

        if (!messages || messages.length === 0) {
            await sendEmail(RECIPIENT_EMAIL, "Daily Chat Summary: No Activity", "<p>No conversations recorded in the last 24 hours.</p>");
            return new Response(JSON.stringify({ message: "No messages to summarize" }), { headers: { "Content-Type": "application/json" } });
        }

        // 2. Format the messages
        // Group by User Email
        const groupedChats: Record<string, any[]> = {};
        messages.forEach((msg) => {
            if (!groupedChats[msg.user_email]) groupedChats[msg.user_email] = [];
            groupedChats[msg.user_email].push(msg);
        });

        let htmlBody = `<h1>Daily Conversation Summary</h1><p>Here is the activity for the last 24 hours:</p>`;

        for (const [email, chatLogs] of Object.entries(groupedChats)) {
            htmlBody += `<div style="margin-bottom: 20px; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">`;
            htmlBody += `<h3>User: ${email}</h3>`;
            htmlBody += `<ul>`;
            chatLogs.forEach(msg => {
                const roleColor = msg.role === 'user' ? 'blue' : 'green';
                const time = new Date(msg.created_at).toLocaleTimeString();
                htmlBody += `<li style="margin-bottom: 5px;">
                <span style="color: gray; font-size: 0.8em;">[${time}]</span> 
                <strong style="color: ${roleColor};">${msg.role.toUpperCase()}:</strong> 
                ${msg.content}
            </li>`;
            });
            htmlBody += `</ul></div>`;
        }

        // 3. Send Email
        const success = await sendEmail(RECIPIENT_EMAIL, `Daily Chat Summary (${Object.keys(groupedChats).length} Users)`, htmlBody);

        return new Response(JSON.stringify({ success, summary_count: messages.length }), { headers: { "Content-Type": "application/json" } });

    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: String(error) }), { status: 500 });
    }
});
