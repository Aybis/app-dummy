import { useCallback, useEffect, useState } from 'react';
import { DEFAULT_SETTINGS, loadSettings, saveSettings } from '../storage/settingsStorage';
import { ApiSettings } from '../types';

export function useSettings() {
  const [settings, setSettings] = useState<ApiSettings>(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadSettings().then((loaded) => {
      setSettings(loaded);
      setIsLoaded(true);
    });
  }, []);

  const updateSettings = useCallback(async (next: ApiSettings) => {
    setSettings(next);
    await saveSettings(next);
  }, []);

  const hasApiKey = settings.apiKey.trim().length > 0;

  return { settings, isLoaded, hasApiKey, updateSettings };
}
