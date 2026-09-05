const prisma = require('../lib/prisma');

const DEMO_DURATION_MINUTES = Number(process.env.DEMO_DURATION_MINUTES || 15);

async function getStatus(req, res, next) {
  try {
    return res.json({
      tier: req.municipality.licenseTier,
      effectiveTier: req.licenseTier,
      isDemoActive: req.isDemoActive,
      demoExpiresAt: req.municipality.demoExpiresAt,
    });
  } catch (err) {
    return next(err);
  }
}

/**
 * "Activar Demo 15 dias" button in Montmell Gestiona.
 *
 * The label sold to the mayor is a 15-day trial; what actually fires here
 * is a short DEMO_DURATION_MINUTES window (15 min by default) so a sales
 * rep can flip PRO features on live, in the same meeting, without needing
 * real payment or a 15-day wait. Only a MAYOR or COUNCIL member may trigger
 * it, and only once no other demo window is already running.
 */
async function activateDemo(req, res, next) {
  try {
    if (req.municipality.licenseTier === 'PRO') {
      return res.status(400).json({ error: 'Este ayuntamiento ya tiene el Plan PRO activo' });
    }

    const now = new Date();
    if (req.municipality.demoExpiresAt && req.municipality.demoExpiresAt > now) {
      return res.status(409).json({
        error: 'Demo ya en curso',
        demoExpiresAt: req.municipality.demoExpiresAt,
      });
    }

    const demoExpiresAt = new Date(now.getTime() + DEMO_DURATION_MINUTES * 60 * 1000);

    const municipality = await prisma.municipality.update({
      where: { id: req.municipality.id },
      data: { demoExpiresAt },
    });

    await prisma.license.create({
      data: {
        municipalityId: municipality.id,
        tier: 'PRO',
        isDemo: true,
        startsAt: now,
        endsAt: demoExpiresAt,
      },
    });

    return res.json({
      message: `Demo PRO activada durante ${DEMO_DURATION_MINUTES} minutos`,
      demoExpiresAt,
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = { getStatus, activateDemo, DEMO_DURATION_MINUTES };
