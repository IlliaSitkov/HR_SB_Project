import React, { useEffect } from 'react';
import { Activity } from '../../../../api/activity';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEventActivitiesThunk } from '../../../../store/eventActivities/thunk';

export const ActivitiesList = ({
	eventId,
	activitySelector,
	emptyListPlaceholder,
	itemToComponentMapper,
}: {
	eventId: number;
	activitySelector: Function;
	emptyListPlaceholder: string;
	itemToComponentMapper: Function;
}) => {
	const dispatch = useDispatch();

	const activities: Activity[] = useSelector(activitySelector(eventId));

	useEffect(() => {
		dispatch(fetchEventActivitiesThunk(eventId) as any);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<section>
			<div>
				{activities.length <= 0 && (
					<div className='text-center'>{emptyListPlaceholder}</div>
				)}
				{activities.map((a: Activity) => (
					<div key={a.event_id + ' ' + a.person_id} className='mb-2'>
						{itemToComponentMapper(a)}
					</div>
				))}
			</div>
		</section>
	);
};
