import React, { useContext, useState } from 'react';
import { Input } from '../../common/Input/Input';
import { ItemsContext } from '../ItemManager/ItemManager';
import { changeHandler } from '../../shared';
import { ErrorMessage } from '../../common/ErrorMessage/ErrorMessage';
import { createPersonFromJoinForm, Person, Statuses } from '../../api/person';
import FacultySelect from '../common/FacultySelect';
import SpecialtySelect from '../common/SpecialtySelect';
import YearSelect from '../common/YearSelect';
import { Button } from 'react-bootstrap';
import { TextField } from '../../common/TextField/TextField';
import { msalInstance } from '../../utils/authConfig';
import { AccountInfo } from '@azure/msal-browser';
import './JoinForm.css';
import RequiredStar from '../common/RequiredStar';
import { useDispatch } from 'react-redux';
import { fetchUserThunk } from '../../store/user/thunk';
import { Circles } from 'react-loader-spinner';

const JoinForm: React.FC<{}> = () => {
	const currentAccount: AccountInfo = msalInstance.getAllAccounts()[0];
	const email = currentAccount.username;

	const [name, setName] = useState<string>('');
	const [parental, setParental] = useState<string>('');
	const [surname, setSurname] = useState<string>('');
	const [facultyId, setFacultyId] = useState<number>(-1);
	const [specialtyId, setSpecialtyId] = useState<number>(-1);
	const [year, setYear] = useState<number>(new Date().getFullYear());
	// const [email, setEmail] = useState('');
	const [telegram, setTelegram] = useState('');
	const [about, setAbout] = useState('');
	const { createFunc, placeholder } = useContext(ItemsContext);
	const [error, setError] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const dispatch = useDispatch();

	const join = async () => {
		resetError();
		try {
			await createFunc({ name });
			if (name === '') {
				setError("Ім'я не має бути порожнім");
				return;
			}
			if (surname === '') {
				setError('Прізвище не має бути порожнім');
				return;
			}
			if (facultyId === -1) {
				setError('Факультет не має бути порожнім');
				return;
			}
			if (specialtyId === -1) {
				setError('Спеціальність не має бути порожньою');
				return;
			}
			if (Number(year) === -1) {
				setError('Рік вступу не має бути порожнім');
				return;
			}
			if (telegram === '') {
				setError('Телеграм не має бути порожнім');
				return;
			}
			if (about === '') {
				setError('Опис про себе не має бути порожнім');
				return;
			}
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
			setIsLoading(true);
			// @ts-ignore
			await createPersonFromJoinForm(person);
			dispatch(fetchUserThunk);
			//refresh();
		} catch (e) {
			setError((e as any).response.data.message);
		}
	};

	const resetError = () => setError('');

	return isLoading ? (
		<div className='mt-3'>
			<Circles
				height='150'
				width='150'
				//@ts-ignore
				radius='9'
				color='blue'
				ariaLabel='loading'
			/>
		</div>
	) : (
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
					required={true}
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
					required={true}
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
				<FacultySelect
					setFacultyId={setFacultyId}
					facultyId={facultyId}
					isRequired={true}
				/>
			</div>
			<div
				className='d-flex justify-content-start flex-column gap-1 mb-2 input-group'
				style={{ maxWidth: '350px' }}
			>
				<SpecialtySelect
					setSpecialtyId={setSpecialtyId}
					specialtyId={specialtyId}
					isRequired={true}
				/>
			</div>
			<div
				className='d-flex justify-content-start flex-column gap-1 mb-2 input-group'
				style={{ maxWidth: '350px' }}
			>
				<YearSelect setYearEnter={setYear} yearEnter={year} isRequired={true} />
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
					required={true}
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
					required={true}
				/>
			</div>
			<div
				className='d-flex align-items-center gap-1 mb-2 input-group'
				style={{ maxWidth: '350px' }}
			>
				<label htmlFor='about'>
					<RequiredStar />
					{
						'Декілька речень про себе. Чим любиш займатися? Що тебе цікавить в СБ?'
					}
				</label>
				<textarea
					className='form-control'
					placeholder={placeholder}
					id='about'
					value={about}
					onChange={changeHandler(setAbout, resetError)}
					style={{ width: '100%' }}
				/>
			</div>
			<ErrorMessage message={error} />
			<Button onClick={join} variant='primary' className='button-margin'>
				Доєднатися
			</Button>
		</section>
	);
};

export default JoinForm;
