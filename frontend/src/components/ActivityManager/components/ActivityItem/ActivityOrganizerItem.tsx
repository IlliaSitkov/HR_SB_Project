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
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '../../../../api/common/types';
import { getUserRole } from '../../../../store/selectors';

export const ActivityOrganizerItem = ({ activity }: { activity: Activity }) => {
	const dispatch = useDispatch();
	const userRole = useSelector(getUserRole);

	const [edit, setEdit] = useState(false);
	const [error, setError] = useState('');

	const [inputRef] = useState<React.MutableRefObject<null>>();

	const [position, setPosition] = useState(activity.position);
	const [contribution, setContribution] = useState(activity.contribution);
	const [hours, setHours] = useState(activity.hours);

	const navigate = useNavigate();

	const goToPersonProfile = () => {
		navigate(`/members/${activity.person_id}`, { replace: true });
	};

	const toggleEdit = () => {
		setError('');
		setEdit(!edit);
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
						<div>Прізвище та ім'я</div>
						<div>Посада</div>
						<div>Внесок</div>
						<div>Години</div>
					</div>
					<div className='activity-card-grid'>
						<div className='align-self-center ms-2'>
							<button className='link-button' onClick={goToPersonProfile}>
								{activity.person.surname + ' ' + activity.person.name}
							</button>
						</div>
						<div>
							<textarea
								className='form-control'
								placeholder='Посада людини'
								id='position'
								value={position}
								disabled={!edit}
								onChange={changeHandler(setPosition, () => setError(''))}
								style={{ background: 'white' }}
							/>
						</div>
						<div>
							<textarea
								className='form-control'
								placeholder='Внесок людини'
								id='contribution'
								value={contribution}
								disabled={!edit}
								onChange={changeHandler(setContribution, () => setError(''))}
								style={{ background: 'white' }}
							/>
						</div>
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
				{userRole === UserRole.HR ? (
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
				) : null}
			</div>
			<ErrorMessage message={error} />
		</div>
	);
};
