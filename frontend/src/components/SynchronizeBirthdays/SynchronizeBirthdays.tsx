import { useState } from 'react';
import { Alert, Button } from 'react-bootstrap';
import { syncBirthdays } from '../../api/person';
import './SynchronizeBirthdays.css';

export const SynchronizeBirthdaysButton = () => {
	const [load, setLoad] = useState(false);
	const [showErrorAlert, setShowErrorAlert] = useState(false);
	const [showSuccessAlert, setShowSuccessAlert] = useState(false);

	const handler = async () => {
		setLoad(true);
		const res = await syncBirthdays();
		if (res.status === 200) {
			setShowSuccessAlert(true);
		} else {
			setShowErrorAlert(true);
		}
		setTimeout(() => {
			setShowSuccessAlert(false);
			setShowErrorAlert(false);
		}, 2000);
		setLoad(false);
	};

	return (
		<div className='d-flex flex-column justify-content-center sync-birthdays ms-3'>
			<p>Зберегти дні народження братчиків в календар Google-акаунту СБ:</p>
			<Button
				disabled={load}
				onClick={() => handler()}
				style={{ fontFamily: '"Playfair Display", serif' }}
				className='mb-2 btn-lg sync-button align-self-center'
			>
				Синхронізувати
			</Button>
			<Alert
				show={showErrorAlert}
				className='mb-0 sync-alert'
				key='error'
				variant='danger'
			>
				Сталася помилка під час синхронізації.
			</Alert>
			<Alert
				show={showSuccessAlert}
				className='mb-0 sync-alert'
				key='error'
				variant='success'
			>
				Успішно синхронізовано.
			</Alert>
		</div>
	);
};
