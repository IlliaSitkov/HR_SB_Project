/*eslint-disable react-hooks/exhaustive-deps*/
import React, { FC, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
	getErrorMessage,
	getEvents,
	getEventsData,
	getUserRole,
} from '../../store/selectors';
import { getAllEvents, Event } from '../../api/event';
import { changeHandler } from '../../shared';
import { Input } from '../../common/Input/Input';
import { Button, Col, Row } from 'react-bootstrap';
import {
	createCategory,
	deleteCategory,
	getAllCategories,
	updateCategory,
} from '../../api/category';
import { deleteAnEvent, updateAnEvent } from '../../store/events/thunk';
import { eventsGet } from '../../store/events/actionCreators';
import { dateToString } from '../../utils/dates';
import { ErrorMessageBig } from '../../common/ErrorMessage/ErrorMessageBig';
import { errorMessageSet } from '../../store/errorMessage/actionCreators';
import { DEFAULT_PHOTO_URL, VALUE_NOT_SET } from '../../utils/constants';
import { EditPhotoUrlModal } from '../EditPhotoUrlModal/EditPhotoUrlModal';
import { ActivityManager } from '../ActivityManager/ActivityManager';
// @ts-ignore
import { getAllPeopleThunk } from '../../store/people/thunk';
import { gotEventDataSet } from '../../store/gotEventData/actionCreators';
import { ConfirmationModal } from '../ConfirmationModal/ConfirmationModal';
import { GotDataStatus } from '../../store/gotDataEnum';
import { ItemManager } from '../ItemManager/ItemManager';
import './EventProfile.css';
import { UserRole } from '../../api/common/types';
import { TextField } from '../../common/TextField/TextField';

