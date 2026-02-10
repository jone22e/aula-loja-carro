
import React from 'react';
import { 
  Car, 
  ShoppingCart, 
  TrendingUp, 
  Package, 
  ArrowUpRight, 
  ArrowDownRight,
  ChevronRight
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { Vehicle, Sale, VehicleStatus } from '../types';

interface DashboardProps {
  stats: {
    available: number;
    soldMonth: number;
    totalInventoryValue: number;
  };
  vehicles: Vehicle[];
  sales: Sale[];
}

const Dashboard: React.FC<DashboardProps> = ({ stats, vehicles, sales }) => {
  const chartData = [
    { name: 'Seg', sales: 2 },
    { name: 'Ter', sales: 5 },
    { name: 'Qua', sales: 3 },
    { name: 'Qui', sales: 7 },
    { name: 'Sex', sales: 10 },
    { name: 'Sab', sales: 12 },
    { name: 'Dom', sales: 4 },
  ];

  const recentSales = sales.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                <Package size={24} />
              </div>
              <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full flex items-center gap-1">
                <ArrowUpRight size={12} /> +12%
              </span>
            </div>
            <p className="text-slate-500 text-sm font-medium">Disponíveis em Estoque</p>
            <h3 className="text-3xl font-bold text-slate-900 mt-1">{stats.available}</h3>
          </div>
          <div className="absolute -bottom-6 -right-6 text-indigo-50 opacity-10 transition-transform group-hover:scale-110">
            <Package size={120} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                <ShoppingCart size={24} />
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full flex items-center gap-1">
                <ArrowUpRight size={12} /> +24%
              </span>
            </div>
            <p className="text-slate-500 text-sm font-medium">Vendas este Mês</p>
            <h3 className="text-3xl font-bold text-slate-900 mt-1">{stats.soldMonth}</h3>
          </div>
          <div className="absolute -bottom-6 -right-6 text-emerald-50 opacity-10 transition-transform group-hover:scale-110">
            <ShoppingCart size={120} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <TrendingUp size={24} />
              </div>
              <span className="text-xs font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-full flex items-center gap-1">
                Estável
              </span>
            </div>
            <p className="text-slate-500 text-sm font-medium">Valor Total em Estoque</p>
            <h3 className="text-3xl font-bold text-slate-900 mt-1">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats.totalInventoryValue)}
            </h3>
          </div>
          <div className="absolute -bottom-6 -right-6 text-blue-50 opacity-10 transition-transform group-hover:scale-110">
            <TrendingUp size={120} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-slate-900">Desempenho de Vendas</h3>
              <p className="text-slate-500 text-xs mt-1">Volume de vendas por dia na última semana</p>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} dy={10} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="sales" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-900">Vendas Recentes</h3>
            <button className="text-indigo-600 text-xs font-bold hover:underline">Ver tudo</button>
          </div>
          
          <div className="space-y-4">
            {recentSales.length > 0 ? (
              recentSales.map((sale) => {
                const vehicle = vehicles.find(v => v.id === sale.vehicleId);
                return (
                  <div key={sale.id} className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-xl transition-colors border border-transparent hover:border-slate-100">
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                      <Car size={20} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-slate-900">{vehicle?.model} {vehicle?.version}</p>
                      <p className="text-xs text-slate-500">{new Date(sale.saleDate).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-slate-900">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(sale.finalValue)}
                      </p>
                      <p className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded uppercase">Vendido</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12">
                <div className="mx-auto w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-3">
                  <ShoppingCart size={20} />
                </div>
                <p className="text-slate-500 text-sm">Nenhuma venda registrada recentemente.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
