
import React, { useState } from 'react';
import { Car, Mail, Lock, User as UserIcon, ArrowRight, ShieldCheck } from 'lucide-react';
import { User, UserRole } from '../types';
import { loadData, saveData, setCurrentSession } from '../db';

interface AuthProps {
  onLogin: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const data = loadData();

    if (isLogin) {
      const user = data.users.find(u => u.email === email && u.password === password);
      if (user) {
        setCurrentSession(user);
        onLogin(user);
      } else {
        setError('E-mail ou senha incorretos.');
      }
    } else {
      if (data.users.some(u => u.email === email)) {
        setError('Este e-mail já está cadastrado.');
        return;
      }

      const newUser: User = {
        id: Date.now().toString(),
        name,
        email,
        password,
        role: 'SELLER' // Default role for new signups
      };

      const updatedData = {
        ...data,
        users: [...data.users, newUser]
      };
      
      saveData(updatedData);
      setCurrentSession(newUser);
      onLogin(newUser);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-500">
        <div className="p-8 bg-indigo-600 text-white text-center">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Car size={32} />
          </div>
          <h2 className="text-2xl font-bold">AutoManager Pro</h2>
          <p className="text-indigo-100 text-sm mt-1">Gestão inteligente de concessionárias</p>
        </div>

        <div className="p-8">
          <h3 className="text-xl font-bold text-slate-900 mb-6">
            {isLogin ? 'Bem-vindo de volta' : 'Crie sua conta'}
          </h3>

          <form onSubmit={handleAuth} className="space-y-4">
            {!isLogin && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Nome Completo</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    required
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                    placeholder="Seu nome"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                  placeholder="exemplo@email.com"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-xs font-bold bg-red-50 p-3 rounded-lg flex items-center gap-2">
                <ShieldCheck size={14} /> {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2 mt-4"
            >
              {isLogin ? 'Entrar no Sistema' : 'Finalizar Cadastro'}
              <ArrowRight size={18} />
            </button>
          </form>

          <div className="mt-8 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
            >
              {isLogin ? 'Não tem uma conta? Cadastre-se' : 'Já tem uma conta? Faça Login'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
