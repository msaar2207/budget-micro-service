// src/common/interfaces/express.interface.ts

import { Request } from 'express';
import { User } from 'src/auth/interfaces/user.interface';

export interface AuthenticatedRequest extends Request {
  user: User; // You can further define the type of 'user' based on your application
}
