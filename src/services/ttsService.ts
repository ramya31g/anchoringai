import type { VoiceSettings } from '@/types';

export function getAvailableVoices(): SpeechSynthesisVoice[] {
  if (typeof window === 'undefined' || !window.speechSynthesis) return [];
  return window.speechSynthesis.getVoices();
}

export function onVoicesChanged(callback: () => void): () => void {
  if (typeof window === 'undefined' || !window.speechSynthesis) return () => {};
  const handler = () => callback();
  window.speechSynthesis.addEventListener('voiceschanged', handler);
  return () => window.speechSynthesis.removeEventListener('voiceschanged', handler);
}

export function isSpeechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

export function speak(text: string, settings: VoiceSettings): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!isSpeechSupported()) {
      reject(new Error('Voice generation is not supported by this browser. Please use Google Chrome or another modern browser.'));
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const voices = getAvailableVoices();
    const voice = voices.find((v) => v.voiceURI === settings.voiceURI);
    if (voice) utterance.voice = voice;

    utterance.rate = settings.rate;
    utterance.volume = settings.volume;
    utterance.pitch = settings.style === 'Dramatic' ? 1.1 : settings.style === 'Energetic' ? 1.05 : 1.0;

    utterance.onend = () => resolve();
    utterance.onerror = (e) => reject(new Error(e.error || 'Speech synthesis error'));

    window.speechSynthesis.speak(utterance);
  });
}

export function pause(): void {
  if (isSpeechSupported()) window.speechSynthesis.pause();
}

export function resume(): void {
  if (isSpeechSupported()) window.speechSynthesis.resume();
}

export function stop(): void {
  if (isSpeechSupported()) window.speechSynthesis.cancel();
}

export function isSpeaking(): boolean {
  return isSpeechSupported() && window.speechSynthesis.speaking;
}

export function isPaused(): boolean {
  return isSpeechSupported() && window.speechSynthesis.paused;
}
