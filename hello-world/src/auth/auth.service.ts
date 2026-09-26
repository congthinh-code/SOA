import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as CryptoJS from 'crypto-js';

@Injectable()
export class AuthService {
  // Giả lập Database lưu sẵn User (Mật khẩu '123456' đã MD5 từ trước: e10adc3949ba59abbe56e057f20f883e)
  private readonly users = [
    {
      id: 1,
      userName: 'admin',
      passwordMd5: CryptoJS.MD5('123456').toString(), // "e10adc3949ba59abbe56e057f20f883e"
      role: 'admin',
    },
  ];

  constructor(private readonly jwtService: JwtService) {}

  async validateAndLogin(userName: string, passwordFromClient: string) {
    const user = this.users.find((u) => u.userName === userName);

    // So sánh chuỗi MD5 từ client gửi lên với MD5 trong DB
    if (!user || user.passwordMd5 !== passwordFromClient.toLowerCase()) {
      throw new UnauthorizedException('Tài khoản hoặc mật khẩu không chính xác');
    }

    // Sinh JWT Payload
    const payload = { sub: user.id, userName: user.userName, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    return {
      message: 'Đăng nhập thành công',
      access_token: accessToken,
    };
  }

  // Hàm xác thực token truyền vào
  async verifyToken(token: string) {
    try {
      // Xác minh chữ ký và thời hạn của Token
      const payload = await this.jwtService.verifyAsync(token);
      return {
        valid: true,
        message: 'Token hợp lệ',
        user: payload,
      };
    } catch (error) {
      throw new UnauthorizedException('Token không hợp lệ hoặc đã hết hạn');
    }
  }
}