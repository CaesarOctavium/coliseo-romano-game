import { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { api } from '../api/client';

/**
 * "Activar Demo 15 dias" — the sales-floor button. The copy promises a
 * 15-day trial; what it actually flips on, server-side, is a short PRO
 * window (see DEMO_DURATION_MINUTES in the backend) so a rep can show the
 * mayor the Panel IA, PDF reports and 1-click assignment live, in the same
 * meeting, without a real purchase.
 */
export default function DemoModeButton({ license, isDemoActive, isPremium, onActivated }) {
  const [activating, setActivating] = useState(false);
  const [error, setError] = useState(null);

  if (isPremium && !isDemoActive) {
    return <Badge variant="pro">Plan PRO activo</Badge>;
  }

  if (isDemoActive) {
    const expiresAt = license?.demoExpiresAt ? new Date(license.demoExpiresAt) : null;
    return (
      <Badge variant="demo">
        Demo PRO activa{expiresAt ? ` hasta las ${expiresAt.toLocaleTimeString()}` : ''}
      </Badge>
    );
  }

  const handleClick = async () => {
    setActivating(true);
    setError(null);
    try {
      await api.activateDemo();
      onActivated?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setActivating(false);
    }
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <Button variant="premium" onClick={handleClick} disabled={activating}>
        {activating ? 'Activando...' : 'Activar Demo 15 dias'}
      </Button>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
