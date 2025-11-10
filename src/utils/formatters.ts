import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (date: string | Date): string => {
  return format(new Date(date), 'dd.MM.yyyy', { locale: ru });
};

export const formatDateTime = (date: string | Date): string => {
  return format(new Date(date), 'dd.MM.yyyy HH:mm', { locale: ru });
};

export const formatTime = (date: string | Date): string => {
  return format(new Date(date), 'HH:mm', { locale: ru });
};

export const getStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    pending: 'Ожидает',
    in_progress: 'В работе',
    completed: 'Завершён',
    cancelled: 'Отменён',
  };
  return labels[status] || status;
};

export const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    in_progress: 'bg-blue-100 text-blue-800 border-blue-200',
    completed: 'bg-green-100 text-green-800 border-green-200',
    cancelled: 'bg-red-100 text-red-800 border-red-200',
  };
  return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
};
