import React, { useState } from 'react';
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
import { createEvent } from '../../api/event_/event.service';
import { useDispatch } from 'react-redux';
import { getAllEventsThunk } from '../../store/events/thunk';

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
			await createEvent({
				name: name!,
				description,
				category_id: categoryId,
				date_end: dateEnd!,
				date_start: dateStart!,
				photo: photoUrl,
			});
			dispatch(getAllEventsThunk as any);
			toggleShow();
		} catch (e) {
			setError((e as any).response.data.message);
		}
	};

	const resetError = () => setError('');

	return (
		<Modal show={showModal} onHide={toggleShow}>
			<Modal.Header closeButton={true}>
				<Modal.Title>Створити подію</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<div className='gap-8'>
					<Input
						label='Назва'
						type='text'
						value={name}
						onChange={changeHandler(setName, resetError)}
					/>
					<Input
						label='Опис'
						type='text'
						value={description}
						onChange={changeHandler(setDescription)}
					/>
					<Input
						label='Дата початку'
						type='date'
						value={dateStart}
						onChange={changeHandler(setDateStart, resetError)}
					/>
					<Input
						label='Дата закінчення'
						type='date'
						value={dateEnd}
						onChange={changeHandler(setDateEnd, resetError)}
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
						selectTitle='Категорія події'
						modalTitle='Усі категорії'
						placeholder='Нова категорія'
					/>
					<Input
						label='Посилання на фото'
						placeholder='https://...'
						type='text'
						onChange={changeHandler(setPhotoUrl)}
						value={photoUrl}
					/>
				</div>
				<ErrorMessage message={error} />
			</Modal.Body>
			<Modal.Footer>
				<Button onClick={toggleShow} className='btn-danger'>
					Скасувати
				</Button>
				<Button onClick={create}>Створити</Button>
			</Modal.Footer>
		</Modal>
	);
};
