import React, { useState } from 'react';
import { AddEventPerson } from './components/AddActivity/AddEventPerson';
import { ActivitiesList } from './components/ActivitiesList/ActivitiesList';
import {
	getEventActivitiesWithGuests,
	getEventActivitiesWithOrganizers,
	getPossibleGuests,
	getPossibleOrganizers,
	getUserRole,
} from '../../store/selectors';
import { ActivityOrganizerItem } from './components/ActivityItem/ActivityOrganizerItem';
import { Activity } from '../../api/activity';
import { ActivityGuestItem } from './components/ActivityItem/ActivityGuestItem';
import { CreateEventModal } from '../CreateEvent/CreateEventModal';
import { UserRole } from '../../api/common/types';
import { useSelector } from 'react-redux';

export const ActivityManager = ({ eventId }: { eventId: number }) => {
	const [show, setShow] = useState(false);
	const userRole = useSelector(getUserRole);

	const toggleModal = () => {
		setShow(!show);
	};

	return (
		<div className='container mt-3'>
			<CreateEventModal showModal={show} toggleModal={toggleModal} />
			<div className='row mb-5'>
				<div className='col-12 col-lg-8 offset-lg-2'>
					<div className='d-flex justify-content-between mb-3 align-items-center'>
						<h4>Організатори</h4>
						{userRole === UserRole.HR ? (
							<AddEventPerson
								buttonTitle='Додати організатора'
								eventId={eventId}
								eventPersonSelector={getPossibleOrganizers}
							/>
						) : null}
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
				<div className='col-12 col-lg-8 offset-lg-2'>
					<div className='d-flex justify-content-between mb-3 align-items-center'>
						<h4>Запрошені гості</h4>
						{userRole === UserRole.HR ? (
							<AddEventPerson
								buttonTitle='Додати гостя'
								eventId={eventId}
								eventPersonSelector={getPossibleGuests}
							/>
						) : null}
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
