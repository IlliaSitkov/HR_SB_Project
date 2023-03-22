import { FC } from 'react';
import { Event } from '../../../../api/event';
import { Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { DEFAULT_AVATAR_URL } from '../../../../utils/constants';

export const EventItem: FC<{ event: Event }> = ({ event }) => {
	const navigate = useNavigate();

	const showEventDetails = () => {
		navigate(`/members/${event.id}`, { replace: true });
	};

	return (
		<Card className='flex-fill mb-2'>
			<Card.Img
				variant='top'
				src={event.photo ? event.photo : DEFAULT_AVATAR_URL}
				alt='Фото'
			/>
			<Card.Body className='text-center'>
				<Card.Title>{event.name}</Card.Title>
				<Card.Text>{event.date_start.toDateString()}</Card.Text>
				<Card.Text>{event.date_end.toDateString()}</Card.Text>
				<Button variant='primary' onClick={showEventDetails}>
					Деталі
				</Button>
			</Card.Body>
		</Card>
	);
};
