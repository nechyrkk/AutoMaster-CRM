import { useMemo } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import StatCard from '@/components/StatCard';
import { ClipboardIcon, CheckIcon, CurrencyIcon, TrendingUpIcon, CalendarIcon } from '@/components/Icons';
import { getMockDashboardStats, getMockChartData } from '@/data/mockData';
import { formatCurrency } from '@/utils/formatters';

const Dashboard = () => {
  const stats = useMemo(() => getMockDashboardStats(), []);
  const chartData = useMemo(() => getMockChartData(), []);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Дашборд</h1>
        <p className="text-gray-600">Обзор ключевых показателей и статистики</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Всего заказов"
          value={stats.totalOrders.toLocaleString()}
          icon={<ClipboardIcon />}
          trend={{ value: 12.5, isPositive: true }}
        />
        <StatCard
          title="Завершенных заказов"
          value={stats.completedOrders.toLocaleString()}
          icon={<CheckIcon />}
          subtitle={`${((stats.completedOrders / stats.totalOrders) * 100).toFixed(1)}% от общего числа`}
        />
        <StatCard
          title="Общая выручка"
          value={formatCurrency(stats.revenue)}
          icon={<CurrencyIcon />}
          trend={{ value: 8.3, isPositive: true }}
        />
        <StatCard
          title="Средний чек"
          value={formatCurrency(stats.avgOrderValue)}
          icon={<TrendingUpIcon />}
        />
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Записи на сегодня</h3>
            <CalendarIcon className="text-blue-600" />
          </div>
          <p className="text-4xl font-bold text-gray-900 mb-2">{stats.todayAppointments}</p>
          <p className="text-sm text-gray-600">Запланированных визитов</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Конверсия</h3>
            <TrendingUpIcon className="text-green-600" />
          </div>
          <p className="text-4xl font-bold text-gray-900 mb-2">
            {((stats.completedOrders / stats.totalOrders) * 100).toFixed(1)}%
          </p>
          <p className="text-sm text-gray-600">Завершенных от общего числа</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">В работе</h3>
            <ClockIcon className="text-orange-600" />
          </div>
          <p className="text-4xl font-bold text-gray-900 mb-2">
            {stats.totalOrders - stats.completedOrders - Math.floor(stats.totalOrders * 0.05)}
          </p>
          <p className="text-sm text-gray-600">Активных заказов</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders Chart */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Динамика заказов</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="name" 
                stroke="#9ca3af"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#9ca3af"
                style={{ fontSize: '12px' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
              <Line 
                type="monotone" 
                dataKey="orders" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ fill: '#3b82f6', r: 4 }}
                activeDot={{ r: 6 }}
                name="Заказы"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Chart */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Выручка по дням</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="name" 
                stroke="#9ca3af"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#9ca3af"
                style={{ fontSize: '12px' }}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
                formatter={(value: number) => [formatCurrency(value), 'Выручка']}
              />
              <Bar 
                dataKey="revenue" 
                fill="#3b82f6" 
                radius={[8, 8, 0, 0]}
                name="Выручка"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const ClockIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export default Dashboard;
