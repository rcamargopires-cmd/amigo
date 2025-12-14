import React, { useState } from 'react';
import { Participant } from '../types';
import { Plus, User, Heart, Phone, DollarSign } from 'lucide-react';

interface InputFormProps {
  onAdd: (p: Omit<Participant, 'id'>) => void;
}

export const InputForm: React.FC<InputFormProps> = ({ onAdd }) => {
  const [name, setName] = useState('');
  const [likes, setLikes] = useState('');
  const [phone, setPhone] = useState('');
  const [budget, setBudget] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    onAdd({ 
      name: name.trim(), 
      likes: likes.trim(),
      phone: phone.trim(),
      budget: budget.trim()
    });
    
    setName('');
    setLikes('');
    setPhone('');
    setBudget('');
  };

  return (
    <form onSubmit={handleSubmit} className="snow-card p-6 rounded-2xl transition-all duration-300 hover:shadow-xl">
      <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
        <div className="bg-red-100 dark:bg-red-900/50 p-2 rounded-lg text-red-600 dark:text-red-400">
            <User size={20} />
        </div>
        Novo Participante
      </h3>
      
      <div className="space-y-4">
        <div className="relative group">
          <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Nome</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: João Silva"
            className="w-full p-4 bg-slate-50 dark:bg-slate-800/50 border-0 rounded-xl focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 outline-none text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-all shadow-sm group-hover:bg-white dark:group-hover:bg-slate-800"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="relative group">
            <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1 mb-1 block flex items-center gap-1">
              WhatsApp <Phone size={10} className="text-green-500" />
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(11) 99999-9999"
              className="w-full p-4 bg-slate-50 dark:bg-slate-800/50 border-0 rounded-xl focus:ring-2 focus:ring-green-500 outline-none text-slate-900 dark:text-white placeholder-slate-400 transition-all shadow-sm group-hover:bg-white dark:group-hover:bg-slate-800"
            />
          </div>
          <div className="relative group">
            <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1 mb-1 block flex items-center gap-1">
              Orçamento <DollarSign size={10} className="text-yellow-500" />
            </label>
            <input
              type="text"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="Ex: 100,00"
              className="w-full p-4 bg-slate-50 dark:bg-slate-800/50 border-0 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none text-slate-900 dark:text-white placeholder-slate-400 transition-all shadow-sm group-hover:bg-white dark:group-hover:bg-slate-800"
            />
          </div>
        </div>

        <div className="relative group">
          <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1 mb-1 block flex items-center gap-1">
            Gostos / Dicas <Heart size={10} className="text-pink-500" />
          </label>
          <input
            type="text"
            value={likes}
            onChange={(e) => setLikes(e.target.value)}
            placeholder="Ex: Livros de ficção, Café especial..."
            className="w-full p-4 bg-slate-50 dark:bg-slate-800/50 border-0 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none text-slate-900 dark:text-white placeholder-slate-400 transition-all shadow-sm group-hover:bg-white dark:group-hover:bg-slate-800"
          />
        </div>

        <button
          type="submit"
          className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-green-900/20 hover:shadow-green-900/30 transform hover:-translate-y-0.5 flex items-center justify-center gap-2 mt-2"
        >
          <Plus size={20} />
          Adicionar à Roda
        </button>
      </div>
    </form>
  );
};