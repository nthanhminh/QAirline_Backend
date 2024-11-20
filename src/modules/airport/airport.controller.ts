import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AirportService } from './airport.service';
import { CreateAirportDto } from './dto/create-airport.dto';
import { UpdateAirportDto } from './dto/update-airport.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ERolesUser } from '@modules/users/enums/index.enum';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from '@modules/auth/guards/roles.guard';
import { JwtAccessTokenGuard } from "@modules/auth/guards/jwt-access-token.guard";
import { Airport } from './entity/airport.entity';
import { AppResponseWithMessage } from 'src/types/common.type';


@ApiTags('airport')
@Controller('airport')
export class AirportController {
  constructor(private readonly airportService: AirportService) { }
  
  //! change to ADMIN
  // @Roles(ERolesUser.USER)
  // @UseGuards(RolesGuard)
  // @ApiBearerAuth('token')
  // @UseGuards(JwtAccessTokenGuard)
  @Post()
  async create(@Body() createAirportDto: CreateAirportDto): Promise<AppResponseWithMessage<Airport>>{
    console.log(createAirportDto);
    return {
      data: await this.airportService.create(createAirportDto),
      message: "ok"
    }
  }

  @Get()
  async findAll() : Promise<AppResponseWithMessage<Airport[]>>{
    return {
      data: (await this.airportService.findAll()).items,
      message: "ok"
    }
  }

  @Get(':code')
  async findOne(@Param('code') code: string) :Promise<AppResponseWithMessage<Airport>> {
    return {
      data: await this.airportService.findOne(code),
      message: "ok"
    }
  }

  @Get('search/code/:code')
  async search(@Param('code') code: string) :Promise<AppResponseWithMessage<Airport[]>> {
    return {
      data: await this.airportService.searchByCode(code),
      message: "ok"
    }
  }

  //! change to ADMIN
  @Roles(ERolesUser.USER)
  @UseGuards(RolesGuard)
  @ApiBearerAuth('token')
  @UseGuards(JwtAccessTokenGuard)
  @Patch(':code')
  update(@Param('code') id: string, @Body() updateAirportDto: UpdateAirportDto) {
    return this.airportService.update(id, updateAirportDto);
  }

    //! change to ADMIN
  @Roles(ERolesUser.USER)
  @UseGuards(RolesGuard)
  @ApiBearerAuth('token')
  @UseGuards(JwtAccessTokenGuard)
  @Delete(':code')
  remove(@Param('code') code: string) {
    return this.airportService.remove(code);
  }
}
