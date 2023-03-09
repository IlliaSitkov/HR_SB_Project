import React, { ChangeEvent, FC, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
	getErrorMessage,
	getGotData,
	getPeople,
	getPeoplePossibleParents,
	getUserRole,
} from '../../store/selectors';
import {
	getAllPeople,
	getFullName,
	getRoleUkr,
	getStatusStyle,
	getStatusUkr,
	Person,
	roles,
	Statuses,
} from '../../api/person';
import { UserActivities } from '../UserActivities/UserActivities';
import { changeHandler } from '../../shared';
import { Input } from '../../common/Input/Input';
import { Button, Col, Row } from 'react-bootstrap';
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
import { peopleGet } from '../../store/people/actionCreators';
import { dateToString } from '../../utils/dates';
import { ErrorMessageBig } from '../../common/ErrorMessage/ErrorMessageBig';
import {
	createUser,
	getUserByEmail,
	updateUser,
} from '../../api/user/user.service';
import { UserRole } from '../../api/common/types';
import { gotDataSet } from '../../store/gotData/actionCreators';
import { errorMessageSet } from '../../store/errorMessage/actionCreators';
import { DEFAULT_AVATAR_URL, VALUE_NOT_SET } from '../../utils/constants';
import { ConfirmationModal } from '../ConfirmationModal/ConfirmationModal';
import { GotDataStatus } from '../../store/gotDataEnum';
import { TextField } from '../../common/TextField/TextField';
import { ImageInput } from '../../common/ImageInput/ImageInput';
import { uploadImageAndGetUrl } from '../../utils/uploadImages';

