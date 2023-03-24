import React, { Dispatch, FC, SetStateAction } from 'react';
import { Modal } from 'react-bootstrap';
import { Item } from './components/Item/Item';
import { AddItem } from './components/AddItem/AddItem';
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
		<Modal
			style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
			onHide={() => setShow(false)}
			show={show}
		>
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
