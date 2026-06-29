import React from 'react';

// Figura de bastão estilizada — consistente em todas as ilustrações.
// Usa stroke da cor passada por prop para se adaptar à cor da fase ativa.

const STROKE_W = 4.5;

function Stick({ children, color = '#F8F7F2' }) {
  return (
    <svg viewBox="0 0 120 120" style={{ width: '100%', height: '100%' }}>
      <g
        stroke={color}
        strokeWidth={STROKE_W}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      >
        {children}
      </g>
    </svg>
  );
}

function Head({ cx, cy, color }) {
  return <circle cx={cx} cy={cy} r="7" fill={color} stroke="none" />;
}

// ===================== ILUSTRAÇÕES =====================

export function IlustSentadilhaBulgara({ color }) {
  return (
    <Stick color={color}>
      <Head cx="50" cy="28" color={color} />
      {/* tronco inclinado ligeiramente */}
      <path d="M50 35 L56 62" />
      {/* perna de trás apoiada no banco */}
      <rect x="78" y="58" width="22" height="6" rx="2" fill={color} stroke="none" opacity="0.5" />
      <path d="M56 62 L70 58 L82 60" />
      {/* perna da frente flexionada */}
      <path d="M56 62 L42 78 L38 100" />
      {/* braços */}
      <path d="M50 40 L34 50" />
      <path d="M52 40 L66 48" />
    </Stick>
  );
}

export function IlustAfundoImpulso({ color }) {
  return (
    <Stick color={color}>
      <Head cx="46" cy="26" color={color} />
      <path d="M46 33 L52 58" />
      {/* perna da frente */}
      <path d="M52 58 L38 76 L34 100" />
      {/* perna de trás estendida */}
      <path d="M52 58 L70 72 L86 70" />
      {/* braços em equilíbrio */}
      <path d="M48 38 L30 44" />
      <path d="M50 38 L66 30" />
      {/* seta de impulso */}
      <path d="M90 30 L96 20 L90 24" opacity="0.6" />
    </Stick>
  );
}

export function IlustPranchaLateral({ color }) {
  return (
    <Stick color={color}>
      <Head cx="22" cy="58" color={color} />
      {/* corpo alinhado horizontal */}
      <path d="M28 60 L95 64" />
      {/* apoio no antebraço */}
      <path d="M40 60 L40 80 L52 84" />
      {/* perna apoiada */}
      <path d="M95 64 L100 90" />
      {/* perna de cima ligeiramente levantada */}
      <path d="M88 62 L100 78" opacity="0.6" />
      {/* braço de cima */}
      <path d="M50 56 L40 38" />
    </Stick>
  );
}

export function IlustPranchaPerna({ color }) {
  return (
    <Stick color={color}>
      <Head cx="20" cy="42" color={color} />
      {/* prancha frontal vista de lado */}
      <path d="M26 44 L95 50" />
      <path d="M40 46 L40 80" />
      <path d="M70 48 L72 80" />
      {/* perna elevada */}
      <path d="M95 50 L100 30" opacity="0.7" />
    </Stick>
  );
}

export function IlustPonteUnilateral({ color }) {
  return (
    <Stick color={color}>
      {/* corpo deitado, quadril elevado */}
      <Head cx="20" cy="70" color={color} />
      <path d="M26 70 L60 58 L80 70" />
      {/* perna apoiada flexionada */}
      <path d="M80 70 L84 92" />
      {/* perna estendida no ar */}
      <path d="M60 58 L88 50" opacity="0.7" />
      <path d="M26 70 L20 90" opacity="0.4" />
    </Stick>
  );
}

export function IlustStepUp({ color }) {
  return (
    <Stick color={color}>
      <rect x="55" y="80" width="35" height="14" rx="2" fill={color} stroke="none" opacity="0.5" />
      <Head cx="60" cy="24" color={color} />
      <path d="M60 31 L62 56" />
      {/* perna a subir no step */}
      <path d="M62 56 L70 80" />
      {/* perna de apoio no chão */}
      <path d="M62 56 L48 90 L44 108" />
      <path d="M58 34 L44 44" />
      <path d="M62 34 L76 42" />
    </Stick>
  );
}

export function IlustCoreAntirrotacao({ color }) {
  return (
    <Stick color={color}>
      {/* deitado de costas, vista de cima estilizada */}
      <Head cx="60" cy="22" color={color} />
      <path d="M60 29 L60 70" />
      {/* braço e perna opostos estendidos */}
      <path d="M60 38 L30 30" />
      <path d="M60 38 L90 46" opacity="0.4" />
      <path d="M60 70 L90 78" />
      <path d="M60 70 L30 88" opacity="0.4" />
    </Stick>
  );
}

