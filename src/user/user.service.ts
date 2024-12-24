import { Injectable } from '@nestjs/common';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(User) private userRepository: Repository<User>
    ) {}

    async findOneUser(_options: FindOneOptions<User>) {
        return this.userRepository.findOne(_options);
    }

    async findUsers(_options: FindManyOptions<User>) {
    return this.userRepository.find(_options);
    }

    async createUser(_user: Partial<User>) {
        return this.userRepository.save(_user);
    }
}
