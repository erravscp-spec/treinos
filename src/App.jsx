import React, { useState, useMemo } from 'react';
import { PHASES, PLANO, TIPO_ICON, hojeNomeDia, sessionKey, totalSessions } from './data';
import { useProgress, useMetrics } from './useFirebaseData';
import MetricsView from './MetricsView';
import { ExerciseIllustration } from './illustrations/exerciseIllustrations';

export default function App() {
  const { progress, loaded, error, toggleSession, setAlternativa } = useProgress();
  const metricsData = useMetrics();

  const [activePhase, setActivePhase] = useState('fase1');
  const [activeWeek, setActiveWeek] = useState(1);
  const [view, setView] = useState('plano'); // 'plano' | 'historico' | 'metricas'
  const [expandedSession, setExpandedSession] = useState(null);
  const [altModal, setAltModal] = useState(null); // { key } quando aberto
  const [altText, setAltText] = useState('');

  const completedCount = Object.keys(progress).length;
  const total = useMemo(() => totalSessions(), []);
  const pct = total ? Math.round((completedCount / total) * 100) : 0;

  const currentPhase = PHASES.find((f) => f.id === activePhase);
  const currentWeeks = PLANO[activePhase];
  const currentWeekData = currentWeeks.find((w) => w.semana === activeWeek);
  const today = hojeNomeDia();

  const phaseStats = PHASES.map((f) => {
    let done = 0;
    let totalF = 0;
    PLANO[f.id].forEach((sem) => {
      sem.sessoes.forEach((_, idx) => {
        totalF += 1;
        if (progress[sessionKey(f.id, sem.semana, idx)]) done += 1;
      });
    });
    return { ...f, done, totalF };
  });

  const openAltModal = (key) => {
    setAltText('');
    setAltModal(key);
  };

  const confirmAlt = () => {
    if (altModal) {
      setAlternativa(altModal, altText.trim() || 'Atividade alternativa');
      setAltModal(null);
    }
  };

  if (!loaded) {
    return (
      <div style={styles.app}>
        <div style={styles.loadingWrap}>A carregar plano…</div>
      </div>
    );
  }

  return (
    <div style={styles.app}>
      <style>{globalCss}</style>

      <header style={styles.header}>
        <div style={styles.headerInner}>
          <div>
            <div style={styles.eyebrow}>Pré-Época · 2026</div>
            <h1 style={styles.title}>Plano de Jogo</h1>
          </div>
          <FieldProgress pct={pct} />
        </div>
        <nav style={styles.nav}>
          <button style={view === 'plano' ? styles.navBtnActive : styles.navBtn} onClick={() => setView('plano')}>Plano</button>
          <button style={view === 'historico' ? styles.navBtnActive : styles.navBtn} onClick={() => setView('historico')}>Histórico</button>
          <button style={view === 'metricas' ? styles.navBtnActive : styles.navBtn} onClick={() => setView('metricas')}>Métricas</button>
        </nav>
      </header>

      {error && (
        <div style={styles.errorBanner}>
          Problema de ligação à base de dados: {error}
        </div>
      )}

      {view === 'plano' && (
        <main style={styles.main}>
          <div style={styles.phaseRow}>
            {PHASES.map((f) => (
              <button
                key={f.id}
                onClick={() => { setActivePhase(f.id); setActiveWeek(1); setExpandedSession(null); }}
                style={{
                  ...styles.phaseTab,
                  borderColor: activePhase === f.id ? f.cor : 'transparent',
                  background: activePhase === f.id ? 'rgba(255,255,255,0.06)' : 'transparent',
                }}
              >
                <span style={{ ...styles.phaseNum, color: f.cor }}>0{f.numero}</span>
                <span style={styles.phaseName}>{f.nome}</span>
                <span style={styles.phasePeriod}>{f.periodo}</span>
              </button>
            ))}
          </div>

          <p style={styles.phaseObjetivo}>{currentPhase.objetivo}</p>

          <div style={styles.weekRow}>
            {currentWeeks.map((w) => {
              const sessDone = w.sessoes.filter((_, idx) => progress[sessionKey(activePhase, w.semana, idx)]).length;
              const weekComplete = sessDone === w.sessoes.length;
              return (
                <button
                  key={w.semana}
                  onClick={() => { setActiveWeek(w.semana); setExpandedSession(null); }}
                  style={{
                    ...styles.weekChip,
                    ...(activeWeek === w.semana ? styles.weekChipActive : {}),
                    ...(weekComplete ? { borderColor: currentPhase.cor } : {}),
                  }}
                >
                  S{w.semana}{weekComplete && <span style={styles.weekCheck}>✓</span>}
                </button>
              );
            })}
          </div>

          <div style={styles.sessionList}>
            {currentWeekData.sessoes.map((sess, idx) => {
              const key = sessionKey(activePhase, activeWeek, idx);
              const entry = progress[key];
              const done = !!entry;
              const isAlt = !!(entry && entry.alternativa);
              const isExpanded = expandedSession === idx;
              const isToday = sess.dia === today;
              return (
                <div
                  key={idx}
                  style={{
                    ...styles.sessionCard,
                    borderColor: done ? currentPhase.cor : (isToday ? '#E8B33D' : 'rgba(255,255,255,0.08)'),
                    borderWidth: isToday && !done ? 2 : 1.5,
                  }}
                >
                  <div style={styles.sessionHeader} onClick={() => setExpandedSession(isExpanded ? null : idx)}>
                    <div style={styles.sessionHeaderLeft}>
                      <span style={{ ...styles.sessionIcon, color: currentPhase.cor }}>
                        {isAlt ? TIPO_ICON['Atividade alternativa'] : (TIPO_ICON[sess.tipo] || '●')}
                      </span>
                      <div>
                        <div style={styles.sessionDia}>{sess.dia}{isToday && !done ? ' · Hoje' : ''}</div>
                        <div style={styles.sessionTipo}>{isAlt ? entry.descricao : sess.tipo}</div>
                        {isAlt && <div style={styles.altLabel}>em vez de: {sess.tipo}</div>}
                      </div>
                    </div>
                    <div style={styles.sessionHeaderRight}>
                      <span style={styles.sessionDuracao}>{sess.duracao}</span>
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleSession(key); }}
                        style={{
                          ...styles.checkBtn,
                          background: done ? currentPhase.cor : 'transparent',
                          borderColor: done ? currentPhase.cor : 'rgba(255,255,255,0.3)',
                        }}
                        aria-label={done ? 'Marcar como não feito' : 'Marcar como feito'}
                      >
                        {done ? '✓' : ''}
                      </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div style={styles.exerciseList}>
                      {sess.exercicios.map((ex, exIdx) => (
                        <div key={exIdx} style={styles.exerciseRow}>
                          <ExerciseIllustration exId={ex.exId} color={currentPhase.cor} size={56} />
                          <div style={styles.exerciseInfo}>
                            <div style={styles.exerciseNome}>{ex.nome}</div>
                            <div style={styles.exerciseDesc}>{ex.desc}</div>
                          </div>
                          <div style={styles.exerciseSeries}>
                            <span style={styles.exerciseSeriesNum}>{ex.series}×</span>
                            <span style={styles.exerciseReps}>{ex.reps}</span>
                          </div>
                        </div>
                      ))}
                      {!done && (
                        <button style={styles.altBtn} onClick={() => openAltModal(key)}>
                          ★ Fiz outra coisa em vez disto
                        </button>
                      )}
                      {isAlt && (
                        <button style={styles.altBtnUndo} onClick={() => toggleSession(key)}>
                          Remover marcação
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </main>
      )}

      {view === 'historico' && (
        <main style={styles.main}>
          <div style={styles.histSummary}>
            <div style={styles.histSummaryNum}>{completedCount}</div>
            <div style={styles.histSummaryLabel}>sessões concluídas de {total}</div>
          </div>

          {completedCount === 0 ? (
            <div style={styles.emptyState}>
              Ainda não marcaste nenhuma sessão como feita. Vai ao separador "Plano" e começa pela Semana 1.
            </div>
          ) : (
            phaseStats.map((f) => (
              <div key={f.id} style={styles.histPhaseBlock}>
                <div style={styles.histPhaseHeader}>
                  <span style={{ ...styles.phaseNum, color: f.cor }}>0{f.numero}</span>
                  <span style={styles.phaseName}>{f.nome}</span>
                  <span style={styles.histPhaseCount}>{f.done}/{f.totalF}</span>
                </div>
                <div style={styles.histBarTrack}>
                  <div style={{ ...styles.histBarFill, width: `${f.totalF ? (f.done / f.totalF) * 100 : 0}%`, background: f.cor }} />
                </div>
                <div style={styles.histWeeksGrid}>
                  {PLANO[f.id].map((w) => (
                    <div key={w.semana} style={styles.histWeekItem}>
                      <div style={styles.histWeekLabel}>S{w.semana}</div>
                      <div style={styles.histWeekDots}>
                        {w.sessoes.map((_, idx) => {
                          const doneSess = !!progress[sessionKey(f.id, w.semana, idx)];
                          const isAltSess = doneSess && progress[sessionKey(f.id, w.semana, idx)].alternativa;
                          return (
                            <span
                              key={idx}
                              title={isAltSess ? 'Atividade alternativa' : undefined}
                              style={{
                                ...styles.histDot,
                                background: doneSess ? f.cor : 'transparent',
                                borderColor: doneSess ? f.cor : 'rgba(255,255,255,0.25)',
                                borderStyle: isAltSess ? 'dashed' : 'solid',
                              }}
                            />
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </main>
      )}

      {view === 'metricas' && (
        <main style={styles.main}>
          <MetricsView {...metricsData} />
        </main>
      )}

      {altModal && (
        <div style={styles.modalOverlay} onClick={() => setAltModal(null)}>
          <div style={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalTitle}>O que fizeste em vez do treino?</div>
            <input
              autoFocus
              type="text"
              placeholder="Ex: Futebol extra, caminhada longa…"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              style={styles.modalInput}
            />
            <div style={styles.modalActions}>
              <button style={styles.modalCancelBtn} onClick={() => setAltModal(null)}>Cancelar</button>
              <button style={styles.modalConfirmBtn} onClick={confirmAlt}>Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FieldProgress({ pct }) {
  return (
    <div style={styles.fieldWrap} title={`${pct}% do plano concluído`}>
      <svg viewBox="0 0 120 80" style={styles.fieldSvg}>
        <rect x="2" y="2" width="116" height="76" rx="3" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
        <line x1="60" y1="2" x2="60" y2="78" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
        <circle cx="60" cy="40" r="10" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
        <rect x="2" y="22" width="14" height="36" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
        <rect x="104" y="22" width="14" height="36" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
        <defs>
          <clipPath id="fillClip"><rect x="2" y="2" width={(116 * pct) / 100} height="76" /></clipPath>
        </defs>
        <rect x="2" y="2" width="116" height="76" fill="#E8B33D" opacity="0.85" clipPath="url(#fillClip)" />
      </svg>
      <span style={styles.fieldPct}>{pct}%</span>
    </div>
  );
}

const globalCss = `
  * { box-sizing: border-box; }
  body { margin: 0; }
  button { font-family: inherit; cursor: pointer; }
  ::selection { background: #E8B33D; color: #1B4332; }
`;

const styles = {
  app: { minHeight: '100vh', background: '#1B4332', color: '#F8F7F2', fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", paddingBottom: 48 },
  loadingWrap: { padding: 40, textAlign: 'center', color: 'rgba(248,247,242,0.6)' },
  errorBanner: { maxWidth: 640, margin: '12px auto 0', padding: '10px 16px', background: 'rgba(193,57,43,0.15)', border: '1px solid rgba(193,57,43,0.4)', borderRadius: 8, fontSize: 13, color: '#F3C9C3' },
  header: { padding: '28px 20px 0', borderBottom: '1px solid rgba(255,255,255,0.08)' },
  headerInner: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', maxWidth: 640, margin: '0 auto' },
  eyebrow: { fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#E8B33D', fontWeight: 600, marginBottom: 4 },
  title: { fontFamily: "'Oswald', 'Arial Narrow', sans-serif", fontSize: 32, fontWeight: 600, letterSpacing: '0.01em', margin: 0, textTransform: 'uppercase' },
  fieldWrap: { position: 'relative', width: 96, height: 64, flexShrink: 0 },
  fieldSvg: { width: '100%', height: '100%', borderRadius: 4 },
  fieldPct: { position: 'absolute', bottom: -20, right: 0, fontSize: 12, fontWeight: 700, color: '#E8B33D' },
  nav: { display: 'flex', gap: 4, maxWidth: 640, margin: '24px auto 0' },
  navBtn: { background: 'none', border: 'none', color: 'rgba(248,247,242,0.5)', fontSize: 14, fontWeight: 600, padding: '10px 4px', marginRight: 24, borderBottom: '2px solid transparent' },
  navBtnActive: { background: 'none', border: 'none', color: '#F8F7F2', fontSize: 14, fontWeight: 600, padding: '10px 4px', marginRight: 24, borderBottom: '2px solid #E8B33D' },
  main: { maxWidth: 640, margin: '0 auto', padding: '24px 20px' },
  phaseRow: { display: 'flex', gap: 8, marginBottom: 16 },
  phaseTab: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2, padding: '12px 10px', borderRadius: 8, border: '1.5px solid transparent', color: '#F8F7F2', textAlign: 'left' },
  phaseNum: { fontFamily: "'Oswald', sans-serif", fontSize: 13, fontWeight: 700 },
  phaseName: { fontSize: 13, fontWeight: 600 },
  phasePeriod: { fontSize: 10.5, color: 'rgba(248,247,242,0.5)' },
  phaseObjetivo: { fontSize: 13.5, lineHeight: 1.5, color: 'rgba(248,247,242,0.75)', margin: '0 0 20px' },
  weekRow: { display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4, marginBottom: 20 },
  weekChip: { flexShrink: 0, background: 'rgba(255,255,255,0.05)', border: '1.5px solid rgba(255,255,255,0.1)', color: 'rgba(248,247,242,0.7)', borderRadius: 20, padding: '6px 14px', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 },
  weekChipActive: { background: 'rgba(255,255,255,0.12)', color: '#F8F7F2' },
  weekCheck: { fontSize: 11 },
  sessionList: { display: 'flex', flexDirection: 'column', gap: 10 },
  sessionCard: { background: 'rgba(255,255,255,0.04)', border: '1.5px solid rgba(255,255,255,0.08)', borderRadius: 10, overflow: 'hidden' },
  sessionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', cursor: 'pointer' },
  sessionHeaderLeft: { display: 'flex', alignItems: 'center', gap: 12 },
  sessionIcon: { fontSize: 16, width: 20, textAlign: 'center' },
  sessionDia: { fontSize: 11, color: 'rgba(248,247,242,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em' },
  sessionTipo: { fontSize: 14.5, fontWeight: 600 },
  altLabel: { fontSize: 11, color: 'rgba(248,247,242,0.45)', marginTop: 1 },
  sessionHeaderRight: { display: 'flex', alignItems: 'center', gap: 14 },
  sessionDuracao: { fontSize: 12.5, color: 'rgba(248,247,242,0.5)' },
  checkBtn: { width: 28, height: 28, borderRadius: '50%', border: '1.5px solid rgba(255,255,255,0.3)', color: '#1B4332', fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  exerciseList: { borderTop: '1px solid rgba(255,255,255,0.08)', padding: '4px 16px 12px' },
  exerciseRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' },
  exerciseInfo: { flex: 1 },
  exerciseNome: { fontSize: 13.5, fontWeight: 600, marginBottom: 2 },
  exerciseDesc: { fontSize: 12, color: 'rgba(248,247,242,0.55)', lineHeight: 1.4 },
  exerciseSeries: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', flexShrink: 0, minWidth: 64 },
  exerciseSeriesNum: { fontSize: 14, fontWeight: 700, color: '#E8B33D' },
  exerciseReps: { fontSize: 11.5, color: 'rgba(248,247,242,0.6)' },
  altBtn: { marginTop: 8, width: '100%', padding: '9px 0', borderRadius: 8, border: '1px dashed rgba(232,179,61,0.5)', color: '#E8B33D', fontSize: 12.5, fontWeight: 600, background: 'rgba(232,179,61,0.08)' },
  altBtnUndo: { marginTop: 8, width: '100%', padding: '9px 0', borderRadius: 8, border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(248,247,242,0.6)', fontSize: 12.5, fontWeight: 600 },
  histSummary: { textAlign: 'center', padding: '20px 0 32px' },
  histSummaryNum: { fontFamily: "'Oswald', sans-serif", fontSize: 56, fontWeight: 700, color: '#E8B33D', lineHeight: 1 },
  histSummaryLabel: { fontSize: 13, color: 'rgba(248,247,242,0.6)', marginTop: 6 },
  emptyState: { textAlign: 'center', padding: '24px 20px', color: 'rgba(248,247,242,0.5)', fontSize: 13.5, lineHeight: 1.5 },
  histPhaseBlock: { marginBottom: 28 },
  histPhaseHeader: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 },
  histPhaseCount: { marginLeft: 'auto', fontSize: 13, color: 'rgba(248,247,242,0.5)', fontWeight: 600 },
  histBarTrack: { height: 6, borderRadius: 4, background: 'rgba(255,255,255,0.08)', overflow: 'hidden', marginBottom: 14 },
  histBarFill: { height: '100%', borderRadius: 4, transition: 'width 0.3s ease' },
  histWeeksGrid: { display: 'flex', flexWrap: 'wrap', gap: 14 },
  histWeekItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 },
  histWeekLabel: { fontSize: 10.5, color: 'rgba(248,247,242,0.45)', fontWeight: 600 },
  histWeekDots: { display: 'flex', gap: 4 },
  histDot: { width: 10, height: 10, borderRadius: '50%', border: '1.5px solid rgba(255,255,255,0.25)' },
  modalOverlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, zIndex: 50 },
  modalCard: { background: '#234A3D', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 12, padding: 20, maxWidth: 360, width: '100%' },
  modalTitle: { fontSize: 14.5, fontWeight: 600, marginBottom: 12 },
  modalInput: { width: '100%', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 8, padding: '10px 12px', color: '#F8F7F2', fontSize: 14, marginBottom: 16 },
  modalActions: { display: 'flex', gap: 10, justifyContent: 'flex-end' },
  modalCancelBtn: { padding: '8px 14px', fontSize: 13, color: 'rgba(248,247,242,0.6)' },
  modalConfirmBtn: { padding: '8px 16px', borderRadius: 8, background: '#E8B33D', color: '#1B4332', fontSize: 13, fontWeight: 700 },
};
