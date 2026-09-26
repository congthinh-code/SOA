import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    // 1. Kiểm tra sự tồn tại của Header Authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        'Thiếu hoặc sai định dạng Bearer Token trong Header',
      );
    }

    // 2. Tách lấy chuỗi Token
    const token = authHeader.split(' ')[1];

    try {
      // 3. Giải mã và verify Token
      const decodedPayload = await this.jwtService.verifyAsync(token);

      // 4. Gắn thông tin User giải mã được vào request object
      (req as any).user = decodedPayload;

      // 5. Cho phép Request đi tiếp tới Controller
      next();
    } catch (error) {
      throw new UnauthorizedException('Token không hợp lệ hoặc đã hết hạn');
    }
  }
}