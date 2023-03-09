import { FC } from 'react';
import { Event } from '../../../../api/event';
import { Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { DEFAULT_PHOTO_URL } from '../../../../utils/constants';

export const EventItem: FC<{ event: Event }> = ({ event }) => {
	const navigate = useNavigate();

	const showEventDetails = () => {
		navigate(`/events/${event.id}`, { replace: true });
	};

	const dates =
		new Date(event.date_start).toLocaleDateString() +
		' - ' +
		new Date(event.date_end).toLocaleDateString();

	return (
		<Card className='flex-fill mb-2'>
			<Card.Img
				variant='top'
				src={event.photo ? event.photo : DEFAULT_PHOTO_URL}
				alt='Фото'
			/>
			<Card.Body className='text-center'>
				<Card.Title>{event.name}</Card.Title>
				<Card.Text>{dates}</Card.Text>
				<Card.Text>{event.category!.name}</Card.Text>
				<Button variant='primary' onClick={showEventDetails}>
					Деталі
				</Button>
			</Card.Body>
		</Card>
	);
};
