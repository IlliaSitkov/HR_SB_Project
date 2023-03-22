import {Event, EventPatchDto, EventPostDto} from "../models/Event"
import {prisma} from "../datasource/connectDB";
import {ApiError} from "../models/ApiError";
import {inject, injectable} from "inversify";
import 'reflect-metadata';
import {PrismaErrorUtil} from "../datasource/PrismaErrorUtil";

@injectable()
export class EventRepository {

    constructor(@inject(PrismaErrorUtil) private errorUtil: PrismaErrorUtil) {
    }

    getAllEvents = async () => {
        return prisma.event.findMany({
            include: {
                category: true
            }
        });
    }

    eventExists = async (id: number) => {
        const event = await prisma.event.findFirst({where: {id}});
        if (!event) {
            throw ApiError.badRequest(`Подію з id:${id} не знайдено`);
        }
        return event;
    };

    createEvent = async (event: EventPostDto) => {
        try {
            return await prisma.event.create({data: event});
        } catch (e: any) {
            console.log(e);
            if (this.errorUtil.isUniqueConstraintViolation(e)) {
                throw ApiError.badRequest(`Подія повинна бути унікальною`);
            } else {
                throw ApiError.internal(`Помилка при додаванні події`);
            }
        }
    }

    updateEvent = async (id: number, event: EventPatchDto) => {
        const ev = await this.eventExists(id);
        try {
            return await prisma.event.update({where:{id},
                data:{
                    name: event.name ? event.name : ev.name,
                    date_start: event.date_start ? event.date_start : ev.date_start,
                    date_end: event.date_end ? event.date_end : ev.date_end,
                    description: event.description ? event.description : ev.description,
                    category_id: event.category_id ? event.category_id : ev.category_id,
                    photo: event.photo ? event.photo : ev.photo
                },
                include: {
                    category: true
                }
            });
        } catch (e: any) {
            if (this.errorUtil.isUniqueConstraintViolation(e)) {
                throw ApiError.badRequest(`Подія повинна бути унікальною`);
            } else {
                throw ApiError.internal(`Помилка при оновленні події`);
            }
        }
    }

    getEventById = async (id: number): Promise<Event> => {
        try {
            return await prisma.event.findUniqueOrThrow({
                where:{id},
                include: {
                    category: true
                }
            });
        } catch (e: any) {
            if (this.errorUtil.isNotFound(e)) {
                throw ApiError.notFound(`Подію з id:${id} не знайдено`);
            } else {
                throw ApiError.internal(`Помилка при отриманні події`);
            }
        }
    }

    deleteEventById = async (id: number): Promise<Event> => {
        try {
            return await prisma.event.delete({
                where:{id},
                include: {
                    category: true
                }
            });
        } catch (e) {
            if (this.errorUtil.isNotFound(e)) {
                throw ApiError.notFound(`Подію з id:${id} не знайдено`);
            } else {
                throw ApiError.internal(`Помилка при видаленні події`);
            }
        }
    }

}