export const EventProfile: FC = () => {
	const gotEventData = useSelector<number>(getEventsData);
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
	const [showEditPhotoModal, setShowEditPhotoModal] = useState<boolean>(false);
	const [showConfirmDeleteModal, setShowConfirmDeleteModal] =
		useState<boolean>(false);
	const userRole = useSelector(getUserRole);

	const goBack = () => {
		resetError();
		navigate('/events', { replace: true });
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
		if (
			gotEventData === GotDataStatus.NOT_YET_LOADED ||
			gotEventData === GotDataStatus.ERROR_WHILE_LOADING
		) {
			dispatch(gotEventDataSet(GotDataStatus.STARTED_LOADING));

			const eventsRes = await getAllEvents();
			if (!eventsRes) {
				alert('Помилка при завантаженні подій!');
				dispatch(gotEventDataSet(GotDataStatus.ERROR_WHILE_LOADING));
				return;
			}

			dispatch(gotEventDataSet(GotDataStatus.LOADED_SUCCESSFULLY));
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
		}
	};

	const deleteEvent = () => {
		resetError();
		// @ts-ignore
		dispatch(deleteAnEvent(event.id));
		navigate('/events', { replace: true });
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
		addFieldIfNeeded(ev, photo, 'photo');
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
				return !(!field || field.toString().trim() === '');
			} else
				return !(
					value === field ||
					(field && value.toString().trim() === field.toString().trim())
				);
		} else return false;
	};

	const getFieldValue = (fieldName: string) => {
		// @ts-ignore
		return event && event[fieldName] ? event[fieldName] : VALUE_NOT_SET;
	};

	const getDeepFieldValue = (
		parentFieldName: string,
		childFieldName: string
	) => {
		return event &&
			// @ts-ignore
			event[parentFieldName] &&
			// @ts-ignore
			event[parentFieldName][childFieldName]
			? // @ts-ignore
			  event[parentFieldName][childFieldName]
			: VALUE_NOT_SET;
	};

	const getDateFieldValue = (fieldName: string) => {
		// @ts-ignore
		return event && event[fieldName]
			? // @ts-ignore
			  new Date(event[fieldName]).toLocaleDateString()
			: VALUE_NOT_SET;
	};

	return (
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
				<h3 className='text-center'>Інформація про подію</h3>
				<Row xs={1} sm={1} md={2} lg={2} className='m-2'>
					<Col>
						<div className='m-2 justify-content-center d-flex'>
							{userRole === UserRole.HR ? (
								<img
									src={photo ? photo : DEFAULT_PHOTO_URL}
									className='rounded'
									style={{
										maxWidth: '350px',
										maxHeight: '350px',
										cursor: 'pointer',
									}}
									alt='Фото'
									onClick={() => setShowEditPhotoModal(!showEditPhotoModal)}
								/>
							) : (
								<img
									src={photo ? photo : DEFAULT_PHOTO_URL}
									className='rounded'
									style={{
										maxWidth: '350px',
										maxHeight: '350px',
									}}
									alt='Фото'
								/>
							)}
						</div>
						{userRole === UserRole.HR ? (
							<EditPhotoUrlModal
								title={'Посилання на фото'}
								setShow={setShowEditPhotoModal}
								show={showEditPhotoModal}
								photoUrl={photo}
								setPhotoUrl={setPhoto}
							/>
						) : null}
					</Col>
					<Col className='d-flex'>
						<div className='border-secondary border border-1 p-2 rounded m-2 flex-fill'>
							<Input
								id='name'
								type='text'
								onChange={changeHandler(setName, resetError)}
								value={userRole === UserRole.HR ? name : getFieldValue('name')}
								label='Назва'
								required={true}
								disabled={userRole !== UserRole.HR}
								inputStyle={{ background: 'white' }}
							/>
							<div>
								<label htmlFor='description'>Опис</label>
								<textarea
									className='form-control'
									id='description'
									value={
										userRole === UserRole.HR
											? description
											: getFieldValue('description')
									}
									onChange={changeHandler(setDescription, resetError)}
									disabled={userRole !== UserRole.HR}
									style={{ background: 'white' }}
								/>
							</div>
							<Input
								id='dateStart'
								type='date'
								onChange={changeHandler(setDate_start, resetError)}
								value={
									userRole === UserRole.HR
										? date_start
										: getDateFieldValue('date_start')
								}
								label='Дата початку'
								required={true}
								disabled={userRole !== UserRole.HR}
								inputStyle={{ background: 'white' }}
							/>
							<Input
								id='dateEnd'
								type='date'
								onChange={changeHandler(setDate_end, resetError)}
								value={
									userRole === UserRole.HR
										? date_end
										: getDateFieldValue('date_end')
								}
								label='Дата закінчення'
								required={true}
								disabled={userRole !== UserRole.HR}
								inputStyle={{ background: 'white' }}
							/>
							{userRole === UserRole.HR ? (
								<ItemManager
									selectedItem={category_id}
									setSelectedItem={(id) => {
										setCategory_id(id);
										resetError();
									}}
									getAllFunc={getAllCategories}
									updateFunc={updateCategory}
									deleteFunc={deleteCategory}
									createFunc={createCategory}
									selectTitle='Категорія'
									modalTitle='Усі категорії'
									placeholder='Нова категорія'
									isRequired={true}
								/>
							) : (
								<TextField
									id='category'
									value={getDeepFieldValue('category', 'name')}
									label='Категорія'
									required={true}
								/>
							)}
						</div>
					</Col>
				</Row>
			</div>
			<div>
				<ErrorMessageBig
					message={typeof errorMessage === 'string' ? errorMessage : ''}
				/>
			</div>
			<div className='mt-3 w-100 mb-5'>
				<ActivityManager eventId={Number(eventId)} />
			</div>
			{userRole === UserRole.HR ? (
				<>
					<div>
						<Button
							variant='primary'
							onClick={updateEvent}
							id='updateEvent'
							className='buttons-margin'
						>
							{'Оновити'}
						</Button>
						<Button
							variant='danger'
							onClick={() => setShowConfirmDeleteModal(!showConfirmDeleteModal)}
							id='deleteEvent'
							className='buttons-margin'
						>
							{'Видалити'}
						</Button>
					</div>
					<ConfirmationModal
						question={
							'Ви впевнені, що хочете видалити всю інформацію про подію ' +
							(event ? event.name : '') +
							'?'
						}
						setShow={setShowConfirmDeleteModal}
						show={showConfirmDeleteModal}
						action={deleteEvent}
					/>
				</>
			) : null}
		</>
	);
};
