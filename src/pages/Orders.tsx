import { useState, useMemo, useCallback } from 'react';
import { FixedSizeList as List } from 'react-window';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setSearchQuery, setStatusFilter, setSortBy, toggleSortOrder } from '@/store/ordersSlice';
import { Order, OrderStatus } from '@/types';
import OrderRow from '@/components/OrderRow';
import OrderModal from '@/components/OrderModal';
import { SearchIcon, FilterIcon, PlusIcon, ChevronDownIcon, ChevronUpIcon } from '@/components/Icons';

const Orders = () => {
  const dispatch = useAppDispatch();
  const { filteredOrders, searchQuery, statusFilter, sortBy, sortOrder } = useAppSelector(
    (state) => state.orders
  );
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchQuery(e.target.value));
  };

  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setStatusFilter(e.target.value as OrderStatus | 'all'));
  };

  const handleSortChange = (field: 'date' | 'price' | 'status') => {
    if (sortBy === field) {
      dispatch(toggleSortOrder());
    } else {
      dispatch(setSortBy(field));
    }
  };

  const handleEditOrder = useCallback((order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  }, []);

  const handleNewOrder = () => {
    setSelectedOrder(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const Row = useCallback(
    ({ index, style }: { index: number; style: React.CSSProperties }) => {
      const order = filteredOrders[index];
      return <OrderRow order={order} style={style} onEdit={handleEditOrder} />;
    },
    [filteredOrders, handleEditOrder]
  );

  const SortButton = ({ field, label }: { field: 'date' | 'price' | 'status'; label: string }) => (
    <button
      onClick={() => handleSortChange(field)}
      className="flex items-center space-x-1 text-xs font-medium text-gray-700 hover:text-gray-900 transition-colors"
    >
      <span>{label}</span>
      {sortBy === field && (
        sortOrder === 'asc' ? <ChevronUpIcon className="w-3 h-3" /> : <ChevronDownIcon className="w-3 h-3" />
      )}
    </button>
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Заказы</h1>
            <p className="text-gray-600">
              Найдено: <span className="font-semibold">{filteredOrders.length}</span> из{' '}
              {useAppSelector((state) => state.orders.orders.length)}
            </p>
          </div>
          <button
            onClick={handleNewOrder}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PlusIcon className="w-5 h-5" />
            <span className="font-medium">Новый заказ</span>
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="flex-1 relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Поиск по ID, клиенту, авто или номеру..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <FilterIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <select
              value={statusFilter}
              onChange={handleStatusFilterChange}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white cursor-pointer"
            >
              <option value="all">Все статусы</option>
              <option value="pending">Ожидает</option>
              <option value="in_progress">В работе</option>
              <option value="completed">Завершён</option>
              <option value="cancelled">Отменён</option>
            </select>
            <ChevronDownIcon className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Table Header */}
      <div className="bg-gray-50 border-b border-gray-200 px-6 py-3">
        <div className="flex items-center space-x-4">
          <div className="w-32">
            <SortButton field="status" label="ID / Статус" />
          </div>
          <div className="flex-1">
            <span className="text-xs font-medium text-gray-700">Клиент / Авто</span>
          </div>
          <div className="w-64">
            <span className="text-xs font-medium text-gray-700">Услуги</span>
          </div>
          <div className="w-40">
            <SortButton field="date" label="Дата записи" />
          </div>
          <div className="w-32 text-right">
            <SortButton field="price" label="Сумма" />
          </div>
          <div className="w-20"></div>
        </div>
      </div>

      {/* Virtualized List */}
      <div className="flex-1 bg-white">
        {filteredOrders.length > 0 ? (
          <List
            height={window.innerHeight - 280}
            itemCount={filteredOrders.length}
            itemSize={88}
            width="100%"
            className="scrollbar-thin"
          >
            {Row}
          </List>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-lg font-medium mb-1">Заказы не найдены</p>
            <p className="text-sm">Попробуйте изменить параметры поиска</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <OrderModal order={selectedOrder} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default Orders;
