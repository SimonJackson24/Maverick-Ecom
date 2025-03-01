import { Request, Response } from 'express';
import { PaymentLog } from '../models/PaymentLog';
import { SuspiciousActivity } from '../models/SuspiciousActivity';
import { NotificationService } from '../services/NotificationService';
import { validatePaymentLog } from '../validators/paymentLogValidator';

export class PaymentMonitoringController {
  static async logPaymentAttempt(req: Request, res: Response) {
    try {
      const { error } = validatePaymentLog(req.body);
      if (error) {
        return res.status(400).json({ error: error.message });
      }

      const paymentLog = new PaymentLog(req.body);
      await paymentLog.save();

      res.status(201).json(paymentLog);
    } catch (error) {
      console.error('Error logging payment attempt:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async reportSuspiciousActivity(req: Request, res: Response) {
    try {
      const { attempt, patterns } = req.body;
      
      // Create payment log
      const paymentLog = new PaymentLog(attempt);
      await paymentLog.save();

      // Create suspicious activity record
      const suspiciousActivity = new SuspiciousActivity({
        paymentLogId: paymentLog.id,
        patterns,
        timestamp: new Date(),
      });
      await suspiciousActivity.save();

      // Send notifications based on severity
      const highSeverityPatterns = patterns.filter(p => p.severity === 'high');
      if (highSeverityPatterns.length > 0) {
        await NotificationService.sendUrgentAlert({
          type: 'suspicious_activity',
          activityId: suspiciousActivity.id,
          patterns: highSeverityPatterns,
        });
      }

      res.status(201).json(suspiciousActivity);
    } catch (error) {
      console.error('Error reporting suspicious activity:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getSuspiciousActivities(req: Request, res: Response) {
    try {
      const { status, severity, startDate, endDate } = req.query;
      
      const query: any = {};
      
      if (status) {
        query.status = status;
      }
      
      if (severity) {
        query['patterns.severity'] = severity;
      }
      
      if (startDate || endDate) {
        query.timestamp = {};
        if (startDate) query.timestamp.$gte = new Date(startDate as string);
        if (endDate) query.timestamp.$lte = new Date(endDate as string);
      }

      const activities = await SuspiciousActivity.find(query)
        .sort({ timestamp: -1 })
        .limit(100)
        .populate('paymentLogId');

      res.json(activities);
    } catch (error) {
      console.error('Error fetching suspicious activities:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async updateSuspiciousActivity(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status, resolution } = req.body;

      const activity = await SuspiciousActivity.findByIdAndUpdate(
        id,
        {
          status,
          resolution,
          resolvedBy: req.user?.id || 'system',
          resolvedAt: new Date(),
        },
        { new: true }
      );

      if (!activity) {
        return res.status(404).json({ error: 'Suspicious activity not found' });
      }

      res.json(activity);
    } catch (error) {
      console.error('Error updating suspicious activity:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
