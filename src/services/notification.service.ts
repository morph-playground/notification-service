import { PermissionServiceClient, Domain, Action } from '../clients/permission-service.client';

export class NotificationService {
  private confirmedNotifications = new Set<string>();

  constructor(private permissionServiceClient: PermissionServiceClient) {}

  async confirmNotification(userId: string, notificationId: string, tenantId?: string): Promise<void> {
    console.log(`Checking permission for userId=${userId} on notificationId=${notificationId} for tenant=${tenantId}`);
    const hasPermission = await this.permissionServiceClient.hasPermission(
      userId,
      Domain.NOTIFICATION,
      Action.UPDATE,
      tenantId
    );

    if (!hasPermission) {
      console.log(`Permission denied for userId=${userId} on notificationId=${notificationId}`);
      throw new Error('Insufficient permissions');
    }

    console.log(`Confirming notificationId=${notificationId} for userId=${userId}`);
    this.confirmedNotifications.add(notificationId);
  }

  isNotificationConfirmed(notificationId: string): boolean {
    const confirmed = this.confirmedNotifications.has(notificationId);
    console.log(`NotificationId=${notificationId} confirmed: ${confirmed}`);
    return confirmed;
  }
}