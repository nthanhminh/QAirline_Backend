import { Inject, Injectable, NotFoundException, UnprocessableEntityException } from "@nestjs/common";
import { BaseServiceAbstract } from "src/services/base/base.abstract.service";
import { News } from "./entity/news.entity";
import { NewsRepository } from "@repositories/news.repository";
import { CreateNewsDto } from "./dto/createNews.dto";
import { AirportService } from "@modules/airports/airport.service";
import { Airport } from "@modules/airports/entity/airport.entity";
import { UpdateNewsDto } from "./dto/updateNews.dto";
import { FindOptionsWhere, UpdateResult } from "typeorm";
import { PaginationDto } from "src/common/dto/pagination.dto";
import * as moment from "moment";
import { ENewsType } from "./enums/index.enums";
import { FilterNewsDto } from "./dto/getNews.dto";
import { _getSkipLimit } from "src/helper/pagination.helper.dto";
import { FindAllResponse } from "src/types/common.type";
@Injectable()
export class NewsService extends BaseServiceAbstract<News> {
    constructor(
        @Inject('NEWS_REPOSITORY') 
        private readonly newsRepository: NewsRepository,
        private readonly airportService: AirportService
    ) {
        super(newsRepository);
    }

    async createNews(dto: CreateNewsDto) : Promise<News> {
        let {airportIds, endTime, ...data} = dto;
        let aiports: Airport[] = [];
        let endTimeDate;
        if (airportIds) {
            const ids = Array.isArray(airportIds) ? airportIds : [airportIds];
            aiports = await Promise.all(
              ids.map(async (id) => {
                const airport = await this.airportService.findOne(id);
                if (!airport) {
                    throw new NotFoundException(`airports.airport not found`);
                }
                return airport;
              }),
            );
        }
        if(endTime) {
            endTimeDate = moment(endTime, 'DD-MM-YYYY HH:mm:ss').toDate();
        }
        if(!endTime && data.type === ENewsType.DISCOUNT) {
            throw new UnprocessableEntityException('news.invalid news');
        }
        return await this.newsRepository.create({
            ...data,
            airports: airportIds ? aiports : null,
            endTime: endTime ? endTimeDate : null,
        })
    }

    async updateNews(id: string, dto: UpdateNewsDto) : Promise<UpdateResult> {
        const news = await this.newsRepository.findOneById(id);
        if(!news) {
            throw new NotFoundException('news.news not found');
        }
        let {airportIds, endTime, ...data} = dto;
        let aiports: Airport[] = [];
        let endTimeDate;
        if(endTime) {
            endTimeDate = moment(endTime, 'DD-MM-YYYY HH:mm:ss').toDate();
        }
        if(!endTime && data.type === ENewsType.DISCOUNT) {
            throw new UnprocessableEntityException('news.invalid news');
        }
        if (airportIds) {
            const ids = Array.isArray(airportIds) ? airportIds : [airportIds];
            aiports = await Promise.all(
              ids.map(async (id) => {
                const airport = await this.airportService.findOne(id);
                if (!airport) {
                  throw new NotFoundException(`airports.airport not found`);
                }
                return airport;
              }),
            );
        }
        const updateData: any = {
            ...data,
        };
    
        if (endTime) {
            updateData.endTime = endTimeDate;
        }
    
        if (airportIds) {
            updateData.airports = aiports;
        }
        return await this.newsRepository.update(id, updateData);
    }

    async deleteNews(id) : Promise<UpdateResult> {
        return await this.newsRepository.softDelete(id);
    }

    async getAllNews(dto: FilterNewsDto) : Promise<FindAllResponse<News>> {
        const condition: FindOptionsWhere<News> = {}
        const {type, page, pageSize} = dto;
        const {skip , limit} = _getSkipLimit({page, pageSize});
        if(type) {
            condition.type = type;
        }
        return await this.newsRepository.findAll(condition, {
            relations: ["airports"],
            take: limit,
            skip: skip
        });
    }
}