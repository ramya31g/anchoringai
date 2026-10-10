import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Script } from '@/types';
import { getScripts, saveScript as storageSave, updateScript as storageUpdate, deleteScript as storageDelete, clearScripts as storageClear } from '@/utils/storage';

interface ScriptContextType {
  scripts: Script[];
  addScript: (script: Script) => void;
  editScript: (script: Script) => void;
  removeScript: (id: string) => void;
  clearAll: () => void;
  getById: (id: string) => Script | undefined;
}

const ScriptContext = createContext<ScriptContextType | undefined>(undefined);

export function ScriptProvider({ children }: { children: ReactNode }) {
  const [scripts, setScripts] = useState<Script[]>(() => getScripts());

  const addScript = useCallback((script: Script) => {
    setScripts(storageSave(script));
  }, []);

  const editScript = useCallback((script: Script) => {
    setScripts(storageUpdate(script));
  }, []);

  const removeScript = useCallback((id: string) => {
    setScripts(storageDelete(id));
  }, []);

  const clearAll = useCallback(() => {
    storageClear();
    setScripts([]);
  }, []);

  const getById = useCallback((id: string) => scripts.find((s) => s.id === id), [scripts]);

  return (
    <ScriptContext.Provider value={{ scripts, addScript, editScript, removeScript, clearAll, getById }}>
      {children}
    </ScriptContext.Provider>
  );
}

export function useScripts() {
  const ctx = useContext(ScriptContext);
  if (!ctx) throw new Error('useScripts must be used within ScriptProvider');
  return ctx;
}
