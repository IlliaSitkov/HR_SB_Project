/*eslint-disable react-hooks/exhaustive-deps*/
import React, { FC, useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
	getErrorMessage,
	getGotData,
	getEvents,
	getUserRole,
} from '../../store/selectors';
import { getAllEvents, Event } from '../../api/event';
import { changeHandler } from '../../shared';
import { Input } from '../../common/Input/Input';
import { Button, Col, Row } from 'react-bootstrap';
import { Select } from '../../common/Select/SelectComponent';
import { Category, getAllCategories } from '../../api/category';
import { deleteAnEvent, updateAnEvent } from '../../store/events/thunk';
import { eventsGet } from '../../store/events/actionCreators';
import { dateToString } from '../../utils/dates';
import { ErrorMessageBig } from '../../common/ErrorMessage/ErrorMessageBig';
import { UserRole } from '../../api/common/types';
import { gotDataSet } from '../../store/gotData/actionCreators';
import { errorMessageSet } from '../../store/errorMessage/actionCreators';
import { DEFAULT_AVATAR_URL } from '../../utils/constants';
import { EditPhotoUrlModal } from './components/EditPhotoUrlModal';
import { ActivityManager } from '../ActivityManager/ActivityManager';
import { getAllPeopleThunk } from '../../store/people/thunk';

