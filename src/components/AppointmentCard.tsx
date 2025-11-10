import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { CalendarAppointment } from '@/types';
import { formatTime, getStatusColor } from '@/utils/formatters';
import { CarIcon, ClockIcon } from '@/components/Icons';

interface AppointmentCardProps {
  appointment: CalendarAppointment;
  style?: React.CSSProperties;
}

const AppointmentCard = ({ appointment, style }: AppointmentCardProps) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: appointment.id,
  });

  const dragStyle = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };

  const getStatusBgColor = (status: string): string => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 border-yellow-300',
      in_progress: 'bg-blue-100 border-blue-300',
      completed: 'bg-green-100 border-green-300',
      cancelled: 'bg-red-100 border-red-300',
    };
    return colors[status] || 'bg-gray-100 border-gray-300';
  };

  return (
    <div
      ref={setNodeRef}
      style={{ ...style, ...dragStyle }}
      {...listeners}
      {...attributes}
      className={`absolute left-1 right-1 rounded-lg border-l-4 p-2 cursor-move hover:shadow-md transition-shadow overflow-hidden ${getStatusBgColor(appointment.status)}`}
    >
      <div className="flex items-start justify-between mb-1">
        <p className="text-xs font-semibold text-gray-900 truncate pr-1">
          {appointment.clientName}
        </p>
        <div className="flex items-center text-xs text-gray-600 flex-shrink-0">
          <ClockIcon className="w-3 h-3 mr-1" />
          {formatTime(appointment.startTime)}
        </div>
      </div>
      
      <div className="flex items-center text-xs text-gray-700 mb-1">
        <CarIcon className="w-3 h-3 mr-1 flex-shrink-0" />
        <span className="truncate">{appointment.carModel}</span>
      </div>
      
      <div className="text-xs text-gray-600">
        <p className="truncate">{appointment.services[0]}</p>
        {appointment.services.length > 1 && (
          <p className="text-xs text-gray-500 mt-0.5">
            +{appointment.services.length - 1} услуг
          </p>
        )}
      </div>
    </div>
  );
};

export default AppointmentCard;
