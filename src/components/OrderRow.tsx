import { memo } from 'react';
import { Order } from '@/types';
import { formatCurrency, formatDateTime, getStatusLabel, getStatusColor } from '@/utils/formatters';
import { EditIcon, CarIcon, UserIcon } from '@/components/Icons';

interface OrderRowProps {
  order: Order;
  style: React.CSSProperties;
  onEdit: (order: Order) => void;
}

const OrderRow = memo(({ order, style, onEdit }: OrderRowProps) => {
  return (
    <div
      style={style}
      className="flex items-center px-6 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-start space-x-4">
          {/* Order ID and Status */}
          <div className="w-32">
            <p className="text-sm font-semibold text-gray-900 mb-1">{order.id}</p>
            <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${getStatusColor(order.status)}`}>
              {getStatusLabel(order.status)}
            </span>
          </div>

          {/* Client Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <UserIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <p className="text-sm font-medium text-gray-900 truncate">{order.clientName}</p>
            </div>
            <div className="flex items-center space-x-2">
              <CarIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <p className="text-sm text-gray-600 truncate">
                {order.carModel} · {order.carNumber}
              </p>
            </div>
          </div>

          {/* Services */}
          <div className="w-64 min-w-0">
            <p className="text-sm text-gray-600 truncate">
              {order.services.map(s => s.name).join(', ')}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {order.services.length} {order.services.length === 1 ? 'услуга' : 'услуг'}
            </p>
          </div>

          {/* Date */}
          <div className="w-40">
            <p className="text-sm text-gray-900">{formatDateTime(order.scheduledDate)}</p>
          </div>

          {/* Price */}
          <div className="w-32 text-right">
            <p className="text-sm font-semibold text-gray-900">{formatCurrency(order.totalPrice)}</p>
          </div>

          {/* Actions */}
          <div className="w-20 flex justify-end">
            <button
              onClick={() => onEdit(order)}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Редактировать"
            >
              <EditIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

OrderRow.displayName = 'OrderRow';

export default OrderRow;
