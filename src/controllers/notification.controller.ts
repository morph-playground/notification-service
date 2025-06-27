import { Request, Response } from 'express';
import { NotificationService } from '../services/notification.service';
import { IdentityProvider } from '../middleware/identity.provider';

export class NotificationController {
  constructor(
    private notificationService: NotificationService,
    private identityProvider: IdentityProvider
  ) {}

  async confirmNotification(req: Request, res: Response): Promise<void> {
    try {
      const userId = this.identityProvider.getUserId(req);
      console.log(`[NotificationController] confirmNotification called by userId: ${userId}`);
      if (!userId) {
        console.warn('[NotificationController] User ID not found in request');
        res.status(401).json({ error: 'User ID not found' });
        return;
      }

      const { notificationId } = req.params;
      console.log(`[NotificationController] notificationId param: ${notificationId}`);
      if (!notificationId) {
        console.warn('[NotificationController] Notification ID is missing in request params');
        res.status(400).json({ error: 'Notification ID is required' });
        return;
      }

      const tenantId = this.identityProvider.getTenantId(req);
      await this.notificationService.confirmNotification(userId, notificationId, tenantId);
      console.log(`[NotificationController] Notification ${notificationId} confirmed for user ${userId}`);
      res.status(200).json({ message: 'Notification confirmed successfully' });
    } catch (error) {
      if (error instanceof Error && error.message === 'Insufficient permissions') {
        console.warn('[NotificationController] Insufficient permissions error:', error);
        res.status(403).json({ error: 'Insufficient permissions' });
        return;
      }
      console.error('[NotificationController] Internal server error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}