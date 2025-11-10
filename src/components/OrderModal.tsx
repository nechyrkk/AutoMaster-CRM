import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAppDispatch } from '@/store/hooks';
import { addOrder, updateOrder } from '@/store/ordersSlice';
import { Order, OrderStatus, Service } from '@/types';
import { mockClients, mockServices } from '@/data/mockData';
import { XIcon } from '@/components/Icons';
import { formatCurrency } from '@/utils/formatters';
import { format } from 'date-fns';

interface OrderModalProps {
  order: Order | null;
  onClose: () => void;
}

interface OrderFormData {
  clientId: string;
  services: string[];
  scheduledDate: string;
  status: OrderStatus;
  notes: string;
}

const schema = yup.object().shape({
  clientId: yup.string().required('Выберите клиента'),
  services: yup.array().of(yup.string()).min(1, 'Выберите хотя бы одну услугу').required(),
  scheduledDate: yup.string().required('Укажите дату записи'),
  status: yup.string().oneOf(Object.values(OrderStatus)).required(),
  notes: yup.string(),
});

const OrderModal = ({ order, onClose }: OrderModalProps) => {
  const dispatch = useAppDispatch();
  const isEdit = !!order;

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<OrderFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      clientId: order?.clientId || '',
      services: order?.services.map(s => s.id) || [],
      scheduledDate: order ? format(new Date(order.scheduledDate), "yyyy-MM-dd'T'HH:mm") : '',
      status: order?.status || OrderStatus.PENDING,
      notes: order?.notes || '',
    },
  });

  const selectedServices = watch('services');
  const selectedClientId = watch('clientId');

  const selectedClient = mockClients.find(c => c.id === selectedClientId);
  const calculatedServices = mockServices.filter(s => selectedServices.includes(s.id));
  const totalPrice = calculatedServices.reduce((sum, s) => sum + s.price, 0);

  const onSubmit = async (data: OrderFormData) => {
    const client = mockClients.find(c => c.id === data.clientId);
    if (!client) return;

    const services = mockServices.filter(s => data.services.includes(s.id));

    const orderData: Order = {
      id: order?.id || `ORD-${String(Date.now()).slice(-6)}`,
      clientId: client.id,
      clientName: client.name,
      clientPhone: client.phone,
      carModel: client.carModel,
      carNumber: client.carNumber,
      services,
      totalPrice,
      status: data.status,
      scheduledDate: new Date(data.scheduledDate).toISOString(),
      createdAt: order?.createdAt || new Date().toISOString(),
      notes: data.notes || undefined,
    };

    if (isEdit) {
      dispatch(updateOrder(orderData));
    } else {
      dispatch(addOrder(orderData));
    }

    onClose();
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Backdrop */}
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          {/* Header */}
          <div className="bg-white px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">
                {isEdit ? 'Редактировать заказ' : 'Новый заказ'}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XIcon />
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="bg-white">
            <div className="px-6 py-6 space-y-6 max-h-[70vh] overflow-y-auto scrollbar-thin">
              {/* Client Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Клиент *
                </label>
                <select
                  {...register('clientId')}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.clientId ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Выберите клиента</option>
                  {mockClients.map(client => (
                    <option key={client.id} value={client.id}>
                      {client.name} - {client.carModel} ({client.carNumber})
                    </option>
                  ))}
                </select>
                {errors.clientId && (
                  <p className="mt-1 text-sm text-red-600">{errors.clientId.message}</p>
                )}
                {selectedClient && (
                  <div className="mt-2 p-3 bg-gray-50 rounded-lg text-sm">
                    <p className="text-gray-700">
                      <span className="font-medium">Телефон:</span> {selectedClient.phone}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">Email:</span> {selectedClient.email}
                    </p>
                  </div>
                )}
              </div>

              {/* Services Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Услуги *
                </label>
                <Controller
                  name="services"
                  control={control}
                  render={({ field }) => (
                    <div className="space-y-2 max-h-60 overflow-y-auto border border-gray-300 rounded-lg p-4">
                      {mockServices.map(service => (
                        <label
                          key={service.id}
                          className="flex items-start space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                        >
                          <input
                            type="checkbox"
                            value={service.id}
                            checked={field.value.includes(service.id)}
                            onChange={(e) => {
                              const newValue = e.target.checked
                                ? [...field.value, service.id]
                                : field.value.filter(id => id !== service.id);
                              field.onChange(newValue);
                            }}
                            className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-gray-900">
                                {service.name}
                              </span>
                              <span className="text-sm font-semibold text-gray-900">
                                {formatCurrency(service.price)}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500">
                              Длительность: {service.duration} мин
                            </p>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                />
                {errors.services && (
                  <p className="mt-1 text-sm text-red-600">{errors.services.message}</p>
                )}
              </div>

              {/* Total Price */}
              {selectedServices.length > 0 && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Итого:</span>
                    <span className="text-xl font-bold text-gray-900">
                      {formatCurrency(totalPrice)}
                    </span>
                  </div>
                </div>
              )}

              {/* Scheduled Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Дата и время записи *
                </label>
                <input
                  type="datetime-local"
                  {...register('scheduledDate')}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.scheduledDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.scheduledDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.scheduledDate.message}</p>
                )}
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Статус *
                </label>
                <select
                  {...register('status')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={OrderStatus.PENDING}>Ожидает</option>
                  <option value={OrderStatus.IN_PROGRESS}>В работе</option>
                  <option value={OrderStatus.COMPLETED}>Завершён</option>
                  <option value={OrderStatus.CANCELLED}>Отменён</option>
                </select>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Примечания
                </label>
                <textarea
                  {...register('notes')}
                  rows={3}
                  placeholder="Дополнительная информация о заказе..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Отмена
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Сохранение...' : isEdit ? 'Сохранить' : 'Создать'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OrderModal;
