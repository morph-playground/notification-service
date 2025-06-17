import { PermissionServiceClient, Domain, Action } from '../clients/permission-service.client';

export class NotificationService {
  private confirmedNotifications = new Set<string>();

  constructor(private permissionServiceClient: PermissionServiceClient) {}

  async confirmNotification(userId: string, notificationId: string): Promise<void> {
    console.log(`Confirming notification: ${notificationId} for user: ${userId}`);
    const hasPermission = await this.permissionServiceClient.hasPermission(
      userId,
      Domain.NOTIFICATION,
      Action.UPDATE
    );

    if (!hasPermission) {
      console.error(`User ${userId} does not have permission to confirm notification ${notificationId}`);
      throw new Error('Insufficient permissions');
    }

    this.confirmedNotifications.add(notificationId);
    console.log(`Notification ${notificationId} confirmed for user ${userId}`);
  }

  isNotificationConfirmed(notificationId: string): boolean {
    console.log(`Checking if notification ${notificationId} is confirmed`);
    return this.confirmedNotifications.has(notificationId);
  }
}