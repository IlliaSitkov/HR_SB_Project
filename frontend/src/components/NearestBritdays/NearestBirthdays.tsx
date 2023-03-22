import { useEffect, useState } from 'react';
import { getNearestBirthdays, PersonBirthday } from '../../api/person';
import { getProfilePhoto } from '../../api/user/user.service';

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
		fontFamily: '"Palatino Linotype", "Book Antiqua", Palatino, serif',
		fontSize: '28px',
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
				setBirthdayTodayTitle('There is no birthdays for today');
				setNearestBirthdayDate(birthdays[0].birthday);
			}
		}
	}, [birthdays]);
	return (
		<>
			<div>
				<p style={headerTitle}>{birthdayTodayTitle}</p>
				{nearestBirthdayDate && (
					<p
						style={headerTitle}
					>{`Birthdays on ${nearestBirthdayDate.toLocaleDateString('default', {
						month: 'long',
					})} ${nearestBirthdayDate.getDate()}`}</p>
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
					email={birthday.email}
				/>
			))}
		</div>
	);
};

const BirthdayRow = ({
	name,
	date,
	email,
}: {
	name: string;
	date: Date;
	email: string;
}) => {
	const [imgUrl, setImgUrl] = useState('');
	useEffect(() => {
		async function fetchApi() {
			return await getProfilePhoto(email);
		}

		fetchApi().then(setImgUrl);
	}, [email]);

	return (
		<div className='d-flex align-items-center'>
			<div style={{ width: '80px' }}>
				<img className='rounded-circle mw-100 h-auto' src={imgUrl} alt='' />
			</div>
			<div className='ms-3'>
				<div
					style={{
						fontFamily: 'Verdana, Geneva, sans-serif',
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
					{name}
				</div>
				<div
					style={{
						fontFamily: 'Verdana, Geneva, sans-serif',
						fontSize: '17px',
						letterSpacing: '2px',
						wordSpacing: '2px',
						color: '#4D4D4D',
						fontWeight: '400',
						textDecoration: 'none',
						fontStyle: 'italic',
						fontVariant: 'normal',
						textTransform: 'none',
					}}
				>
					{new Date().getFullYear() - date.getUTCFullYear()} years
				</div>
			</div>
		</div>
	);
};

export default NearestBirthdays;
