# Critical: Enable Database Access for Assistant

The chatbot is currently blocked from reading or updating appointments because of **Row Level Security (RLS)** policies in your database. 

Since your local Docker/CLI setup is having connection issues, you **MUST** run the following SQL command manually in your **Supabase Dashboard**.

## Instructions
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard).
2. Open your project.
3. Click on **SQL Editor** in the left sidebar.
4. Paste the code below and click **Run**.

```sql
-- 1. UNBLOCK READ ACCESS (Allows bot to see appointments)
DROP POLICY IF EXISTS "Anyone can see appointments" ON appointments;
CREATE POLICY "Anyone can see appointments" 
    ON appointments FOR SELECT 
    USING (true);

-- 2. UNBLOCK UPDATE ACCESS (Allows bot to reschedule)
DROP POLICY IF EXISTS "Anyone can update appointments" ON appointments;
CREATE POLICY "Anyone can update appointments" 
    ON appointments FOR UPDATE 
    USING (true) 
    WITH CHECK (true);
```

Once this is run, the chatbot will immediately be able to find rescheduling options.
