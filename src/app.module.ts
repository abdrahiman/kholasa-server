import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { LessonsModule } from './lessons/lessons.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    DatabaseModule,
     AuthModule,
     UserModule,
      LessonsModule
    ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
