import express from 'express';
import { HealthController } from './controllers/health.controller';
import { NotificationController } from './controllers/notification.controller';
import { IdentityProvider } from './middleware/identity.provider';
import { PermissionServiceClient } from './clients/permission-service.client';
import { NotificationService } from './services/notification.service';

export function createApp(permissionServiceConfig: { host: string; port: number }) {
  const app = express();
  app.use(express.json());

  console.log('Initializing IdentityProvider...');
  const identityProvider = new IdentityProvider();
  console.log('IdentityProvider initialized.');

  console.log('Initializing PermissionServiceClient with config:', permissionServiceConfig);
  const permissionServiceClient = new PermissionServiceClient(permissionServiceConfig);
  console.log('PermissionServiceClient initialized.');

  console.log('Initializing NotificationService...');
  const notificationService = new NotificationService(permissionServiceClient);
  console.log('NotificationService initialized.');

  const healthController = new HealthController();
  const notificationController = new NotificationController(notificationService, identityProvider);

  app.get('/health', (req, res) => {
    console.log('GET /health called');
    healthController.getHealth(req, res);
  });
  app.post('/notifications/:notificationId/confirm', (req, res) => {
    console.log('POST /notifications/' + req.params.notificationId + '/confirm called');
    notificationController.confirmNotification(req, res);
  });

  return app;
}