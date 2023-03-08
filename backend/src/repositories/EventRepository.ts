import {Event} from '../models/Event';
import {prisma} from '../datasource/connectDB';
import {ApiError} from '../models/ApiError';
import {inject, injectable} from 'inversify';
import 'reflect-metadata';
import {PrismaErrorUtil} from '../datasource/PrismaErrorUtil';

@injectable()
export class EventRepository {

    constructor(@inject(PrismaErrorUtil) private errorUtil: PrismaErrorUtil) {
    }

    getAllEvents = (): Promise<Event[]> => {
        prisma.event
        return prisma.event.findMany();
    }

    createEvent = async (name: string, date_start: Date, date_end: Date, description: string, category_id: number, photo: Buffer): Promise<Event> => {
        try {
            return await prisma.event.create({
                data: {name, date_start, date_end, description, category_id, photo}
            });
        } catch (e: any) {
            if (this.errorUtil.isUniqueConstraintViolation(e)) {
                throw ApiError.badRequest('Event name should be unique');
            } else {
                throw ApiError.internal('Failed to update the event');
            }
        }
    }

    updateEvent = async (id: number, name: string, date_start: Date, date_end: Date, description: string, category_id: number, photo: Buffer): Promise<Event> => {
        const event: Event = await this.getEventById(id);
        if (event.name === name) {
            return event;
        }
        try {
            return await prisma.event.update({where:{id}, data:{name, date_start, date_end, description, category_id, photo}});
        } catch (e: any) {
            if (this.errorUtil.isUniqueConstraintViolation(e)) {
                throw ApiError.badRequest('Event name should be unique');
            } else {
                throw ApiError.internal('Failed to update the event');
            }
        }
    }

    getEventById = async (id: number): Promise<Event> => {
        try {
            return await prisma.event.findUniqueOrThrow({where:{id}});
        } catch (e: any) {
            if (this.errorUtil.isNotFound(e)) {
                throw ApiError.notFound('Event not found');
            } else {
                throw ApiError.internal('Failed to update the event');
            }
        }
    }

    deleteEventById = async (id: number): Promise<Event> => {
        try {
            return await prisma.event.delete({where:{id}});
        } catch (e) {
            if (this.errorUtil.isNotFound(e)) {
                throw ApiError.notFound('Event not found');
            } else {
                throw ApiError.internal('Failed to delete the event');
            }
        }
    }

}
