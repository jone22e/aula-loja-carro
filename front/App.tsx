
import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Car, 
  Users, 
  ShoppingCart, 
  Plus, 
  Search,
  LogOut,
  ChevronRight,
  ChevronLeft,
  TrendingUp,
  Package,
  CheckCircle,
  Menu,
  X,
  PlusCircle,
  BarChart3
} from 'lucide-react';
import { 
  Vehicle, 
  Client, 
  Sale, 
  VehicleStatus, 
  User, 
  UserRole,
  ClientType,
  PaymentMethod
} from './types';
import { loadData, saveData, getCurrentSession, setCurrentSession } from './db';

// Components
import Dashboard from './components/Dashboard';
import VehicleManager from './components/VehicleManager';
import ClientManager from './components/ClientManager';
import SaleManager from './components/SaleManager';
import Auth from './components/Auth';

const App: React.FC = () => {
  const [data, setData] = useState(loadData());
  const [currentUser, setCurrentUser] = useState<User | null>(getCurrentSession());
  const [activeTab, setActiveTab] = useState<'dashboard' | 'vehicles' | 'clients' | 'sales'>('dashboard');
  
  // Sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    saveData(data);
  }, [data]);

  const stats = useMemo(() => {
    const available = data.vehicles.filter(v => v.status === VehicleStatus.AVAILABLE).length;
    const soldMonth = data.sales.filter(s => {
      const saleDate = new Date(s.saleDate);
      const now = new Date();
      return saleDate.getMonth() === now.getMonth() && saleDate.getFullYear() === now.getFullYear();
    }).length;
    const totalInventoryValue = data.vehicles
      .filter(v => v.status !== VehicleStatus.SOLD)
      .reduce((acc, v) => acc + (v.salePrice || 0), 0);

    return { available, soldMonth, totalInventoryValue };
  }, [data]);

  const updateVehicles = (vehicles: Vehicle[]) => setData(prev => ({ ...prev, vehicles }));
  const updateClients = (clients: Client[]) => setData(prev => ({ ...prev, clients }));
  const updateSales = (sales: Sale[]) => setData(prev => ({ ...prev, sales }));

  const addSale = (sale: Sale) => {
    const updatedVehicles = data.vehicles.map(v => 
      v.id === sale.vehicleId ? { ...v, status: VehicleStatus.SOLD } : v
    );
    setData(prev => ({
      ...prev,
      sales: [sale, ...prev.sales],
      vehicles: updatedVehicles
    }));
  };

  const handleLogout = () => {
    setCurrentSession(null);
    setCurrentUser(null);
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'vehicles', label: 'Veículos', icon: <Car size={20} /> },
    { id: 'clients', label: 'Clientes', icon: <Users size={20} /> },
    { id: 'sales', label: 'Vendas', icon: <ShoppingCart size={20} /> },
  ];

  if (!currentUser) {
    return <Auth onLogin={setCurrentUser} />;
  }

  const sidebarWidth = isSidebarCollapsed ? 'w-20' : 'w-64';

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Mobile Sidebar Toggle */}
      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-50 p-4 bg-indigo-600 text-white rounded-full shadow-lg"
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40 transition-all duration-300 ease-in-out bg-slate-900 text-white
        ${sidebarWidth}
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full overflow-hidden">
          <div className="p-4 lg:p-6 flex flex-col h-full">
            <div className="flex items-center gap-3 text-indigo-400 mb-8 overflow-hidden">
              <div className="bg-indigo-600/20 p-2 rounded-lg flex-shrink-0">
                <Car size={32} />
              </div>
              {!isSidebarCollapsed && (
                <h1 className="text-xl font-bold text-white tracking-tight whitespace-nowrap animate-in fade-in duration-300">
                  AutoManager <span className="text-indigo-400">Pro</span>
                </h1>
              )}
            </div>

            <nav className="space-y-2 flex-1">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as any);
                    if (window.innerWidth < 1024) setIsSidebarOpen(false);
                  }}
                  className={`
                    w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 group relative
                    ${activeTab === item.id 
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'}
                    ${isSidebarCollapsed ? 'justify-center' : 'gap-3'}
                  `}
                  title={isSidebarCollapsed ? item.label : undefined}
                >
                  <div className="flex-shrink-0">{item.icon}</div>
                  {!isSidebarCollapsed && (
                    <span className="font-medium whitespace-nowrap animate-in fade-in slide-in-from-left-2 duration-300 flex-1 text-left">
                      {item.label}
                    </span>
                  )}
                  {!isSidebarCollapsed && activeTab === item.id && <ChevronRight size={16} />}
                  
                  {isSidebarCollapsed && (
                    <div className="absolute left-full ml-4 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity">
                      {item.label}
                    </div>
                  )}
                </button>
              ))}
            </nav>

            {/* Collapse Toggle Button (Desktop) */}
            <button 
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="hidden lg:flex items-center justify-center p-2 mt-4 mb-4 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              {isSidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>
          </div>

          <div className="mt-auto p-4 lg:p-6 border-t border-slate-800">
            <div className={`flex items-center mb-6 overflow-hidden ${isSidebarCollapsed ? 'justify-center' : 'gap-3'}`}>
              <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-indigo-400 font-bold flex-shrink-0">
                {currentUser.name.charAt(0)}
              </div>
              {!isSidebarCollapsed && (
                <div className="overflow-hidden animate-in fade-in duration-300">
                  <p className="text-sm font-semibold truncate">{currentUser.name}</p>
                  <p className="text-xs text-slate-500">{currentUser.role === 'ADMIN' ? 'Administrador' : 'Vendedor'}</p>
                </div>
              )}
            </div>
            <button 
              onClick={handleLogout}
              className={`flex items-center text-slate-400 hover:text-red-400 transition-colors text-sm font-medium w-full ${isSidebarCollapsed ? 'justify-center' : 'gap-2'}`}
            >
              <LogOut size={18} />
              {!isSidebarCollapsed && <span className="animate-in fade-in duration-300">Sair</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-0 p-4 lg:p-8 overflow-y-auto min-w-0 transition-all duration-300">
        <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              {menuItems.find(i => i.id === activeTab)?.label}
            </h2>
            <p className="text-slate-500 text-sm mt-1">Bem-vindo de volta, {currentUser.name}.</p>
          </div>
          
          <div className="flex items-center gap-3">
             {activeTab === 'vehicles' && (
               <button 
                 onClick={() => (window as any).openVehicleModal()} 
                 className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all font-medium"
               >
                 <PlusCircle size={18} /> Novo Veículo
               </button>
             )}
             {activeTab === 'clients' && (
               <button 
                 onClick={() => (window as any).openClientModal()} 
                 className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all font-medium"
               >
                 <PlusCircle size={18} /> Novo Cliente
               </button>
             )}
             {activeTab === 'sales' && (
               <button 
                 onClick={() => (window as any).openSaleModal()} 
                 className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all font-medium"
               >
                 <ShoppingCart size={18} /> Registrar Venda
               </button>
             )}
          </div>
        </header>

        {activeTab === 'dashboard' && <Dashboard stats={stats} vehicles={data.vehicles} sales={data.sales} />}
        {activeTab === 'vehicles' && (
          <VehicleManager 
            vehicles={data.vehicles} 
            onUpdate={updateVehicles} 
            userRole={currentUser.role}
          />
        )}
        {activeTab === 'clients' && (
          <ClientManager 
            clients={data.clients} 
            onUpdate={updateClients} 
          />
        )}
        {activeTab === 'sales' && (
          <SaleManager 
            sales={data.sales} 
            vehicles={data.vehicles} 
            clients={data.clients}
            onAddSale={addSale}
            onUpdate={updateSales}
          />
        )}
      </main>
    </div>
  );
};

export default App;
