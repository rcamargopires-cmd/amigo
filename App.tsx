import React, { useState, useEffect } from 'react';
import { Participant, Match, GameStage } from './types';
import { drawNames } from './utils/calculations';
import { decodeShareData } from './utils/share';
import { InputForm } from './components/InputForm';
import { ParticipantList } from './components/Summary';
import { RevealCard } from './components/GrowthChart';
import { RemoteDashboard } from './components/RemoteDashboard';
import { Gift, Snowflake, RotateCcw, Moon, Sun, Settings, ChevronRight, Users, Smartphone, Key, ArrowRight } from 'lucide-react';

const App: React.FC = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [gameStage, setGameStage] = useState<GameStage>('setup');
  const [globalBudget, setGlobalBudget] = useState('50,00');
  
  // Manual Code Entry State
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [manualCode, setManualCode] = useState('');
  
  // States for single remote view
  const [remoteParticipant, setRemoteParticipant] = useState<Participant | null>(null);
  
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || 
        (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  // Function to process a code (from URL or manual input)
  const processSecretCode = (secret: string) => {
    const data = decodeShareData(secret);
    if (data) {
      setParticipants([data.giver, data.receiver]); 
      setMatches([{ giverId: data.giver.id, receiverId: data.receiver.id }]);
      setGlobalBudget(data.globalBudget);
      setRemoteParticipant(data.giver);
      setGameStage('revealing');
      return true;
    }
    return false;
  };

  // Check for secret link on load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const secret = params.get('secret');

    if (secret) {
      const success = processSecretCode(secret);
      if (!success) {
        window.history.replaceState({}, '', window.location.pathname);
      }
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(!darkMode);

  const handleAddParticipant = (newP: Omit<Participant, 'id'>) => {
    const participant: Participant = {
      ...newP,
      id: crypto.randomUUID()
    };
    setParticipants([...participants, participant]);
  };

  const handleRemoveParticipant = (id: string) => {
    setParticipants(participants.filter(p => p.id !== id));
  };

  const handleStartDraw = () => {
    if (participants.length < 2) {
      alert("Adicione pelo menos 2 participantes!");
      return;
    }
    const newMatches = drawNames(participants);
    setMatches(newMatches);
    setGameStage('mode_selection');
  };

  const handleManualCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) return;
    
    const success = processSecretCode(manualCode.trim());
    if (!success) {
      alert("Código inválido ou corrompido. Peça um novo link/código ao organizador.");
    }
  };

  const handleReset = () => {
    if (confirm("Tem certeza? Isso apagará o sorteio atual.")) {
      setMatches([]);
      setParticipants([]); 
      setGameStage('setup');
      setRemoteParticipant(null);
      window.history.replaceState({}, '', window.location.pathname);
    }
  };
  
  const handleSoftReset = () => {
    if (confirm("Voltar ao início? Os participantes serão mantidos.")) {
        setMatches([]);
        setGameStage('setup');
    }
  }

  const isRemoteView = !!remoteParticipant;

  return (
    <div className="min-h-screen font-sans selection:bg-indigo-200 dark:selection:bg-indigo-900">
      
      {/* Floating Header */}
      <nav className="fixed top-4 left-0 right-0 z-50 px-4">
        <div className="max-w-4xl mx-auto snow-card rounded-2xl px-6 py-3 flex items-center justify-between shadow-lg shadow-black/5">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-indigo-500 to-violet-600 p-2 rounded-xl text-white shadow-md">
              <Gift size={20} fill="currentColor" className="text-white/90" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800 dark:text-white">
              Amigo Secreto <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-violet-500">2025</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-2">
            {!isRemoteView && gameStage !== 'setup' && (
              <button onClick={handleSoftReset} className="p-2 text-slate-500 dark:text-slate-400 hover:text-indigo-500 transition-colors" title="Reiniciar">
                <RotateCcw size={18} />
              </button>
            )}
            
            <button 
              onClick={toggleTheme} 
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 pt-32 pb-16 relative z-10">
        
        {/* SETUP STAGE */}
        {gameStage === 'setup' && (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center mb-10">
              <h2 className="text-5xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300 font-festive">Amigo Secreto 2025</h2>
              <p className="text-slate-600 dark:text-slate-300 font-medium text-lg max-w-lg mx-auto leading-relaxed">Conectando pessoas e presentes. Organize seu sorteio de forma simples e moderna.</p>
            </div>

            {/* Manual Code Entry Button/Form */}
            {!showCodeInput ? (
                <div className="flex justify-center -mt-4 mb-8">
                   <button 
                     onClick={() => setShowCodeInput(true)}
                     className="text-indigo-600 dark:text-indigo-300 hover:text-indigo-800 dark:hover:text-white text-sm font-medium flex items-center gap-2 hover:underline transition-all px-4 py-2 rounded-full"
                   >
                     <Key size={14} /> Já recebi um código? Clique aqui
                   </button>
                </div>
            ) : (
                <form onSubmit={handleManualCodeSubmit} className="max-w-md mx-auto mb-8 snow-card p-4 rounded-xl flex gap-2 animate-fade-in">
                    <input 
                      type="text" 
                      placeholder="Cole o código secreto aqui..." 
                      className="flex-1 bg-transparent border-b border-slate-300 dark:border-slate-600 px-2 py-1 outline-none text-slate-800 dark:text-white"
                      value={manualCode}
                      onChange={e => setManualCode(e.target.value)}
                      autoFocus
                    />
                    <button type="submit" className="bg-slate-800 dark:bg-slate-700 text-white p-2 rounded-lg hover:bg-black transition-colors">
                        <ArrowRight size={16} />
                    </button>
                </form>
            )}

            {/* Global Settings Card */}
            <div className="snow-card p-6 rounded-2xl shadow-sm border border-white/50 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-5 dark:opacity-10 pointer-events-none group-hover:scale-110 transition-transform duration-700">
                    <Settings size={120} />
                </div>
                
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-1">
                            <Settings size={18} className="text-slate-400" /> Configurações
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Valor sugerido para o presente.</p>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800/80 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center shadow-inner">
                        <div className="bg-white dark:bg-slate-700 px-3 py-2 rounded-lg text-slate-400 font-bold border border-slate-100 dark:border-slate-600">R$</div>
                        <input 
                            type="text" 
                            value={globalBudget} 
                            onChange={e => setGlobalBudget(e.target.value)}
                            className="w-24 px-3 bg-transparent font-bold text-slate-800 dark:text-white outline-none"
                            placeholder="50,00"
                        />
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-12 gap-6 items-start">
              <div className="md:col-span-7">
                <InputForm onAdd={handleAddParticipant} />
              </div>
              <div className="md:col-span-5 h-full">
                <ParticipantList 
                  participants={participants} 
                  onRemove={handleRemoveParticipant} 
                />
              </div>
            </div>

            <div className="flex justify-center pt-8">
              <button
                onClick={handleStartDraw}
                disabled={participants.length < 2}
                className="group relative px-10 py-5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold rounded-full text-xl shadow-2xl hover:shadow-indigo-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-95 flex items-center gap-3 overflow-hidden"
              >
                 <Snowflake size={24} className={participants.length >= 2 ? "animate-spin-slow text-indigo-200" : "text-white/50"} />
                 <span className="relative">Realizar Sorteio</span>
                 <ChevronRight size={24} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all relative" />
              </button>
            </div>
            {participants.length < 2 && (
                   <p className="text-center text-slate-400 dark:text-slate-500 font-medium text-sm">Adicione pelo menos 2 participantes</p>
            )}
          </div>
        )}

        {/* MODE SELECTION STAGE */}
        {gameStage === 'mode_selection' && (
          <div className="animate-fade-in text-center py-10">
             <h2 className="text-4xl font-festive text-slate-800 dark:text-white font-bold mb-8">Como vamos revelar?</h2>
             
             <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                <button 
                  onClick={() => setGameStage('revealing')}
                  className="snow-card p-8 rounded-2xl hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all group flex flex-col items-center gap-4 text-left hover:-translate-y-1 hover:shadow-xl"
                >
                    <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/40 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                        <Users size={32} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-800 dark:text-white">Presencial (Roda)</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Passamos o dispositivo de mão em mão agora mesmo.</p>
                    </div>
                </button>

                <button 
                  onClick={() => setGameStage('remote_dashboard')}
                  className="snow-card p-8 rounded-2xl hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all group flex flex-col items-center gap-4 text-left hover:-translate-y-1 hover:shadow-xl"
                >
                    <div className="w-16 h-16 bg-teal-100 dark:bg-teal-900/40 rounded-full flex items-center justify-center text-teal-600 dark:text-teal-400 group-hover:scale-110 transition-transform">
                        <Smartphone size={32} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-800 dark:text-white">Remoto (Online)</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Gera links secretos e códigos para enviar.</p>
                    </div>
                </button>
             </div>
          </div>
        )}

        {/* REMOTE DASHBOARD STAGE */}
        {gameStage === 'remote_dashboard' && (
           <RemoteDashboard 
             participants={participants} 
             matches={matches} 
             globalBudget={globalBudget}
             onReset={handleSoftReset}
           />
        )}

        {/* REVEALING STAGE (Local or Single Remote) */}
        {gameStage === 'revealing' && (
          <div className="py-8">
             <RevealCard 
                matches={matches} 
                participants={participants} 
                onFinish={() => setGameStage('finished')}
                globalBudget={globalBudget}
                isSingleMode={isRemoteView}
            />
          </div>
        )}

        {/* FINISHED STAGE (Only for local group flow) */}
        {gameStage === 'finished' && !isRemoteView && (
          <div className="text-center py-12 animate-fade-in flex flex-col items-center">
            <div className="w-32 h-32 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mb-8 shadow-xl">
                <Gift size={64} className="text-indigo-600 dark:text-indigo-400" />
            </div>
            
            <h2 className="text-5xl md:text-6xl font-festive text-slate-800 dark:text-white mb-6">Sorteio Concluído!</h2>
            <p className="text-xl text-slate-500 dark:text-slate-400 mb-10 max-w-md font-medium leading-relaxed">
                Tudo pronto. Agora é só comprar os presentes!
            </p>
            
            <button
                onClick={handleSoftReset}
                className="px-8 py-4 bg-slate-900 hover:bg-black dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-900 rounded-2xl font-bold transition-all shadow-lg flex items-center gap-3 hover:scale-105"
            >
                <RotateCcw size={20} />
                Novo Sorteio
            </button>
          </div>
        )}

      </main>
      
      <footer className="fixed bottom-0 left-0 right-0 py-4 text-center bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-t border-slate-200/50 dark:border-slate-800/50">
        <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">
          © Reinaldo Camargo 2025
        </p>
      </footer>
    </div>
  );
};

export default App;