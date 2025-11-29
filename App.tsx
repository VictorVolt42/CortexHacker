import React, { useState, useRef, useEffect } from 'react';
import { Search, Globe, ShieldAlert, Terminal, Lock, MapPin } from 'lucide-react';
import { generateProfile } from './services/geminiService';
import { ProfileData } from './types';
import { TerminalOutput } from './components/TerminalOutput';

type Step = 'IDLE' | 'SEARCHING_NAME' | 'MATCH_FOUND' | 'SEARCHING_LOCATION' | 'DISPLAY_RESULT';

export default function App() {
  const [step, setStep] = useState<Step>('IDLE');
  const [nameQuery, setNameQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [matchCount, setMatchCount] = useState(0);
  
  // Audio refs for sound effects (simulated visually via console for now, or just UI feedback)
  const terminalRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of terminal
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [step, profileData]);

  const handleNameSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameQuery.trim()) return;

    setStep('SEARCHING_NAME');
    
    // Simulate network delay and "hacking" time
    setTimeout(() => {
      // Randomize match count between 50 and 500 for realism
      setMatchCount(Math.floor(Math.random() * 450) + 50);
      setStep('MATCH_FOUND');
    }, 1500);
  };

  const handleLocationSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep('SEARCHING_LOCATION');

    try {
      const data = await generateProfile(nameQuery, locationQuery);
      setProfileData(data);
      setStep('DISPLAY_RESULT');
    } catch (error) {
      console.error(error);
      setStep('MATCH_FOUND'); // Fallback to previous step on error
    }
  };

  const reset = () => {
    setStep('IDLE');
    setNameQuery('');
    setLocationQuery('');
    setProfileData(null);
  };

  return (
    <div className="min-h-screen font-mono text-hacker-green p-4 md:p-8 flex flex-col items-center justify-center relative z-10 selection:bg-hacker-green selection:text-black">
      
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
         <div className="absolute top-10 left-10 border-t-2 border-l-2 w-16 h-16 border-hacker-green"></div>
         <div className="absolute bottom-10 right-10 border-b-2 border-r-2 w-16 h-16 border-hacker-green"></div>
      </div>

      {/* Main Terminal Container */}
      <div 
        className="w-full max-w-4xl bg-black/90 border border-hacker-dim shadow-[0_0_20px_rgba(0,255,0,0.15)] flex flex-col relative overflow-hidden"
        style={{ minHeight: '600px' }}
      >
        {/* Terminal Header */}
        <div className="bg-hacker-dark border-b border-hacker-dim p-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal size={18} />
            <span className="text-sm tracking-widest font-bold">GHOST_TRACE v2.0.4</span>
          </div>
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-900"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-900"></div>
            <div className="w-3 h-3 rounded-full bg-green-900"></div>
          </div>
        </div>

        {/* Terminal Body */}
        <div ref={terminalRef} className="flex-1 p-6 overflow-y-auto space-y-8 pb-20">
          
          {/* Welcome Message */}
          <div className="space-y-2">
            <p className="text-hacker-dim">Connection established via proxy 192.168.X.X...</p>
            <p className="text-hacker-dim">Accessing federal database...</p>
            <h1 className="text-4xl md:text-6xl font-retro text-center my-8 glow-text tracking-widest">
              Cortex <br/> <span className="text-white">Heckar</span>
            </h1>
          </div>

          {/* Step 1: Initial Search */}
          <div className={`transition-opacity duration-500 ${step === 'IDLE' ? 'opacity-100' : 'opacity-50'}`}>
            <label className="block text-sm mb-2 font-bold tracking-wider">
              > Digite abaixo a informação do alvo:
            </label>
            <form onSubmit={handleNameSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 opacity-70" />
                <input 
                  type="text" 
                  value={nameQuery}
                  onChange={(e) => setNameQuery(e.target.value)}
                  disabled={step !== 'IDLE'}
                  placeholder="EX: LEANDRO MONTEIRO"
                  className="w-full bg-black border border-hacker-green py-3 pl-10 pr-4 text-lg focus:outline-none focus:ring-1 focus:ring-hacker-green focus:shadow-[0_0_10px_rgba(0,255,0,0.5)] placeholder-hacker-dim disabled:opacity-50 disabled:border-hacker-dim uppercase"
                  autoFocus
                />
              </div>
              <button 
                type="submit" 
                disabled={step !== 'IDLE' || !nameQuery}
                className="bg-hacker-green text-black font-bold px-6 hover:bg-white hover:shadow-[0_0_15px_rgba(0,255,0,0.8)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                RASTREAR
              </button>
            </form>
          </div>

          {/* Step 2: Processing Name */}
          {step === 'SEARCHING_NAME' && (
             <div className="space-y-1 text-yellow-500">
                <p>> Analyzing massive data...</p>
                <p>> Crossing CPF references...</p>
                <p className="animate-pulse">> Decrypting government hashes...</p>
             </div>
          )}

          {/* Step 3: Matches Found */}
          {(step === 'MATCH_FOUND' || step === 'SEARCHING_LOCATION' || step === 'DISPLAY_RESULT') && (
            <div className="border border-yellow-600/50 bg-yellow-900/10 p-4 animate-in fade-in slide-in-from-bottom-4">
              <div className="flex items-start gap-4">
                <ShieldAlert className="w-10 h-10 text-yellow-500 shrink-0" />
                <div className="w-full">
                  <p className="text-xl text-yellow-400 font-bold mb-2">
                    ALERTA DO SISTEMA
                  </p>
                  <p className="text-lg mb-4">
                    Existem <span className="text-white font-bold bg-yellow-700 px-1">{matchCount}</span> pessoas com esse nome no Brasil.
                  </p>
                  <p className="text-sm text-yellow-300/80 mb-4 animate-pulse">
                    "Deseja aplicar filtro de localidade para refinar a busca?"
                  </p>

                  {/* Filter Input */}
                  <form onSubmit={handleLocationSearch} className="flex flex-col md:flex-row gap-2 mt-4">
                     <div className="relative flex-1">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 opacity-70 text-hacker-green" />
                        <input 
                          type="text" 
                          value={locationQuery}
                          onChange={(e) => setLocationQuery(e.target.value)}
                          disabled={step !== 'MATCH_FOUND'}
                          placeholder="CIDADE, ESTADO OU BAIRRO..."
                          className="w-full bg-black border border-hacker-green py-3 pl-10 pr-4 text-lg focus:outline-none focus:ring-1 focus:ring-hacker-green placeholder-hacker-dim disabled:opacity-50 uppercase"
                          autoFocus={step === 'MATCH_FOUND'}
                        />
                     </div>
                     <button 
                        type="submit"
                        disabled={step !== 'MATCH_FOUND'}
                        className="bg-transparent border border-hacker-green text-hacker-green px-6 py-3 hover:bg-hacker-green hover:text-black font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                     >
                        {step === 'SEARCHING_LOCATION' ? 'PROCESSANDO...' : 'FILTRAR'}
                     </button>
                  </form>
                </div>
              </div>
            </div>
          )}
          
          {/* Step 4: Final Result */}
          {step === 'DISPLAY_RESULT' && profileData && (
             <div className="mt-8 border-t-2 border-hacker-green pt-8 animate-in zoom-in-95 duration-500">
                <TerminalOutput data={profileData} />
                
                <div className="mt-12 flex justify-center">
                    <button 
                        onClick={reset}
                        className="flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors border border-transparent hover:border-gray-700 px-4 py-2"
                    >
                        <Lock size={14} /> NOVA CONSULTA
                    </button>
                </div>
             </div>
          )}

        </div>

        {/* Footer Status Bar */}
        <div className="bg-hacker-dark border-t border-hacker-dim p-1 px-4 text-xs flex justify-between text-hacker-dim select-none">
          <div className="flex gap-4">
             <span>MEM: 64TB FREE</span>
             <span>UPTIME: 4291h 22m</span>
          </div>
          <div className="animate-pulse text-hacker-green">
             SECURE CONNECTION
          </div>
        </div>
      </div>

    </div>
  );
}