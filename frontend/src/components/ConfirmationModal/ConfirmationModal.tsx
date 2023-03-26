import React, { FC } from 'react';
import { Button, Modal } from 'react-bootstrap';

export const ConfirmationModal: FC<{
	show: boolean;
	setShow: (value: ((prevState: boolean) => boolean) | boolean) => void;
	question: string;
	action: any;
}> = ({ show, setShow, question, action }) => {
	return (
		<Modal onHide={() => setShow(false)} show={show}>
			<Modal.Header closeButton={true}>
				<Modal.Body>{question}</Modal.Body>
			</Modal.Header>
			<Modal.Body>
				<div>
					<Button
						onClick={() => setShow(false)}
						variant='secondary'
						className='m-2'
					>
						Скасувати
					</Button>
					<Button onClick={action} variant='primary' className='m-2'>
						Так
					</Button>
				</div>
			</Modal.Body>
		</Modal>
	);
};
