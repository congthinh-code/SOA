import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AuthService } from './auth/auth.service';
import { HashCheckMiddleware } from './hash-check/hash-check.middleware';
import { AuthMiddleware } from './auth/auth.middleware'; // Import AuthMiddleware

@Module({
  imports: [
    JwtModule.register({
      secret: 'MY_SECRET_KEY_123',
      signOptions: { expiresIn: '15m' },
    }),
  ],
  controllers: [AppController],
  providers: [AuthService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // 1. HashCheckMiddleware cho route Đăng nhập
    consumer
      .apply(HashCheckMiddleware)
      .forRoutes({ path: 'auth/login', method: RequestMethod.POST });

    // 2. AuthMiddleware xác thực Token cho API Hello World
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: 'hello', method: RequestMethod.GET });
  }
}