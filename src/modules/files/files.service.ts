import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateFileDto } from './dto/create-file.dto';
import { FilesRepository } from '@repositories/files.repository';
import { Files } from './entities/file.entity';
import { FindAllResponse } from 'src/types/common.type';
import { UpdateResult } from 'typeorm';

@Injectable()
export class FilesService {
  constructor(
    @Inject("FILES_REPOSITORY") 
    private filesRepository: FilesRepository, 
  ) {}

  async createFile(fileDto: CreateFileDto): Promise<Files> {
    return await this.filesRepository.create(fileDto);
  }

  async findAll(): Promise<FindAllResponse<Files>> {
    return await this.filesRepository.findAll({});
  }

  async findById(id: string): Promise<Files> {
    return await this.filesRepository.findOneById(id); 
  }

  async updateFile(id: string, fileDto: CreateFileDto): Promise<UpdateResult> {
    const file = await this.filesRepository.findOneById(id);
    if (!file) {
      throw new Error('File not found');
    }
    return await this.filesRepository.update(id, fileDto); 
  }

  async deleteFile(id: string): Promise<void> {
    const file = await this.filesRepository.findOneById(id);
    if (!file) {
      throw new Error('File not found');
    }
    await this.filesRepository.softDelete(id); 
  }

  async uploadFiles(files: Express.Multer.File[]): Promise<Files[]> {
	const dtos = []

    for (const file of files) {
	  dtos.push({
		path: file.path,
		filename: file.filename,
		mimetype: file.mimetype,
	  })
    }

    return this.filesRepository.insert(dtos);
  }
}
