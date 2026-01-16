import { supabase } from './supabase';

export interface TimeSlot {
    time: string;
    available: boolean;
}

const WORKING_HOURS = {
    start: 8, // 8 AM
    end: 17,  // 5 PM (Last slot starts at 4 PM)
};

export const getAvailableSlots = async (date: string): Promise<TimeSlot[]> => {
    try {
        // 1. Fetch confirmed/pending appointments for the given date
        const { data: appointments, error } = await supabase
            .from('appointments')
            .select('appointment_time')
            .eq('appointment_date', date)
            .in('status', ['confirmed', 'pending']);

        if (error) throw error;

        // 2. Generate all possible 1-hour slots
        const slots: TimeSlot[] = [];
        const takenTimes = appointments?.map(a => a.appointment_time) || [];

        for (let hour = WORKING_HOURS.start; hour < WORKING_HOURS.end; hour++) {
            const timeString = `${hour.toString().padStart(2, '0')}:00`;
            slots.push({
                time: timeString,
                available: !takenTimes.includes(timeString),
            });
        }

        return slots;
    } catch (err) {
        console.error('Error fetching available slots:', err);
        return [];
    }
};

export const fetchMonthAvailability = async (year: number, month: number) => {
    const startDate = new Date(year, month, 1).toISOString().split('T')[0];
    const endDate = new Date(year, month + 1, 0).toISOString().split('T')[0];

    const { data: appointments, error } = await supabase
        .from('appointments')
        .select('appointment_date, appointment_time')
        .gte('appointment_date', startDate)
        .lte('appointment_date', endDate)
        .in('status', ['confirmed', 'pending']);

    if (error) return {};

    // Group by date
    const counts: Record<string, number> = {};
    appointments?.forEach(a => {
        counts[a.appointment_date] = (counts[a.appointment_date] || 0) + 1;
    });

    return counts;
};
