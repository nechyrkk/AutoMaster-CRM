import { Client, Service, Order, OrderStatus, CalendarAppointment } from '@/types';
import { format, addDays, addHours, subDays } from 'date-fns';

export const mockServices: Service[] = [
  { id: '1', name: 'Замена масла', price: 2500, duration: 60 },
  { id: '2', name: 'Диагностика двигателя', price: 1500, duration: 90 },
  { id: '3', name: 'Замена тормозных колодок', price: 4500, duration: 120 },
  { id: '4', name: 'Развал-схождение', price: 2000, duration: 60 },
  { id: '5', name: 'Замена свечей зажигания', price: 1800, duration: 45 },
  { id: '6', name: 'Замена воздушного фильтра', price: 800, duration: 30 },
  { id: '7', name: 'Замена салонного фильтра', price: 700, duration: 30 },
  { id: '8', name: 'Регулировка клапанов', price: 3500, duration: 150 },
  { id: '9', name: 'Замена ремня ГРМ', price: 8500, duration: 180 },
  { id: '10', name: 'Компьютерная диагностика', price: 1000, duration: 45 },
];

export const mockClients: Client[] = [
  {
    id: '1',
    name: 'Иванов Иван Иванович',
    phone: '+7 (999) 123-45-67',
    email: 'ivanov@mail.ru',
    carModel: 'Toyota Camry',
    carNumber: 'А123БВ777',
    createdAt: subDays(new Date(), 30).toISOString(),
  },
  {
    id: '2',
    name: 'Петров Петр Петрович',
    phone: '+7 (999) 234-56-78',
    email: 'petrov@mail.ru',
    carModel: 'BMW X5',
    carNumber: 'В456ГД199',
    createdAt: subDays(new Date(), 25).toISOString(),
  },
  {
    id: '3',
    name: 'Сидоров Сидор Сидорович',
    phone: '+7 (999) 345-67-89',
    email: 'sidorov@mail.ru',
    carModel: 'Mercedes-Benz E-Class',
    carNumber: 'С789ЕЖ777',
    createdAt: subDays(new Date(), 20).toISOString(),
  },
  // Добавляем еще клиентов
  ...Array.from({ length: 20 }, (_, i) => ({
    id: `${i + 4}`,
    name: `Клиент ${i + 4}`,
    phone: `+7 (999) ${String(i).padStart(3, '0')}-${String(i + 10).padStart(2, '0')}-${String(i + 20).padStart(2, '0')}`,
    email: `client${i + 4}@mail.ru`,
    carModel: ['Lada Vesta', 'Hyundai Solaris', 'Kia Rio', 'Volkswagen Polo', 'Skoda Octavia'][i % 5],
    carNumber: `${String.fromCharCode(65 + (i % 26))}${String(i).padStart(3, '0')}${String.fromCharCode(65 + ((i + 1) % 26))}${String.fromCharCode(65 + ((i + 2) % 26))}${(i % 200).toString().padStart(2, '0')}`,
    createdAt: subDays(new Date(), 15 - i).toISOString(),
  })),
];

const generateOrders = (): Order[] => {
  const orders: Order[] = [];
  const statuses = [OrderStatus.PENDING, OrderStatus.IN_PROGRESS, OrderStatus.COMPLETED, OrderStatus.CANCELLED];
  
  for (let i = 0; i < 1200; i++) {
    const client = mockClients[i % mockClients.length];
    const numServices = Math.floor(Math.random() * 3) + 1;
    const orderServices = Array.from({ length: numServices }, () => 
      mockServices[Math.floor(Math.random() * mockServices.length)]
    );
    const totalPrice = orderServices.reduce((sum, service) => sum + service.price, 0);
    
    const daysAgo = Math.floor(Math.random() * 60);
    const scheduledDate = subDays(new Date(), daysAgo);
    
    orders.push({
      id: `ORD-${String(i + 1).padStart(6, '0')}`,
      clientId: client.id,
      clientName: client.name,
      clientPhone: client.phone,
      carModel: client.carModel,
      carNumber: client.carNumber,
      services: orderServices,
      totalPrice,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      scheduledDate: scheduledDate.toISOString(),
      createdAt: scheduledDate.toISOString(),
      notes: i % 5 === 0 ? 'Требуется дополнительная диагностика' : undefined,
    });
  }
  
  return orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const mockOrders: Order[] = generateOrders();

const generateCalendarAppointments = (): CalendarAppointment[] => {
  const appointments: CalendarAppointment[] = [];
  const today = new Date();
  
  for (let day = 0; day < 7; day++) {
    const date = addDays(today, day);
    const appointmentsPerDay = Math.floor(Math.random() * 8) + 5;
    
    for (let i = 0; i < appointmentsPerDay; i++) {
      const startHour = 9 + Math.floor(Math.random() * 8);
      const client = mockClients[Math.floor(Math.random() * mockClients.length)];
      const numServices = Math.floor(Math.random() * 2) + 1;
      const services = Array.from({ length: numServices }, () => 
        mockServices[Math.floor(Math.random() * mockServices.length)]
      );
      
      const duration = services.reduce((sum, s) => sum + s.duration, 0);
      const startTime = new Date(date);
      startTime.setHours(startHour, i * 15, 0, 0);
      const endTime = addHours(startTime, Math.ceil(duration / 60));
      
      appointments.push({
        id: `APT-${day}-${i}`,
        orderId: mockOrders[Math.floor(Math.random() * 100)].id,
        clientName: client.name,
        carModel: client.carModel,
        services: services.map(s => s.name),
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        status: day === 0 ? OrderStatus.IN_PROGRESS : OrderStatus.PENDING,
      });
    }
  }
  
  return appointments.sort((a, b) => 
    new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  );
};

export const mockCalendarAppointments: CalendarAppointment[] = generateCalendarAppointments();

export const getMockDashboardStats = () => {
  const completedOrders = mockOrders.filter(o => o.status === OrderStatus.COMPLETED);
  const revenue = completedOrders.reduce((sum, order) => sum + order.totalPrice, 0);
  const today = format(new Date(), 'yyyy-MM-dd');
  const todayAppointments = mockCalendarAppointments.filter(
    apt => format(new Date(apt.startTime), 'yyyy-MM-dd') === today
  );
  
  return {
    totalOrders: mockOrders.length,
    completedOrders: completedOrders.length,
    revenue,
    avgOrderValue: revenue / (completedOrders.length || 1),
    todayAppointments: todayAppointments.length,
  };
};

export const getMockChartData = () => {
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i);
    const dateStr = format(date, 'yyyy-MM-dd');
    const dayOrders = mockOrders.filter(
      order => format(new Date(order.scheduledDate), 'yyyy-MM-dd') === dateStr
    );
    const dayRevenue = dayOrders
      .filter(o => o.status === OrderStatus.COMPLETED)
      .reduce((sum, order) => sum + order.totalPrice, 0);
    
    return {
      name: format(date, 'dd MMM'),
      orders: dayOrders.length,
      revenue: dayRevenue,
    };
  });
  
  return last7Days;
};
