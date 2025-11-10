export interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  carModel: string;
  carNumber: string;
  createdAt: string;
}

export interface Service {
  id: string;
  name: string;
  price: number;
  duration: number; // в минутах
}

export enum OrderStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export interface Order {
  id: string;
  clientId: string;
  clientName: string;
  clientPhone: string;
  carModel: string;
  carNumber: string;
  services: Service[];
  totalPrice: number;
  status: OrderStatus;
  scheduledDate: string;
  createdAt: string;
  notes?: string;
}

export interface CalendarAppointment {
  id: string;
  orderId: string;
  clientName: string;
  carModel: string;
  services: string[];
  startTime: string;
  endTime: string;
  status: OrderStatus;
}

export interface DashboardStats {
  totalOrders: number;
  completedOrders: number;
  revenue: number;
  avgOrderValue: number;
  todayAppointments: number;
}

export interface ChartData {
  name: string;
  orders: number;
  revenue: number;
}
