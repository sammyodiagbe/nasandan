import { Car, Calendar, DollarSign, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui';
import { vehicles, bookings } from '@/data';
import { formatCurrency } from '@/lib/utils';

export function DashboardStats() {
  const totalVehicles = vehicles.length;
  const availableVehicles = vehicles.filter((v) => v.status === 'available').length;
  const activeBookings = bookings.filter((b) => b.status === 'active' || b.status === 'confirmed').length;
  const totalRevenue = bookings
    .filter((b) => b.status !== 'cancelled')
    .reduce((sum, b) => sum + b.pricing.total, 0);

  const stats = [
    {
      name: 'Total Vehicles',
      value: totalVehicles.toString(),
      subtext: `${availableVehicles} available`,
      icon: Car,
      gradient: 'from-blue-500 to-indigo-600',
      bgGradient: 'from-blue-50 to-indigo-50',
      trend: '+5%',
      trendUp: true,
    },
    {
      name: 'Active Bookings',
      value: activeBookings.toString(),
      subtext: 'Currently active',
      icon: Calendar,
      gradient: 'from-emerald-500 to-teal-600',
      bgGradient: 'from-emerald-50 to-teal-50',
      trend: '+12%',
      trendUp: true,
    },
    {
      name: 'Total Revenue',
      value: formatCurrency(totalRevenue),
      subtext: 'All time',
      icon: DollarSign,
      gradient: 'from-amber-500 to-orange-600',
      bgGradient: 'from-amber-50 to-orange-50',
      trend: '+23%',
      trendUp: true,
    },
    {
      name: 'Fleet Utilization',
      value: `${Math.round(((totalVehicles - availableVehicles) / totalVehicles) * 100)}%`,
      subtext: 'Currently rented',
      icon: TrendingUp,
      gradient: 'from-purple-500 to-violet-600',
      bgGradient: 'from-purple-50 to-violet-50',
      trend: '-3%',
      trendUp: false,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {stats.map((stat, index) => (
        <Card key={stat.name} hover className="overflow-hidden">
          <CardContent className="p-6 relative">
            {/* Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-50`} />

            <div className="relative">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg`}>
                  <stat.icon className="h-5 w-5 text-white" />
                </div>
                <div className={`flex items-center gap-1 text-xs font-semibold ${stat.trendUp ? 'text-emerald-600' : 'text-red-600'}`}>
                  {stat.trendUp ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                  {stat.trend}
                </div>
              </div>

              <p className="text-sm font-medium text-slate-500 mb-1">{stat.name}</p>
              <p className="text-2xl font-bold text-slate-900 mb-1">{stat.value}</p>
              <p className="text-xs text-slate-400">{stat.subtext}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
