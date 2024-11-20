import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { CreateNewUserDto } from "./dto/createNewUser.dto";
import { User } from "./entity/user.entity";
import { UsersService } from "./user.services";
import { AppResponse } from "src/types/common.type";
import { UpdateUserDto } from "./dto/updateUser.dto";
import { CurrentUserDecorator } from "src/decorators/current-user.decorator";
import { ApiTags } from "@nestjs/swagger";

@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(private userService: UsersService) {}
    @Post()
    async createNewUser(@Body() dto: CreateNewUserDto): Promise<AppResponse<User>> {
        return {
            data: await this.userService.create(dto),
        }
    }

    @Patch()
    async updateUser(@Body() dto: UpdateUserDto, @CurrentUserDecorator() user: User): Promise<AppResponse<User>> {
        return {
            data: await this.userService.updateUser(dto, user),
        }
    }

    @Get(':id')
    async getUserInfo(@Param() id: string): Promise<AppResponse<User>> {
        return {
            data: await this.userService.findUserById(id),
        }
    }

    @Delete(':id')
    async deleteUser(@Param() id: string): Promise<AppResponse<any>> {
        return {
            data: await this.userService.deleteUser(id),
        }
    }
}