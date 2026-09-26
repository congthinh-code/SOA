import { Injectable, NestMiddleware, BadRequestException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class HashCheckMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Thêm dấu '|| {}' để tránh crash khi req.body bị undefined
    const { userName, password } = req.body || {};

    if (!userName || !password) {
      throw new BadRequestException('userName và password không được để trống trong Request Body');
    }

    console.log(`[Middleware] Receiving login attempt for: ${userName}`);
    console.log(`[Middleware] Hashed password from client: ${password}`);

    next();
  }
}