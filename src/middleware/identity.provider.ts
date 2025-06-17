import { Request } from 'express';

export class IdentityProvider {
  getUserId(req: Request): string | null {
    console.log(`[IdentityProvider] Received headers: ${JSON.stringify(req.headers)}`);
    const userId = req.header('identity-user-id');
    console.log(`[IdentityProvider] Extracted userId: ${userId}`);
    return userId || null;
  }
}