import React, { useState } from 'react';
import { Participant, GiftSuggestionState } from '../types';
import { getGiftSuggestions } from '../services/geminiService';
import { Sparkles, Loader, Lightbulb } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface AIAnalysisProps {
  giver: Participant;
  receiver: Participant;
  globalBudget: string;
}

export const AIAnalysis: React.FC<AIAnalysisProps> = ({ giver, receiver, globalBudget }) => {
  const [suggestion, setSuggestion] = useState<GiftSuggestionState>({
    loading: false,
    content: null,
  });

  const handleGetIdeas = async () => {
    setSuggestion({ loading: true, content: null });
    
    // Determine effective budget
    const individualBudget = receiver.budget?.trim();
    const effectiveBudget = individualBudget && individualBudget.length > 0 
      ? individualBudget 
      : (globalBudget || "50,00");

    const content = await getGiftSuggestions(receiver, giver.name, effectiveBudget);
    setSuggestion({ loading: false, content });
  };

  if (suggestion.content) {
    return (
        <div className="mt-6 text-left bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-950/40 dark:to-slate-900/40 p-5 rounded-2xl border border-indigo-100 dark:border-indigo-900/30 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Sparkles size={80} />
            </div>
            <h4 className="flex items-center gap-2 font-bold text-indigo-600 dark:text-indigo-400 text-sm mb-3 uppercase tracking-wider">
                <Lightbulb size={16} className="fill-current" /> Sugestões da IA
            </h4>
            <div className="prose prose-sm prose-indigo dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 text-sm leading-relaxed font-medium">
                <ReactMarkdown>{suggestion.content}</ReactMarkdown>
            </div>
        </div>
    );
  }

  return (
    <div className="mt-6 flex justify-center">
        <button
        onClick={handleGetIdeas}
        disabled={suggestion.loading}
        className="group relative inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-300 text-sm font-bold shadow-sm ring-1 ring-indigo-100 dark:ring-indigo-900 hover:ring-indigo-300 dark:hover:ring-indigo-700 hover:shadow-md transition-all disabled:opacity-70 disabled:cursor-not-allowed"
        >
        {suggestion.loading ? (
            <><Loader size={16} className="animate-spin" /> Consultando os astros...</>
        ) : (
            <>
                <Sparkles size={16} className="text-indigo-500 group-hover:text-yellow-500 transition-colors" /> 
                <span>Pedir dicas de presente</span>
            </>
        )}
        </button>
    </div>
  );
};