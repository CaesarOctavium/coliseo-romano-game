const express = require('express');
const { requireAuth, requireRole } = require('../middleware/auth');
const { licenseMiddleware, requireLicense } = require('../middleware/license');
const incidentsController = require('../controllers/incidentsController');

const router = express.Router();

router.use(requireAuth, licenseMiddleware);

router.get('/', incidentsController.listIncidents);
router.get('/:id', incidentsController.getIncidentById);

// FREE tier still allows acknowledging an incident.
router.patch(
  '/:id/seen',
  requireRole('COUNCIL', 'MAYOR'),
  incidentsController.markSeen
);

// PRO-only actions — the "candado" that makes upgrading worth it.
router.patch(
  '/:id/assign',
  requireRole('COUNCIL', 'MAYOR'),
  requireLicense('PRO'),
  incidentsController.assignIncident
);

router.patch(
  '/:id/status',
  requireRole('COUNCIL', 'MAYOR'),
  requireLicense('PRO'),
  incidentsController.updateStatus
);

module.exports = router;
