export interface Participant {
  id: string;
  name: string;
  phone?: string; // WhatsApp number
  likes: string; // O que a pessoa gosta, para ajudar a IA
  budget?: string; // Orçamento específico para esta pessoa (opcional)
}

export interface Match {
  giverId: string;
  receiverId: string;
}

export type GameStage = 'setup' | 'mode_selection' | 'remote_dashboard' | 'revealing' | 'finished';

export interface GiftSuggestionState {
  loading: boolean;
  content: string | null;
}