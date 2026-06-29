import { useState, useEffect, useCallback } from 'react';
import { db } from './firebase';
import { ref, onValue, set, push, remove } from 'firebase/database';

// ===================== PROGRESSO DE SESSÕES =====================

export function useProgress() {
  const [progress, setProgress] = useState({});
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const progressRef = ref(db, 'progress');
    const unsubscribe = onValue(
      progressRef,
      (snapshot) => {
        const val = snapshot.val();
        setProgress(val || {});
        setLoaded(true);
        setError(null);
      },
      (err) => {
        setError(err.message);
        setLoaded(true);
      }
    );
    return () => unsubscribe();
  }, []);

  const toggleSession = useCallback((key, extra) => {
    const itemRef = ref(db, `progress/${key}`);
    if (progress[key]) {
      remove(itemRef).catch((e) => setError(e.message));
    } else {
      set(itemRef, {
        completedAt: new Date().toISOString(),
        ...(extra || {}),
      }).catch((e) => setError(e.message));
    }
  }, [progress]);

  const setAlternativa = useCallback((key, descricao) => {
    const itemRef = ref(db, `progress/${key}`);
    set(itemRef, {
      completedAt: new Date().toISOString(),
      alternativa: true,
      descricao: descricao || 'Atividade alternativa',
    }).catch((e) => setError(e.message));
  }, []);

  return { progress, loaded, error, toggleSession, setAlternativa };
}

// ===================== MÉTRICAS (peso, FC, corrida) =====================

export function useMetrics() {
  const [metrics, setMetrics] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const metricsRef = ref(db, 'metrics');
    const unsubscribe = onValue(
      metricsRef,
      (snapshot) => {
        const val = snapshot.val();
        if (!val) {
          setMetrics([]);
        } else {
          const arr = Object.entries(val).map(([id, data]) => ({ id, ...data }));
          arr.sort((a, b) => new Date(a.data) - new Date(b.data));
          setMetrics(arr);
        }
        setLoaded(true);
        setError(null);
      },
      (err) => {
        setError(err.message);
        setLoaded(true);
      }
    );
    return () => unsubscribe();
  }, []);

  const addMetric = useCallback((entry) => {
    const metricsRef = ref(db, 'metrics');
    const newRef = push(metricsRef);
    return set(newRef, entry).catch((e) => {
      setError(e.message);
      throw e;
    });
  }, []);

  const deleteMetric = useCallback((id) => {
    const itemRef = ref(db, `metrics/${id}`);
    return remove(itemRef).catch((e) => setError(e.message));
  }, []);

  return { metrics, loaded, error, addMetric, deleteMetric };
}
