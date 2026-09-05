const express = require('express');
const { requireAuth, requireRole } = require('../middleware/auth');
const { licenseMiddleware } = require('../middleware/license');
const licenseController = require('../controllers/licenseController');

const router = express.Router();

router.use(requireAuth, licenseMiddleware);

router.get('/status', licenseController.getStatus);

// Only the mayor's office can trigger the sales demo.
router.post('/demo/activate', requireRole('MAYOR', 'COUNCIL'), licenseController.activateDemo);

module.exports = router;
