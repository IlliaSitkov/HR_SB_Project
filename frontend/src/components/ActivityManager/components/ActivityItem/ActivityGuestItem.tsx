import React from 'react';
import { Activity, deleteActivity } from '../../../../api/activity';
import './ActivityItem.css';
import { fetchEventActivitiesThunk } from '../../../../store/eventActivities/thunk';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getUserRole } from '../../../../store/selectors';
import { UserRole } from '../../../../api/common/types';
import { binIcon } from '../../../../common/icons/icons';

export const ActivityGuestItem = ({ activity }: { activity: Activity }) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const userRole = useSelector(getUserRole);

	const goToPersonProfile = () => {
		navigate(`/members/${activity.person_id}`, { replace: true });
	};

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
					<div>Прізвище та ім'я</div>
				</div>
				<div className='p-2'>
					<button className='link-button' onClick={goToPersonProfile}>
						{activity.person.surname + ' ' + activity.person.name}
					</button>
				</div>
			</div>
			{userRole === UserRole.HR ? (
				<div className='visible-on-hover'>
					<button onClick={deleteAct} className='empty bin'>
						{binIcon(24, 'red')}
					</button>
				</div>
			) : null}
		</div>
	);
};
