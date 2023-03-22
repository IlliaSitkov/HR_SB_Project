import {inject, injectable} from 'inversify';
import {EventRepository} from '../repositories/EventRepository';
import {Event, EventPatchDto, EventPostDto} from '../models/Event';
import {ApiError} from '../models/ApiError';
import {CategoryService} from './CategoryService';

@injectable()
export class EventService {

    public constructor(@inject(EventRepository) private eventRepository: EventRepository,
                       @inject(CategoryService) private categoryService: CategoryService) {
    }

    getEvents = (): Promise<Event[]> => {
        return this.eventRepository.getAllEvents();
    };

    getEventById = (id: number): Promise<Event>=> {
        return this.eventRepository.getEventById(id);
    };

    createEvent = async (event: EventPostDto) => {
        return this.eventRepository.createEvent(event);
    };

    updateEvent = async (id: number, event: EventPatchDto) => {
        return this.eventRepository.updateEvent(id, event);
    };

    deleteEventById = (id: number): Promise<Event> => {
        return this.eventRepository.deleteEventById(id);
    };

    checkAndFormatEventDataForPost = async (eventData: any) => {
        // check whether category exists
        let category_id = eventData.category_id ?
            await this.categoryService.getById(eventData.category_id) : undefined;
        if(eventData.category_id === 0){
            category_id =  await this.categoryService.getById(eventData.category_id);
        }
        if (category_id === undefined)
            {throw ApiError.badRequest('Категорії з таким id не існує');}
        const event: EventPostDto = {
            name: eventData.name,
            date_start: eventData.date_start,
            date_end: eventData.date_end,
            description: eventData.description,
            category_id: eventData.category_id,
            photo: eventData.photo
        };
        return event;
    };

    checkAndFormatEventDataForPatch = async (eventData: any) => {
        const event: EventPatchDto = {
            name: eventData.name,
            date_start: eventData.date_start,
            date_end: eventData.date_end,
            description: eventData.description,
            category_id: eventData.category_id,
            photo: eventData.photo
        };
        return event;
    };
}