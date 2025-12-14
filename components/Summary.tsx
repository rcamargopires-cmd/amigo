import React from 'react';
import { Participant } from '../types';
import { Trash2, Users, Phone, Heart, DollarSign } from 'lucide-react';

interface ParticipantListProps {
  participants: Participant[];
  onRemove: (id: string) => void;
}

export const ParticipantList: React.FC<ParticipantListProps> = ({ participants, onRemove }) => {
  if (participants.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 snow-card rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 transition-colors">
        <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-full mb-4">
            <Users size={32} className="opacity-50" />
        </div>
        <p className="font-medium">A lista está vazia.</p>
        <p className="text-sm opacity-70 mt-1 text-center">Adicione amigos para começar a mágica!</p>
      </div>
    );
  }

  return (
    <div className="snow-card rounded-2xl p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2 text-xl">
          <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-lg text-blue-600 dark:text-blue-400">
            <Users size={20} />
          </div>
          Participantes
        </h3>
        <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 py-1 px-3 rounded-full text-sm font-bold">
            {participants.length}
        </span>
      </div>
      
      <div className="flex-1 overflow-y-auto pr-1 space-y-3 max-h-[500px] custom-scrollbar">
        {participants.map((p) => (
          <div key={p.id} className="group p-4 bg-white/60 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:border-red-100 dark:hover:border-red-900/50 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md flex items-start justify-between">
            <div className="flex-1 min-w-0 pr-3">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-bold text-slate-800 dark:text-slate-100 truncate text-base">{p.name}</p>
                {p.phone && (
                  <span title="WhatsApp adicionado" className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 p-1 rounded-full">
                    <Phone size={10} strokeWidth={3} />
                  </span>
                )}
              </div>
              
              <div className="flex flex-wrap gap-2">
                  {p.likes && (
                      <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-900/50 px-2 py-1 rounded-md max-w-full truncate">
                        <Heart size={10} className="text-pink-500 shrink-0" /> {p.likes}
                      </div>
                  )}
                  {p.budget && (
                      <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-900/50 px-2 py-1 rounded-md">
                        <DollarSign size={10} className="text-yellow-500 shrink-0" /> {p.budget}
                      </div>
                  )}
              </div>
            </div>
            
            <button
              onClick={() => onRemove(p.id)}
              className="p-2 text-slate-300 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
              title="Remover"
              aria-label="Remover participante"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};