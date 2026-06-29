import React, { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

const METRIC_FIELDS = [
  { key: 'peso', label: 'Peso corporal', unit: 'kg', color: '#E8B33D', step: '0.1' },
  { key: 'fcRepouso', label: 'FC repouso', unit: 'bpm', color: '#6B9080', step: '1' },
  { key: 'fcTreino', label: 'FC média treino', unit: 'bpm', color: '#C1392B', step: '1' },
  { key: 'ritmoCorrida', label: 'Ritmo de corrida', unit: 'min/km', color: '#8AB4F8', step: '0.01' },
];

function formatDateLabel(dateStr) {
  const d = new Date(dateStr);
  return `${d.getDate()}/${d.getMonth() + 1}`;
}

export default function MetricsView({ metrics, addMetric, deleteMetric, error }) {
  const [form, setForm] = useState({
    data: new Date().toISOString().slice(0, 10),
    peso: '',
    fcRepouso: '',
    fcTreino: '',
    ritmoCorrida: '',
    notas: '',
  });
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const hasAnyValue = METRIC_FIELDS.some((f) => form[f.key] !== '');
    if (!hasAnyValue) {
      setFeedback({ type: 'error', msg: 'Preenche pelo menos uma métrica antes de guardar.' });
      return;
    }
    setSaving(true);
    try {
      const entry = { data: form.data, notas: form.notas || '' };
      METRIC_FIELDS.forEach((f) => {
        if (form[f.key] !== '') entry[f.key] = parseFloat(form[f.key]);
      });
      await addMetric(entry);
      setFeedback({ type: 'success', msg: 'Registo guardado.' });
      setForm({
        data: new Date().toISOString().slice(0, 10),
        peso: '',
        fcRepouso: '',
        fcTreino: '',
        ritmoCorrida: '',
        notas: '',
      });
    } catch (err) {
      setFeedback({ type: 'error', msg: 'Não foi possível guardar. Tenta novamente.' });
    } finally {
      setSaving(false);
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  const chartData = metrics.map((m) => ({
    ...m,
    label: formatDateLabel(m.data),
  }));

  return (
    <div style={styles.wrap}>
      <section style={styles.formSection}>
        <h2 style={styles.sectionTitle}>Registo semanal</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.fieldRow}>
            <label style={styles.label}>Data</label>
            <input
              type="date"
              value={form.data}
              onChange={(e) => handleChange('data', e.target.value)}
              style={styles.input}
            />
          </div>
          {METRIC_FIELDS.map((f) => (
            <div style={styles.fieldRow} key={f.key}>
              <label style={styles.label}>{f.label} ({f.unit})</label>
              <input
                type="number"
                step={f.step}
                placeholder="—"
                value={form[f.key]}
                onChange={(e) => handleChange(f.key, e.target.value)}
                style={styles.input}
              />
            </div>
          ))}
          <div style={styles.fieldRow}>
            <label style={styles.label}>Notas (opcional)</label>
            <input
              type="text"
              placeholder="Ex: semana mais cansativa, etc."
              value={form.notas}
              onChange={(e) => handleChange('notas', e.target.value)}
              style={styles.input}
            />
          </div>
          <button type="submit" disabled={saving} style={styles.submitBtn}>
            {saving ? 'A guardar…' : 'Guardar registo'}
          </button>
          {feedback && (
            <div style={feedback.type === 'error' ? styles.feedbackError : styles.feedbackSuccess}>
              {feedback.msg}
            </div>
          )}
          {error && <div style={styles.feedbackError}>Erro de ligação: {error}</div>}
        </form>
      </section>

      {metrics.length === 0 ? (
        <div style={styles.emptyState}>
          Ainda não há registos. Adiciona o primeiro acima para começares a ver a tua evolução.
        </div>
      ) : (
        <section style={styles.chartsSection}>
          <h2 style={styles.sectionTitle}>Evolução</h2>
          {METRIC_FIELDS.map((f) => {
            const hasData = chartData.some((d) => d[f.key] !== undefined);
            if (!hasData) return null;
            return (
              <div key={f.key} style={styles.chartCard}>
                <div style={styles.chartTitle}>{f.label} <span style={styles.chartUnit}>({f.unit})</span></div>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={chartData} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                    <XAxis dataKey="label" stroke="rgba(248,247,242,0.5)" fontSize={11} />
                    <YAxis stroke="rgba(248,247,242,0.5)" fontSize={11} domain={['auto', 'auto']} />
                    <Tooltip
                      contentStyle={{ background: '#1B4332', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, fontSize: 12 }}
                      labelStyle={{ color: '#F8F7F2' }}
                    />
                    <Line
                      type="monotone"
                      dataKey={f.key}
                      stroke={f.color}
                      strokeWidth={2.5}
                      dot={{ r: 3, fill: f.color }}
                      connectNulls
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            );
          })}

          <div style={styles.historyList}>
            <div style={styles.chartTitle}>Registos recentes</div>
            {metrics.slice().reverse().slice(0, 8).map((m) => (
              <div key={m.id} style={styles.historyRow}>
                <div style={styles.historyDate}>{formatDateLabel(m.data)}</div>
                <div style={styles.historyValues}>
                  {METRIC_FIELDS.filter((f) => m[f.key] !== undefined).map((f) => (
                    <span key={f.key} style={styles.historyValueChip}>
                      {f.label}: <strong>{m[f.key]}{f.unit}</strong>
                    </span>
                  ))}
                  {m.notas && <span style={styles.historyNote}>"{m.notas}"</span>}
                </div>
                <button
                  onClick={() => deleteMetric(m.id)}
                  style={styles.deleteBtn}
                  aria-label="Remover registo"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

const styles = {
  wrap: { display: 'flex', flexDirection: 'column', gap: 28 },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 700,
    marginBottom: 14,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    color: 'rgba(248,247,242,0.85)',
  },
  formSection: {},
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    background: 'rgba(255,255,255,0.04)',
    border: '1.5px solid rgba(255,255,255,0.08)',
    borderRadius: 10,
    padding: 16,
  },
  fieldRow: { display: 'flex', flexDirection: 'column', gap: 4 },
  label: { fontSize: 12.5, color: 'rgba(248,247,242,0.6)', fontWeight: 600 },
  input: {
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: 6,
    padding: '8px 10px',
    color: '#F8F7F2',
    fontSize: 14,
  },
  submitBtn: {
    marginTop: 6,
    background: '#E8B33D',
    color: '#1B4332',
    fontWeight: 700,
    fontSize: 13.5,
    padding: '10px 0',
    borderRadius: 8,
  },
  feedbackError: {
    fontSize: 12.5,
    color: '#F3C9C3',
    background: 'rgba(193,57,43,0.15)',
    border: '1px solid rgba(193,57,43,0.4)',
    borderRadius: 6,
    padding: '8px 10px',
  },
  feedbackSuccess: {
    fontSize: 12.5,
    color: '#D7E8DE',
    background: 'rgba(107,144,128,0.2)',
    border: '1px solid rgba(107,144,128,0.4)',
    borderRadius: 6,
    padding: '8px 10px',
  },
  emptyState: {
    textAlign: 'center',
    padding: '24px 20px',
    color: 'rgba(248,247,242,0.5)',
    fontSize: 13.5,
    lineHeight: 1.5,
  },
  chartsSection: {},
  chartCard: {
    background: 'rgba(255,255,255,0.04)',
    border: '1.5px solid rgba(255,255,255,0.08)',
    borderRadius: 10,
    padding: '14px 8px 8px 4px',
    marginBottom: 14,
  },
  chartTitle: {
    fontSize: 13.5,
    fontWeight: 600,
    paddingLeft: 12,
    marginBottom: 4,
  },
  chartUnit: {
    color: 'rgba(248,247,242,0.5)',
    fontWeight: 400,
  },
  historyList: {
    background: 'rgba(255,255,255,0.04)',
    border: '1.5px solid rgba(255,255,255,0.08)',
    borderRadius: 10,
    padding: 14,
    marginTop: 14,
  },
  historyRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '8px 0',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
  },
  historyDate: {
    fontSize: 12,
    color: 'rgba(248,247,242,0.5)',
    minWidth: 40,
    fontWeight: 600,
  },
  historyValues: {
    flex: 1,
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
    fontSize: 12,
  },
  historyValueChip: {
    color: 'rgba(248,247,242,0.7)',
  },
  historyNote: {
    color: 'rgba(248,247,242,0.45)',
    fontStyle: 'italic',
  },
  deleteBtn: {
    color: 'rgba(248,247,242,0.4)',
    fontSize: 14,
    padding: '2px 6px',
    flexShrink: 0,
  },
};
