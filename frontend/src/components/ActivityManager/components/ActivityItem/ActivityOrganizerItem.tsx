import React, { useEffect, useState } from 'react';
import {
	Activity,
	deleteActivity,
	updateActivity,
} from '../../../../api/activity';
import { Input } from '../../../../common/Input/Input';
import './ActivityItem.css';
import {
	binIcon,
	checkIcon,
	crossIcon,
	penIcon,
} from '../../../../common/icons/icons';
import { ErrorMessage } from '../../../../common/ErrorMessage/ErrorMessage';
import { changeHandler } from '../../../../shared';
import { fetchEventActivitiesThunk } from '../../../../store/eventActivities/thunk';
import { useDispatch } from 'react-redux';
import { getFullName } from '../../../../api/person';

export const ActivityOrganizerItem = ({ activity }: { activity: Activity }) => {
	const dispatch = useDispatch();

	const [edit, setEdit] = useState(false);
	const [error, setError] = useState('');

	const [inputRef, setInputRef] = useState<React.MutableRefObject<null>>();

	const [position, setPosition] = useState(activity.position);
	const [contribution, setContribution] = useState(activity.contribution);
	const [hours, setHours] = useState(activity.hours);

	const toggleEdit = () => {
		setError('');
		setEdit(!edit);
	};

	const refCallback = (ref: React.MutableRefObject<null>) => {
		setInputRef(ref);
	};

	useEffect(() => {
		if (edit && inputRef?.current) {
			(inputRef.current as HTMLInputElement).focus();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [edit]);

	const resetValues = () => {
		setPosition(activity.position);
		setContribution(activity.contribution);
		setHours(activity.hours);
	};

	const closeEdit = async () => {
		resetValues();
		toggleEdit();
	};

	const update = async () => {
		setError('');
		try {
			await updateActivity({
				position,
				contribution,
				hours,
				person_id: activity.person_id,
				event_id: activity.event_id,
			});
			toggleEdit();
			dispatch(fetchEventActivitiesThunk(activity.event_id) as any);
		} catch (e) {
			setError((e as any).response.data.message);
		}
	};

	const deleteAct = async () => {
		setError('');
		try {
			await deleteActivity(activity.person_id, activity.event_id);
			dispatch(fetchEventActivitiesThunk(activity.event_id) as any);
		} catch (e) {
			setError((e as any).response.data.message);
		}
	};

	return (
		<div className='d-flex flex-column gap-1'>
			<div className='show-on-hover item-card d-flex gap-2 align-items-center'>
				<div>
					<div className='activity-card-grid activity-card-grid-header'>
						<div>Імʼя та прізвище</div>
						<div>Посада</div>
						<div>Внесок</div>
						<div>Години</div>
					</div>
					<div className='activity-card-grid'>
						<Input
							type='text'
							value={getFullName(activity.person)}
							disabled={true}
						/>
						<Input
							placeholder='Посада учасника'
							refCallback={refCallback}
							disabled={!edit}
							type='text'
							onChange={changeHandler(setPosition, () => setError(''))}
							value={position}
						/>
						<Input
							placeholder='Внесок учасника'
							disabled={!edit}
							type='text'
							onChange={changeHandler(setContribution, () => setError(''))}
							value={contribution}
						/>
						<Input
							placeholder='Кількість годин стажування'
							min={0}
							type='number'
							disabled={!edit}
							onChange={changeHandler(setHours, () => setError(''))}
							value={hours}
						/>
					</div>
				</div>
				<div>
					<div
						className={`d-flex gap-1 ${
							edit ? 'display-none' : 'visible-on-hover'
						}`}
					>
						<button onClick={toggleEdit} className='empty pen'>
							{penIcon(24, 'blue')}
						</button>
						<button onClick={deleteAct} className='empty bin'>
							{binIcon(24, 'red')}
						</button>
					</div>
					<div className={`d-flex gap-1 ${edit ? '' : 'display-none'}`}>
						<button onClick={update} className='empty check'>
							{checkIcon(28, '#31c410')}
						</button>
						<button onClick={closeEdit} className='empty bin'>
							{crossIcon(20, 'red')}
						</button>
					</div>
				</div>
			</div>
			<ErrorMessage message={error} />
		</div>
	);
};
