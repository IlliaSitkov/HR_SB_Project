import React, { ChangeEvent, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { Input } from '../../common/Input/Input';
import { changeHandler } from '../../shared';
import { ItemManager } from '../ItemManager/ItemManager';
import {
	createCategory,
	deleteCategory,
	getAllCategories,
	updateCategory,
} from '../../api/category';
import './CreateEventModal.css';
import { ErrorMessage } from '../../common/ErrorMessage/ErrorMessage';
import { createEvent, EventPostDto } from '../../api/event';
import { useDispatch } from 'react-redux';
import { getAllEventsThunk } from '../../store/events/thunk';
import { uploadImageAndGetUrl } from '../../utils/uploadImages';
import { errorMessageSet } from '../../store/errorMessage/actionCreators';
import { ImageInput } from '../../common/ImageInput/ImageInput';
import { DEFAULT_PHOTO_URL } from '../../utils/constants';

export const CreateEventModal = ({
	showModal,
	toggleModal,
}: {
	showModal: boolean;
	toggleModal: () => void;
}) => {
	const [name, setName] = useState<string>('');
	const [description, setDescription] = useState<string>('');
	const [photoUrl, setPhotoUrl] = useState<string>('');
	const [photoFilePath, setPhotoFilePath] = useState<string>('');

	const [dateStart, setDateStart] = useState<Date>(new Date());
	const [dateEnd, setDateEnd] = useState<Date>(new Date());

	const [categoryId, setCategoryId] = useState<number>(-1);

	const [error, setError] = useState<string>('');

	const dispatch = useDispatch();

	const toggleShow = () => {
		toggleModal();
		resetFields();
	};

	const resetFields = () => {
		setName('');

		setDateStart(new Date());
		setDateEnd(new Date());

		setDescription('');
		setError('');
		setPhotoUrl('');
		setCategoryId(-1);
	};

	const checkData = () => {
		let correct = true;
		let error = '';
		if (!name?.length || name?.length <= 0) {
			correct = false;
			error += 'Назва не може бути порожньою';
		}
		if (!dateStart) {
			correct = false;
			error += `\nДата початку не може бути порожньою`;
		}
		if (!dateEnd) {
			correct = false;
			error += `\nДата закінчення не може бути порожньою`;
		}
		if (dateStart && dateEnd && dateStart > dateEnd) {
			correct = false;
			error += `\nДата початку не може бути більше за дату закінчення`;
		}
		if (categoryId < 0) {
			correct = false;
			error += `\nКатегорія не може бути порожньою`;
		}
		setError(error);
		return correct;
	};

	const create = async () => {
		if (!checkData()) return;
		setError('');
		try {
			const event: EventPostDto = {
				name: name!,
				category_id: categoryId,
				date_end: dateEnd!,
				date_start: dateStart!,
			};
			if (description !== '') {
				event.description = description;
			}
			if (photoUrl !== '') {
				event.photo = photoUrl;
			}
			await createEvent(event);
			dispatch(getAllEventsThunk as any);
			toggleShow();
		} catch (e) {
			setError((e as any).response.data.message);
		}
	};

	const resetError = () => setError('');

	const processFileChosen = async (event: ChangeEvent) => {
		resetError();
		// @ts-ignore
		setPhotoFilePath(event.target.value);
		const errorText = 'Не вдалося встановити фото';
		try {
			// @ts-ignore
			const selectedFile = event.target.files[0];
			const newPhotoUrl = await uploadImageAndGetUrl(
				selectedFile,
				name + (dateEnd ? new Date(dateEnd).getFullYear() : '')
			);
			if (newPhotoUrl) {
				setPhotoUrl(newPhotoUrl);
				console.log(newPhotoUrl);
			} else dispatch(errorMessageSet(errorText));
		} catch (e) {
			dispatch(errorMessageSet(errorText));
		}
	};

	return (
		<Modal show={showModal} onHide={toggleShow}>
			<Modal.Header closeButton={true}>
				<Modal.Title>Створити подію</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<div className='gap-8'>
					<div>
						<ImageInput
							id='selectPhotoNewEvent'
							value={photoFilePath}
							onChange={(e) => processFileChosen(e)}
						/>
						<img
							src={photoUrl ? photoUrl : DEFAULT_PHOTO_URL}
							className='rounded'
							style={{
								maxWidth: '320px',
								maxHeight: '320px',
								cursor: 'pointer',
							}}
							alt='Фото'
							onClick={() =>
								document.getElementById('selectPhotoNewEvent')!.click()
							}
						/>
					</div>
					<Input
						label='Назва'
						type='text'
						value={name}
						onChange={changeHandler(setName, resetError)}
						required={true}
					/>
					<div>
						<label htmlFor='description'>Опис</label>
						<textarea
							className='form-control'
							id='description'
							value={description}
							onChange={changeHandler(setDescription)}
						/>
					</div>
					<Input
						label='Дата початку'
						type='date'
						value={dateStart}
						onChange={changeHandler(setDateStart, resetError)}
						required={true}
					/>
					<Input
						label='Дата закінчення'
						type='date'
						value={dateEnd}
						onChange={changeHandler(setDateEnd, resetError)}
						required={true}
					/>
					<ItemManager
						selectedItem={categoryId}
						setSelectedItem={(id) => {
							setCategoryId(id);
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
				</div>
				<ErrorMessage message={error} />
			</Modal.Body>
			<Modal.Footer>
				<Button onClick={toggleShow} className='btn-secondary'>
					Скасувати
				</Button>
				<Button onClick={create}>Створити</Button>
			</Modal.Footer>
		</Modal>
	);
};
