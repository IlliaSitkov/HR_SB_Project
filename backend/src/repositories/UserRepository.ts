import 'reflect-metadata';
import {inject, injectable} from 'inversify';
import {prisma} from '../datasource/connectDB';
import {User, UserAdd, UserOptionalUpdate, UserUpdateByPersonId} from '../models/User';
import {RoleEnum} from '../utils/enum/Role.enum';
import {PrismaErrorUtil} from '../datasource/PrismaErrorUtil';
import {ApiError} from '../models/ApiError';

@injectable()
export class UserRepository {
    constructor(@inject(PrismaErrorUtil) private errorUtil: PrismaErrorUtil) {
    }

    async getUserByEmail(email: string) {
        const query = await prisma.user.findFirst({
            where: {
                person: {
                    email
                }
            }
        });

        if (query) {
            const user: User = {
                id: query.id,
                personId: query.person_id,
                role: RoleEnum[query.role]
            };
            return user;
        }

        return null;
    }

    async getAllUsers() {
        const query = await prisma.user.findMany({
            select: {
                id: true,
                role: true,
                person_id: true
            }
        });

        return query.map((user) => {
            //Map object here with camel case person Id
            return {
                id: user.id,
                personId: user.person_id,
                role: RoleEnum[user.role]
            };
        });
    }

    async addUser(user: UserAdd) {
        try {
            const query = await prisma.user.create({
                data: {
                    // @ts-ignore
                    role: RoleEnum[user.role],
                    person: {connect: {id: user.personId}}
                },
            });
            return {
                id: query.id,
                personId: query.person_id,
                role: RoleEnum[query.role]
            };
        } catch (e: any) {
            if (this.errorUtil.isRelationViolation(e)) {
                throw ApiError.badRequest('У цієї людини вже є користувацький акаунт.');
            } else if (this.errorUtil.isNotFound(e)) {
                throw ApiError.badRequest('Людини, для якої Ви намагаєтеся створити акаунт, не існує');
            } else {
                throw ApiError.internal('Помилка при додаванні користувача');
            }
        }
    }

    async getUserById(id: number) {
        const query = await prisma.user.findFirst({
            where: {
                id
            }
        });

        if (query) {
            const user: User = {
                id: query.id,
                personId: query.person_id,
                role: RoleEnum[query.role]
            };
            return user;
        }

        return null;
    }

    async deleteUserById(id: number) {
        try {
            const query = await prisma.user.delete({where: {id}});
            return {
                id: query.id,
                personId: query.person_id,
                role: RoleEnum[query.role]
            };
        } catch (e: any) {
            console.log(e);
            if (this.errorUtil.isNotFound(e)) {
                throw ApiError.notFound(`Користувача з id:${id} не знайдено`);
            } else {
                throw ApiError.internal('Помилка при видаленні користувача');
            }
        }
    }

    async updateUser(user: UserOptionalUpdate) {
        try {
            const query = await prisma.user.update({
                where: {id: user.id},
                // @ts-ignore
                data: {
                    //Include role only if defined
                    ...(user.role && {role: RoleEnum[user.role]}),
                },
            });
            return {
                id: query.id,
                personId: query.person_id,
                role: RoleEnum[query.role]
            };
        } catch (e: any) {
            if (this.errorUtil.isNotFound(e)) {
                throw ApiError.badRequest(`Користувача з id:${user.id} не знайдено`);
            } else {
                throw ApiError.internal('Помилка при редагуванні користувача');
            }
        }
    }

    async updateUserByPersonId(user: UserUpdateByPersonId) {
        try {
            const query = await prisma.user.update({
                where: {person_id: user.personId},
                data: {
                    // @ts-ignore
                    role: RoleEnum[user.role],
                },
            });
            return {
                id: query.id,
                personId: query.person_id,
                role: RoleEnum[query.role]
            };
        } catch (e: any) {
            if (this.errorUtil.isNotFound(e)) {
                return this.addUser(user);
            } else {
                throw ApiError.internal('Помилка при редагуванні користувача');
            }
        }
    }
}
