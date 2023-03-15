import React, { FC, useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getPeople, getPeoplePossibleParents } from '../../store/selectors';
import {
	getFullName,
	Person,
	roles,
	Statuses,
	statusesColorful,
} from '../../api/person';
import { UserActivities } from '../UserActivities/UserActivities';
import { changeHandler } from '../../shared';
import { Input } from '../../common/Input/Input';
import { Button, Card } from 'react-bootstrap';
import { ErrorMessage } from '../../common/ErrorMessage/ErrorMessage';
import { ItemManager } from '../ItemManager/ItemManager';
import {
	createGeneration,
	deleteGeneration,
	getAllGenerations,
	updateGeneration,
} from '../../api/generation/generation.service';
import { Select } from '../../common/Select/SelectComponent';
import { Faculty, getAllFaculties } from '../../api/faculty';
import { getAllSpecialties, Specialty } from '../../api/specialty';
import {
	deleteAPerson,
	updateAPerson,
	updateAPersonStatus,
} from '../../store/people/thunk';

export const PersonProfile: FC = () => {
	const people = useSelector(getPeople);
	const possibleParents = useSelector(getPeoplePossibleParents);
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { personId } = useParams();
	const [person, setPerson] = useState<Person | null>(null);

	const [surname, setSurname] = useState<string>('');
	const [name, setName] = useState<string>('');
	const [parental, setParental] = useState<string>('');
	const [dateBirth, setDateBirth] = useState<Date | null>(null);
	const [avatar, setAvatar] = useState<Buffer | null>(null);

	const [facultyId, setFacultyId] = useState<number>(-1);
	const [specialtyId, setSpecialtyId] = useState<number>(-1);
	const [yearEnter, setYearEnter] = useState<number>(-1);

	const [email, setEmail] = useState<string>('');
	const [telephone, setTelephone] = useState<string>('');
	const [telegram, setTelegram] = useState<string>('');
	const [facebook, setFacebook] = useState<string>('');

	const [status, setStatus] = useState<string>('');
	const [roleId, setRoleId] = useState<number>(-1);
	const [parentId, setParentId] = useState<number>(-1);
	const [generationId, setGenerationId] = useState<number>(-1);
	const [about, setAbout] = useState<string>('');

	const [dateFillForm, setDateFillForm] = useState<Date | null>(null);
	const [dateVysviata, setDateVysviata] = useState<Date | null>(null);
	const [datePoshanuvannia, setDatePoshanuvannia] = useState<Date | null>(null);
	const [dateExclusion, setDateExclusion] = useState<Date | null>(null);

	const [faculties, setFaculties] = useState<Faculty[]>([]);
	const [specialties, setSpecialties] = useState<Specialty[]>([]);
	const [yearsEnter, setYearsEnter] = useState<number[]>([]);

	const [error, setError] = useState('');

	const goBack = () => {
		navigate('/people', { replace: true });
	};

	const resetError = () => setError('');

	useEffect(() => {
		const p: Person = people.find(
			(person: Person) => person.id === Number(personId)
		);
		setPerson(p);

		setSurname(p.surname);
		setName(p.name);
		if (p.parental) setParental(p.parental);
		if (p.date_birth) setDateBirth(p.date_birth);
		if (p.avatar) setAvatar(p.avatar);

		if (p.faculty_id) setFacultyId(p.faculty_id);
		if (p.specialty_id) setSpecialtyId(p.specialty_id);
		if (p.year_enter) setYearEnter(p.year_enter);

		if (p.email) setEmail(p.email);
		if (p.telephone) setTelephone(p.telephone);
		if (p.telegram) setTelegram(p.telegram);
		if (p.facebook) setFacebook(p.facebook);

		setStatus(p.status);
		if (p.role) {
			const role = roles.find((r) => r.name === p.role);
			if (role) setRoleId(role.id);
		}
		if (p.parent_id) setParentId(p.parent_id);
		if (p.generation_id) setGenerationId(p.generation_id);
		if (p.about) setAbout(p.about);

		if (p.date_fill_form) setDateFillForm(p.date_fill_form);
		if (p.date_vysviata) setDateVysviata(p.date_vysviata);
		if (p.date_poshanuvannia) setDatePoshanuvannia(p.date_poshanuvannia);
		if (p.date_exclusion) setDateExclusion(p.date_exclusion);

		const yearsEnter = [];
		const currentYear = new Date().getFullYear();
		for (let i = 1992; i <= currentYear; i++) yearsEnter.push(i);
		setYearsEnter(yearsEnter);
		fetchData();
	}, []);

	const fetchData = async () => {
		const faculties = await getAllFaculties();
		setFaculties(faculties);

		const specialties = await getAllSpecialties();
		setSpecialties(specialties);
	};

	const updateStatusToMaliuk = () => {
		if (person && person.id) {
			resetError();
			try {
				// @ts-ignore
				dispatch(updateAPersonStatus(person.id, { status: Statuses.MALIUK }));
			} catch (e) {
				setError((e as any).response.data.message);
			}
		}
	};

	const updateStatusToBratchyk = () => {
		if (person && person.id) {
			resetError();
			try {
				dispatch(
					// @ts-ignore
					updateAPersonStatus(person.id, {
						status: Statuses.BRATCHYK,
						date: dateVysviata ? dateVysviata : new Date(),
					})
				);
			} catch (e) {
				setError((e as any).response.data.message);
			}
		}
	};

	const updateStatusToPoshanovanyi = () => {
		if (person && person.id) {
			resetError();
			try {
				dispatch(
					// @ts-ignore
					updateAPersonStatus(person.id, {
						status: Statuses.POSHANOVANYI,
						date: datePoshanuvannia ? datePoshanuvannia : new Date(),
					})
				);
			} catch (e) {
				setError((e as any).response.data.message);
			}
		}
	};

	const updateStatusToExBratchyk = () => {
		if (person && person.id) {
			resetError();
			try {
				dispatch(
					// @ts-ignore
					updateAPersonStatus(person.id, {
						status: Statuses.EX_BRATCHYK,
						date: dateExclusion ? dateExclusion : new Date(),
					})
				);
			} catch (e) {
				setError((e as any).response.data.message);
			}
		}
	};

	const updatePerson = () => {
		resetError();
		let p: Person | null = null;
		if (status === Statuses.NEWCOMER) p = getNewcomerToUpdate();
		else if (status === Statuses.MALIUK) p = getMaliukToUpdate();
		else if (status === Statuses.BRATCHYK) p = getBratchykToUpdate();
		else if (status === Statuses.POSHANOVANYI) p = getPoshanovanyiToUpdate();
		else if (status === Statuses.EX_BRATCHYK) p = getExBratchykToUpdate();
		try {
			// @ts-ignore
			dispatch(updateAPerson(person.id, p));
		} catch (e) {
			setError((e as any).response.data.message);
		}
	};

	const deletePerson = () => {
		resetError();
		try {
			// @ts-ignore
			dispatch(deleteAPerson(person.id));
			navigate('/people', { replace: true });
		} catch (e) {
			setError((e as any).response.data.message);
		}
	};

	const getNewcomerToUpdate = (): Person => {
		return {
			name,
			surname,
			parental,
			date_birth: dateBirth,

			faculty_id: facultyId >= 0 ? facultyId : null,
			specialty_id: specialtyId >= 0 ? specialtyId : null,
			year_enter: yearEnter > 0 ? yearEnter : null,

			email,
			telephone,
			telegram,
			facebook,

			status,
			about,

			date_fill_form: dateFillForm,
		};
	};

	const getMaliukToUpdate = (): Person => {
		return {
			name,
			surname,
			parental,
			date_birth: dateBirth,
			avatar,

			faculty_id: facultyId >= 0 ? facultyId : null,
			specialty_id: specialtyId >= 0 ? specialtyId : null,
			year_enter: yearEnter > 0 ? yearEnter : null,

			email,
			telephone,
			telegram,
			facebook,

			status,
			parent_id: parentId >= 0 ? parentId : null,
			about,

			date_fill_form: dateFillForm,
		};
	};

	const getBratchykToUpdate = (): Person => {
		return {
			name,
			surname,
			parental,
			date_birth: dateBirth,
			avatar,

			faculty_id: facultyId >= 0 ? facultyId : null,
			specialty_id: specialtyId >= 0 ? specialtyId : null,
			year_enter: yearEnter > 0 ? yearEnter : null,

			email,
			telephone,
			telegram,
			facebook,

			status,
			// @ts-ignore
			role: roleId >= 0 ? roles.find((r) => r.id === roleId).name : null,
			parent_id: parentId >= 0 ? parentId : null,
			about,

			date_vysviata: dateVysviata,
		};
	};

	const getPoshanovanyiToUpdate = (): Person => {
		return {
			name,
			surname,
			parental,
			date_birth: dateBirth,
			avatar,

			faculty_id: facultyId >= 0 ? facultyId : null,
			specialty_id: specialtyId >= 0 ? specialtyId : null,

			email,
			telephone,
			telegram,
			facebook,

			status,
			parent_id: parentId >= 0 ? parentId : null,
			generation_id: generationId >= 0 ? generationId : null,
			about,

			date_poshanuvannia: datePoshanuvannia,
		};
	};

	const getExBratchykToUpdate = (): Person => {
		return {
			name,
			surname,
			parental,
			date_birth: dateBirth,
			avatar,

			faculty_id: facultyId >= 0 ? facultyId : null,
			specialty_id: specialtyId >= 0 ? specialtyId : null,

			email,
			telephone,
			telegram,
			facebook,

			status,
			parent_id: parentId >= 0 ? parentId : null,
			generation_id: generationId >= 0 ? generationId : null,
			about,

			date_exclusion: dateExclusion,
		};
	};

	return !localStorage.getItem('token') ? (
		<Navigate to='/' />
	) : (
		<>
			<Button
				id='backPerson'
				onClick={goBack}
				variant='primary'
				className='ms-4 m-2 align-self-start'
			>
				Назад
			</Button>
			<div className='mb-5'>
				{status !== Statuses.NEWCOMER ? (
					<Card.Img
						src='https://kvitkay.com.ua/image/catalog/IMG_9625.JPG'
						className='rounded'
						style={{ maxWidth: '40%' }}
					/>
				) : null}
				<Input
					id='surname'
					placeholder={'Введіть прізвище...'}
					type='text'
					onChange={changeHandler(setSurname, resetError)}
					value={surname}
					label='Прізвище'
					required={true}
				/>
				<Input
					id='name'
					placeholder={'Введіть ім`я...'}
					type='text'
					onChange={changeHandler(setName, resetError)}
					value={name}
					label='Ім`я'
					required={true}
				/>
				<Input
					id='parental'
					placeholder={'Введіть по батькові...'}
					type='text'
					onChange={changeHandler(setParental, resetError)}
					value={parental}
					label='По батькові'
				/>
				{status !== Statuses.NEWCOMER ? (
					<Input
						id='dateBirth'
						type='date'
						onChange={changeHandler(setDateBirth, resetError)}
						value={dateBirth ? dateBirth.toString() : ''}
						label='Дата народження'
					/>
				) : null}

				<Select
					id='select'
					noneSelectedOption={true}
					value={facultyId}
					label='Факультет'
					onChange={changeHandler(setFacultyId)}
					data={faculties}
					idSelector={(f) => f.id}
					nameSelector={(f) => f.name}
				/>
				<Select
					id='select'
					noneSelectedOption={true}
					value={specialtyId}
					label='Спеціальність'
					onChange={changeHandler(setSpecialtyId)}
					data={specialties}
					idSelector={(s) => s.id}
					nameSelector={(s) => s.name}
				/>
				{status !== Statuses.POSHANOVANYI && status !== Statuses.EX_BRATCHYK ? (
					<Select
						id='select'
						noneSelectedOption={true}
						value={yearEnter}
						label='Рік вступу в КМА'
						onChange={changeHandler(setYearEnter)}
						data={yearsEnter}
						idSelector={(y) => y}
						nameSelector={(y) => y}
					/>
				) : null}

				<Input
					id='email'
					placeholder={'Введіть email...'}
					type='text'
					onChange={changeHandler(setEmail, resetError)}
					value={email}
					label='Email'
				/>
				<Input
					id='telephone'
					placeholder={'Введіть телефон...'}
					type='text'
					onChange={changeHandler(setTelephone, resetError)}
					value={telephone}
					label='Телефон'
				/>
				<Input
					id='telegram'
					placeholder={'Введіть телеграм...'}
					type='text'
					onChange={changeHandler(setTelegram, resetError)}
					value={telegram}
					label='Телеграм'
				/>
				<Input
					id='facebook'
					placeholder={'Введіть фейсбук...'}
					type='text'
					onChange={changeHandler(setFacebook, resetError)}
					value={facebook}
					label='Фейсбук'
				/>

				{status === Statuses.BRATCHYK ? (
					<Select
						id='select'
						noneSelectedOption={true}
						value={roleId}
						label='Посада'
						onChange={changeHandler(setRoleId)}
						data={roles}
						idSelector={(r) => r.id}
						nameSelector={(r) => r.ukr}
					/>
				) : null}
				{status !== Statuses.NEWCOMER ? (
					<Select
						id='select'
						noneSelectedOption={true}
						value={parentId}
						label='Патрон'
						onChange={changeHandler(setParentId)}
						data={possibleParents}
						idSelector={(p) => p.id}
						nameSelector={(p) =>
							//@ts-ignore
							`${getFullName(p)} (${statusesColorful[p.status].ukr})`
						}
					/>
				) : null}
				{status === Statuses.POSHANOVANYI || status === Statuses.EX_BRATCHYK ? (
					<ItemManager
						selectedItem={generationId}
						setSelectedItem={setGenerationId}
						getAllFunc={getAllGenerations}
						updateFunc={updateGeneration}
						deleteFunc={deleteGeneration}
						createFunc={createGeneration}
						selectTitle='Покоління'
						modalTitle='Усі покоління'
						placeholder='Нове покоління'
					/>
				) : null}
				<Input
					id='about'
					placeholder={'Введіть опис...'}
					type='text'
					onChange={changeHandler(setAbout, resetError)}
					value={about}
					label='Опис'
				/>

				{status === Statuses.NEWCOMER || status === Statuses.MALIUK ? (
					<Input
						id='dateFillForm'
						type='date'
						onChange={changeHandler(setDateFillForm, resetError)}
						value={dateFillForm ? dateFillForm.toString() : ''}
						label='Дата заповнення форми для приєднання'
					/>
				) : null}
				{status === Statuses.BRATCHYK ? (
					<Input
						id='dateVysviata'
						type='date'
						onChange={changeHandler(setDateVysviata, resetError)}
						value={dateVysviata ? dateVysviata.toString() : ''}
						label='Дата висвяти'
					/>
				) : null}
				{status === Statuses.POSHANOVANYI ? (
					<Input
						id='datePoshanuvannia'
						type='date'
						onChange={changeHandler(setDatePoshanuvannia, resetError)}
						value={datePoshanuvannia ? datePoshanuvannia.toString() : ''}
						label='Дата пошанування'
					/>
				) : null}
				{status === Statuses.EX_BRATCHYK ? (
					<Input
						id='dateExclusion'
						type='date'
						onChange={changeHandler(setDateExclusion, resetError)}
						value={dateExclusion ? dateExclusion.toString() : ''}
						label='Дата виключення'
					/>
				) : null}

				{status === Statuses.NEWCOMER ? (
					<Button
						variant='primary'
						onClick={updateStatusToMaliuk}
						id='updateStatus'
						className='m-2'
					>
						{'Новенький -> Малюк'}
					</Button>
				) : null}
				{status === Statuses.MALIUK ? (
					<Button
						variant='primary'
						onClick={updateStatusToBratchyk}
						id='updateStatus'
						className='m-2'
					>
						{'Малюк -> Братчик'}
					</Button>
				) : null}
				{status === Statuses.BRATCHYK ? (
					<Button
						variant='primary'
						onClick={updateStatusToPoshanovanyi}
						id='updateStatus'
						className='m-2'
					>
						{'Братчик -> Пошанований'}
					</Button>
				) : null}
				{status === Statuses.BRATCHYK ? (
					<Button
						variant='primary'
						onClick={updateStatusToExBratchyk}
						id='updateStatus'
						className='m-2'
					>
						{'Братчик -> Виключений братчик'}
					</Button>
				) : null}
			</div>
			<div>
				<Button
					variant='primary'
					onClick={updatePerson}
					id='updatePerson'
					className='m-2'
				>
					{'Оновити'}
				</Button>
				<Button
					variant='danger'
					onClick={deletePerson}
					id='deletePerson'
					className='m-2'
				>
					{'Видалити'}
				</Button>
			</div>
			<UserActivities personId={Number(personId)} />
			<ErrorMessage message={error} />
		</>
	);
};
