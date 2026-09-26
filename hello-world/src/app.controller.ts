import { Controller, Post, Get, Body, UseGuards, Request, Headers, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './jwt-auth/jwt-auth.guard';

@Controller()
export class AppController {
  constructor(private readonly authService: AuthService) {}

  // 1. Router đăng nhập công khai
  @Post('auth/login')
  async login(@Body() body: { userName: string; password: string }) {
    return this.authService.validateAndLogin(body.userName, body.password);
  }

  // 2. Router bảo vệ - Yêu cầu có JWT hợp lệ ở Header
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: any) {
    return {
      message: 'Truy cập tài nguyên thành công!',
      userData: req.user,
    };
  }

  // 2. API Xác thực Token: POST http://localhost:3000/auth
  @Post('auth')
  async verifyToken(@Headers('authorization') authHeader: string) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Thiếu hoặc sai định dạng Bearer Token trong Header');
    }

    // Tách lấy chuỗi token đằng sau chữ "Bearer "
    const token = authHeader.split(' ')[1];
    return this.authService.verifyToken(token);
  }

  // Route in dòng Hello World (sẽ được bảo vệ bởi AuthMiddleware)
  @Get('hello')
  getHello(@Request() req: any) {
    return {
      message: 'Hello World',
      currentUser: req.user, // Dữ liệu user giải mã từ AuthMiddleware
    };
  }
}