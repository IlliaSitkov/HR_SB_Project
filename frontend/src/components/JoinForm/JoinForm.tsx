import React, { useContext, useState } from 'react';
import { Input } from '../../common/Input/Input';
import { ItemsContext } from '../ItemManager/ItemManager';
import { changeHandler } from '../../shared';
import { ErrorMessage } from '../../common/ErrorMessage/ErrorMessage';
import { createPerson, Person, Statuses } from '../../api/person';
import FacultySelect from '../common/FacultySelect';
import SpecialtySelect from '../common/SpecialtySelect';
import YearSelect from '../common/YearSelect';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { TextField } from '../../common/TextField/TextField';
import { msalInstance } from '../../utils/authConfig';
import { AccountInfo } from '@azure/msal-browser';

const JoinForm: React.FC<{}> = () => {
	const currentAccount: AccountInfo = msalInstance.getAllAccounts()[0];
	const email = currentAccount.username;

	const [name, setName] = useState<string>('');
	const [parental, setParental] = useState<string>('');
	const [surname, setSurname] = useState<string>('');
	const [facultyId, setFacultyId] = useState<number>(0);
	const [specialtyId, setSpecialtyId] = useState<number>(0);
	const [year, setYear] = useState<number>(new Date().getFullYear());
	// const [email, setEmail] = useState('');
	const [telegram, setTelegram] = useState('');
	const [about, setAbout] = useState('');
	const navigate = useNavigate();
	const { createFunc, placeholder } = useContext(ItemsContext);
	const [error, setError] = useState('');

	const join = async () => {
		resetError();
		try {
			await createFunc({ name });
			const person: Person = {
				name,
				parental,
				surname,
				faculty_id: facultyId,
				specialty_id: specialtyId,
				year_enter: year,
				email,
				telegram,
				about,
				date_fill_form: new Date(),
				status: Statuses.NEWCOMER,
			};
			// @ts-ignore
			await createPerson(person);
			// refresh();
			navigate('/profile', { replace: true });
		} catch (e) {
			setError((e as any).response.data.message);
		}
	};

	const resetError = () => setError('');

	return (
		<section className='col w-75 d-flex align-items-center flex-column'>
			<div
				className='d-flex align-items-center gap-1 mb-2 row-3 input-group'
				style={{ maxWidth: '350px' }}
			>
				<Input
					placeholder={placeholder}
					style={{ width: '100%' }}
					type='text'
					onChange={changeHandler(setSurname, resetError)}
					id='surname'
					value={surname}
					label='Прізвище'
				/>
			</div>
			<div
				className='d-flex align-items-center gap-1 mb-2 input-group'
				style={{ maxWidth: '350px' }}
			>
				<Input
					placeholder={placeholder}
					style={{ width: '100%' }}
					type='text'
					onChange={changeHandler(setName, resetError)}
					id='name'
					value={name}
					label="Ім'я"
				/>
			</div>
			<div
				className='d-flex align-items-center gap-1 mb-2 input-group'
				style={{ maxWidth: '350px' }}
			>
				<Input
					placeholder={placeholder}
					style={{ width: '100%' }}
					type='text'
					onChange={changeHandler(setParental, resetError)}
					id='parental'
					value={parental}
					label='По батькові'
				/>
			</div>
			<div
				className='d-flex justify-content-start flex-column gap-1 mb-2 input-group'
				style={{ maxWidth: '350px' }}
			>
				<FacultySelect setFacultyId={setFacultyId} facultyId={facultyId} />
			</div>
			<div
				className='d-flex justify-content-start flex-column gap-1 mb-2 input-group'
				style={{ maxWidth: '350px' }}
			>
				<SpecialtySelect
					setSpecialtyId={setSpecialtyId}
					specialtyId={specialtyId}
				/>
			</div>
			<div
				className='d-flex justify-content-start flex-column gap-1 mb-2 input-group'
				style={{ maxWidth: '350px' }}
			>
				<YearSelect setYearEnter={setYear} yearEnter={year} />
			</div>
			<div
				className='d-flex align-items-center gap-1 mb-2 input-group'
				style={{ maxWidth: '350px' }}
			>
				<TextField
					style={{ width: '100%' }}
					id='email'
					value={email}
					label='Корпоративна пошта'
				/>
			</div>
			<div
				className='d-flex align-items-center gap-1 mb-2 input-group'
				style={{ maxWidth: '350px' }}
			>
				<Input
					placeholder={placeholder}
					style={{ width: '100%' }}
					type='text'
					onChange={changeHandler(setTelegram, resetError)}
					id='telegram'
					value={telegram}
					label='Телеграм'
				/>
			</div>
			<div
				className='d-flex align-items-center gap-1 mb-2 input-group'
				style={{ maxWidth: '350px' }}
			>
				<Input
					placeholder={placeholder}
					style={{ width: '100%' }}
					type='text'
					onChange={changeHandler(setAbout, resetError)}
					id='about'
					value={about}
					label='Декілька речень про себе. Чим любиш займатися? Що тебе цікавить в СБ?'
				/>
			</div>
			<ErrorMessage message={error} />
			<Button onClick={join} variant='primary' className='ms-4 m-2'>
				Доєднатися
			</Button>
		</section>
	);
};

export default JoinForm;
