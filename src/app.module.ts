import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ProductsModule } from './products/products.module';
import { authConstants } from './auth/authConstants';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [
    DatabaseModule,
    UsersModule,
    JwtModule.register({
      global: true,
      secret: authConstants.jwtSecret,
      signOptions: { expiresIn: '30d' },
    }),
    ProductsModule,
    CategoryModule,
  ],
  controllers: [AppController, AuthController],
  providers: [AppService, AuthService],
})
export class AppModule {}
