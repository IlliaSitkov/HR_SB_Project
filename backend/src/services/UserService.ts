import 'reflect-metadata';
import {inject, injectable} from 'inversify';
import {UserRepository} from '../repositories/UserRepository';
import {UserAdd, UserOptionalUpdate, UserUpdateByPersonId} from '../models/User';

@injectable()
export class UserService {
    public constructor(@inject(UserRepository) private userRepository: UserRepository) {
    }

    async getUserByEmail(email: string) {
        return this.userRepository.getUserByEmail(email);
    }

    async getById(id: number) {
        return this.userRepository.getUserById(id);
    }

    async getAll() {
        return this.userRepository.getAllUsers();
    }

    async add(user: UserAdd) {
        return this.userRepository.addUser(user);
    }

    async update(user: UserOptionalUpdate) {
        return this.userRepository.updateUser(user);
    }

    async updateByPersonId(user: UserUpdateByPersonId) {
        return this.userRepository.updateUserByPersonId(user);
    }

    async deleteById(id: number) {
        return this.userRepository.deleteUserById(id);
    }
}
