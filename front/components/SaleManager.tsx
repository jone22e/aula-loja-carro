
import React, { useState } from 'react';
import { 
  ShoppingCart, 
  Search, 
  Plus, 
  X, 
  Check, 
  Car, 
  User, 
  DollarSign, 
  ChevronRight,
  ArrowRight,
  Receipt,
  FileText
} from 'lucide-react';
import { Sale, Vehicle, Client, VehicleStatus, PaymentMethod } from '../types';

interface SaleManagerProps {
  sales: Sale[];
  vehicles: Vehicle[];
  clients: Client[];
  onAddSale: (sale: Sale) => void;
  onUpdate: (sales: Sale[]) => void;
}

const SaleManager: React.FC<SaleManagerProps> = ({ sales, vehicles, clients, onAddSale, onUpdate }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState(1);
  
  // Selection state
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.CASH);
  const [downPayment, setDownPayment] = useState(0);
  const [installmentsCount, setInstallmentsCount] = useState(1);
  const [obs, setObs] = useState('');

  const availableVehicles = vehicles.filter(v => v.status === VehicleStatus.AVAILABLE);

  const resetForm = () => {
    setStep(1);
    setSelectedClient(null);
    setSelectedVehicle(null);
    setDiscount(0);
    setDownPayment(0);
    setInstallmentsCount(1);
    setObs('');
    setIsModalOpen(false);
  };

  const handleFinish = () => {
    if (!selectedClient || !selectedVehicle) return;

    const finalValue = selectedVehicle.salePrice - discount;
    if (finalValue < 0) {
      alert('O valor final da venda não pode ser negativo.');
      return;
    }

    const newSale: Sale = {
      id: Date.now().toString(),
      clientId: selectedClient.id,
      vehicleId: selectedVehicle.id,
      saleDate: new Date().toISOString(),
      listPrice: selectedVehicle.salePrice,
      discountValue: discount,
      finalValue: finalValue,
      paymentMethod: paymentMethod,
      downPayment: downPayment,
      installmentsCount: installmentsCount,
      installmentsValue: installmentsCount > 1 ? (finalValue - downPayment) / installmentsCount : 0,
      observations: obs,
      sellerId: 'u1',
      createdAt: new Date().toISOString()
    };

    onAddSale(newSale);
    resetForm();
  };

  (window as any).openSaleModal = () => setIsModalOpen(true);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Data</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Veículo</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Cliente</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Pagamento</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Valor Final</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {sales.map((sale) => {
                const v = vehicles.find(vec => vec.id === sale.vehicleId);
                const c = clients.find(cl => cl.id === sale.clientId);
                return (
                  <tr key={sale.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-slate-600">{new Date(sale.saleDate).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-slate-900">{v?.model}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{v?.plate}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 font-medium">{c?.name}</td>
                    <td className="px-6 py-4 text-xs text-slate-500">
                       <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-full font-bold">{sale.paymentMethod}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className="text-sm font-bold text-slate-900">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(sale.finalValue)}
                      </p>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {sales.length === 0 && (
          <div className="p-12 text-center text-slate-400">
             Nenhuma venda registrada ainda.
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col md:flex-row">
            {/* Sidebar Steps */}
            <div className="w-full md:w-64 bg-indigo-600 p-8 text-white hidden md:block">
              <h3 className="text-xl font-bold mb-8">Nova Venda</h3>
              <div className="space-y-6">
                {[
                  { n: 1, l: 'Cliente' },
                  { n: 2, l: 'Veículo' },
                  { n: 3, l: 'Pagamento' },
                  { n: 4, l: 'Confirmação' }
                ].map(s => (
                  <div key={s.n} className={`flex items-center gap-4 ${step === s.n ? 'opacity-100' : 'opacity-40'}`}>
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold ${step === s.n ? 'bg-white text-indigo-600' : 'border-white/50 text-white'}`}>
                      {s.n}
                    </div>
                    <span className="font-semibold">{s.l}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 flex flex-col min-h-0 bg-white">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <span className="md:hidden text-indigo-600 font-bold uppercase tracking-tighter text-xs">Passo {step} de 4</span>
                <button onClick={resetForm} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 ml-auto">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8">
                {step === 1 && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    <h4 className="text-2xl font-bold text-slate-900">Selecione o Cliente</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {clients.map(c => (
                        <button
                          key={c.id}
                          onClick={() => setSelectedClient(c)}
                          className={`p-4 rounded-2xl border-2 text-left transition-all ${selectedClient?.id === c.id ? 'border-indigo-600 bg-indigo-50 shadow-md' : 'border-slate-100 hover:border-slate-200'}`}
                        >
                          <p className="font-bold text-slate-900">{c.name}</p>
                          <p className="text-xs text-slate-500 font-mono mt-1">{c.cpfCnpj}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    <h4 className="text-2xl font-bold text-slate-900">Selecione o Veículo</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {availableVehicles.map(v => (
                        <button
                          key={v.id}
                          onClick={() => setSelectedVehicle(v)}
                          className={`p-4 rounded-2xl border-2 text-left transition-all ${selectedVehicle?.id === v.id ? 'border-indigo-600 bg-indigo-50 shadow-md' : 'border-slate-100 hover:border-slate-200'}`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-bold text-slate-900">{v.model}</p>
                              <p className="text-xs text-slate-500">{v.brand} - {v.yearModel}</p>
                            </div>
                            <p className="font-black text-indigo-600">
                              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v.salePrice)}
                            </p>
                          </div>
                          <span className="mt-3 block px-2 py-0.5 bg-slate-100 rounded font-mono text-[9px] font-bold text-slate-600 w-fit">{v.plate}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    <h4 className="text-2xl font-bold text-slate-900">Forma de Pagamento</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <label className="block text-xs font-bold text-slate-500 uppercase">Método</label>
                        <select 
                          className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                          value={paymentMethod}
                          onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                        >
                          {Object.values(PaymentMethod).map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                        
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Desconto (R$)</label>
                          <input 
                            type="number" 
                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                            value={discount}
                            onChange={(e) => setDiscount(Number(e.target.value))}
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Valor da Entrada</label>
                          <input 
                            type="number" 
                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                            value={downPayment}
                            onChange={(e) => setDownPayment(Number(e.target.value))}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Qtd Parcelas</label>
                          <input 
                            type="number" 
                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                            value={installmentsCount}
                            onChange={(e) => setInstallmentsCount(Number(e.target.value))}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                    <h4 className="text-2xl font-bold text-slate-900">Resumo da Venda</h4>
                    
                    <div className="bg-slate-50 p-6 rounded-2xl space-y-4 border border-slate-100">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Veículo:</span>
                        <span className="font-bold text-slate-900">{selectedVehicle?.brand} {selectedVehicle?.model}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Cliente:</span>
                        <span className="font-bold text-slate-900">{selectedClient?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Pagamento:</span>
                        <span className="font-bold text-indigo-600">{paymentMethod}</span>
                      </div>
                      <hr className="border-slate-200" />
                      <div className="flex justify-between text-lg font-black">
                        <span className="text-slate-900 uppercase tracking-tighter">Total a Pagar:</span>
                        <span className="text-emerald-600">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format((selectedVehicle?.salePrice || 0) - discount)}
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Observações Adicionais</label>
                      <textarea 
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                        rows={3}
                        value={obs}
                        onChange={(e) => setObs(e.target.value)}
                        placeholder="Ex: Entrega agendada para sexta-feira..."
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex gap-4">
                {step > 1 && (
                  <button 
                    onClick={() => setStep(step - 1)}
                    className="px-6 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-100"
                  >
                    Voltar
                  </button>
                )}
                
                <button 
                  onClick={() => {
                    if (step === 1 && !selectedClient) return alert('Selecione um cliente');
                    if (step === 2 && !selectedVehicle) return alert('Selecione um veículo');
                    if (step < 4) setStep(step + 1);
                    else handleFinish();
                  }}
                  className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
                >
                  {step === 4 ? <Check size={20} /> : <ArrowRight size={20} />}
                  {step === 4 ? 'Confirmar e Finalizar Venda' : 'Próximo Passo'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SaleManager;
