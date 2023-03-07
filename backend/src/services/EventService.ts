import {inject, injectable} from 'inversify';
import {EventRepository} from '../repositories/EventRepository';
import {Event} from '../models/Event';

@injectable()
export class EventService {

    constructor(@inject(EventRepository) private eventRepository: EventRepository) {
    }

    getAll = (): Promise<Event[]> => {
        return this.eventRepository.getAllEvents();
    }

    getById = (id: number): Promise<Event>=> {
        return this.eventRepository.getEventById(id);
    }

    create = (name: string, date_start: Date, date_end: Date, description: string, category_id: number, photo: Buffer): Promise<Event> => {
        return this.eventRepository.createEvent(name, date_start, date_end, description, category_id, photo);
    }

    update = (id: number, name: string, date_start: Date, date_end: Date, description: string, category_id: number, photo: Buffer): Promise<Event> => {
        return this.eventRepository.updateEvent(id, name, date_start, date_end, description, category_id, photo);
    }

    deleteById = (id: number): Promise<Event> => {
        return this.eventRepository.deleteEventById(id);
    }

}