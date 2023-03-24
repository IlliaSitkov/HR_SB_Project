import { FC } from 'react';
import { Event } from '../../../../api/event';
import { Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { DEFAULT_PHOTO_URL } from '../../../../utils/constants';

export const EventItem: FC<{ event: Event }> = ({ event }) => {
	const navigate = useNavigate();

	const showEventDetails = () => {
		navigate(`/all-events/${event.id}`, { replace: true });
	};

	return (
		<Card className='flex-fill mb-2'>
			<Card.Img
				variant='top'
				src={event.photo ? event.photo : DEFAULT_PHOTO_URL}
				alt='Фото'
			/>
			<Card.Body className='text-center'>
				<Card.Title>{event.name}</Card.Title>
				<Card.Text>
					Початок: {new Date(event.date_start).toLocaleDateString()}
				</Card.Text>
				<Card.Text>
					Кінець: {new Date(event.date_end).toLocaleDateString()}
				</Card.Text>
				<Button variant='primary' onClick={showEventDetails}>
					Деталі
				</Button>
			</Card.Body>
		</Card>
	);
};
