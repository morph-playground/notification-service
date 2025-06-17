import request from 'supertest';
import express from 'express';
import nock from 'nock';
import { createApp } from '../../src/app';

const permissionServiceHost = 'localhost';
const permissionServicePort = 3001;
const permissionServiceBaseUrl = `http://${permissionServiceHost}:${permissionServicePort}`;

describe('Notification Integration Tests', () => {
  let app: express.Application;

  beforeAll(() => {
    app = createApp({ host: permissionServiceHost, port: permissionServicePort });
  });

  afterEach(() => {
    nock.cleanAll();
  });

  describe('POST /notifications/:notificationId/confirm', () => {
    it('should confirm notification when user has permission', async () => {
      const userId = 'user123';
      const notificationId = 'notification456';

      // Mock permission service response
      nock(permissionServiceBaseUrl)
        .get('/permissions/check')
        .query({
          subjectId: userId,
          domain: 'NOTIFICATION',
          action: 'UPDATE'
        })
        .reply(200, { allowed: true });

      const response = await request(app)
        .post(`/notifications/${notificationId}/confirm`)
        .set('identity-user-id', userId);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Notification confirmed successfully' });
    });

    it('should return 403 when user lacks permission', async () => {
      const userId = 'user123';
      const notificationId = 'notification456';

      // Mock permission service response
      nock(permissionServiceBaseUrl)
        .get('/permissions/check')
        .query({
          subjectId: userId,
          domain: 'NOTIFICATION',
          action: 'UPDATE'
        })
        .reply(200, { allowed: false });

      const response = await request(app)
        .post(`/notifications/${notificationId}/confirm`)
        .set('identity-user-id', userId);

      expect(response.status).toBe(403);
      expect(response.body).toEqual({ error: 'Insufficient permissions' });
    });

    it('should return 401 when user ID is missing', async () => {
      const notificationId = 'notification456';

      const response = await request(app)
        .post(`/notifications/${notificationId}/confirm`);

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ error: 'User ID not found' });
    });

    it('should return 500 when permission service is unavailable', async () => {
      const userId = 'user123';
      const notificationId = 'notification456';

      // Mock permission service error
      nock(permissionServiceBaseUrl)
        .get('/permissions/check')
        .query({
          subjectId: userId,
          domain: 'NOTIFICATION',
          action: 'UPDATE'
        })
        .reply(500, 'Internal Server Error');

      const response = await request(app)
        .post(`/notifications/${notificationId}/confirm`)
        .set('identity-user-id', userId);

      expect(response.status).toBe(403);
      expect(response.body).toEqual({ error: 'Insufficient permissions' });
    });
  });
});