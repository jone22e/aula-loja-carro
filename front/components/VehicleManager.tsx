
import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Car, 
  Calendar, 
  Gauge, 
  ChevronDown,
  X,
  Plus,
  Zap,
  Check,
  Tag
} from 'lucide-react';
import { Vehicle, VehicleStatus, UserRole } from '../types';

interface VehicleManagerProps {
  vehicles: Vehicle[];
  onUpdate: (vehicles: Vehicle[]) => void;
  userRole: UserRole;
}

const VehicleManager: React.FC<VehicleManagerProps> = ({ vehicles, onUpdate, userRole }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<VehicleStatus | 'ALL'>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  // Filtered list
  const filteredVehicles = useMemo(() => {
    return vehicles.filter(v => {
      const matchSearch = v.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          v.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          v.plate.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter === 'ALL' || v.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [vehicles, searchTerm, statusFilter]);

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este veículo?')) {
      onUpdate(vehicles.filter(v => v.id !== id));
    }
  };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const plate = formData.get('plate') as string;
    // Check duplicate plate
    if (!editingVehicle && vehicles.some(v => v.plate === plate)) {
      alert('Já existe um veículo cadastrado com esta placa.');
      return;
    }

    const newVehicle: Vehicle = {
      id: editingVehicle?.id || Date.now().toString(),
      plate: plate,
      brand: formData.get('brand') as string,
      model: formData.get('model') as string,
      version: formData.get('version') as string,
      yearFab: parseInt(formData.get('yearFab') as string),
      yearModel: parseInt(formData.get('yearModel') as string),
      color: formData.get('color') as string,
      fuel: formData.get('fuel') as string,
      gear: formData.get('gear') as string,
      km: parseInt(formData.get('km') as string),
      salePrice: parseFloat(formData.get('salePrice') as string),
      costPrice: parseFloat(formData.get('costPrice') as string) || 0,
      status: (formData.get('status') as VehicleStatus) || VehicleStatus.AVAILABLE,
      observations: formData.get('observations') as string,
      createdAt: editingVehicle?.createdAt || new Date().toISOString()
    };

    if (editingVehicle) {
      onUpdate(vehicles.map(v => v.id === editingVehicle.id ? newVehicle : v));
    } else {
      onUpdate([newVehicle, ...vehicles]);
    }

    setIsModalOpen(false);
    setEditingVehicle(null);
  };

  // Expose modal trigger to parent
  (window as any).openVehicleModal = (v?: Vehicle) => {
    setEditingVehicle(v || null);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por modelo, marca ou placa..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <Filter size={18} className="text-slate-400 flex-shrink-0" />
          {[
            { id: 'ALL', label: 'Todos' },
            { id: VehicleStatus.AVAILABLE, label: 'Disponíveis' },
            { id: VehicleStatus.RESERVED, label: 'Reservados' },
            { id: VehicleStatus.SOLD, label: 'Vendidos' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setStatusFilter(f.id as any)}
              className={`
                px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors
                ${statusFilter === f.id ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}
              `}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* List View Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[1000px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Veículo</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Placa</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Ano / Modelo</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">KM / Comb.</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Preço</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredVehicles.map((vehicle) => (
                <tr key={vehicle.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-12 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0">
                        <img 
                          src={`https://picsum.photos/seed/${vehicle.id}/100/100`} 
                          alt={vehicle.model} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-indigo-600 uppercase tracking-tight">{vehicle.brand}</p>
                        <h4 className="text-sm font-bold text-slate-900 leading-tight truncate">{vehicle.model}</h4>
                        <p className="text-[11px] text-slate-500 truncate">{vehicle.version}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-slate-100 rounded font-mono text-[10px] font-bold text-slate-600 uppercase">
                      {vehicle.plate}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-slate-600 text-xs font-medium">
                      <Calendar size={14} className="text-slate-400" />
                      {vehicle.yearFab}/{vehicle.yearModel}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-slate-600 text-xs font-medium">
                        <Gauge size={14} className="text-slate-400" />
                        {vehicle.km.toLocaleString()} km
                      </div>
                      <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase">
                        <Zap size={12} />
                        {vehicle.fuel}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`
                      px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider
                      ${vehicle.status === VehicleStatus.AVAILABLE ? 'bg-emerald-50 text-emerald-600' : 
                        vehicle.status === VehicleStatus.SOLD ? 'bg-red-50 text-red-600' : 
                        'bg-amber-50 text-amber-600'}
                    `}>
                      {vehicle.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <p className="text-sm font-black text-slate-900">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(vehicle.salePrice)}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => (window as any).openVehicleModal(vehicle)}
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit size={16} />
                      </button>
                      {userRole === 'ADMIN' && (
                        <button 
                          onClick={() => handleDelete(vehicle.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Excluir"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredVehicles.length === 0 && (
          <div className="p-16 text-center">
            <div className="mx-auto w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-4">
              <Car size={32} />
            </div>
            <p className="text-slate-500 font-medium">Nenhum veículo encontrado para os filtros selecionados.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white p-6 border-b border-slate-100 flex items-center justify-between z-10">
              <h3 className="text-xl font-bold text-slate-900">{editingVehicle ? 'Editar Veículo' : 'Cadastrar Novo Veículo'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Placa *</label>
                  <input required name="plate" defaultValue={editingVehicle?.plate} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 font-mono" placeholder="ABC-1234" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Marca *</label>
                  <input required name="brand" defaultValue={editingVehicle?.brand} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="Ex: Toyota" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Modelo *</label>
                  <input required name="model" defaultValue={editingVehicle?.model} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="Ex: Corolla" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Versão *</label>
                  <input required name="version" defaultValue={editingVehicle?.version} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="Ex: 2.0 VVT-i XEI" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Ano Fab. *</label>
                  <input required name="yearFab" type="number" defaultValue={editingVehicle?.yearFab} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Ano Modelo *</label>
                  <input required name="yearModel" type="number" defaultValue={editingVehicle?.yearModel} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">KM *</label>
                  <input required name="km" type="number" defaultValue={editingVehicle?.km} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Cor *</label>
                  <input required name="color" defaultValue={editingVehicle?.color} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Combustível</label>
                  <select name="fuel" defaultValue={editingVehicle?.fuel || 'Flex'} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500">
                    <option value="Flex">Flex</option>
                    <option value="Gasolina">Gasolina</option>
                    <option value="Álcool">Álcool</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Híbrido">Híbrido</option>
                    <option value="Elétrico">Elétrico</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Câmbio</label>
                  <select name="gear" defaultValue={editingVehicle?.gear || 'Automático'} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500">
                    <option value="Automático">Automático</option>
                    <option value="Manual">Manual</option>
                    <option value="CVT">CVT</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Preço de Venda *</label>
                  <input required name="salePrice" type="number" step="0.01" defaultValue={editingVehicle?.salePrice} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Custo de Compra</label>
                  <input name="costPrice" type="number" step="0.01" defaultValue={editingVehicle?.costPrice} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Status</label>
                  <select name="status" defaultValue={editingVehicle?.status || VehicleStatus.AVAILABLE} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500">
                    <option value={VehicleStatus.AVAILABLE}>Disponível</option>
                    <option value={VehicleStatus.RESERVED}>Reservado</option>
                    <option value={VehicleStatus.SOLD}>Vendido</option>
                    <option value={VehicleStatus.INACTIVE}>Inativo</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Observações</label>
                  <textarea name="observations" defaultValue={editingVehicle?.observations} rows={3} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t border-slate-100">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 px-4 rounded-xl text-slate-600 font-bold hover:bg-slate-100 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 px-4 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2"
                >
                  <Check size={20} /> Salvar Veículo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleManager;
