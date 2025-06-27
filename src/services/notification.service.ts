import { PermissionServiceClient, Domain, Action } from '../clients/permission-service.client';

export class NotificationService {
  private confirmedNotifications = new Set<string>();

  constructor(private permissionServiceClient: PermissionServiceClient) {}

  async confirmNotification(userId: string, tenantId: string, notificationId: string): Promise<void> {
    console.log(`Checking permission for userId=${userId}, tenantId=${tenantId} on notificationId=${notificationId}`);
    const hasPermission = await this.permissionServiceClient.hasPermission(
      userId,
      tenantId,
      Domain.NOTIFICATION,
      Action.UPDATE
    );

    if (!hasPermission) {
      console.log(`Permission denied for userId=${userId}, tenantId=${tenantId} on notificationId=${notificationId}`);
      throw new Error('Insufficient permissions');
    }

    console.log(`Confirming notificationId=${notificationId} for userId=${userId} in tenant ${tenantId}`);
    this.confirmedNotifications.add(notificationId);
  }

  isNotificationConfirmed(notificationId: string): boolean {
    const confirmed = this.confirmedNotifications.has(notificationId);
    console.log(`NotificationId=${notificationId} confirmed: ${confirmed}`);
    return confirmed;
  }
}