export const EventProfile: FC = () => {
	const userRole = useSelector<UserRole>(getUserRole);
	const gotData = useSelector<number>(getGotData);
	const errorMessage = useSelector<string>(getErrorMessage);

	const events = useSelector(getEvents);
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { eventId } = useParams();
	const [event, setEvent] = useState<Event | null>(null);
	const [name, setName] = useState<string>('');
	const [date_start, setDate_start] = useState<string>('');
	const [date_end, setDate_end] = useState<string>('');
	const [description, setDescription] = useState<string>('');
	const [category_id, setCategory_id] = useState<number>(-1);
	const [photo, setPhoto] = useState<string>('');
	const [categories, setCategories] = useState<Category[]>([]); // ?
	const [showModal, setShowModal] = useState<boolean>(false);

	const goBack = () => {
		resetError();
		navigate('/all-events', { replace: true });
	};

	const resetError = () => dispatch(errorMessageSet(''));

	useEffect(() => {
		dispatch(getAllPeopleThunk as any);
	}, []);

	useEffect(() => {
		fetchData();
		return () => {
			resetError();
		};
	}, [events]);

	const fetchData = async () => {
		if (gotData === 0 || gotData === 2) {
			dispatch(gotDataSet(1));

			const eventsRes = await getAllEvents();
			if (!eventsRes) {
				alert('Помилка при завантаженні подій!');
				dispatch(gotDataSet(2));
				return;
			}

			dispatch(gotDataSet(3));
			dispatch(eventsGet(eventsRes));
		}

		const ev: Event = events.find(
			(event: Event) => event.id === Number(eventId)
		);

		if (ev) {
			console.log('Start event: ');
			console.log(ev);
			setEvent(ev);
			setName(ev.name);
			if (ev.date_start) setDate_start(dateToString(new Date(ev.date_start)));
			if (ev.date_end) setDate_end(dateToString(new Date(ev.date_end)));
			if (ev.description) setDescription(ev.description);
			if (ev.category_id) setCategory_id(ev.category_id);
			if (ev.photo) setPhoto(ev.photo);
			const categories = await getAllCategories();
			setCategories(categories);
		}
	};

	const deleteEvent = () => {
		resetError();
		// @ts-ignore
		dispatch(deleteAnEvent(event.id));
		navigate('/all-events', { replace: true });
	};

	const updateEvent = () => {
		resetError();
		let ev: any = {};
		addCommonFieldsToUpdate(ev);
		console.log('Event to update: ');
		console.log(ev);
		// @ts-ignore
		dispatch(updateAnEvent(event.id, ev));
	};

	const addCommonFieldsToUpdate = (ev: any): void => {
		addFieldIfNeeded(ev, name, 'name');
		addFieldIfNeeded(
			ev,
			date_start === '' ? null : new Date(date_start),
			'date_start'
		);
		addFieldIfNeeded(
			ev,
			date_end === '' ? null : new Date(date_end),
			'date_end'
		);
		addFieldIfNeeded(ev, description, 'description');
		addFieldFromSelectIfNeeded(ev, category_id, 'category_id');
	};

	const addFieldIfNeeded = (
		event: any,
		field: any,
		fieldName: string
	): void => {
		if (doesFieldNeedUpdate(field, fieldName)) {
			event[fieldName] = field;
		}
	};

	const addFieldFromSelectIfNeeded = (
		event: any,
		field: any,
		fieldName: string
	): void => {
		let fieldNumber: number | null = Number(field);
		if (fieldNumber && fieldNumber < 0) fieldNumber = null;
		if (doesFieldNeedUpdate(fieldNumber, fieldName))
			event[fieldName] = fieldNumber;
	};

	const doesFieldNeedUpdate = (field: any, fieldName: string): boolean => {
		if (event) {
			// @ts-ignore
			const value = event[fieldName];
			if (!value || value === '') {
				if (!field || field.toString().trim() === '') return false;
				else return true;
			} else if (
				value === field ||
				(field && value.toString().trim() === field.toString().trim())
			)
				return false;
			else return true;
		} else return false;
	};

	return userRole !== UserRole.HR ? (
		<Navigate to='/' />
	) : (
		<>
			<Button
				id='backEvent'
				onClick={goBack}
				variant='primary'
				className='ms-4 m-2 align-self-start'
			>
				Назад
			</Button>
			<div className='w-100'>
				<h3 className='text-center'>Профіль події</h3>
				<Row xs={1} sm={1} md={2} lg={2} className='m-2'>
					<Col>
						<div className='m-2 justify-content-center d-flex'>
							<img
								src={photo ? photo : DEFAULT_AVATAR_URL}
								className='rounded'
								style={{
									maxWidth: '350px',
									maxHeight: '350px',
									cursor: 'pointer',
								}}
								alt='Фото'
								onClick={() => setShowModal(!showModal)}
							/>
						</div>
						<EditPhotoUrlModal
							title={'Посилання на фото'}
							setShow={setShowModal}
							show={showModal}
							photoUrl={photo}
							setPhotoUrl={setPhoto}
						/>
					</Col>
					<Col className='d-flex'>
						<div className='border-secondary border border-1 p-2 rounded m-2 flex-fill'>
							<h6 className='text-center'>Дані про подію</h6>
							<Input
								id='name'
								placeholder={'Введіть назву...'}
								type='text'
								onChange={changeHandler(setName, resetError)}
								value={name}
								label='Назва'
								required={true}
							/>
							<Input
								id='dateStart'
								type='date'
								onChange={changeHandler(setDate_start, resetError)}
								value={date_start}
								label='Дата початку події'
								required={true}
							/>
							<Input
								id='dateEnd'
								type='date'
								onChange={changeHandler(setDate_end, resetError)}
								value={date_end}
								label='Дата завершення події'
								required={true}
							/>
							<Input
								id='description'
								placeholder={'Введіть опис...'}
								type='text'
								onChange={changeHandler(setDescription, resetError)}
								value={description}
								label='Опис'
								required={false}
							/>
							<Select
								id='selectCategory'
								noneSelectedOption={true}
								value={category_id}
								label='Категорія'
								onChange={changeHandler(setCategory_id)}
								data={categories}
								idSelector={(c) => c.id}
								nameSelector={(c) => c.name}
							/>
						</div>
					</Col>
				</Row>
			</div>
			<div>
				<ErrorMessageBig
					message={typeof errorMessage === 'string' ? errorMessage : ''}
				/>
			</div>
			<div>
				<Button
					variant='primary'
					onClick={updateEvent}
					id='updateEvent'
					className='m-2'
				>
					{'Оновити'}
				</Button>
				<Button
					variant='danger'
					onClick={deleteEvent}
					id='deleteEvent'
					className='m-2'
				>
					{'Видалити'}
				</Button>
			</div>
			<div className='mt-3 w-100 mb-5'>
				<ActivityManager eventId={Number(eventId)} />
			</div>
		</>
	);
};
