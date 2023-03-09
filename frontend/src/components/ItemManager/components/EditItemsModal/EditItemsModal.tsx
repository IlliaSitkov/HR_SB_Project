import React, { Dispatch, FC, SetStateAction } from 'react';
import { Modal } from 'react-bootstrap';
import { Item } from './components/CategoryItem/Item';
import { AddItem } from './components/AddCategory/AddItem';
import { IItem } from '../../../../api/common/types';

export const EditItemsModal: FC<{
	show: boolean;
	title: string;
	listItems: IItem[];
	setShow: Dispatch<SetStateAction<boolean>>;
}> = ({ show, setShow, listItems, title }) => {
	const itemsViews = listItems.map((item) => (
		<section key={item.id}>
			<Item item={item} />
		</section>
	));

	return (
		<Modal onHide={() => setShow(false)} show={show}>
			<Modal.Header closeButton={true}>
				<Modal.Title>{title}</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<AddItem />
				<div className='d-flex flex-column gap-2'>{itemsViews}</div>
			</Modal.Body>
		</Modal>
	);
};
