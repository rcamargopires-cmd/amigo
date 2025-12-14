import React from 'react';
import { Participant, Match } from '../types';
import { encodeShareData, generateWhatsappLink, generateInviteMessage } from '../utils/share';
import { MessageCircle, Copy, RotateCcw, AlertTriangle, Share2, Link as LinkIcon, Check } from 'lucide-react';

interface RemoteDashboardProps {
  participants: Participant[];
  matches: Match[];
  globalBudget: string;
  onReset: () => void;
}

export const RemoteDashboard: React.FC<RemoteDashboardProps> = ({ participants, matches, globalBudget, onReset }) => {
  
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert(`${label} copiado para a área de transferência!`);
    });
  };

  const handleNativeShare = async (title: string, text: string, url: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url,
        });
      } catch (error) {
        console.log('Error sharing', error);
      }
    } else {
      handleCopy(`${text}\n\n${url}`, "Convite");
    }
  };

  return (
    <div className="animate-fade-in w-full max-w-2xl mx-auto pb-20">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-festive font-bold text-white mb-2 drop-shadow-md">Painel do Organizador</h2>
        <p className="text-white/80">Envie o resultado individualmente para cada participante.</p>
      </div>

      {isLocalhost && (
        <div className="bg-yellow-100 dark:bg-yellow-900/40 border border-yellow-300 dark:border-yellow-700 p-4 rounded-xl mb-6 flex items-start gap-3 text-left">
           <AlertTriangle className="text-yellow-600 dark:text-yellow-400 shrink-0 mt-0.5" />
           <div>
             <h4 className="font-bold text-yellow-800 dark:text-yellow-200 text-sm">Atenção: Você está em Localhost</h4>
             <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
               Os links gerados aqui são locais. Se você enviar para alguém fora da sua rede, <strong>não funcionará</strong>.
               <br/>
               Use o <strong>Código Manual</strong> ou publique o site para funcionar corretamente.
             </p>
           </div>
        </div>
      )}

      <div className="space-y-4">
        {matches.map((match) => {
          const giver = participants.find(p => p.id === match.giverId)!;
          const receiver = participants.find(p => p.id === match.receiverId)!;
          
          // 1. Gera o hash
          const hash = encodeShareData({ giver, receiver, globalBudget });
          
          // 2. Cria a URL SEGURA
          const baseUrl = window.location.origin + window.location.pathname;
          // Garantimos que o hash está codificado corretamente para URL
          const secretLink = `${baseUrl}?secret=${encodeURIComponent(hash)}`;
          
          // 3. Gera a mensagem completa (Texto + Link + Código)
          const message = generateInviteMessage(giver.name, secretLink, hash);
          
          // 4. Link direto do WhatsApp (API)
          const waLink = generateWhatsappLink(giver.phone, message);

          return (
            <div key={giver.id} className="snow-card p-4 rounded-xl flex flex-col gap-4 transition-all hover:shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white font-bold shadow-sm shrink-0">
                  {giver.name.charAt(0).toUpperCase()}
                </div>
                <div className="text-left overflow-hidden">
                  <h3 className="font-bold text-slate-800 dark:text-white truncate">{giver.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {giver.phone ? 'WhatsApp disponível' : 'Sem telefone cadastrado'}
                  </p>
                </div>
              </div>

              {/* Área de Ações */}
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3 border border-slate-100 dark:border-slate-700/50">
                  {/* Código Manual */}
                  <div className="flex items-center justify-between gap-2 mb-3 bg-white dark:bg-slate-900 p-2 rounded border border-slate-200 dark:border-slate-700">
                     <code className="text-[10px] text-slate-500 dark:text-slate-400 font-mono break-all line-clamp-1 flex-1">
                        Código: {hash}
                     </code>
                     <button 
                       onClick={() => handleCopy(hash, 'Código')}
                       className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 flex items-center gap-1 shrink-0 px-2 py-1 bg-blue-50 dark:bg-blue-900/30 rounded"
                     >
                       <Copy size={12} /> Copiar
                     </button>
                  </div>
                  
                  {/* Botões de Ação Principal */}
                  <div className="grid grid-cols-2 gap-2">
                    {/* Botão 1: Nativo ou WhatsApp */}
                    {navigator.share ? (
                        <button
                            onClick={() => handleNativeShare(`Amigo Secreto de ${giver.name}`, message, secretLink)}
                            className="py-3 px-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95"
                        >
                            <Share2 size={16} />
                            Compartilhar
                        </button>
                    ) : (
                        <a
                            href={waLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="py-3 px-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
                        >
                            <MessageCircle size={16} />
                            WhatsApp
                        </a>
                    )}

                    {/* Botão 2: Copiar Link Apenas */}
                    <button
                        onClick={() => handleCopy(secretLink, "Link")}
                        className="py-3 px-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95"
                    >
                        <LinkIcon size={16} />
                        Copiar Link
                    </button>
                  </div>

                  {/* Botão 3: Copiar Convite Completo (Texto + Link + Código) */}
                  <button
                      onClick={() => handleCopy(message, "Convite completo")}
                      className="w-full mt-2 py-2 px-2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg font-medium text-[10px] flex items-center justify-center gap-1 transition-colors"
                  >
                      <Copy size={12} />
                      Copiar mensagem completa (Texto + Link + Código)
                  </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-10 text-center">
        <button
          onClick={onReset}
          className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2 mx-auto"
        >
          <RotateCcw size={18} />
          Reiniciar Sorteio
        </button>
      </div>
    </div>
  );
};