export const PersonProfile: FC = () => {
	const gotData = useSelector<number>(getGotData);
	const errorMessage = useSelector<string>(getErrorMessage);

	const people = useSelector(getPeople);
	const possibleParents = useSelector(getPeoplePossibleParents);
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { memberId } = useParams();
	const [person, setPerson] = useState<Person | null>(null);

	const [surname, setSurname] = useState<string>('');
	const [name, setName] = useState<string>('');
	const [parental, setParental] = useState<string>('');
	const [date_birth, setDate_birth] = useState<string>('');
	const [avatar, setAvatar] = useState<string>('');
	const [avatarFilePath, setAvatarFilePath] = useState<string>('');

	const [faculty_id, setFaculty_id] = useState<number>(-1);
	const [specialty_id, setSpecialty_id] = useState<number>(-1);
	const [year_enter, setYear_enter] = useState<number>(-1);

	const [email, setEmail] = useState<string>('');
	const [telephone, setTelephone] = useState<string>('');
	const [telegram, setTelegram] = useState<string>('');
	const [facebook, setFacebook] = useState<string>('');

	const [status, setStatus] = useState<string>('');
	const [roleId, setRoleId] = useState<number>(-1);
	const [parent_id, setParent_id] = useState<number>(-1);
	const [generation_id, setGeneration_id] = useState<number>(-1);
	const [about, setAbout] = useState<string>('');

	const [date_fill_form, setDate_fill_form] = useState<string>('');
	const [date_vysviata, setDate_vysviata] = useState<string>('');
	const [date_poshanuvannia, setDate_poshanuvannia] = useState<string>('');
	const [date_exclusion, setDate_exclusion] = useState<string>('');

	const [faculties, setFaculties] = useState<Faculty[]>([]);
	const [specialties, setSpecialties] = useState<Specialty[]>([]);
	const [yearsEnter, setYearsEnter] = useState<number[]>([]);

	const [showConfirmDeleteModal, setShowConfirmDeleteModal] =
		useState<boolean>(false);
	const [
		showConfirmUpdateStatusToMaliukModal,
		setShowConfirmUpdateStatusToMaliukModal,
	] = useState<boolean>(false);
	const [
		showConfirmUpdateStatusToBratchykModal,
		setShowConfirmUpdateStatusToBratchykModal,
	] = useState<boolean>(false);
	const [
		showConfirmUpdateStatusToPoshanovanyiModal,
		setShowConfirmUpdateStatusToPoshanovanyiModal,
	] = useState<boolean>(false);
	const [
		showConfirmUpdateStatusToExBratchykModal,
		setShowConfirmUpdateStatusToExBratchykModal,
	] = useState<boolean>(false);

	//-1 - not fetched yet or person does not have email
	//0 - fetched, user is not HR
	//1 - fetched, user is HR
	const [isHR, setIsHR] = useState<number>(-1);
	const [userId, setUserId] = useState<number>(-1);
	const userRole = useSelector(getUserRole);

	const goBack = () => {
		resetError();
		navigate('/members', { replace: true });
	};

	const resetError = () => dispatch(errorMessageSet(''));

	useEffect(() => {
		fetchData();
		return () => {
			resetError();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [people]);

	const fetchData = async () => {
		if (
			gotData === GotDataStatus.NOT_YET_LOADED ||
			gotData === GotDataStatus.ERROR_WHILE_LOADING
		) {
			dispatch(gotDataSet(GotDataStatus.STARTED_LOADING));

			const peopleRes = await getAllPeople();
			if (!peopleRes) {
				alert('Помилка при завантаженні людей!');
				dispatch(gotDataSet(GotDataStatus.ERROR_WHILE_LOADING));
				return;
			}

			dispatch(gotDataSet(GotDataStatus.LOADED_SUCCESSFULLY));
			dispatch(peopleGet(peopleRes));
		}

		const p: Person = people.find(
			(person: Person) => person.id === Number(memberId)
		);
		if (p) {
			console.log('Start person: ');
			console.log(p);
			setPerson(p);

			setSurname(p.surname);
			setName(p.name);
			if (p.parental) setParental(p.parental);

			if (p.date_birth) setDate_birth(dateToString(new Date(p.date_birth)));
			if (p.avatar) setAvatar(p.avatar);

			if (p.faculty_id) setFaculty_id(p.faculty_id);
			if (p.specialty_id) setSpecialty_id(p.specialty_id);
			if (p.year_enter) setYear_enter(p.year_enter);

			if (p.email) setEmail(p.email);
			if (p.telephone) setTelephone(p.telephone);
			if (p.telegram) setTelegram(p.telegram);
			if (p.facebook) setFacebook(p.facebook);

			setStatus(p.status);
			if (p.role) {
				const role = roles.find((r) => r.name === p.role);
				if (role) setRoleId(role.id);
			}
			if (p.parent_id) setParent_id(p.parent_id);
			if (p.generation_id) setGeneration_id(p.generation_id);
			if (p.about) setAbout(p.about);

			if (p.date_fill_form)
				setDate_fill_form(dateToString(new Date(p.date_fill_form)));
			if (p.date_vysviata)
				setDate_vysviata(dateToString(new Date(p.date_vysviata)));
			if (p.date_poshanuvannia)
				setDate_poshanuvannia(dateToString(new Date(p.date_poshanuvannia)));
			if (p.date_exclusion)
				setDate_exclusion(dateToString(new Date(p.date_exclusion)));

			const yearsEnter = [];
			const currentYear = new Date().getFullYear();
			for (let i = 1992; i <= currentYear; i++) yearsEnter.push(i);
			setYearsEnter(yearsEnter);

			const faculties = await getAllFaculties();
			setFaculties(faculties);

			const specialties = await getAllSpecialties();
			setSpecialties(specialties);

			if (p.email) {
				let user = await getUserByEmail(p.email);
				if (!user)
					user = await createUser({ personId: p.id, role: UserRole.USER });
				if (user) {
					setUserId(user.id);
					if (user.role === UserRole.HR) {
						setIsHR(1);
					} else setIsHR(0);
				}
			} else {
				setIsHR(-1);
				setUserId(-1);
			}
		}
	};

	const updateStatusToMaliuk = () => {
		setShowConfirmUpdateStatusToMaliukModal(
			!showConfirmUpdateStatusToMaliukModal
		);
		if (person && person.id) {
			resetError();
			dispatch(
				// @ts-ignore
				updateAPersonStatus(person.id, {
					oldStatus: Statuses.NEWCOMER,
					newStatus: Statuses.MALIUK,
				})
			);
		}
	};

	const updateStatusToBratchyk = () => {
		setShowConfirmUpdateStatusToBratchykModal(
			!showConfirmUpdateStatusToBratchykModal
		);
		if (person && person.id) {
			resetError();
			dispatch(
				// @ts-ignore
				updateAPersonStatus(person.id, {
					oldStatus: Statuses.MALIUK,
					newStatus: Statuses.BRATCHYK,
					date: date_vysviata === '' ? new Date() : new Date(date_vysviata),
				})
			);
		}
	};

	const updateStatusToPoshanovanyi = () => {
		setShowConfirmUpdateStatusToPoshanovanyiModal(
			!showConfirmUpdateStatusToPoshanovanyiModal
		);
		if (person && person.id) {
			resetError();
			dispatch(
				// @ts-ignore
				updateAPersonStatus(person.id, {
					oldStatus: Statuses.BRATCHYK,
					newStatus: Statuses.POSHANOVANYI,
					date:
						date_poshanuvannia === ''
							? new Date()
							: new Date(date_poshanuvannia),
				})
			);
		}
	};

	const updateStatusToExBratchyk = () => {
		setShowConfirmUpdateStatusToExBratchykModal(
			!showConfirmUpdateStatusToExBratchykModal
		);
		if (person && person.id) {
			resetError();
			dispatch(
				// @ts-ignore
				updateAPersonStatus(person.id, {
					oldStatus: Statuses.BRATCHYK,
					newStatus: Statuses.EX_BRATCHYK,
					date: date_exclusion === '' ? new Date() : new Date(date_exclusion),
				})
			);
		}
	};

	const deletePerson = () => {
		setShowConfirmDeleteModal(!showConfirmDeleteModal);
		resetError();
		// @ts-ignore
		dispatch(deleteAPerson(person.id));
		navigate('/members', { replace: true });
	};

	const updatePerson = () => {
		resetError();
		let p: any = {};
		addCommonFieldsToUpdate(p);
		if (status === Statuses.NEWCOMER) formNewcomerToUpdate(p);
		else if (status === Statuses.MALIUK) formMaliukToUpdate(p);
		else if (status === Statuses.BRATCHYK) formBratchykToUpdate(p);
		else if (status === Statuses.POSHANOVANYI) formPoshanovanyiToUpdate(p);
		else if (status === Statuses.EX_BRATCHYK) formExBratchykToUpdate(p);
		console.log('Person to update: ');
		console.log(p);
		// @ts-ignore
		dispatch(updateAPerson(person.id, p));
	};

	const addCommonFieldsToUpdate = (p: any): void => {
		p.status = status;
		addFieldIfNeeded(p, name, 'name');
		addFieldIfNeeded(p, surname, 'surname');
		addFieldIfNeeded(p, parental, 'parental');
		addFieldIfNeeded(
			p,
			date_birth === '' ? null : new Date(date_birth),
			'date_birth'
		);

		addFieldFromSelectIfNeeded(p, faculty_id, 'faculty_id');
		addFieldFromSelectIfNeeded(p, specialty_id, 'specialty_id');

		addFieldIfNeeded(p, email, 'email');
		addFieldIfNeeded(p, telephone, 'telephone');
		addFieldIfNeeded(p, telegram, 'telegram');
		addFieldIfNeeded(p, facebook, 'facebook');

		addFieldIfNeeded(p, about, 'about');
	};

	const formNewcomerToUpdate = (p: any): void => {
		addFieldFromSelectIfNeeded(p, year_enter, 'year_enter');
		addFieldIfNeeded(
			p,
			date_fill_form === '' ? null : new Date(date_fill_form),
			'date_fill_form'
		);
	};

	const formMaliukToUpdate = (p: any): void => {
		addFieldIfNeeded(p, avatar, 'avatar');
		addFieldFromSelectIfNeeded(p, year_enter, 'year_enter');
		addFieldFromSelectIfNeeded(p, parent_id, 'parent_id');
		addFieldIfNeeded(
			p,
			date_fill_form === '' ? null : new Date(date_fill_form),
			'date_fill_form'
		);
	};

	const formBratchykToUpdate = (p: any): void => {
		addFieldIfNeeded(p, avatar, 'avatar');
		addFieldFromSelectIfNeeded(p, year_enter, 'year_enter');
		addFieldFromSelectIfNeeded(p, parent_id, 'parent_id');
		const role =
			Number(roleId) >= 0
				? // @ts-ignore
				  roles.find((r) => r.id === Number(roleId)).name
				: null;
		addFieldIfNeeded(p, role, 'role');
		addFieldIfNeeded(
			p,
			date_vysviata === '' ? null : new Date(date_vysviata),
			'date_vysviata'
		);
	};

	const formPoshanovanyiToUpdate = (p: any): void => {
		addFieldIfNeeded(p, avatar, 'avatar');
		addFieldFromSelectIfNeeded(p, parent_id, 'parent_id');
		addFieldFromSelectIfNeeded(p, generation_id, 'generation_id');
		addFieldIfNeeded(
			p,
			date_poshanuvannia === '' ? null : new Date(date_poshanuvannia),
			'date_poshanuvannia'
		);
	};

	const formExBratchykToUpdate = (p: any): void => {
		addFieldIfNeeded(p, avatar, 'avatar');
		addFieldFromSelectIfNeeded(p, parent_id, 'parent_id');
		addFieldFromSelectIfNeeded(p, generation_id, 'generation_id');
		addFieldIfNeeded(
			p,
			date_exclusion === '' ? null : new Date(date_exclusion),
			'date_exclusion'
		);
	};

	const addFieldIfNeeded = (
		person: any,
		field: any,
		fieldName: string
	): void => {
		if (doesFieldNeedUpdate(field, fieldName)) {
			person[fieldName] = field;
		}
	};

	const addFieldFromSelectIfNeeded = (
		person: any,
		field: any,
		fieldName: string
	): void => {
		let fieldNumber: number | null = Number(field);
		if (fieldNumber && fieldNumber < 0) fieldNumber = null;
		if (doesFieldNeedUpdate(fieldNumber, fieldName))
			person[fieldName] = fieldNumber;
	};

	const doesFieldNeedUpdate = (field: any, fieldName: string): boolean => {
		if (person) {
			// @ts-ignore
			const value = person[fieldName];
			if (!value || value === '') {
				return !(!field || field.toString().trim() === '');
			} else
				return !(
					value === field ||
					(field && value.toString().trim() === field.toString().trim())
				);
		} else return false;
	};

	const makePersonToBeHR = async () => {
		try {
			resetError();
			await updateUser(userId, UserRole.HR);
			setIsHR(1);
		} catch (e) {
			dispatch(errorMessageSet((e as any).response.data.message));
		}
	};

	const deletePersonFromHRs = async () => {
		try {
			resetError();
			await updateUser(userId, UserRole.USER);
			setIsHR(0);
		} catch (e) {
			dispatch(errorMessageSet((e as any).response.data.message));
		}
	};

	const getFieldValue = (fieldName: string) => {
		// @ts-ignore
		return person && person[fieldName] ? person[fieldName] : VALUE_NOT_SET;
	};

	const getDeepFieldValue = (
		parentFieldName: string,
		childFieldName: string
	) => {
		return person &&
			// @ts-ignore
			person[parentFieldName] &&
			// @ts-ignore
			person[parentFieldName][childFieldName]
			? // @ts-ignore
			  person[parentFieldName][childFieldName]
			: VALUE_NOT_SET;
	};

	const getDateFieldValue = (fieldName: string) => {
		// @ts-ignore
		return person && person[fieldName]
			? // @ts-ignore
			  new Date(person[fieldName]).toLocaleDateString()
			: VALUE_NOT_SET;
	};

	const processFileChosen = async (event: ChangeEvent) => {
		resetError();
		// @ts-ignore
		setAvatarFilePath(event.target.value);
		const errorText = 'Не вдалося встановити новий аватар';
		try {
			// @ts-ignore
			const selectedFile = event.target.files[0];
			const newAvatarUrl = await uploadImageAndGetUrl(
				selectedFile,
				surname + name
			);
			if (newAvatarUrl) {
				setAvatar(newAvatarUrl);
				console.log(newAvatarUrl);
			} else dispatch(errorMessageSet(errorText));
		} catch (e) {
			dispatch(errorMessageSet(errorText));
		}
	};

	return (
		<>
			<Button
				id='backPerson'
				onClick={goBack}
				variant='primary'
				className='ms-4 m-2 align-self-start'
			>
				Назад
			</Button>
			<div className='w-100'>
				<h3 className='text-center'>Профіль людини</h3>
				<Row xs={1} sm={1} md={2} lg={2} className='m-2'>
					<Col>
						<div className='m-2 justify-content-center d-flex'>
							{status !== Statuses.NEWCOMER && userRole === UserRole.HR ? (
								<>
									<ImageInput
										id='selectAvatarPersonProfile'
										value={avatarFilePath}
										onChange={(e) => processFileChosen(e)}
									/>
									<img
										src={avatar ? avatar : DEFAULT_AVATAR_URL}
										className='rounded'
										style={{
											maxWidth: '320px',
											maxHeight: '320px',
											cursor: 'pointer',
										}}
										alt='Аватар'
										onClick={() =>
											document
												.getElementById('selectAvatarPersonProfile')!
												.click()
										}
									/>
								</>
							) : null}
							{status !== Statuses.NEWCOMER && userRole !== UserRole.HR ? (
								<img
									src={avatar ? avatar : DEFAULT_AVATAR_URL}
									className='rounded'
									style={{
										maxWidth: '350px',
										maxHeight: '350px',
									}}
									alt='Аватар'
								/>
							) : null}
						</div>
						<h5
							style={getStatusStyle(status)}
							className='rounded mt-2 p-1 text-center ms-5 me-5'
						>
							{getStatusUkr(status)}
						</h5>
					</Col>
					<Col className='d-flex'>
						<div className='border-secondary border border-1 p-2 rounded m-2 flex-fill'>
							<h6 className='text-center'>Загальні дані</h6>
							<Input
								id='surname'
								type='text'
								onChange={changeHandler(setSurname, resetError)}
								value={surname}
								label='Прізвище'
								required={true}
								disabled={userRole !== UserRole.HR}
								inputStyle={{ background: 'white' }}
							/>
							<Input
								id='name'
								type='text'
								onChange={changeHandler(setName, resetError)}
								value={name}
								label='Ім`я'
								required={true}
								disabled={userRole !== UserRole.HR}
								inputStyle={{ background: 'white' }}
							/>
							<Input
								id='parental'
								type='text'
								onChange={changeHandler(setParental, resetError)}
								value={
									userRole === UserRole.HR
										? parental
										: getFieldValue('parental')
								}
								label='По батькові'
								disabled={userRole !== UserRole.HR}
								inputStyle={{ background: 'white' }}
							/>
							{status !== Statuses.NEWCOMER ? (
								<Input
									id='dateBirth'
									type='date'
									onChange={changeHandler(setDate_birth, resetError)}
									value={
										userRole === UserRole.HR
											? date_birth
											: getDateFieldValue('date_birth')
									}
									label='Дата народження'
									disabled={userRole !== UserRole.HR}
									inputStyle={{ background: 'white' }}
								/>
							) : null}
						</div>
					</Col>
				</Row>

				<Row xs={1} sm={1} md={2} lg={3} className='m-2'>
					<Col className='d-flex'>
						<div className='border-secondary border border-1 p-2 rounded m-2 flex-fill'>
							<h6 className='text-center'>Навчання в КМА</h6>
							{userRole === UserRole.HR ? (
								<>
									<Select
										id='selectFaculty'
										noneSelectedOption={true}
										value={faculty_id}
										label='Факультет'
										onChange={changeHandler(setFaculty_id)}
										data={faculties}
										idSelector={(f) => f.id}
										nameSelector={(f) => f.name}
									/>
									<Select
										id='selectSpecialty'
										noneSelectedOption={true}
										value={specialty_id}
										label='Спеціальність'
										onChange={changeHandler(setSpecialty_id)}
										data={specialties}
										idSelector={(s) => s.id}
										nameSelector={(s) => s.name}
									/>
									{status !== Statuses.POSHANOVANYI &&
									status !== Statuses.EX_BRATCHYK ? (
										<Select
											id='selectYearEnter'
											noneSelectedOption={true}
											value={year_enter}
											label='Рік вступу в КМА'
											onChange={changeHandler(setYear_enter)}
											data={yearsEnter}
											idSelector={(y) => y}
											nameSelector={(y) => y}
										/>
									) : null}
								</>
							) : (
								<>
									<TextField
										value={getDeepFieldValue('faculty', 'name')}
										label='Факультет'
										id='faculty'
									/>
									<TextField
										id='specialty'
										value={getDeepFieldValue('specialty', 'name')}
										label='Спеціальність'
									/>
									{status !== Statuses.POSHANOVANYI &&
									status !== Statuses.EX_BRATCHYK ? (
										<TextField
											value={getFieldValue('year_enter')}
											label='Рік вступу в КМА'
											id='year_enter'
										/>
									) : null}
								</>
							)}
						</div>
					</Col>
					<Col className='d-flex'>
						<div className='border-secondary border border-1 p-2 rounded m-2 flex-fill'>
							<h6 className='text-center'>Контакти</h6>
							<Input
								id='email'
								type='text'
								onChange={changeHandler(setEmail, resetError)}
								value={
									userRole === UserRole.HR ? email : getFieldValue('email')
								}
								label='Email'
								disabled={userRole !== UserRole.HR}
								inputStyle={{ background: 'white' }}
							/>
							<Input
								id='telephone'
								type='text'
								onChange={changeHandler(setTelephone, resetError)}
								value={
									userRole === UserRole.HR
										? telephone
										: getFieldValue('telephone')
								}
								label='Телефон'
								disabled={userRole !== UserRole.HR}
								inputStyle={{ background: 'white' }}
							/>
							<Input
								id='telegram'
								type='text'
								onChange={changeHandler(setTelegram, resetError)}
								value={
									userRole === UserRole.HR
										? telegram
										: getFieldValue('telegram')
								}
								label='Телеграм'
								disabled={userRole !== UserRole.HR}
								inputStyle={{ background: 'white' }}
							/>
							<Input
								id='facebook'
								type='text'
								onChange={changeHandler(setFacebook, resetError)}
								value={
									userRole === UserRole.HR
										? facebook
										: getFieldValue('facebook')
								}
								label='Фейсбук'
								disabled={userRole !== UserRole.HR}
								inputStyle={{ background: 'white' }}
							/>
						</div>
					</Col>
					<Col className='d-flex'>
						<div className='border-secondary border border-1 p-2 rounded m-2 flex-fill'>
							<h6 className='text-center'>Дані в СБ</h6>
							<div>
								<label htmlFor='about'>Опис</label>
								<textarea
									className='form-control'
									id='about'
									value={
										userRole === UserRole.HR ? about : getFieldValue('about')
									}
									onChange={changeHandler(setAbout, resetError)}
									disabled={userRole !== UserRole.HR}
									style={{ background: 'white' }}
								/>
							</div>
							{userRole === UserRole.HR ? (
								<>
									{status !== Statuses.NEWCOMER ? (
										<Select
											id='selectParent'
											noneSelectedOption={true}
											value={parent_id}
											label='Патрон'
											onChange={changeHandler(setParent_id)}
											data={possibleParents}
											idSelector={(p) => p.id}
											nameSelector={(p) =>
												//@ts-ignore
												`${getFullName(p)} (${getStatusUkr(p.status)})`
											}
										/>
									) : null}
									{status === Statuses.BRATCHYK ? (
										<Select
											id='selectRole'
											noneSelectedOption={true}
											value={roleId}
											label='Посада'
											onChange={changeHandler(setRoleId)}
											data={roles}
											idSelector={(r) => r.id}
											nameSelector={(r) => r.ukr}
										/>
									) : null}
									{status === Statuses.POSHANOVANYI ||
									status === Statuses.EX_BRATCHYK ? (
										<ItemManager
											selectedItem={generation_id}
											setSelectedItem={setGeneration_id}
											getAllFunc={getAllGenerations}
											updateFunc={updateGeneration}
											deleteFunc={deleteGeneration}
											createFunc={createGeneration}
											selectTitle='Покоління'
											modalTitle='Усі покоління'
											placeholder='Нове покоління'
										/>
									) : null}
								</>
							) : (
								<>
									{status !== Statuses.NEWCOMER ? (
										<TextField
											id='parent'
											value={
												person && person.parent
													? `${getFullName(person.parent)} (${getStatusUkr(
															person.parent.status
													  )})`
													: VALUE_NOT_SET
											}
											label='Патрон'
										/>
									) : null}
									{status === Statuses.BRATCHYK ? (
										<TextField
											id='role'
											value={person ? getRoleUkr(person.role) : VALUE_NOT_SET}
											label='Посада'
										/>
									) : null}
									{status === Statuses.POSHANOVANYI ||
									status === Statuses.EX_BRATCHYK ? (
										<TextField
											value={getDeepFieldValue('generation', 'name')}
											label='Покоління'
											id='generation'
										/>
									) : null}
								</>
							)}
							{status === Statuses.NEWCOMER || status === Statuses.MALIUK ? (
								<Input
									id='dateFillForm'
									type='date'
									onChange={changeHandler(setDate_fill_form, resetError)}
									value={
										userRole === UserRole.HR
											? date_fill_form
											: getDateFieldValue('date_fill_form')
									}
									label='Дата заповнення форми для приєднання'
									disabled={userRole !== UserRole.HR}
									inputStyle={{ background: 'white' }}
								/>
							) : null}
							{status === Statuses.BRATCHYK ? (
								<Input
									id='dateVysviata'
									type='date'
									onChange={changeHandler(setDate_vysviata, resetError)}
									value={
										userRole === UserRole.HR
											? date_vysviata
											: getDateFieldValue('date_vysviata')
									}
									label='Дата висвяти'
									disabled={userRole !== UserRole.HR}
									inputStyle={{ background: 'white' }}
								/>
							) : null}
							{status === Statuses.POSHANOVANYI ? (
								<Input
									id='datePoshanuvannia'
									type='date'
									onChange={changeHandler(setDate_poshanuvannia, resetError)}
									value={
										userRole === UserRole.HR
											? date_poshanuvannia
											: getDateFieldValue('date_poshanuvannia')
									}
									label='Дата пошанування'
									disabled={userRole !== UserRole.HR}
									inputStyle={{ background: 'white' }}
								/>
							) : null}
							{status === Statuses.EX_BRATCHYK ? (
								<Input
									id='dateExclusion'
									type='date'
									onChange={changeHandler(setDate_exclusion, resetError)}
									value={
										userRole === UserRole.HR
											? date_exclusion
											: getDateFieldValue('date_exclusion')
									}
									label='Дата виключення'
									disabled={userRole !== UserRole.HR}
									inputStyle={{ background: 'white' }}
								/>
							) : null}
						</div>
					</Col>
				</Row>
			</div>
			<div>
				<ErrorMessageBig
					message={typeof errorMessage === 'string' ? errorMessage : ''}
				/>
			</div>
			{userRole === UserRole.HR ? (
				<>
					{/*<div>*/}
					{/*	<Button*/}
					{/*		variant='primary'*/}
					{/*		onClick={updatePerson}*/}
					{/*		id='updatePerson'*/}
					{/*		className='m-2'*/}
					{/*	>*/}
					{/*		{'Оновити'}*/}
					{/*	</Button>*/}
					{/*	{isHR === 0 && status !== Statuses.NEWCOMER ? (*/}
					{/*		<Button*/}
					{/*			variant='info'*/}
					{/*			onClick={makePersonToBeHR}*/}
					{/*			id='addUser'*/}
					{/*			className='m-2'*/}
					{/*		>*/}
					{/*			{'Зробити HR-ом'}*/}
					{/*		</Button>*/}
					{/*	) : null}*/}
					{/*	{isHR === 1 ? (*/}
					{/*		<Button*/}
					{/*			variant='info'*/}
					{/*			onClick={deletePersonFromHRs}*/}
					{/*			id='deleteUser'*/}
					{/*			className='m-2'*/}
					{/*		>*/}
					{/*			{'Видалити з HR-ів'}*/}
					{/*		</Button>*/}
					{/*	) : null}*/}
					{/*	<Button*/}
					{/*		variant='danger'*/}
					{/*		onClick={() => setShowConfirmDeleteModal(!showConfirmDeleteModal)}*/}
					{/*		id='deletePerson'*/}
					{/*		className='m-2'*/}
					{/*	>*/}
					{/*		{'Видалити'}*/}
					{/*	</Button>*/}
					{/*</div>*/}
					{/*<div>*/}
					{/*	{status === Statuses.NEWCOMER ? (*/}
					{/*		<Button*/}
					{/*			variant='primary'*/}
					{/*			onClick={() =>*/}
					{/*				setShowConfirmUpdateStatusToMaliukModal(*/}
					{/*					!showConfirmUpdateStatusToMaliukModal*/}
					{/*				)*/}
					{/*			}*/}
					{/*			id='updateStatus'*/}
					{/*			className='m-2'*/}
					{/*		>*/}
					{/*			{'Новенький -> Малюк'}*/}
					{/*		</Button>*/}
					{/*	) : null}*/}
					{/*	{status === Statuses.MALIUK ? (*/}
					{/*		<Button*/}
					{/*			variant='primary'*/}
					{/*			onClick={() =>*/}
					{/*				setShowConfirmUpdateStatusToBratchykModal(*/}
					{/*					!showConfirmUpdateStatusToBratchykModal*/}
					{/*				)*/}
					{/*			}*/}
					{/*			id='updateStatus'*/}
					{/*			className='m-2'*/}
					{/*		>*/}
					{/*			{'Малюк -> Братчик'}*/}
					{/*		</Button>*/}
					{/*	) : null}*/}
					{/*	{status === Statuses.BRATCHYK ? (*/}
					{/*		<Button*/}
					{/*			variant='primary'*/}
					{/*			onClick={() =>*/}
					{/*				setShowConfirmUpdateStatusToPoshanovanyiModal(*/}
					{/*					!showConfirmUpdateStatusToPoshanovanyiModal*/}
					{/*				)*/}
					{/*			}*/}
					{/*			id='updateStatus'*/}
					{/*			className='m-2'*/}
					{/*		>*/}
					{/*			{'Братчик -> Пошанований'}*/}
					{/*		</Button>*/}
					{/*	) : null}*/}
					{/*	{status === Statuses.BRATCHYK ? (*/}
					{/*		<Button*/}
					{/*			variant='primary'*/}
					{/*			onClick={() =>*/}
					{/*				setShowConfirmUpdateStatusToExBratchykModal(*/}
					{/*					!showConfirmUpdateStatusToExBratchykModal*/}
					{/*				)*/}
					{/*			}*/}
					{/*			id='updateStatus'*/}
					{/*			className='m-2'*/}
					{/*		>*/}
					{/*			{'Братчик -> Виключений братчик'}*/}
					{/*		</Button>*/}
					{/*	) : null}*/}
					{/*</div>*/}

					<ConfirmationModal
						question={
							'Ви впевнені, що хочете видалити всю інформацію про людину ' +
							(person ? getFullName(person) : '') +
							'?'
						}
						setShow={setShowConfirmDeleteModal}
						show={showConfirmDeleteModal}
						action={deletePerson}
					/>
					<ConfirmationModal
						question={
							'Ви впевнені, що хочете змінити статус людини ' +
							(person ? getFullName(person) + ' ' : '') +
							'на Малюк?'
						}
						setShow={setShowConfirmUpdateStatusToMaliukModal}
						show={showConfirmUpdateStatusToMaliukModal}
						action={updateStatusToMaliuk}
					/>
					<ConfirmationModal
						question={
							'Ви впевнені, що хочете змінити статус людини ' +
							(person ? getFullName(person) + ' ' : '') +
							'на Братчик?'
						}
						setShow={setShowConfirmUpdateStatusToBratchykModal}
						show={showConfirmUpdateStatusToBratchykModal}
						action={updateStatusToBratchyk}
					/>
					<ConfirmationModal
						question={
							'Ви впевнені, що хочете змінити статус людини ' +
							(person ? getFullName(person) + ' ' : '') +
							'на Пошанований?'
						}
						setShow={setShowConfirmUpdateStatusToPoshanovanyiModal}
						show={showConfirmUpdateStatusToPoshanovanyiModal}
						action={updateStatusToPoshanovanyi}
					/>
					<ConfirmationModal
						question={
							'Ви впевнені, що хочете змінити статус людини ' +
							(person ? getFullName(person) + ' ' : '') +
							'на Виключений братчик?'
						}
						setShow={setShowConfirmUpdateStatusToExBratchykModal}
						show={showConfirmUpdateStatusToExBratchykModal}
						action={updateStatusToExBratchyk}
					/>
				</>
			) : null}

			{/*<UserActivities personId={Number(memberId)} />*/}
		</>
	);
};
