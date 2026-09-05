import { useCallback, useEffect, useState } from 'react';
import { api } from '../api/client';

export function useLicense() {
  const [license, setLicense] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    setLoading(true);
    return api
      .getLicenseStatus()
      .then(setLicense)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    license,
    loading,
    isPremium: license?.effectiveTier === 'PRO',
    isDemoActive: Boolean(license?.isDemoActive),
    refresh,
  };
}
