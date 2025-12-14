import { GoogleGenAI } from "@google/genai";
import { Participant } from "../types";

export const getGiftSuggestions = async (
  receiver: Participant,
  giverName: string,
  budget: string
): Promise<string> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) throw new Error("API Key required");

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
      Você é um assistente de Amigo Secreto criativo e divertido.
      
      Tarefa: Sugerir 3 opções de presentes para ${receiver.name}.
      
      Contexto:
      - O amigo secreto é no Brasil.
      - Quem vai presentear é: ${giverName}.
      - Orçamento máximo sugerido: R$ ${budget}.
      - O que ${receiver.name} gosta/dicas: "${receiver.likes || "Não informado, sugira coisas genéricas mas úteis"}".
      
      Formato da resposta:
      - Use emojis.
      - Respeite rigorosamente o orçamento de R$ ${budget} nas sugestões.
      - Seja breve (máximo 2 frases por sugestão).
      - Retorne apenas a lista formatada com Markdown.
      - Adicione uma pequena rima engraçada no final sobre o segredo.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Não consegui pensar em nada agora, use sua criatividade!";

  } catch (error) {
    console.error("Gemini Error:", error);
    return "Erro ao consultar o duende ajudante (IA indisponível).";
  }
};