import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import dotenv from 'dotenv';

dotenv.config();
export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'postgres', 
        useUTC: true,
        database: 'qairline_database', 
        entities: [
            __dirname + '/../**/*.entity{.ts,.js}',
        ],
        ssl: {
          rejectUnauthorized: false, 
        },
        synchronize: true,
      });

      return dataSource.initialize();
    },
  },
];
