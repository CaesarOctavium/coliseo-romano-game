const prisma = require('../lib/prisma');

/**
 * Shapes an Incident row according to the request's effective license tier.
 *
 *  FREE / BASIC -> only { id, title, status } and status is genericized,
 *                  so citizens see a vague "en revision" / "resuelto"
 *                  instead of the council's internal workflow states.
 *  PRO          -> full detail: who is assigned, ETA, last comment. This is
 *                  the "hook" — once a town sees this, taking it away hurts.
 */
function serializeIncidentForCitizen(incident, licenseTier) {
  if (licenseTier === 'PRO') {
    return {
      id: incident.id,
      title: incident.title,
      status: incident.status,
      assigned_to: incident.assignedTo ? incident.assignedTo.name : null,
      estimated_time: incident.estimatedTime,
      last_comment: incident.lastComment,
    };
  }

  const genericStatus = incident.status === 'RESOLVED' ? 'resolved' : 'pending';

  return {
    id: incident.id,
    title: incident.title,
    status: genericStatus,
  };
}

async function getIncidentById(req, res, next) {
  try {
    const { id } = req.params;

    const incident = await prisma.incident.findFirst({
      where: { id, municipalityId: req.user.municipalityId },
      include: { assignedTo: true },
    });

    if (!incident) {
      return res.status(404).json({ error: 'Incident not found' });
    }

    return res.json(serializeIncidentForCitizen(incident, req.licenseTier));
  } catch (err) {
    return next(err);
  }
}

async function listIncidents(req, res, next) {
  try {
    const incidents = await prisma.incident.findMany({
      where: { municipalityId: req.user.municipalityId },
      include: { assignedTo: true, reportedBy: true },
      orderBy: { createdAt: 'desc' },
    });

    // The admin panel (council/mayor) always sees full operational detail;
    // it is the citizen-facing endpoint that gets tier-gated.
    return res.json(
      incidents.map((incident) => ({
        id: incident.id,
        title: incident.title,
        description: incident.description,
        status: incident.status,
        seen_by_council: incident.seenByCouncil,
        assigned_to: incident.assignedTo
          ? { id: incident.assignedTo.id, name: incident.assignedTo.name }
          : null,
        estimated_time: incident.estimatedTime,
        last_comment: incident.lastComment,
        reported_by: incident.reportedBy.name,
        created_at: incident.createdAt,
      }))
    );
  } catch (err) {
    return next(err);
  }
}

// FREE tier: council can only acknowledge ("Visto"), never assign or
// change the workflow status.
async function markSeen(req, res, next) {
  try {
    const { id } = req.params;

    const incident = await prisma.incident.update({
      where: { id },
      data: { seenByCouncil: true },
    });

    return res.json({ id: incident.id, seen_by_council: incident.seenByCouncil });
  } catch (err) {
    return next(err);
  }
}

// PRO-only: 1-click assignment from the "Panel IA".
async function assignIncident(req, res, next) {
  try {
    const { id } = req.params;
    const { assignedToId, estimatedTime } = req.body;

    const incident = await prisma.incident.update({
      where: { id },
      data: {
        assignedToId,
        estimatedTime,
        status: 'ASSIGNED',
      },
      include: { assignedTo: true },
    });

    return res.json({
      id: incident.id,
      status: incident.status,
      assigned_to: incident.assignedTo.name,
      estimated_time: incident.estimatedTime,
    });
  } catch (err) {
    return next(err);
  }
}

// PRO-only: full workflow status changes (council decides the states).
async function updateStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status, lastComment } = req.body;

    const incident = await prisma.incident.update({
      where: { id },
      data: { status, lastComment },
    });

    return res.json({ id: incident.id, status: incident.status, last_comment: incident.lastComment });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  serializeIncidentForCitizen,
  getIncidentById,
  listIncidents,
  markSeen,
  assignIncident,
  updateStatus,
};
