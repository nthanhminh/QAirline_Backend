import { FindAirportDto } from "@modules/airports/dto/findAirport.dto";
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { AppResponse, FindAllResponse } from "src/types/common.type";
import { CreateNewPlaneDto } from "./dto/createNewPlane.dto";
import { Plane } from "./entity/plane.entity";
import { UpdatePlaneDto } from "./dto/updatePlane.dto";
import { UpdateResult } from "typeorm";
import { JwtAccessTokenGuard } from "@modules/auth/guards/jwt-access-token.guard";
import { RolesGuard } from "@modules/auth/guards/roles.guard";
import { ERolesUser } from "@modules/users/enums/index.enum";
import { Roles } from "src/decorators/roles.decorator";
import { PlaneService } from "./planes.service";

@Controller('planes')
@ApiTags('planes')
@ApiBearerAuth('token')
export class PlaneController {

    constructor(private readonly planeService: PlaneService) {}

    @Roles(ERolesUser.USER, ERolesUser.ADMIN)
    @UseGuards(RolesGuard)
	@ApiBearerAuth('token')
	@UseGuards(JwtAccessTokenGuard)
    @Get(":id")
    @ApiOperation({
        description: "Find a plane by id"
    })
    async getPlaneById(
        @Query('id') id: string
    ): Promise<AppResponse<Plane>> {
        return {
            data: await this.planeService.getPlaneById(id),
        }
    }

    @Roles(ERolesUser.USER, ERolesUser.ADMIN)
    @UseGuards(RolesGuard)
	@ApiBearerAuth('token')
	@UseGuards(JwtAccessTokenGuard)
    @Get()
    @ApiOperation({
        description: "Get all of the planes list"
    })
    async getPlanes(): Promise<AppResponse<FindAllResponse<Plane>>> {
        return {
            data: await this.planeService.getPlaneList()
        }
    }

    @Roles(ERolesUser.ADMIN)
    @UseGuards(RolesGuard)
	@ApiBearerAuth('token')
	@UseGuards(JwtAccessTokenGuard)
    @Post()
    @ApiOperation({
        description: "Only admin can use this api: create New Plane"
    })
    async createNewPlane(@Body() dto: CreateNewPlaneDto) : Promise<AppResponse<Plane>> {
        return {
            data: await this.planeService.createPlane(dto),
        }
    }

    @Roles(ERolesUser.USER, ERolesUser.ADMIN)
    @UseGuards(RolesGuard)
	@ApiBearerAuth('token')
	@UseGuards(JwtAccessTokenGuard)
    @Patch(':id')
    @ApiOperation({
        description: "Only admin can use this api: update exsited plane"
    })
    async updatePlane(
        @Param('id') id: string,
        @Body() dto: UpdatePlaneDto,
    ) : Promise<AppResponse<UpdateResult>> {
        return {
            data: await this.planeService.updatePlane(id, dto),
        }
    }

    @Roles(ERolesUser.ADMIN)
    @UseGuards(RolesGuard)
	@ApiBearerAuth('token')
	@UseGuards(JwtAccessTokenGuard)
    @Delete(':id')
    @ApiOperation({
        description: "Only user can use this api: delete exsited plane"
    })
    async deletePlane(
        @Param('id') id: string,
    ) : Promise<AppResponse<UpdateResult>> {
        return {
            data: await this.planeService.deletePlane(id),
        }
    }
}
