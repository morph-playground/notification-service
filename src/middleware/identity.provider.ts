import { Request } from 'express';

export class IdentityProvider {
  getUserId(req: Request): string | null {
    console.log('Retrieving user ID from request headers...');
    const userId = req.header('identity-user-id');
    console.log(`User ID found: ${userId || 'null'}`);
    return userId || null;
  }
}