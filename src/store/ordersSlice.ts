import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Order, OrderStatus } from '@/types';
import { mockOrders } from '@/data/mockData';

interface OrdersState {
  orders: Order[];
  filteredOrders: Order[];
  searchQuery: string;
  statusFilter: OrderStatus | 'all';
  sortBy: 'date' | 'price' | 'status';
  sortOrder: 'asc' | 'desc';
  isLoading: boolean;
}

const initialState: OrdersState = {
  orders: mockOrders,
  filteredOrders: mockOrders,
  searchQuery: '',
  statusFilter: 'all',
  sortBy: 'date',
  sortOrder: 'desc',
  isLoading: false,
};

const applyFiltersAndSort = (state: OrdersState) => {
  let filtered = [...state.orders];

  // Применяем поиск
  if (state.searchQuery) {
    const query = state.searchQuery.toLowerCase();
    filtered = filtered.filter(
      order =>
        order.id.toLowerCase().includes(query) ||
        order.clientName.toLowerCase().includes(query) ||
        order.carModel.toLowerCase().includes(query) ||
        order.carNumber.toLowerCase().includes(query)
    );
  }

  // Применяем фильтр по статусу
  if (state.statusFilter !== 'all') {
    filtered = filtered.filter(order => order.status === state.statusFilter);
  }

  // Применяем сортировку
  filtered.sort((a, b) => {
    let comparison = 0;

    switch (state.sortBy) {
      case 'date':
        comparison = new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime();
        break;
      case 'price':
        comparison = a.totalPrice - b.totalPrice;
        break;
      case 'status':
        comparison = a.status.localeCompare(b.status);
        break;
    }

    return state.sortOrder === 'asc' ? comparison : -comparison;
  });

  state.filteredOrders = filtered;
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      applyFiltersAndSort(state);
    },
    setStatusFilter: (state, action: PayloadAction<OrderStatus | 'all'>) => {
      state.statusFilter = action.payload;
      applyFiltersAndSort(state);
    },
    setSortBy: (state, action: PayloadAction<'date' | 'price' | 'status'>) => {
      state.sortBy = action.payload;
      applyFiltersAndSort(state);
    },
    toggleSortOrder: (state) => {
      state.sortOrder = state.sortOrder === 'asc' ? 'desc' : 'asc';
      applyFiltersAndSort(state);
    },
    addOrder: (state, action: PayloadAction<Order>) => {
      state.orders.unshift(action.payload);
      applyFiltersAndSort(state);
    },
    updateOrder: (state, action: PayloadAction<Order>) => {
      const index = state.orders.findIndex(o => o.id === action.payload.id);
      if (index !== -1) {
        state.orders[index] = action.payload;
        applyFiltersAndSort(state);
      }
    },
    deleteOrder: (state, action: PayloadAction<string>) => {
      state.orders = state.orders.filter(o => o.id !== action.payload);
      applyFiltersAndSort(state);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const {
  setSearchQuery,
  setStatusFilter,
  setSortBy,
  toggleSortOrder,
  addOrder,
  updateOrder,
  deleteOrder,
  setLoading,
} = ordersSlice.actions;

export default ordersSlice.reducer;
