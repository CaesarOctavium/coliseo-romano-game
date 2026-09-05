/**
 * Persistent banner shown in the citizen's profile whenever their
 * municipality has not activated the PRO plan. This is the growth loop:
 * neighbors see what they're missing and pressure the town hall to pay.
 */
export default function UpgradeBanner({ isPremium }) {
  if (isPremium) return null;

  return (
    <div
      role="status"
      className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4 text-blue-900 shadow-sm"
    >
      <span className="mt-0.5 text-xl" aria-hidden="true">
        🔔
      </span>
      <div className="flex-1">
        <p className="font-medium">
          Activa el seguimiento en tiempo real de tus incidencias.
        </p>
        <p className="text-sm text-blue-800">
          Pide a tu ayuntamiento que contrate el Plan Premium.
        </p>
      </div>
    </div>
  );
}
