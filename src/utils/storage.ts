import type { Script } from '@/types';
import { SAMPLE_SCRIPTS } from '@/data/sampleScripts';

const STORAGE_KEY = 'aura-announcements';

export function getScripts(): Script[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_SCRIPTS));
      return SAMPLE_SCRIPTS;
    }
    return JSON.parse(raw) as Script[];
  } catch {
    return [];
  }
}

export function saveScript(script: Script): Script[] {
  const scripts = getScripts();
  const exists = scripts.find((s) => s.id === script.id);
  let updated: Script[];
  if (exists) {
    updated = scripts.map((s) => (s.id === script.id ? script : s));
  } else {
    updated = [script, ...scripts];
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function updateScript(script: Script): Script[] {
  const scripts = getScripts();
  const updated = scripts.map((s) => (s.id === script.id ? script : s));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function deleteScript(id: string): Script[] {
  const scripts = getScripts();
  const updated = scripts.filter((s) => s.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function clearScripts(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function getScriptById(id: string): Script | undefined {
  return getScripts().find((s) => s.id === id);
}
