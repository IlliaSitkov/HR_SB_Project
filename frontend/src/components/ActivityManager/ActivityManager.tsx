import React from 'react';
import { AddEventPerson } from './components/AddActivity/AddEventPerson';
import { ActivitiesList } from './components/ActivitiesList/ActivitiesList';
import {
	getEventActivitiesWithGuests,
	getEventActivitiesWithOrganizers,
	getPossibleGuests,
	getPossibleOrganizers,
} from '../../store/selectors';
import { ActivityOrganizerItem } from './components/ActivityItem/ActivityOrganizerItem';
import { Activity } from '../../api/activity';
import { ActivityGuestItem } from './components/ActivityItem/ActivityGuestItem';

export const ActivityManager = ({ eventId }: { eventId: number }) => {
	return (
		<div className='container mt-3'>
			<div className='row mb-5'>
				<div className='col-12 col-lg-8'>
					<div className='d-flex justify-content-between mb-3 align-items-center'>
						<h4>Організатори</h4>
						<AddEventPerson
							buttonTitle='Додати учасника'
							eventId={eventId}
							eventPersonSelector={getPossibleOrganizers}
						/>
					</div>
					<div>
						<ActivitiesList
							eventId={eventId}
							activitySelector={getEventActivitiesWithOrganizers}
							emptyListPlaceholder='Не додано організаторів'
							itemToComponentMapper={(activity: Activity) => (
								<ActivityOrganizerItem activity={activity} />
							)}
						/>
					</div>
				</div>
			</div>
			<div className='row'>
				<div className='col-12 col-lg-8'>
					<div className='d-flex justify-content-between mb-3 align-items-center'>
						<h4>Запрошені гості</h4>
						<AddEventPerson
							buttonTitle='Додати гостя'
							eventId={eventId}
							eventPersonSelector={getPossibleGuests}
						/>
					</div>
					<div>
						<ActivitiesList
							eventId={eventId}
							activitySelector={getEventActivitiesWithGuests}
							emptyListPlaceholder='Не запрошено гостей'
							itemToComponentMapper={(activity: Activity) => (
								<ActivityGuestItem activity={activity} />
							)}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};