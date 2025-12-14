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
    <div className="min-h-screen text-slate-800 dark:text-slate-100 font-sans selection:bg-red-200 dark:selection:bg-red-900">
      
      {/* Floating Header */}
      <nav className="fixed top-4 left-0 right-0 z-50 px-4">
        <div className="max-w-4xl mx-auto snow-card rounded-2xl px-6 py-3 flex items-center justify-between shadow-lg shadow-black/5">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-red-500 to-red-600 p-2 rounded-xl text-white shadow-md">
              <Gift size={20} fill="currentColor" className="text-white/90" />
            </div>
            <h1 className="text-xl font-festive text-slate-800 dark:text-white font-bold tracking-wide">
              Amigo Secreto <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-500">IA</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-2">
            {!isRemoteView && gameStage !== 'setup' && (
              <button onClick={handleSoftReset} className="p-2 text-slate-500 dark:text-slate-400 hover:text-red-500 transition-colors" title="Reiniciar">
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
            <div className="text-center text-white mb-10">
              <h2 className="text-5xl md:text-6xl font-festive font-bold mb-4 drop-shadow-lg text-white">Hora do Sorteio!</h2>
              <p className="text-white/90 font-medium text-lg max-w-lg mx-auto leading-relaxed">Organize, sorteie e receba dicas mágicas de presentes em segundos.</p>
            </div>

            {/* Manual Code Entry Button/Form */}
            {!showCodeInput ? (
                <div className="flex justify-center -mt-4 mb-8">
                   <button 
                     onClick={() => setShowCodeInput(true)}
                     className="text-white/80 hover:text-white text-sm font-medium flex items-center gap-2 hover:underline transition-all bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm"
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
            <div className="snow-card p-6 rounded-2xl shadow-lg border border-white/40 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-5 dark:opacity-10 pointer-events-none group-hover:scale-110 transition-transform duration-700">
                    <Settings size={120} />
                </div>
                
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-1">
                            <Settings size={18} className="text-slate-400" /> Configurações
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Defina o padrão para quem não tiver orçamento.</p>
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
                className="group relative px-10 py-5 bg-white text-red-600 font-bold rounded-full text-xl shadow-2xl hover:shadow-red-900/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 flex items-center gap-3 overflow-hidden"
              >
                 <div className="absolute inset-0 bg-gradient-to-r from-red-50 to-white opacity-0 group-hover:opacity-100 transition-opacity"></div>
                 <Snowflake size={24} className={participants.length >= 2 ? "animate-spin-slow text-red-400" : "text-slate-300"} />
                 <span className="relative">Realizar Sorteio</span>
                 <ChevronRight size={24} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all relative" />
              </button>
            </div>
            {participants.length < 2 && (
                   <p className="text-center text-white/80 font-medium text-sm">Adicione pelo menos 2 participantes</p>
            )}
          </div>
        )}

        {/* MODE SELECTION STAGE */}
        {gameStage === 'mode_selection' && (
          <div className="animate-fade-in text-center py-10">
             <h2 className="text-4xl font-festive text-white font-bold mb-8">Como vamos revelar?</h2>
             
             <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                <button 
                  onClick={() => setGameStage('revealing')}
                  className="snow-card p-8 rounded-2xl hover:bg-white/90 transition-all group flex flex-col items-center gap-4 text-left hover:-translate-y-1"
                >
                    <div className="w-16 h-16 bg-red-100 dark:bg-red-900/40 rounded-full flex items-center justify-center text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform">
                        <Users size={32} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-800 dark:text-white">Presencial (Roda)</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Passamos o dispositivo de mão em mão agora mesmo.</p>
                    </div>
                </button>

                <button 
                  onClick={() => setGameStage('remote_dashboard')}
                  className="snow-card p-8 rounded-2xl hover:bg-white/90 transition-all group flex flex-col items-center gap-4 text-left hover:-translate-y-1"
                >
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
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
            <div className="w-32 h-32 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mb-8 border border-white/30 shadow-2xl shadow-red-900/50">
                <Gift size={64} className="text-white drop-shadow-md" />
            </div>
            
            <h2 className="text-5xl md:text-7xl font-festive text-white mb-6 drop-shadow-lg">Sorteio Concluído!</h2>
            <p className="text-xl text-white/90 mb-10 max-w-md font-medium leading-relaxed">
                O ciclo se fechou. Agora é hora de preparar os presentes e celebrar!
            </p>
            
            <button
                onClick={handleSoftReset}
                className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-2xl font-bold transition-all border border-white/20 flex items-center gap-3 hover:scale-105"
            >
                <RotateCcw size={20} />
                Novo Sorteio
            </button>
          </div>
        )}

      </main>
      
      <footer className="fixed bottom-4 left-0 right-0 text-center pointer-events-none">
        <p className="text-white/40 text-sm font-festive text-lg drop-shadow-md">Boas Festas! 🎄</p>
      </footer>
    </div>
  );
};

export default App;