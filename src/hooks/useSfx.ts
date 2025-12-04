import { useCallback } from 'react';
import { audioManager } from '../lib/audio/audioManager';

export const useSfx = () => {
  const play = useCallback((name: string, opts?: { loop?: boolean; volume?: number }) => {
    audioManager.play(name, opts);
  }, []);

  const stop = useCallback((name: string) => {
    audioManager.stop(name);
  }, []);

  const setMuted = useCallback((muted: boolean) => {
    audioManager.setMuted(muted);
  }, []);

  return { play, stop, setMuted };
};