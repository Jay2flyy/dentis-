-- Allow anyone to read appointments (temporary for development flow)
DROP POLICY IF EXISTS "Anyone can see appointments" ON appointments;
CREATE POLICY "Anyone can see appointments"
    ON appointments FOR SELECT
    USING (true);

-- Allow anyone to update appointments (for rescheduling by email)
DROP POLICY IF EXISTS "Anyone can update appointments" ON appointments;
CREATE POLICY "Anyone can update appointments"
    ON appointments FOR UPDATE
    USING (true)
    WITH CHECK (true);
