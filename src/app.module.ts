import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GenaiModule } from './genai/genai.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RoleModule } from './role/role.module';
import { RoleFeatureModule } from './role-feature/role-feature.module';
import { FeatureModule } from './feature/feature.module';
import { User } from './user/entities/user.entity';
import { Role } from './role/entities/role.entity';
import { Feature } from './feature/entities/feature.entity';
import { RoleFeature } from './role-feature/entities/role-feature.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: Number(configService.get<number>('DB_PORT')),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        autoLoadEntities: true,
        synchronize: true,
        entities: [
          User,
          Role,
          Feature,
          RoleFeature
        ],
      }),
    }), 
    GenaiModule, 
    AuthModule, 
    RoleModule, 
    RoleFeatureModule, 
    FeatureModule
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    }
  ],
})
export class AppModule {}
