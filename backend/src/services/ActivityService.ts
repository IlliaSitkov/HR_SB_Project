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

    getActivityByEventId = (event_id: number) => {
        return this.activityRepository.getActivityByEventId(event_id);
    };

    getActivityByPersonId = (person_id: number) => {
        return this.activityRepository.getActivityByPersonId(person_id);
    };

    createActivity = async (activity: Activity) => {
        return this.activityRepository.createActivity(activity);
    };

    updateActivity = async (person_id: number, event_id: number, activity: Activity) => {
        return this.activityRepository.updateActivity(person_id, event_id, activity);
    };

    checkAndFormatActivityDataPost = async (activityData: any) => {
        // check whether person exists
        let person_id = activityData.person_id ?
            await this.personService.getPersonById(activityData.person_id) : undefined;
        if(activityData.person_id === 0){
            person_id = await this.personService.getPersonById(activityData.person_id);
        }
        if (person_id === undefined)
            {throw ApiError.badRequest('Людини з таким id не існує');}
        // check whether event exists
        let event_id = activityData.event_id ?
            await this.eventService.getEventById(activityData.event_id) : undefined;
        if(activityData.event_id === 0){
            event_id = await this.eventService.getEventById(activityData.event_id);
        }
        if(event_id === undefined)
            {throw ApiError.badRequest('Події з таким id не існує');}
        const activity: Activity = {
            person_id: activityData.person_id,
            event_id: activityData.event_id,
            hours: activityData.hours,
            position: activityData.position,
            contribution: activityData.contribution
        };
        return activity;
    };

    checkAndFormatActivityDataPatch = async (activityData: any) => {
        const activity: Activity = {
            person_id: activityData.person_id,
            event_id: activityData.event_id,
            hours: activityData.hours,
            position: activityData.position,
            contribution: activityData.contribution
        };
        return activity;
    };

    deleteActivityById = (person_id: number, event_id: number): Promise<Activity> => {
        return this.activityRepository.deleteActivity(person_id, event_id);
    };
}