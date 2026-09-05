const prisma = require('../lib/prisma');

/**
 * Reads the requesting user's municipality and computes the *effective*
 * license tier for this request, then exposes it on req.licenseTier.
 *
 * The effective tier is PRO whenever:
 *   - municipality.licenseTier is already 'PRO', or
 *   - a Demo Mode window is active (municipality.demoExpiresAt is in the
 *     future) — this is what powers the "Activar Demo 15 dias" button in
 *     Montmell Gestiona, letting a mayor preview PRO features live.
 *
 * Every route that needs to branch on licensing (citizen incident details,
 * council assignment tools, PDF reports, ...) should run this middleware
 * before its handler and read req.licenseTier / req.isDemoActive.
 */
async function licenseMiddleware(req, res, next) {
  try {
    if (!req.user || !req.user.municipalityId) {
      return res.status(401).json({ error: 'Authenticated municipality required' });
    }

    const municipality = await prisma.municipality.findUnique({
      where: { id: req.user.municipalityId },
    });

    if (!municipality) {
      return res.status(404).json({ error: 'Municipality not found' });
    }

    const now = new Date();
    const isDemoActive = Boolean(
      municipality.demoExpiresAt && municipality.demoExpiresAt > now
    );

    req.municipality = municipality;
    req.isDemoActive = isDemoActive;
    req.licenseTier = isDemoActive ? 'PRO' : municipality.licenseTier;

    next();
  } catch (err) {
    next(err);
  }
}

/**
 * Route guard for endpoints that only make sense above a given tier
 * (e.g. assigning an incident, generating AI reports). FREE < BASIC < PRO.
 */
const TIER_RANK = { FREE: 0, BASIC: 1, PRO: 2 };

function requireLicense(minTier) {
  return (req, res, next) => {
    if (!req.licenseTier) {
      return res.status(500).json({ error: 'licenseMiddleware must run first' });
    }

    if (TIER_RANK[req.licenseTier] < TIER_RANK[minTier]) {
      return res.status(402).json({
        error: 'Funcionalidad Premium',
        message: `Esta accion requiere el Plan ${minTier}. Contrata el Plan Premium para desbloquearla.`,
        requiredTier: minTier,
        currentTier: req.licenseTier,
      });
    }

    next();
  };
}

module.exports = { licenseMiddleware, requireLicense };
