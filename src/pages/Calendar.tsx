import { useState, useMemo } from 'react';
import { format, addDays, startOfWeek, isSameDay } from 'date-fns';
import { ru } from 'date-fns/locale';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
  closestCenter,
} from '@dnd-kit/core';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { moveAppointment } from '@/store/calendarSlice';
import { CalendarAppointment } from '@/types';
import { formatTime, getStatusColor, getStatusLabel } from '@/utils/formatters';
import { ChevronLeftIcon, ChevronRightIcon, CarIcon } from '@/components/Icons';
import AppointmentCard from '@/components/AppointmentCard';

const Calendar = () => {
  const dispatch = useAppDispatch();
  const { appointments } = useAppSelector((state) => state.calendar);
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { locale: ru }));
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i));
  }, [currentWeekStart]);

  const timeSlots = useMemo(() => {
    return Array.from({ length: 10 }, (_, i) => i + 9); // 9:00 - 18:00
  }, []);

  const getAppointmentsForDay = (date: Date) => {
    return appointments.filter(apt => 
      isSameDay(new Date(apt.startTime), date)
    );
  };

  const getAppointmentPosition = (apt: CalendarAppointment) => {
    const startTime = new Date(apt.startTime);
    const hour = startTime.getHours();
    const minutes = startTime.getMinutes();
    
    if (hour < 9 || hour >= 19) return null;
    
    const top = ((hour - 9) * 60 + minutes) / 60 * 80; // 80px per hour
    
    const endTime = new Date(apt.endTime);
    const duration = (endTime.getTime() - startTime.getTime()) / (1000 * 60); // in minutes
    const height = (duration / 60) * 80;
    
    return { top, height };
  };

  const handlePrevWeek = () => {
    setCurrentWeekStart(prev => addDays(prev, -7));
  };

  const handleNextWeek = () => {
    setCurrentWeekStart(prev => addDays(prev, 7));
  };

  const handleToday = () => {
    setCurrentWeekStart(startOfWeek(new Date(), { locale: ru }));
  };

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const appointmentId = active.id as string;
      const [dayIndex, hour] = (over.id as string).split('-').map(Number);
      
      if (dayIndex !== undefined && hour !== undefined) {
        const newDate = addDays(currentWeekStart, dayIndex);
        newDate.setHours(hour, 0, 0, 0);
        
        dispatch(moveAppointment({
          id: appointmentId,
          newStartTime: newDate.toISOString(),
        }));
      }
    }
    
    setActiveId(null);
  };

  const activeAppointment = activeId 
    ? appointments.find(apt => apt.id === activeId)
    : null;

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 px-8 py-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Календарь записей</h1>
            <p className="text-gray-600">
              {format(currentWeekStart, 'd MMMM', { locale: ru })} -{' '}
              {format(addDays(currentWeekStart, 6), 'd MMMM yyyy', { locale: ru })}
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={handleToday}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Сегодня
            </button>
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrevWeek}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeftIcon />
              </button>
              <button
                onClick={handleNextWeek}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRightIcon />
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-400 rounded"></div>
            <span className="text-sm text-gray-600">Ожидает</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-400 rounded"></div>
            <span className="text-sm text-gray-600">В работе</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded"></div>
            <span className="text-sm text-gray-600">Завершён</span>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex-1 overflow-auto scrollbar-thin">
          <div className="min-w-[1000px]">
            {/* Day Headers */}
            <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
              <div className="flex">
                <div className="w-20 flex-shrink-0 border-r border-gray-200"></div>
                {weekDays.map((day, index) => (
                  <div
                    key={index}
                    className="flex-1 px-4 py-3 text-center border-r border-gray-200 last:border-r-0"
                  >
                    <div className={`${
                      isSameDay(day, new Date()) ? 'text-blue-600 font-bold' : 'text-gray-900'
                    }`}>
                      <div className="text-sm font-medium">
                        {format(day, 'EEE', { locale: ru })}
                      </div>
                      <div className={`text-2xl ${
                        isSameDay(day, new Date()) ? 'bg-blue-600 text-white w-10 h-10 rounded-full mx-auto flex items-center justify-center mt-1' : ''
                      }`}>
                        {format(day, 'd')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Time Grid */}
            <div className="flex">
              {/* Time labels */}
              <div className="w-20 flex-shrink-0">
                {timeSlots.map(hour => (
                  <div
                    key={hour}
                    className="h-20 border-b border-gray-200 px-2 py-1 text-xs text-gray-500 text-right"
                  >
                    {String(hour).padStart(2, '0')}:00
                  </div>
                ))}
              </div>

              {/* Day columns */}
              {weekDays.map((day, dayIndex) => (
                <div key={dayIndex} className="flex-1 border-r border-gray-200 last:border-r-0 relative">
                  {/* Time slots */}
                  {timeSlots.map(hour => (
                    <div
                      key={`${dayIndex}-${hour}`}
                      id={`${dayIndex}-${hour}`}
                      className="h-20 border-b border-gray-200 hover:bg-blue-50 transition-colors"
                    />
                  ))}

                  {/* Appointments */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="relative h-full pointer-events-auto">
                      {getAppointmentsForDay(day).map(apt => {
                        const position = getAppointmentPosition(apt);
                        if (!position) return null;
                        
                        return (
                          <AppointmentCard
                            key={apt.id}
                            appointment={apt}
                            style={{
                              top: `${position.top}px`,
                              height: `${Math.max(position.height, 40)}px`,
                            }}
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DragOverlay>
          {activeAppointment && (
            <div className="bg-white shadow-2xl rounded-lg p-3 border-2 border-blue-500 opacity-90 w-48">
              <p className="text-xs font-semibold text-gray-900 mb-1 truncate">
                {activeAppointment.clientName}
              </p>
              <p className="text-xs text-gray-600 truncate">
                {activeAppointment.carModel}
              </p>
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default Calendar;
