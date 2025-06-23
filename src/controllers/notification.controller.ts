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
      
      if (!userId) {
        
        res.status(401).json({ error: 'User ID not found' });
        return;
      }

      const { notificationId } = req.params;
      
      if (!notificationId) {
        
        res.status(400).json({ error: 'Notification ID is required' });
        return;
      }

      await this.notificationService.confirmNotification(userId, notificationId);
      
      res.status(200).json({ message: 'Notification confirmed successfully' });
    } catch (error) {
      if (error instanceof Error && error.message === 'Insufficient permissions') {
        
        res.status(403).json({ error: 'Insufficient permissions' });
        return;
      }
      
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}