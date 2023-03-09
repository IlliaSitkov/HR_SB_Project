import {inject, injectable} from 'inversify';
import {ActivityRepository} from '../repositories/ActivityRepository';
import {Activity} from '../models/Activity';
import {ApiError} from '../models/ApiError';
import {EventService} from './EventService';
import {PersonService} from './PersonService';

@injectable()
export class ActivityService {
    public constructor(@inject(ActivityRepository) private activityRepository: ActivityRepository,
                       @inject(EventService) private eventService: EventService,
                       @inject(PersonService) private personService: PersonService) {
    }

    getActivitiesByEventId = (event_id: number) => {
        return this.activityRepository.getActivitiesByEventId(event_id);
    };

    getActivitiesByPersonId = (person_id: number) => {
        return this.activityRepository.getActivitiesByPersonId(person_id);
    };

    createActivity = async (activity: Activity) => {
        return this.activityRepository.createActivity(activity);
    };

    updateActivity = async (activity: Activity) => {
        return this.activityRepository.updateActivity(activity);
    };

    checkAndFormatActivityDataPost = async (activityData: any) => {
        // check whether person exists
        const person_id = (activityData.person_id || activityData.person_id === 0) ?
            await this.personService.getPersonById(activityData.person_id) : undefined;
        if (!person_id)
            {throw ApiError.badRequest('Людини з таким id не існує');}
        // check whether event exists
        const event_id = (activityData.event_id || activityData.event_id === 0) ?
            await this.eventService.getEventById(activityData.event_id) : undefined;
        if(!event_id)
            {throw ApiError.badRequest('Події з таким id не існує');}
        const activity: Activity = {
            person_id: activityData.person_id,
            event_id: activityData.event_id,
            hours: 0,
            position: 'Учасник',
            contribution: 'Організація події'
        };
        return activity;
    };

    checkAndFormatActivityDataPut = async (activityData: any) => {
        const activity: Activity = {
            person_id: activityData.person_id,
            event_id: activityData.event_id,
            hours: activityData.hours,
            position: activityData.position,
            contribution: activityData.contribution
        };
        return activity;
    };

    deleteActivityById = (person_id: number, event_id: number) => {
        return this.activityRepository.deleteActivity(person_id, event_id);
    };
}
