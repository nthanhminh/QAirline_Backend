import { DataSource } from 'typeorm';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'postgres', // Change to 'postgres' for PostgreSQL
        host: 'localhost', // PostgreSQL host
        port: 5432, // Default PostgreSQL port
        username: 'postgres', // PostgreSQL username
        password: 'admin', // PostgreSQL password
        database: 'Qairline_db', 
        entities: [
            __dirname + '/../**/*.entity{.ts,.js}',
        ],
        synchronize: true, // Be cautious with 'synchronize' in production
      });

      return dataSource.initialize();
    },
  },
];
