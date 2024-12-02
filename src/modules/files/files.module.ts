import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { SharedModule } from '@modules/shared/shared.module';
import { DatabaseModule } from '@modules/databases/databases.module';
import { filesProviders } from './files.provider';

@Module({
	imports: [
		DatabaseModule,
		SharedModule,
	],
	controllers: [FilesController],
	providers: [...filesProviders, FilesService],
	exports: [FilesService]
})
export class FilesModule {}
