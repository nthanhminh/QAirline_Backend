import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'DATA_SOURCE',
      useFactory: async (configService: ConfigService) => {
        const dataSource = new DataSource({
          type: 'postgres',
          url: configService.get('DATABASE_URL'), 
          useUTC: true,
          database: 'qairline_database',
          entities: [__dirname + '/../**/*.entity{.ts,.js}'],
          ssl: {
            rejectUnauthorized: false, 
          },
          synchronize: false,  
        });

        return dataSource.initialize();
      },
      inject: [ConfigService],
    },
  ],
  exports: ['DATA_SOURCE'],  // Make sure DATA_SOURCE is exported
})
export class DatabaseModule {}
