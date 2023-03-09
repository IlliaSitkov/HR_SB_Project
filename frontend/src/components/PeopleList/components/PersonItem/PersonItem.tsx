import { FC } from 'react';
import { getFullName, Person, statusesColorful } from '../../../../api/person';
import { Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { DEFAULT_AVATAR_URL } from '../../../../utils/constants';

export const PersonItem: FC<{ person: Person }> = ({ person }) => {
	// @ts-ignore
	const status = statusesColorful[person.status];
	const navigate = useNavigate();

	const showPersonDetails = () => {
		navigate(`/members/${person.id}`, { replace: true });
	};

	return (
		<Card className='flex-fill mb-2'>
			<Card.Img
				variant='top'
				src={person.avatar ? person.avatar : DEFAULT_AVATAR_URL}
				alt='Аватар'
			/>
			<Card.Body className='text-center'>
				<Card.Title>{getFullName(person)}</Card.Title>
				<Card.Text style={{ background: status.color }} className='rounded'>
					{status.ukr}
				</Card.Text>
				{person.telegram ? <Card.Text>{person.telegram}</Card.Text> : null}
				<Button variant='primary' onClick={showPersonDetails}>
					Деталі
				</Button>
			</Card.Body>
		</Card>
	);
};
