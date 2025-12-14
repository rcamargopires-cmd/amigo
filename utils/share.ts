import { Participant } from '../types';

interface ShareData {
  giver: Participant;
  receiver: Participant;
  globalBudget: string;
}

// FORMATO MINIFICADO: [version, giverName, receiverName, receiverLikes, budget]
type MinifiedShareData = [number, string, string, string, string];

// Codifica os dados em uma string Base64 curta
export const encodeShareData = (data: ShareData): string => {
  const payload: MinifiedShareData = [
    1,
    data.giver.name,
    data.receiver.name,
    data.receiver.likes,
    data.receiver.budget || data.globalBudget
  ];
  
  const json = JSON.stringify(payload);
  return btoa(unescape(encodeURIComponent(json)));
};

export const decodeShareData = (hash: string): ShareData | null => {
  try {
    // A string vem da URL, então pode ter espaços onde deveriam ser '+'.
    // Corrigimos isso antes de decodificar.
    const cleanHash = hash.replace(/ /g, '+');
    const json = decodeURIComponent(escape(atob(cleanHash)));
    const payload = JSON.parse(json);

    if (Array.isArray(payload) && payload[0] === 1) {
      const [_, giverName, receiverName, receiverLikes, budget] = payload as MinifiedShareData;
      return {
        giver: { id: 'temp-g', name: giverName, likes: '' },
        receiver: { id: 'temp-r', name: receiverName, likes: receiverLikes, budget: budget },
        globalBudget: budget
      };
    }
    
    return payload as ShareData;
  } catch (error) {
    console.error("Failed to decode share data", error);
    return null;
  }
};

export const generateInviteMessage = (name: string, link: string, code: string) => {
  return `Olá ${name}! 🎅\n\nSeu Amigo Secreto:\n🔗 ${link}\n\nSe o link não abrir, entre no site e digite o código:\n🔑 *${code}*`;
};

export const generateWhatsappLink = (phone: string | undefined, message: string) => {
  let cleanPhone = phone ? phone.replace(/\D/g, '') : '';
  if (cleanPhone.length >= 10 && cleanPhone.length <= 11) {
    cleanPhone = '55' + cleanPhone;
  }

  // wa.me é mais universal e redireciona corretamente na maioria dos casos
  const waUrl = cleanPhone 
    ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`
    : `https://wa.me/?text=${encodeURIComponent(message)}`;

  return waUrl;
};