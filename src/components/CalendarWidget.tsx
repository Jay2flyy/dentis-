import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { getAvailableSlots, fetchMonthAvailability, TimeSlot } from '../lib/availability';

interface CalendarWidgetProps {
    onSelectSlot: (date: string, time: string) => void;
}

export const CalendarWidget = ({ onSelectSlot }: CalendarWidgetProps) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [slots, setSlots] = useState<TimeSlot[]>([]);
    const [monthAvailability, setMonthAvailability] = useState<Record<string, number>>({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchAvailability = async () => {
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth();
            const availability = await fetchMonthAvailability(year, month);
            setMonthAvailability(availability);
        };
        fetchAvailability();
    }, [currentDate]);

    useEffect(() => {
        if (selectedDate) {
            const fetchSlots = async () => {
                setLoading(true);
                const availableSlots = await getAvailableSlots(selectedDate);
                setSlots(availableSlots);
                setLoading(false);
            };
            fetchSlots();
        }
    }, [selectedDate]);

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
        setSelectedDate(null);
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
        setSelectedDate(null);
    };

    return (
        <div className="mt-2 bg-white rounded-xl border border-gray-200 p-3 shadow-sm w-full overflow-hidden animate-in fade-in zoom-in-95 duration-500">
            <div className="flex items-center justify-between mb-3 border-b pb-2">
                <div className="flex items-center space-x-2 text-blue-600 font-semibold text-xs">
                    <CalendarIcon size={14} />
                    <span>Book Appointment</span>
                </div>
                <div className="flex items-center space-x-2">
                    <button onClick={handlePrevMonth} className="p-1 hover:bg-gray-100 rounded text-gray-400">
                        <ChevronLeft size={14} />
                    </button>
                    <span className="text-[10px] font-medium text-gray-600">
                        {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </span>
                    <button onClick={handleNextMonth} className="p-1 hover:bg-gray-100 rounded text-gray-400">
                        <ChevronRight size={14} />
                    </button>
                </div>
            </div>

            {!selectedDate ? (
                <div className="grid grid-cols-7 gap-1">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                        <div key={d} className="text-[10px] text-center text-gray-400 font-medium h-6 flex items-center justify-center">
                            {d}
                        </div>
                    ))}
                    {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                        <div key={`empty-${i}`} className="h-8" />
                    ))}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                        const day = i + 1;
                        const dateStr = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                        const isToday = new Date().toISOString().split('T')[0] === dateStr;
                        const hasAppointments = monthAvailability[dateStr] > 0;

                        return (
                            <button
                                key={day}
                                onClick={() => setSelectedDate(dateStr)}
                                className={`h-8 text-[11px] flex flex-col items-center justify-center rounded-lg transition-all relative ${isToday ? 'border border-blue-200' : ''
                                    } hover:bg-blue-50 text-gray-700`}
                            >
                                <span>{day}</span>
                                {hasAppointments && (
                                    <span className="absolute bottom-1 w-1 h-1 bg-blue-300 rounded-full"></span>
                                )}
                            </button>
                        );
                    })}
                </div>
            ) : (
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => setSelectedDate(null)}
                            className="text-[10px] text-blue-600 hover:underline flex items-center space-x-1"
                        >
                            <ChevronLeft size={10} />
                            <span>Back to calendar</span>
                        </button>
                        <span className="text-[10px] font-medium text-gray-500">{selectedDate}</span>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-4">
                            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-3 gap-2">
                            {slots.length > 0 ? slots.map(slot => (
                                <button
                                    key={slot.time}
                                    disabled={!slot.available}
                                    onClick={() => onSelectSlot(selectedDate, slot.time)}
                                    className={`py-2 text-[10px] rounded-lg border text-center transition-all ${slot.available
                                        ? 'border-blue-100 text-blue-700 hover:bg-blue-600 hover:text-white hover:border-blue-600'
                                        : 'border-gray-100 text-gray-300 cursor-not-allowed bg-gray-50'
                                        }`}
                                >
                                    {slot.time}
                                </button>
                            )) : (
                                <div className="col-span-3 text-center py-2 text-[10px] text-gray-400">
                                    No slots available for this date.
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            <div className="mt-3 flex items-center justify-between border-t pt-2">
                <div className="flex space-x-1 items-center">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                    <span className="text-[9px] text-gray-400">Available</span>
                </div>
                {selectedDate && <div className="text-[9px] text-gray-400 italic">Slots are 1-hour duration</div>}
            </div>
        </div>
    );
};
