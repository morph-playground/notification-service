import express from 'express';
import { HealthController } from './controllers/health.controller';
import { NotificationController } from './controllers/notification.controller';
import { IdentityProvider } from './middleware/identity.provider';
import { PermissionServiceClient } from './clients/permission-service.client';
import { NotificationService } from './services/notification.service';

export function createApp(permissionServiceConfig: { host: string; port: number }) {
  const app = express();
  app.use(express.json());

  console.log('Creating IdentityProvider instance');
  const identityProvider = new IdentityProvider();

  console.log('Creating PermissionServiceClient instance');
  const permissionServiceClient = new PermissionServiceClient(permissionServiceConfig);

  console.log('Creating NotificationService instance');
  const notificationService = new NotificationService(permissionServiceClient);

  const healthController = new HealthController();
  const notificationController = new NotificationController(notificationService, identityProvider);

  console.log('Registering health route');
  app.get('/health', (req, res) => healthController.getHealth(req, res));

  console.log('Registering notification confirmation route');
  app.post('/notifications/:notificationId/confirm', (req, res) => 
    notificationController.confirmNotification(req, res)
  );

  return app;
}