export const PHASES = [
  {
    id: 'fase1',
    numero: 1,
    nome: 'Construção',
    periodo: 'Junho — Julho',
    objetivo: 'Reconstruir a base aeróbia e elevar o nível de força desde já, com progressão controlada de volume.',
    cor: '#E8B33D',
  },
  {
    id: 'fase2',
    numero: 2,
    nome: 'Intensidade',
    periodo: 'Final de Julho — Agosto',
    objetivo: 'Pico de volume e intensidade: velocidade, explosão e resistência específica de jogo.',
    cor: '#C1392B',
  },
  {
    id: 'fase3',
    numero: 3,
    nome: 'Resiliência',
    periodo: 'Setembro',
    objetivo: 'Paralelo aos treinos diários de equipa — prevenção de lesões e recuperação ativa, sem esforço extra.',
    cor: '#6B9080',
  },
];

const EX = {
  sentadilha_bulgara: { nome: 'Sentadilha búlgara', desc: 'Pé de trás apoiado num banco/cadeira, desce a perna da frente.', exId: 'sentadilha_bulgara' },
  afundo_impulso: { nome: 'Afundo com impulso controlado', desc: 'Afundo normal — adiciona um pequeno impulso a partir da semana 2.', exId: 'afundo_impulso' },
  prancha_lateral: { nome: 'Prancha lateral', desc: 'Apoio no antebraço, corpo alinhado, mantém a posição.', exId: 'prancha_lateral' },
  prancha_perna: { nome: 'Prancha com elevação de perna', desc: 'Prancha frontal, eleva uma perna de cada vez sem rodar o quadril.', exId: 'prancha_perna' },
  ponte_unilateral: { nome: 'Ponte a uma perna', desc: 'Deitado, uma perna estendida, eleva o quadril com a outra perna apoiada.', exId: 'ponte_unilateral' },
  step_up: { nome: 'Step-up com tempo sob tensão', desc: 'Sobe a um banco/step controlando bem a descida (3s).', exId: 'step_up' },
  core_antirrotacao: { nome: 'Core anti-rotação (dead bug)', desc: 'Deitado, braço e perna opostos estendem lentamente sem deixar as costas arquear.', exId: 'core_antirrotacao' },
  sentadilha_salto: { nome: 'Sentadilha com salto', desc: 'Sentadilha normal, explode para um salto vertical no topo.', exId: 'sentadilha_salto' },
  step_up_rapido: { nome: 'Step-up rápido', desc: 'Mesmo step-up, agora em ritmo explosivo.', exId: 'step_up_rapido' },
  nordico: { nome: 'Nórdico (isquiotibiais)', desc: 'Ajoelhado, tornozelos fixos, desce o tronco controlando com os isquiotibiais.', exId: 'nordico' },
  mobilidade_tornozelo: { nome: 'Mobilidade de tornozelo', desc: 'Agachamento na parede, joelho à frente do pé, sente o alongamento no tornozelo.', exId: 'mobilidade_tornozelo' },
  skip_baixo: { nome: 'Skipping baixo', desc: 'Corrida no lugar com joelhos a meia altura, ritmo controlado.', exId: 'skip_baixo' },
  skip_alto: { nome: 'Skipping alto', desc: 'Joelhos sobem até à cintura, braços ativos.', exId: 'skip_alto' },
  mudanca_direcao: { nome: 'Mudança de direção em "Z"', desc: 'Corre 5m, corta 45°, repete em zig-zag.', exId: 'mudanca_direcao' },
  escada_agilidade: { nome: 'Escada de agilidade', desc: 'Usa linhas do campo ou marcas no chão — passos rápidos in-in-out-out.', exId: 'escada_agilidade' },
  sprint: { nome: 'Sprint', desc: 'Esforço máximo na distância indicada, recuperação completa entre repetições.', exId: 'sprint' },
  saltos_verticais: { nome: 'Saltos verticais', desc: 'Salto explosivo a partir de posição parada, aterragem suave.', exId: 'saltos_verticais' },
  ativacao_prejogo: { nome: 'Ativação pré-jogo', desc: 'Mobilidade + skips leves + 2-3 sprints curtos para preparar o corpo.', exId: 'ativacao_prejogo' },
};

function gerarFase1() {
  const semanas = [];
  for (let s = 1; s <= 4; s++) {
    const seriesForc = s === 1 ? 2 : 3;
    const repsForc = s <= 2 ? '8-10' : '10-12';
    const corridaMin = 20 + (s - 1) * 5;
    semanas.push({
      semana: s,
      sessoes: [
        {
          dia: 'Segunda-feira',
          tipo: 'Força',
          duracao: '35-40 min',
          exercicios: [
            { ...EX.sentadilha_bulgara, series: seriesForc, reps: `${repsForc} por perna` },
            { ...EX.afundo_impulso, series: seriesForc, reps: `${repsForc} por perna` },
            { ...EX.prancha_lateral, series: seriesForc, reps: '30-40s por lado' },
            { ...EX.ponte_unilateral, series: seriesForc, reps: `${repsForc} por perna` },
            { ...EX.step_up, series: seriesForc, reps: `${repsForc} por perna` },
          ],
        },
        {
          dia: 'Terça-feira',
          tipo: 'Corrida',
          duracao: `${corridaMin} min`,
          exercicios: [
            { nome: 'Corrida contínua', desc: 'Ritmo Zona 2 — confortável, capaz de manter conversa.', series: 1, reps: `${corridaMin} minutos`, exId: 'corrida_continua' },
          ],
        },
        {
          dia: 'Quinta-feira',
          tipo: 'Mobilidade & Core',
          duracao: '20-25 min',
          exercicios: [
            { ...EX.mobilidade_tornozelo, series: 2, reps: '8 por lado' },
            { ...EX.prancha_perna, series: 3, reps: '8 por lado' },
            { ...EX.core_antirrotacao, series: 3, reps: '10 por lado' },
            { ...EX.ponte_unilateral, series: 2, reps: '10 por perna' },
          ],
        },
        {
          dia: 'Sexta-feira',
          tipo: 'Velocidade & Agilidade',
          duracao: '30 min',
          exercicios: [
            { ...EX.skip_baixo, series: 3, reps: '20s' },
            { ...EX.skip_alto, series: 3, reps: '20s' },
            { ...EX.mudanca_direcao, series: 4, reps: '1 repetição' },
            { ...EX.prancha_perna, series: 2, reps: '8 por lado' },
          ],
        },
      ],
    });
  }
  return semanas;
}

