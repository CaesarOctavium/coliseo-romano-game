import { useEffect, useState } from 'react';
import { api } from '../api/client';

/**
 * Fetches the current municipality's effective license tier so components
 * can decide whether to show the Premium upgrade banner and other
 * FREE-vs-PRO conditional UI.
 */
export function useLicense() {
  const [license, setLicense] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    api
      .getLicenseStatus()
      .then((data) => {
        if (!cancelled) setLicense(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return {
    license,
    loading,
    error,
    isPremium: license?.effectiveTier === 'PRO',
  };
}
