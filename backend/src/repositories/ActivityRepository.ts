import {prisma} from '../datasource/connectDB';
import {ApiError} from '../models/ApiError';
import {Activity} from '../models/Activity';
import {inject, injectable} from 'inversify';
import {PrismaErrorUtil} from '../datasource/PrismaErrorUtil';
import 'reflect-metadata';

@injectable()
export class ActivityRepository {

    constructor(@inject(PrismaErrorUtil) private errorUtil: PrismaErrorUtil) {
    }

    activityExists = async (person_id: number, event_id: number) => {
        const activity = await prisma.activity.findFirst({where: {person_id, event_id}});
        if (!activity) {
            throw ApiError.badRequest(`Людина з id:${person_id} не має активності у події з id:${event_id}`);
        }
        return activity;
    };

    createActivity = async (activity: Activity) => {
        try {
            return await prisma.activity.create({data: activity});
        } catch (err: any) {
            if (this.errorUtil.isUniqueConstraintViolation(err)) {
                throw ApiError.badRequest('Ця активність вже існує');
            } else {
                throw ApiError.internal('Помилка при додаванні активності');
            }
        }
    };

    updateActivity = async (activity: Activity) => {
        const act = await this.activityExists(activity.person_id, activity.event_id);
        try {
            return await prisma.activity.updateMany({
                where: {
                    person_id: activity.person_id,
                    event_id: activity.event_id
                },
                data: {
                    hours: activity.hours ? activity.hours : act.hours,
                    position: activity.position ? activity.position : act.position,
                    contribution: activity.contribution ? activity.contribution : act.contribution
                }
            });
        } catch (err) {
            throw ApiError.internal('Помилка при оновленні активності');
        }
    };

    deleteActivity = async (person_id: number, event_id: number) => {
        try {
            return await prisma.activity.deleteMany({
                where: {
                    person_id,
                    event_id
                }
            });
        } catch (err) {
            console.log(err);
            if (this.errorUtil.isNotFound(err)) {
                return [];
            } else {
                throw ApiError.internal('Помилка при видаленні активності');
            }
        }
    };

    getActivitiesByEventId = async (event_id: number) => {
        try {
            return await prisma.activity.findMany(
                {
                    where: {
                        event_id
                    },
                    include: {
                        person: {
                            select: {
                                name: true,
                                parental: true,
                                surname: true,
                                status: true
                            },
                        },
                        event: {
                            select: {
                                name: true,
                                date_start: true
                            }
                        }
                    },
                    orderBy: {
                        person: {
                            surname: 'asc'
                        }
                    }
                });
        } catch (e: any) {
            if (this.errorUtil.isNotFound(e)) {
                return [];
            } else {
                throw ApiError.internal(`Помилка при отриманні активності на події`);
            }
        }
    };

    getActivitiesByPersonId = async (person_id: number) => {
        try {
            return await prisma.activity.findMany(
                {
                    where: {
                        person_id
                    },
                    include: {
                        person: {
                            select: {
                                name: true,
                                parental: true,
                                surname: true,
                                status: true
                            },
                        },
                        event: {
                            select: {
                                name: true,
                                date_start: true
                            }
                        }
                    },
                    orderBy: {
                        event: {
                            date_start: 'desc'
                        }
                    }
                });
        } catch (e: any) {
            if (this.errorUtil.isNotFound(e)) {
                return [];
            } else {
                throw ApiError.internal(`Помилка при отриманні активності людини`);
            }
        }
    };

}
