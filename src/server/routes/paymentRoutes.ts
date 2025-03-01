import express from 'express';
import { PaymentConfigController } from '../controllers/PaymentConfigController';
import { PaymentMonitoringController } from '../controllers/PaymentMonitoringController';
import { authenticateAdmin } from '../middleware/auth';
import { rateLimiter } from '../middleware/rateLimiter';

const router = express.Router();

// Payment Configuration Routes
router.get(
  '/config',
  authenticateAdmin,
  PaymentConfigController.getConfig
);

router.put(
  '/config',
  authenticateAdmin,
  PaymentConfigController.updateConfig
);

router.post(
  '/config/validate',
  authenticateAdmin,
  PaymentConfigController.validateConfig
);

// Payment Monitoring Routes
router.post(
  '/logs',
  rateLimiter,
  PaymentMonitoringController.logPaymentAttempt
);

router.post(
  '/suspicious-activity',
  rateLimiter,
  PaymentMonitoringController.reportSuspiciousActivity
);

router.get(
  '/suspicious-activity',
  authenticateAdmin,
  PaymentMonitoringController.getSuspiciousActivities
);

router.put(
  '/suspicious-activity/:id',
  authenticateAdmin,
  PaymentMonitoringController.updateSuspiciousActivity
);

export default router;
