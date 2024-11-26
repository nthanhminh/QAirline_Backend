import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { UserRepository } from "@repositories/user.repository";
import { BaseServiceAbstract } from "src/services/base/base.abstract.service";
import { User } from "./entity/user.entity";
import { CreateNewUserDto } from "./dto/createNewUser.dto";
import { UpdateUserDto } from "./dto/updateUser.dto";

@Injectable()
export class UsersService extends BaseServiceAbstract<User>{
    constructor(
        @Inject('USER_REPOSITORY')
        private readonly userRepository: UserRepository,
      ) {
        super(userRepository);
      }
    async create(dto: CreateNewUserDto) : Promise<User> {
        const { birthOfDate, ...data } = dto;
        const convertedBirthOfDate = new Date(birthOfDate);
        return await this.userRepository.create({
            ...data,
            birthOfDate: convertedBirthOfDate
        });
    }

    async updateUser(dto: UpdateUserDto, user: User) : Promise<User> {
        await this.userRepository.update(user.id, dto);
        return await this.userRepository.findOneById(user.id);
    }

    async findUserById(id: string) : Promise<User> {
        return await this.userRepository.findOneById(id);
    }

    async findByEmail(email: string): Promise<User | null> {
        return await this.findOneByCondition({ email });
    }

    async deleteUser(id: string) {
        return await this.userRepository.softDelete(id);
    }

    async getUserWithRole(userId: string) : Promise<User> {
        if(!userId) {
            throw new NotFoundException('users.user not found');
        }
        return await this.userRepository.findOneById(userId);
    }
}