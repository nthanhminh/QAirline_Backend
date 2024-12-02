import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { AppResponse, FindAllResponse } from "src/types/common.type";
import { FilterNewsDto } from "./dto/getNews.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { News } from "./entity/news.entity";
import { NewsService } from "./news.service";
import { CreateNewsDto } from "./dto/createNews.dto";
import { UpdateResult } from "typeorm";
import { UpdateNewsDto } from "./dto/updateNews.dto";
import { JwtAccessTokenGuard } from "@modules/auth/guards/jwt-access-token.guard";
import { RolesGuard } from "@modules/auth/guards/roles.guard";
import { ERolesUser } from "@modules/users/enums/index.enum";
import { Roles } from "src/decorators/roles.decorator";

@Controller('news')
@ApiTags('news')
export class NewsController {
    constructor(
        private readonly newsService: NewsService
    ) {}
    @Get()
    async getAllNews(@Query() dto: FilterNewsDto): Promise<AppResponse<FindAllResponse<News>>> {
        return {
            data: await this.newsService.getAllNews(dto)
        }
    }

    @Roles(ERolesUser.ADMIN)
    @UseGuards(RolesGuard)
	@UseGuards(JwtAccessTokenGuard)
    @ApiBearerAuth('token')
    @Post()
    async createNews(@Body() dto: CreateNewsDto) : Promise<AppResponse<News>> {
        return {
            data: await this.newsService.createNews(dto),
        }
    }

    @Roles(ERolesUser.ADMIN)
    @UseGuards(RolesGuard)
	@UseGuards(JwtAccessTokenGuard)
    @ApiBearerAuth('token')
    @Patch(':id')
    async updateNews(
        @Param('id') id: string,
        @Body() dto: UpdateNewsDto
    ) : Promise<AppResponse<UpdateResult>> {
        return {
            data: await this.newsService.updateNews(id, dto),
        }
    }

    @Roles(ERolesUser.ADMIN)
    @UseGuards(RolesGuard)
	@UseGuards(JwtAccessTokenGuard)
    @ApiBearerAuth('token')
    @Delete(':id')
    async deleteNews(@Param('id') id: string) : Promise<AppResponse<UpdateResult>> {
        return {
            data: await this.newsService.deleteNews(id),
        }
    }
}