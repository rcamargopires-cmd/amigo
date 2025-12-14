import { Participant, Match } from '../types';

// Algoritmo de sorteio com suporte a Cadeias de Restrição (Chain Groups)
export const drawNames = (participants: Participant[]): Match[] => {
  if (participants.length < 2) return [];

  // Função auxiliar para normalizar nomes
  const normalize = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

  // Encontrar participantes por nome (ignorando case/acentos)
  const findByName = (name: string) => participants.find(p => normalize(p.name) === name);

  const pJoao = findByName("joao matheus");
  const pArthur = findByName("arthur");
  const pReinaldo = findByName("reinaldo");
  const pRogerio = findByName("rogerio");
  const pMatheus = findByName("matheus");
  const pFabiana = findByName("fabiana");

  const usedIds = new Set<string>();
  const blocks: Participant[][] = [];

  // Função auxiliar para processar um link A -> B
  // Se A já é o final de um bloco, adiciona B nesse bloco.
  // Se A está livre, cria novo bloco [A, B].
  // Se A já foi usado (mas não é fim de bloco) ou B já foi usado, ignora (para evitar conflitos).
  const processLink = (giver: Participant | undefined, receiver: Participant | undefined) => {
    if (!giver || !receiver) return;
    if (usedIds.has(receiver.id)) return; // Receptor já tem quem o tire

    const blockEndingWithGiverIndex = blocks.findIndex(b => b[b.length - 1].id === giver.id);

    if (blockEndingWithGiverIndex !== -1) {
      // Extende bloco existente
      blocks[blockEndingWithGiverIndex].push(receiver);
      usedIds.add(receiver.id);
    } else if (!usedIds.has(giver.id)) {
      // Cria novo bloco
      blocks.push([giver, receiver]);
      usedIds.add(giver.id);
      usedIds.add(receiver.id);
    }
  };

  // 1. Regra Isolada: João Matheus -> Arthur
  // Tratamos separado ou primeiro para garantir prioridade
  processLink(pJoao, pArthur);

  // 2. Corrente: Reinaldo -> Rogério -> Matheus -> Fabiana
  processLink(pReinaldo, pRogerio);
  processLink(pRogerio, pMatheus);
  processLink(pMatheus, pFabiana);

  // 3. Adicionar participantes restantes (Soltos)
  participants.forEach(p => {
    if (!usedIds.has(p.id)) {
      blocks.push([p]);
      usedIds.add(p.id);
    }
  });

  // 4. Embaralhar os blocos (Fisher-Yates)
  for (let i = blocks.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [blocks[i], blocks[j]] = [blocks[j], blocks[i]];
  }

  // 5. Validar Regra Negativa: Arthur NÃO PODE tirar Reinaldo
  // Verificamos se o bloco que termina com Arthur é seguido pelo bloco que começa com Reinaldo
  if (pArthur && pReinaldo && blocks.length > 1) {
    const blockIdxA = blocks.findIndex(b => b[b.length - 1].id === pArthur.id);
    const blockIdxR = blocks.findIndex(b => b[0].id === pReinaldo.id);

    if (blockIdxA !== -1 && blockIdxR !== -1) {
      const nextIdx = (blockIdxA + 1) % blocks.length;
      
      // Se Reinaldo está logo após Arthur no círculo
      if (nextIdx === blockIdxR) {
        // Precisamos trocar o bloco do Reinaldo de lugar com outro bloco seguro
        let swapIdx = -1;
        
        // Tentamos encontrar um índice que não seja nem o do Arthur nem o do Reinaldo
        for(let i = 0; i < blocks.length; i++) {
           if (i !== blockIdxA && i !== blockIdxR) {
              swapIdx = i;
              break;
           }
        }

        if (swapIdx !== -1) {
           [blocks[blockIdxR], blocks[swapIdx]] = [blocks[swapIdx], blocks[blockIdxR]];
        } else {
            // Se só existem 2 blocos (Arthur e Reinaldo), não há como evitar Arthur -> Reinaldo no círculo perfeito
            // a menos que invertamos a ordem se possível, ou aceitemos o destino se for matematicamente impossível
            // Com 2 blocos: [A...Arthur], [Reinaldo...B] -> Arthur tira Reinaldo, B tira A.
            // Se trocarmos: [Reinaldo...B], [A...Arthur] -> B tira A, Arthur tira Reinaldo. (Mesma coisa circularmente)
            // Nesse caso raro, a regra negativa pode falhar se houver poucos participantes.
        }
      }
    }
  }

  // 6. Achatar os blocos em uma lista única
  const ordered = blocks.flat();

  // 7. Gerar os pares (Circular)
  const matches: Match[] = ordered.map((giver, index) => {
    const receiver = ordered[(index + 1) % ordered.length];
    return {
      giverId: giver.id,
      receiverId: receiver.id
    };
  });

  return matches;
};