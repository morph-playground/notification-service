import express from 'express';
import { HealthController } from './controllers/health.controller';
import { NotificationController } from './controllers/notification.controller';
import { IdentityProvider } from './middleware/identity.provider';
import { PermissionServiceClient } from './clients/permission-service.client';
import { NotificationService } from './services/notification.service';

export function createApp(permissionServiceConfig: { host: string; port: number }) {
  const app = express();
  app.use(express.json());

  const identityProvider = new IdentityProvider();
  const permissionServiceClient = new PermissionServiceClient(permissionServiceConfig);
  const notificationService = new NotificationService(permissionServiceClient);

  const healthController = new HealthController();
  const notificationController = new NotificationController(notificationService, identityProvider);

  app.get('/health', (req, res) => healthController.getHealth(req, res));
  app.post('/notifications/:notificationId/confirm', (req, res) => 
    notificationController.confirmNotification(req, res)
  );

  return app;
}