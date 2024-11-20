import { Module } from '@nestjs/common';
import { AirportService } from './airport.service';
import { AirportController } from './airport.controller';
import { DatabaseModule } from '@modules/databases/databases.module';
import { SharedModule } from '@modules/shared/shared.module';
import { airportProviders } from './airport.provider';

@Module({
  imports: [
    DatabaseModule,
    SharedModule
],
  controllers: [AirportController],
  providers: [AirportService,...airportProviders],
})
export class AirportModule {}
