import React, { FC } from 'react';
import { Modal } from 'react-bootstrap';
import { Input } from '../../common/Input/Input';
import { changeHandler } from '../../shared';

export const EditPhotoUrlModal: FC<{
	show: boolean;
	setShow: (value: ((prevState: boolean) => boolean) | boolean) => void;
	photoUrl: string;
	setPhotoUrl: (value: ((prevState: string) => string) | string) => void;
	title: string;
}> = ({ show, setShow, photoUrl, setPhotoUrl, title }) => {
	return (
		<Modal onHide={() => setShow(false)} show={show}>
			<Modal.Header closeButton={true}>
				<Modal.Title>{title}</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Input
					type='text'
					onChange={changeHandler(setPhotoUrl)}
					value={photoUrl}
					style={{ width: '100%' }}
				/>
			</Modal.Body>
		</Modal>
	);
};
