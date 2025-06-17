import { Request, Response } from 'express';

import { Request, Response } from 'express';

export class HealthController {
  getHealth(req: Request, res: Response): void {
    console.log('Incoming request to getHealth');
    res.status(200).json({ status: "OK" });
  }
}