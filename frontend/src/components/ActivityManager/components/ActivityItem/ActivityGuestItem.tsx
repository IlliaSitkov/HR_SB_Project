import React from 'react';
import { Activity, deleteActivity } from '../../../../api/activity';
import { Input } from '../../../../common/Input/Input';
import './ActivityItem.css';
import { binIcon } from '../../../../common/icons/icons';
import { fetchEventActivitiesThunk } from '../../../../store/eventActivities/thunk';
import { useDispatch } from 'react-redux';

export const ActivityGuestItem = ({ activity }: { activity: Activity }) => {
	const dispatch = useDispatch();

	const deleteAct = async () => {
		try {
			await deleteActivity(activity.person_id, activity.event_id);
			dispatch(fetchEventActivitiesThunk(activity.event_id) as any);
		} catch (e) {
			console.log(e);
		}
	};

	return (
		<div className='show-on-hover item-card d-flex align-items-center justify-content-between'>
			<div>
				<div className='activity-card-grid-header'>
					<div>Імʼя та прізвище</div>
				</div>
				<Input
					type='text'
					value={
						activity.person.name +
						' ' +
						activity.person.parental +
						' ' +
						activity.person.surname
					}
					disabled={true}
				/>
			</div>
			<div className='visible-on-hover'>
				<button onClick={deleteAct} className='empty bin'>
					{binIcon(24, 'red')}
				</button>
			</div>
		</div>
	);
};
