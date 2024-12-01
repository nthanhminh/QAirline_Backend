import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import dotenv from 'dotenv';

dotenv.config();
export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      console.log(process.env.Databse);
      const dataSource = new DataSource({
        type: 'postgres', // Change to 'postgres' for PostgreSQL
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
