import { useEffect, useState } from 'react';
import { getNearestBirthdays, PersonBirthday } from '../../api/person';
import './NearestBirthdays.css';
import { DEFAULT_AVATAR_URL } from '../../utils/constants';

const NearestBirthdays = () => {
	const [birthdays, setBirthdays] = useState<PersonBirthday[]>([]);

	useEffect(() => {
		async function getBirthdays() {
			const birthdays: PersonBirthday[] = await getNearestBirthdays();
			return birthdays;
		}

		getBirthdays().then(setBirthdays);
	}, []);

	return <NearestBirthdaysWithHeaders birthdays={birthdays} />;
};

const NearestBirthdaysWithHeaders = ({
	birthdays,
}: {
	birthdays: PersonBirthday[];
}) => {
	const headerTitle = {
		fontFamily: '"Playfair Display SC", serif',
		fontSize: '26px',
		letterSpacing: '2px',
		wordSpacing: '2px',
		color: '#000000',
		fontWeight: 'normal',
		textDecoration: 'none',
		fontStyle: 'normal',
		fontVariant: 'normal',
	};
	const [birthdayTodayTitle, setBirthdayTodayTitle] = useState<string>('');
	const [nearestBirthdayDate, setNearestBirthdayDate] = useState<Date | null>(
		null
	);

	useEffect(() => {
		if (birthdays.length !== 0) {
			if (birthdays[0].birthday.getDate() !== new Date().getDate()) {
				//No birthday today
				setBirthdayTodayTitle('Сьогодні немає днів народжень');
				setNearestBirthdayDate(birthdays[0].birthday);
			}
		}
	}, [birthdays]);
	return (
		<>
			<div className='m-3'>
				<p style={headerTitle}>{birthdayTodayTitle}</p>
				{nearestBirthdayDate && (
					<p
						style={headerTitle}
					>{`Дні народження - ${nearestBirthdayDate.toLocaleDateString(
						'default',
						{
							month: 'long',
						}
					)} ${nearestBirthdayDate.getDate()}`}</p>
				)}
				<BirthdayTable birthdays={birthdays} />
			</div>
		</>
	);
};
const BirthdayTable = ({ birthdays }: { birthdays: PersonBirthday[] }) => {
	return (
		<div className='d-flex flex-column gap-2'>
			{birthdays.map((birthday) => (
				<BirthdayRow
					key={birthday.email}
					date={birthday.birthday}
					name={birthday.name}
					surname={birthday.surname}
					imgUrl={birthday.avatar}
					email={birthday.email}
				/>
			))}
		</div>
	);
};

const BirthdayRow = ({
	imgUrl,
	name,
	surname,
	date,
	email,
}: {
	imgUrl: string;
	name: string;
	surname: string;
	date: Date;
	email: string;
}) => {
	return (
		<div className='d-flex align-items-center'>
			<div style={{ width: '80px' }}>
				<img
					className='rounded-circle mw-100 h-auto'
					src={imgUrl ? imgUrl : DEFAULT_AVATAR_URL}
					alt=''
				/>
			</div>
			<div className='ms-3'>
				<div
					style={{
						fontFamily: 'Playfair Display, serif',
						fontSize: '20px',
						letterSpacing: '2px',
						wordSpacing: '2px',
						fontWeight: '700',
						textDecoration: 'none',
						fontStyle: 'normal',
						fontVariant: 'normal',
						textTransform: 'none',
						color: '#4D4D4D',
					}}
				>
					{surname + ' ' + name}
				</div>
				<div
					style={{
						fontFamily: 'Playfair Display, serif',
						fontSize: '20px',
						letterSpacing: '2px',
						wordSpacing: '2px',
						color: '#4D4D4D',
						fontWeight: '400',
						textDecoration: 'none',
						fontVariant: 'normal',
						textTransform: 'none',
					}}
				>
					{new Date().getFullYear() - date.getUTCFullYear()} років
				</div>
			</div>
		</div>
	);
};

export default NearestBirthdays;
