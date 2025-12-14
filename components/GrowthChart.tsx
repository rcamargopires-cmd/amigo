import React, { useState } from 'react';
import { Participant, Match } from '../types';
import { Eye, CheckCircle, ArrowRight, MessageCircle, Gift, Check, Sparkles } from 'lucide-react';

interface RevealCardProps {
  matches: Match[];
  participants: Participant[];
  onFinish: () => void;
  globalBudget: string;
  isSingleMode?: boolean; // New prop to indicate if it's a single user viewing via link
}

export const RevealCard: React.FC<RevealCardProps> = ({ matches, participants, onFinish, globalBudget, isSingleMode = false }) => {
  const [currentTurn, setCurrentTurn] = useState(0);
  const [viewState, setViewState] = useState<'waiting' | 'revealed'>('waiting');
  const [showToast, setShowToast] = useState(false);

  const currentMatch = matches[currentTurn];
  const giver = participants.find(p => p.id === currentMatch.giverId)!;
  const receiver = participants.find(p => p.id === currentMatch.receiverId)!;

  const handleReveal = () => {
    setViewState('revealed');
  };

  const handleNext = () => {
    if (currentTurn < matches.length - 1) {
      setViewState('waiting');
      setCurrentTurn(prev => prev + 1);
      setShowToast(false); 
    } else {
      onFinish();
    }
  };

  const sendWhatsapp = () => {
    if (!giver.phone) return;
    
    if (window.confirm(`Tem certeza que deseja enviar o resultado para ${giver.name} pelo WhatsApp?`)) {
        let cleanPhone = giver.phone.replace(/\D/g, '');
        
        if (cleanPhone.length >= 10 && cleanPhone.length <= 11) {
          cleanPhone = '55' + cleanPhone;
        }

        const message = `Olá ${giver.name}! 🎅\n\nSou seu organizador do Amigo Secreto 2025.\nSeu amigo secreto é...\n\n\n\n🥁 *${receiver.name.toUpperCase()}* 🥁\n\n${receiver.likes ? `Dica: ${receiver.likes}` : ''}\n\n🤫 Guarde segredo!`;
        
        const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
        
        setShowToast(true);
        setTimeout(() => setShowToast(false), 4000);
    }
  };

  const progress = ((currentTurn + (viewState === 'revealed' ? 1 : 0)) / matches.length) * 100;
  
  const effectiveBudget = receiver.budget && receiver.budget.trim().length > 0 
    ? receiver.budget 
    : (globalBudget || "50,00");

  return (
    <div className="w-full max-w-lg mx-auto relative">
      {/* Success Toast - only show in group mode */}
      {!isSingleMode && (
        <div className={`absolute -top-20 left-0 right-0 flex justify-center transition-all duration-500 z-50 ${showToast ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
            <div className="bg-emerald-600 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-emerald-400/50 backdrop-blur-sm">
                <div className="bg-white/20 p-1 rounded-full">
                    <Check size={16} strokeWidth={3} />
                </div>
                <div className="flex flex-col">
                    <span className="font-bold text-sm">WhatsApp Aberto!</span>
                    <span className="text-[10px] text-white/80">Verifique se a mensagem foi enviada.</span>
                </div>
            </div>
        </div>
      )}

      {/* Progress Bar - Hide in single mode */}
      {!isSingleMode && (
        <div className="flex items-center gap-3 mb-6">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{Math.round(progress)}% Completo</span>
            <div className="flex-1 bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div 
                className="bg-gradient-to-r from-indigo-500 to-violet-500 h-full rounded-full transition-all duration-700 ease-out shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                style={{ width: `${progress}%` }}
                />
            </div>
        </div>
      )}

      <div className="snow-card rounded-3xl shadow-2xl overflow-hidden relative min-h-[500px] flex flex-col transition-all duration-500">
        
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center relative z-10">
          
          {viewState === 'waiting' ? (
            <div className="animate-fade-in space-y-8 w-full">
              <div className="w-28 h-28 bg-gradient-to-br from-indigo-100 to-indigo-50 dark:from-indigo-900/40 dark:to-slate-800 rounded-full flex items-center justify-center mx-auto shadow-inner ring-4 ring-white/50 dark:ring-white/10">
                <span className="text-5xl drop-shadow-sm text-indigo-600 dark:text-indigo-400"><Sparkles size={48} fill="currentColor" /></span>
              </div>
              
              <div>
                <h2 className="text-sm font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-widest mb-2">
                    {isSingleMode ? "Você foi convidado(a)!" : "Agora é a vez de"}
                </h2>
                <div className="text-4xl md:text-5xl font-festive font-bold text-slate-800 dark:text-white break-words drop-shadow-sm leading-tight">
                    {giver.name}
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700/50">
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                    {isSingleMode 
                        ? "O sorteio já foi realizado. Toque abaixo para descobrir quem você tirou!" 
                        : "Passe o dispositivo ou envie o resultado."
                    }
                </p>
              </div>
              
              <div className="flex flex-col gap-3 pt-2">
                <button
                  onClick={handleReveal}
                  className="w-full py-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold rounded-2xl shadow-lg hover:shadow-indigo-500/30 transform hover:scale-[1.02] transition-all flex items-center justify-center gap-3 text-lg"
                >
                  <Eye size={24} />
                  {isSingleMode ? "Ver quem eu tirei" : "Ver meu Amigo Secreto"}
                </button>
                
                {!isSingleMode && giver.phone && (
                  <button
                    onClick={sendWhatsapp}
                    className="w-full py-3 bg-white dark:bg-slate-800 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 font-bold rounded-2xl border border-green-200 dark:border-green-900/50 transition-all flex items-center justify-center gap-3"
                  >
                    <MessageCircle size={20} />
                    Enviar secretamente
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="animate-fade-in w-full">
              <div className="flex justify-center mb-6">
                 <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-2xl rotate-3 flex items-center justify-center shadow-sm">
                    <Gift size={40} className="text-green-600 dark:text-green-400" />
                 </div>
              </div>
              
              <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">Você tirou</h3>
              
              <div className="p-8 bg-gradient-to-b from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-inner relative mb-6">
                <h2 className="text-4xl md:text-5xl font-festive font-bold text-slate-800 dark:text-white break-words drop-shadow-sm mb-3">{receiver.name}</h2>
                
                <div className="flex flex-wrap justify-center gap-2 mt-4">
                    {receiver.likes && (
                        <span className="text-xs font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-700 py-1.5 px-3 rounded-lg border border-slate-200 dark:border-slate-600 shadow-sm">
                            ❤️ {receiver.likes}
                        </span>
                    )}
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-700 py-1.5 px-3 rounded-lg border border-slate-200 dark:border-slate-600 shadow-sm">
                        💰 Meta: R$ {effectiveBudget}
                    </span>
                </div>
              </div>

              <div className="pt-8">
                {!isSingleMode ? (
                    <button
                        onClick={handleNext}
                        className="w-full py-4 bg-slate-900 hover:bg-black dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-bold rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 group"
                    >
                        {currentTurn < matches.length - 1 ? (
                            <>Próxima Pessoa <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" /></>
                        ) : (
                            <>Finalizar Sorteio <CheckCircle size={20} /></>
                        )}
                    </button>
                ) : (
                    <div className="text-center text-slate-400 text-sm">
                        <p className="flex items-center justify-center gap-2"><CheckCircle size={16} /> Resultado revelado com sucesso!</p>
                        <p className="mt-2 text-xs opacity-70">Capture a tela para não esquecer.</p>
                    </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};