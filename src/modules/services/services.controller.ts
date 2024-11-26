import { AppResponse, FindAllResponse } from "src/types/common.type";
import { ServiceHandler } from "./services.handler";
import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Services } from "./entity/service.entity";
import { CreateNewServiceDto } from "./dto/createNewService.dto";
import { ServiceItemDto } from "./dto/service.dto";
import { UpdateResult } from "typeorm";
import { ServiceUpdateDto } from "./dto/updateService.dto";
import { JwtAccessTokenGuard } from "@modules/auth/guards/jwt-access-token.guard";
import { RolesGuard } from "@modules/auth/guards/roles.guard";
import { ERolesUser } from "@modules/users/enums/index.enum";
import { Roles } from "src/decorators/roles.decorator";

@Controller('services')
@ApiTags('services')
@ApiBearerAuth('token')
export class ServicesController {
    constructor(private readonly servicesHandler: ServiceHandler) {}
    @Get()
    async getAllServices(): Promise<AppResponse<FindAllResponse<Services>>> {
        return {
            data: await this.servicesHandler.getAllServices()
        }
    }

    @Roles(ERolesUser.ADMIN)
    @UseGuards(RolesGuard)
	@UseGuards(JwtAccessTokenGuard)
    @Post()
    async createNewService(@Body() dto: CreateNewServiceDto) : Promise<AppResponse<Services>> {
        return {
            data: await this.servicesHandler.createNewService(dto)
        }
    }

    @Roles(ERolesUser.ADMIN)
    @UseGuards(RolesGuard)
	@UseGuards(JwtAccessTokenGuard)
    @Patch('/addService/:id')
    async addNewService(
        @Param('id') id: string,
        @Body() dto: ServiceItemDto
    ) : Promise<AppResponse<UpdateResult>> {
        return {
            data: await this.servicesHandler.addNewServiceChild(id, dto),
        }
    }

    @Roles(ERolesUser.ADMIN)
    @UseGuards(RolesGuard)
	@UseGuards(JwtAccessTokenGuard)
    @Patch(':id')
    async updateService(
        @Param('id') id: string,
        @Body() dto: ServiceUpdateDto
    ) : Promise<AppResponse<UpdateResult>> {
        return {
            data: await this.servicesHandler.updateService(id, dto),
        }
    }

    @Roles(ERolesUser.ADMIN)
    @UseGuards(RolesGuard)
	@UseGuards(JwtAccessTokenGuard)
    @Delete(':id')
    async deleteService(
        @Param('id') id: string
    ) : Promise<AppResponse<UpdateResult>> {
        return {
            data: await this.servicesHandler.deleteService(id),
        }
    }
}