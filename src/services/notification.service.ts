import { PermissionServiceClient, Domain, Action } from '../clients/permission-service.client';

export class NotificationService {
  private confirmedNotifications = new Set<string>();

  constructor(private permissionServiceClient: PermissionServiceClient) {}

  async confirmNotification(userId: string, notificationId: string): Promise<void> {
    const hasPermission = await this.permissionServiceClient.hasPermission(
      userId,
      Domain.NOTIFICATION,
      Action.UPDATE
    );

    if (!hasPermission) {
      throw new Error('Insufficient permissions');
    }

    this.confirmedNotifications.add(notificationId);
  }

  isNotificationConfirmed(notificationId: string): boolean {
    return this.confirmedNotifications.has(notificationId);
  }
}