export function IlustSentadilhaSalto({ color }) {
  return (
    <Stick color={color}>
      <Head cx="55" cy="18" color={color} />
      <path d="M55 25 L55 48" />
      <path d="M55 48 L40 70 L36 92" />
      <path d="M55 48 L70 70 L74 92" />
      <path d="M55 30 L36 40" />
      <path d="M55 30 L74 40" />
      {/* linhas de impulso a indicar salto */}
      <path d="M30 14 L34 22" opacity="0.5" />
      <path d="M80 14 L76 22" opacity="0.5" />
      <path d="M55 4 L55 12" opacity="0.5" />
    </Stick>
  );
}

export function IlustStepUpRapido({ color }) {
  return (
    <Stick color={color}>
      <rect x="55" y="78" width="35" height="14" rx="2" fill={color} stroke="none" opacity="0.5" />
      <Head cx="62" cy="20" color={color} />
      <path d="M62 27 L64 52" />
      <path d="M64 52 L74 78" />
      <path d="M64 52 L50 86 L46 105" />
      <path d="M60 30 L44 36" />
      <path d="M64 30 L80 36" />
      <path d="M30 50 L40 50" opacity="0.5" />
      <path d="M30 50 L36 45" opacity="0.5" />
      <path d="M30 50 L36 55" opacity="0.5" />
    </Stick>
  );
}

export function IlustNordico({ color }) {
  return (
    <Stick color={color}>
      {/* ajoelhado, tronco inclinado para a frente */}
      <Head cx="78" cy="48" color={color} />
      <path d="M75 53 L48 70" />
      {/* tornozelos fixos */}
      <path d="M48 70 L48 95" />
      <rect x="40" y="93" width="18" height="6" rx="2" fill={color} stroke="none" opacity="0.5" />
      {/* braços à frente em equilíbrio */}
      <path d="M70 56 L50 50" />
      <path d="M72 58 L56 64" opacity="0.6" />
    </Stick>
  );
}

export function IlustMobilidadeTornozelo({ color }) {
  return (
    <Stick color={color}>
      {/* agachamento na parede */}
      <line x1="95" y1="10" x2="95" y2="105" opacity="0.3" />
      <Head cx="58" cy="28" color={color} />
      <path d="M58 35 L60 58" />
      <path d="M60 58 L48 80 L46 100" />
      <path d="M60 58 L80 75 L90 98" />
      <path d="M56 40 L40 48" />
      <path d="M60 40 L70 30" />
    </Stick>
  );
}

export function IlustSkipBaixo({ color }) {
  return (
    <Stick color={color}>
      <Head cx="55" cy="20" color={color} />
      <path d="M55 27 L55 52" />
      {/* joelho elevado a meia altura */}
      <path d="M55 52 L42 64 L46 80" />
      <path d="M55 52 L66 78 L70 98" />
      <path d="M52 32 L38 40" />
      <path d="M58 32 L72 26" />
    </Stick>
  );
}

export function IlustSkipAlto({ color }) {
  return (
    <Stick color={color}>
      <Head cx="55" cy="18" color={color} />
      <path d="M55 25 L55 48" />
      {/* joelho até à cintura */}
      <path d="M55 48 L40 50 L42 70" />
      <path d="M55 48 L68 76 L72 98" />
      <path d="M52 30 L36 36" />
      <path d="M58 30 L74 22" />
    </Stick>
  );
}

export function IlustMudancaDirecao({ color }) {
  return (
    <Stick color={color}>
      <Head cx="48" cy="40" color={color} />
      <path d="M48 47 L54 68" />
      <path d="M54 68 L40 86 L34 102" />
      <path d="M54 68 L70 80 L82 90" />
      <path d="M46 50 L30 56" />
      <path d="M50 50 L66 44" />
      {/* trajetória em zig-zag */}
      <path d="M85 20 L95 35 L88 50" opacity="0.5" strokeDasharray="3 3" />
    </Stick>
  );
}

export function IlustEscadaAgilidade({ color }) {
  return (
    <Stick color={color}>
      {/* linhas da escada no chão */}
      <line x1="20" y1="98" x2="100" y2="98" opacity="0.5" />
      <line x1="35" y1="98" x2="35" y2="106" opacity="0.5" />
      <line x1="55" y1="98" x2="55" y2="106" opacity="0.5" />
      <line x1="75" y1="98" x2="75" y2="106" opacity="0.5" />
      <line x1="95" y1="98" x2="95" y2="106" opacity="0.5" />
      <Head cx="55" cy="30" color={color} />
      <path d="M55 37 L55 60" />
      <path d="M55 60 L44 78 L40 95" />
      <path d="M55 60 L66 76 L72 92" />
      <path d="M52 42 L38 50" />
      <path d="M58 42 L72 36" />
    </Stick>
  );
}