function gerarFase2() {
  const semanas = [];
  const intervalos = ['30s/30s', '30s/30s', '25s/35s', '20s/40s', '20s/40s'];
  for (let s = 1; s <= 5; s++) {
    semanas.push({
      semana: s,
      sessoes: [
        {
          dia: 'Segunda-feira',
          tipo: 'Força explosiva',
          duracao: '35-40 min',
          exercicios: [
            { ...EX.sentadilha_salto, series: 4, reps: '8-10' },
            { ...EX.step_up_rapido, series: 4, reps: '10 por perna' },
            { ...EX.core_antirrotacao, series: 3, reps: '12 por lado' },
            { ...EX.prancha_perna, series: 3, reps: '10 por lado' },
            { ...EX.saltos_verticais, series: 3, reps: '6-8' },
          ],
        },
        {
          dia: 'Terça-feira',
          tipo: 'Resistência tipo-jogo',
          duracao: '30 min',
          exercicios: [
            { nome: `Intervalos ${intervalos[s - 1]}`, desc: 'Corrida forte / recuperação ativa, repete durante a sessão.', series: 8, reps: intervalos[s - 1], exId: 'intervalos' },
          ],
        },
        {
          dia: 'Quinta-feira',
          tipo: 'Mobilidade & Core',
          duracao: '20-25 min',
          exercicios: [
            { ...EX.mobilidade_tornozelo, series: 3, reps: '8 por lado' },
            { ...EX.prancha_perna, series: 3, reps: '10 por lado' },
            { ...EX.core_antirrotacao, series: 3, reps: '12 por lado' },
            { ...EX.ponte_unilateral, series: 2, reps: '12 por perna' },
          ],
        },
        {
          dia: 'Sexta-feira',
          tipo: 'Velocidade, Agilidade & Pliometria',
          duracao: '35-40 min',
          exercicios: [
            { ...EX.sprint, series: 5, reps: '15-20m' },
            { ...EX.mudanca_direcao, series: 5, reps: '1 repetição' },
            { ...EX.escada_agilidade, series: 4, reps: '20-30s' },
            { ...EX.saltos_verticais, series: 3, reps: '6-8' },
          ],
        },
      ],
    });
  }
  return semanas;
}

function gerarFase3() {
  const semanas = [];
  for (let s = 1; s <= 4; s++) {
    semanas.push({
      semana: s,
      sessoes: [
        {
          dia: 'Segunda-feira',
          tipo: 'Prevenção & Mobilidade',
          duracao: '15-20 min',
          exercicios: [
            { ...EX.nordico, series: 3, reps: '6-8' },
            { ...EX.mobilidade_tornozelo, series: 3, reps: '8 por lado' },
            { ...EX.ponte_unilateral, series: 2, reps: '12 por lado' },
            { ...EX.prancha_lateral, series: 2, reps: '30s por lado' },
          ],
        },
        {
          dia: 'Quinta-feira',
          tipo: 'Ativação & Recuperação',
          duracao: '15-20 min',
          exercicios: [
            { ...EX.ativacao_prejogo, series: 1, reps: 'Sequência completa' },
            { ...EX.skip_baixo, series: 2, reps: '20s' },
            { ...EX.mobilidade_tornozelo, series: 2, reps: '8 por lado' },
          ],
        },
      ],
    });
  }
  return semanas;
}

export const PLANO = {
  fase1: gerarFase1(),
  fase2: gerarFase2(),
  fase3: gerarFase3(),
};

export const TIPO_ICON = {
  'Força': '◆',
  'Força explosiva': '◆',
  'Velocidade & Agilidade': '▲',
  'Velocidade, Agilidade & Pliometria': '▲',
  'Corrida': '●',
  'Resistência tipo-jogo': '●',
  'Mobilidade & Core': '✦',
  'Prevenção & Mobilidade': '✦',
  'Ativação & Recuperação': '✦',
  'Atividade alternativa': '★',
};

export const DIAS_SEMANA = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];

export function hojeNomeDia() {
  return DIAS_SEMANA[new Date().getDay()];
}

export function sessionKey(faseId, semana, diaIdx) {
  return `${faseId}-s${semana}-d${diaIdx}`;
}

export function totalSessions() {
  let total = 0;
  PHASES.forEach((f) => {
    PLANO[f.id].forEach((sem) => {
      total += sem.sessoes.length;
    });
  });
  return total;
}
