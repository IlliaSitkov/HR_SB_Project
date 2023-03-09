import React, { FC, useContext, useEffect, useState } from 'react';
import { ItemsContext } from '../../../../ItemManager';
import { Input } from '../../../../../../common/Input/Input';
import { changeHandler } from '../../../../../../shared';
import {
	binIcon,
	checkIcon,
	crossIcon,
	penIcon,
} from '../../../../../../common/icons/icons';

import './Item.css';
import { ErrorMessage } from '../../../../../../common/ErrorMessage/ErrorMessage';
import { IItem } from '../../../../../../api/common/types';

export const Item: FC<{ item: IItem }> = ({ item }) => {
	const { refresh, deleteFunc, updateFunc } = useContext(ItemsContext);
	const [name, setName] = useState<string>(item.name);

	const [inputRef, setInputRef] = useState<React.MutableRefObject<null>>();

	const [edit, setEdit] = useState(false);
	const [error, setError] = useState('');

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
	}, [edit]);

	const updateObj = async () => {
		try {
			if (name !== item.name) {
				await updateFunc(item.id, { name });
				refresh();
			}
			toggleEdit();
		} catch (e) {
			setError((e as any).response.data.message);
		}
	};

	const closeEdit = async () => {
		setName(item.name);
		toggleEdit();
	};

	const deleteObj = async () => {
		try {
			await deleteFunc(item.id);
			refresh();
		} catch (e) {
			setError((e as any).response.data.message);
		}
	};

	return (
		<div className='d-flex flex-column gap-1'>
			<div className='category-item d-flex gap-2'>
				<Input
					refCallback={refCallback}
					disabled={!edit}
					style={{ width: '100%' }}
					type='text'
					onChange={changeHandler(setName, () => setError(''))}
					value={name}
				/>
				<div
					className={`d-flex gap-1 ${
						edit ? 'hidden-btn-group' : 'hiding-btn-group'
					}`}
				>
					<button onClick={toggleEdit} className='empty pen'>
						{penIcon(24, 'blue')}
					</button>
					<button onClick={deleteObj} className='empty bin'>
						{binIcon(24, 'red')}
					</button>
				</div>
				<div className={`d-flex gap-1 ${edit ? '' : 'hidden-btn-group'}`}>
					<button onClick={updateObj} className='empty check'>
						{checkIcon(26, '#31c410')}
					</button>
					<button onClick={closeEdit} className='empty bin'>
						{crossIcon(20, 'red')}
					</button>
				</div>
			</div>
			<ErrorMessage message={error} />
		</div>
	);
};
