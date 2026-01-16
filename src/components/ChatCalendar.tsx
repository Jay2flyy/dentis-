
import React, { useState, useEffect } from 'react';
import { getAvailableSlots } from '../lib/availability';

interface ChatCalendarProps {
    onSlotSelected: (date: string, time: string) => void;
    onCancel: () => void;
}

const ChatCalendar: React.FC<ChatCalendarProps> = ({ onSlotSelected, onCancel }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [availableSlots, setAvailableSlots] = useState<{ time: string; available: boolean }[]>([]);
    const [loadingSlots, setLoadingSlots] = useState(false);

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const days = new Date(year, month + 1, 0).getDate();
        return Array.from({ length: days }, (_, i) => new Date(year, month, i + 1));
    };

    const days = getDaysInMonth(currentMonth);
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const handleDateClick = async (date: Date) => {
        setSelectedDate(date);
        setLoadingSlots(true);
        setAvailableSlots([]);

        // Format date as YYYY-MM-DD for the API
        const dateStr = date.toISOString().split('T')[0];
        try {
            const slots = await getAvailableSlots(dateStr);
            setAvailableSlots(slots);
        } catch (error) {
            console.error("Error fetching slots:", error);
        } finally {
            setLoadingSlots(false);
        }
    };

    const handleSlotClick = (time: string, available: boolean) => {
        if (!available || !selectedDate) return;
        const dateStr = selectedDate.toISOString().split('T')[0];
        onSlotSelected(dateStr, time);
    };

    const changeMonth = (offset: number) => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + offset, 1));
        setSelectedDate(null);
        setAvailableSlots([]);
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-4 max-w-sm mx-auto mt-2 mb-4 border border-blue-100 font-sans">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <button onClick={() => changeMonth(-1)} className="p-1 hover:bg-gray-100 rounded text-blue-600 font-bold">&lt;</button>
                <h3 className="font-bold text-gray-800">{monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}</h3>
                <button onClick={() => changeMonth(1)} className="p-1 hover:bg-gray-100 rounded text-blue-600 font-bold">&gt;</button>
            </div>

            {/* Calendar Grid */}
            {!selectedDate ? (
                <div className="grid grid-cols-7 gap-1 text-center text-sm">
                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                        <div key={day} className="text-gray-400 font-medium py-1">{day}</div>
                    ))}
                    {/* Calendar Day Offset Filler (simplified, assumes starting on correct day) */}
                    {/* Note: Ideally we'd calculate exact start day offset. implementing properly below */}
                    {Array.from({ length: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay() }).map((_, i) => (
                        <div key={`empty-${i}`} className="p-2"></div>
                    ))}
                    {days.map(date => {
                        const isToday = new Date().toDateString() === date.toDateString();
                        const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));
                        return (
                            <button
                                key={date.toISOString()}
                                onClick={() => !isPast && handleDateClick(date)}
                                disabled={isPast}
                                className={`p-2 rounded-full hover:bg-blue-50 transition-colors
                  ${isToday ? 'bg-blue-100 text-blue-700 font-bold' : ''}
                  ${isPast ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700'}
                `}
                            >
                                {date.getDate()}
                            </button>
                        );
                    })}
                </div>
            ) : (
                /* Slot Selection View */
                <div className="animate-fade-in-up">
                    <div className="flex justify-between items-center mb-3">
                        <button onClick={() => setSelectedDate(null)} className="text-sm text-blue-500 hover:underline">← Back to Month</button>
                        <span className="font-medium text-gray-700">{selectedDate.toLocaleDateString()}</span>
                    </div>

                    {loadingSlots ? (
                        <div className="text-center py-4 text-gray-500">Checking availability...</div>
                    ) : availableSlots.length > 0 ? (
                        <div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto">
                            {availableSlots.map((slot) => (
                                <button
                                    key={slot.time}
                                    onClick={() => handleSlotClick(slot.time, slot.available)}
                                    disabled={!slot.available}
                                    className={`py-2 px-1 text-xs rounded border transition-all
                    ${slot.available
                                            ? 'border-green-200 bg-green-50 text-green-700 hover:bg-green-100 cursor-pointer'
                                            : 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed'}
                  `}
                                >
                                    {slot.time}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-4 text-gray-500">No slots available.</div>
                    )}
                </div>
            )}

            {/* Footer */}
            <div className="mt-4 pt-2 border-t text-center">
                <button onClick={onCancel} className="text-xs text-gray-400 hover:text-gray-600">Cancel Booking</button>
            </div>
        </div>
    );
};

export default ChatCalendar;