export function IlustSprint({ color }) {
  return (
    <Stick color={color}>
      <Head cx="38" cy="32" color={color} />
      {/* tronco inclinado para a frente */}
      <path d="M40 38 L58 56" />
      <path d="M58 56 L48 80 L52 100" />
      <path d="M58 56 L80 64 L92 58" />
      <path d="M42 42 L26 36" />
      <path d="M48 46 L62 36" />
      {/* linhas de velocidade */}
      <path d="M10 50 L24 50" opacity="0.5" />
      <path d="M6 60 L20 60" opacity="0.5" />
    </Stick>
  );
}

export function IlustSaltosVerticais({ color }) {
  return (
    <Stick color={color}>
      <Head cx="55" cy="14" color={color} />
      <path d="M55 21 L55 44" />
      <path d="M55 44 L46 66 L48 88" />
      <path d="M55 44 L64 66 L62 88" />
      <path d="M52 24 L38 16" />
      <path d="M58 24 L72 16" />
      <path d="M30 30 L36 36" opacity="0.5" />
      <path d="M80 30 L74 36" opacity="0.5" />
    </Stick>
  );
}

export function IlustAtivacaoPrejogo({ color }) {
  return (
    <Stick color={color}>
      <Head cx="40" cy="24" color={color} />
      <path d="M40 31 L42 56" />
      <path d="M42 56 L30 76 L26 96" />
      <path d="M42 56 L56 72 L60 92" />
      <path d="M38 36 L24 30" />
      <path d="M44 36 L58 44" />
      {/* bola simbólica */}
      <circle cx="85" cy="80" r="10" fill="none" />
      <path d="M78 76 L92 84" opacity="0.5" />
    </Stick>
  );
}

export function IlustCorridaContinua({ color }) {
  return (
    <Stick color={color}>
      <Head cx="42" cy="28" color={color} />
      <path d="M44 34 L58 54" />
      <path d="M58 54 L46 74 L50 96" />
      <path d="M58 54 L76 64 L84 82" />
      <path d="M46 38 L32 48" />
      <path d="M50 40 L64 32" />
      <path d="M14 70 L26 70" opacity="0.4" />
      <path d="M10 80 L22 80" opacity="0.4" />
    </Stick>
  );
}

export function IlustIntervalos({ color }) {
  return (
    <Stick color={color}>
      <Head cx="44" cy="26" color={color} />
      <path d="M46 32 L60 52" />
      <path d="M60 52 L48 72 L52 94" />
      <path d="M60 52 L78 62 L88 80" />
      <path d="M48 36 L34 46" />
      <path d="M52 38 L66 30" />
      {/* indicador de intervalo (relógio simplificado) */}
      <circle cx="95" cy="20" r="12" />
      <path d="M95 14 L95 20 L100 24" />
    </Stick>
  );
}

export const ILLUSTRATIONS = {
  sentadilha_bulgara: IlustSentadilhaBulgara,
  afundo_impulso: IlustAfundoImpulso,
  prancha_lateral: IlustPranchaLateral,
  prancha_perna: IlustPranchaPerna,
  ponte_unilateral: IlustPonteUnilateral,
  step_up: IlustStepUp,
  core_antirrotacao: IlustCoreAntirrotacao,
  sentadilha_salto: IlustSentadilhaSalto,
  step_up_rapido: IlustStepUpRapido,
  nordico: IlustNordico,
  mobilidade_tornozelo: IlustMobilidadeTornozelo,
  skip_baixo: IlustSkipBaixo,
  skip_alto: IlustSkipAlto,
  mudanca_direcao: IlustMudancaDirecao,
  escada_agilidade: IlustEscadaAgilidade,
  sprint: IlustSprint,
  saltos_verticais: IlustSaltosVerticais,
  ativacao_prejogo: IlustAtivacaoPrejogo,
  corrida_continua: IlustCorridaContinua,
  intervalos: IlustIntervalos,
};

export function ExerciseIllustration({ exId, color = '#E8B33D', size = 64 }) {
  const Comp = ILLUSTRATIONS[exId];
  if (!Comp) return null;
  return (
    <div style={{ width: size, height: size, flexShrink: 0 }}>
      <Comp color={color} />
    </div>
  );
}
