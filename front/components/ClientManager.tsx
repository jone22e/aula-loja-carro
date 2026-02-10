
import React, { useState, useMemo } from 'react';
import { 
  Search, 
  UserPlus, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Phone, 
  Mail, 
  MapPin, 
  X, 
  Check, 
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { Client, ClientType } from '../types';

interface ClientManagerProps {
  clients: Client[];
  onUpdate: (clients: Client[]) => void;
}

const ClientManager: React.FC<ClientManagerProps> = ({ clients, onUpdate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const filteredClients = useMemo(() => {
    return clients.filter(c => 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.cpfCnpj.includes(searchTerm) ||
      c.phone.includes(searchTerm)
    );
  }, [clients, searchTerm]);

  const handleDelete = (id: string) => {
    if (confirm('Deseja excluir este cliente?')) {
      onUpdate(clients.filter(c => c.id !== id));
    }
  };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const cpfCnpj = formData.get('cpfCnpj') as string;
    if (!editingClient && clients.some(c => c.cpfCnpj === cpfCnpj)) {
      alert('CPF/CNPJ já cadastrado.');
      return;
    }

    const newClient: Client = {
      id: editingClient?.id || Date.now().toString(),
      type: formData.get('type') as ClientType,
      name: formData.get('name') as string,
      cpfCnpj: cpfCnpj,
      rgIe: formData.get('rgIe') as string,
      phone: formData.get('phone') as string,
      email: formData.get('email') as string,
      address: {
        cep: formData.get('cep') as string,
        street: formData.get('street') as string,
        number: formData.get('number') as string,
        neighborhood: formData.get('neighborhood') as string,
        city: formData.get('city') as string,
        state: formData.get('state') as string,
      },
      observations: formData.get('observations') as string,
      createdAt: editingClient?.createdAt || new Date().toISOString(),
    };

    if (editingClient) {
      onUpdate(clients.map(c => c.id === editingClient.id ? newClient : c));
    } else {
      onUpdate([newClient, ...clients]);
    }

    setIsModalOpen(false);
    setEditingClient(null);
  };

  (window as any).openClientModal = (c?: Client) => {
    setEditingClient(c || null);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por nome, documento ou telefone..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Cliente</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Documento</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Contato</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Cidade</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredClients.map((client) => (
              <tr key={client.id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold">
                      {client.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{client.name}</p>
                      <p className="text-xs text-slate-400">{client.type}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                   <p className="text-sm text-slate-600 font-mono">{client.cpfCnpj}</p>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Phone size={12} className="text-indigo-500" /> {client.phone}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Mail size={12} className="text-indigo-500" /> {client.email}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                   <p className="text-sm text-slate-600">{client.address.city} - {client.address.state}</p>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => (window as any).openClientModal(client)}
                      className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(client.id)}
                      className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredClients.length === 0 && (
          <div className="p-12 text-center text-slate-400">
             Nenhum cliente encontrado.
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white p-6 border-b border-slate-100 flex items-center justify-between z-10">
              <h3 className="text-xl font-bold text-slate-900">{editingClient ? 'Editar Cliente' : 'Cadastrar Cliente'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-8">
              <section>
                <h4 className="text-sm font-bold text-indigo-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-600"></div> Dados Pessoais
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Tipo</label>
                    <select name="type" defaultValue={editingClient?.type || ClientType.PF} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500">
                      <option value={ClientType.PF}>Pessoa Física</option>
                      <option value={ClientType.PJ}>Pessoa Jurídica</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">CPF/CNPJ *</label>
                    <input required name="cpfCnpj" defaultValue={editingClient?.cpfCnpj} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 font-mono" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Nome Completo / Razão Social *</label>
                    <input required name="name" defaultValue={editingClient?.name} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Telefone/WhatsApp *</label>
                    <input required name="phone" defaultValue={editingClient?.phone} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">E-mail *</label>
                    <input required type="email" name="email" defaultValue={editingClient?.email} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500" />
                  </div>
                </div>
              </section>

              <section>
                <h4 className="text-sm font-bold text-indigo-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-indigo-600"></div> Endereço
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">CEP</label>
                    <input name="cep" defaultValue={editingClient?.address.cep} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 font-mono" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Logradouro</label>
                    <input name="street" defaultValue={editingClient?.address.street} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Número</label>
                    <input name="number" defaultValue={editingClient?.address.number} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Bairro</label>
                    <input name="neighborhood" defaultValue={editingClient?.address.neighborhood} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Cidade</label>
                    <input name="city" defaultValue={editingClient?.address.city} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">UF</label>
                    <input name="state" defaultValue={editingClient?.address.state} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 uppercase" maxLength={2} />
                  </div>
                </div>
              </section>

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
                  <Check size={20} /> Salvar Cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientManager;
