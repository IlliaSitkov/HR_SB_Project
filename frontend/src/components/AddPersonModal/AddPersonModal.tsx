import React, { useEffect, useState } from 'react';
import { Button, Col, Modal, Row } from 'react-bootstrap';
import { Input } from '../../common/Input/Input';
import { changeHandler } from '../../shared';
import { ErrorMessage } from '../../common/ErrorMessage/ErrorMessage';
import {
	getStatusStyle,
	getStatusUkr,
	Person,
	roles,
	Statuses,
	statusesArray,
} from '../../api/person';
import { useDispatch, useSelector } from 'react-redux';
import { DEFAULT_AVATAR_URL } from '../../utils/constants';
import { errorMessageSet } from '../../store/errorMessage/actionCreators';
import { EditAvatarUrlModal } from '../PersonProfile/components/EditAvatarUrlModal';
import {
	FacultySelect,
	GenerationSelect,
	ParentSelect,
	RoleSelect,
	SpecialtySelect,
	StatusSelect,
	YearSelect,
} from '../common';
import { statusToNecessaryFields } from './fields';
import { errorToString } from '../../utils/errorHandling';
import { saveNewPerson } from '../../store/people/thunk';
import { getErrorMessage } from '../../store/selectors';

const AddPersonModal: React.FC<{
	isShown: boolean;
	onHide: { (): void };
}> = ({ isShown, onHide }) => {
	const dispatch = useDispatch();
	const errorMessage = useSelector<string>(getErrorMessage);

	const [surname, setSurname] = useState<string>('');
	const [name, setName] = useState<string>('');
	const [parental, setParental] = useState<string>('');
	const [date_birth, setDate_birth] = useState<string>('');
	const [avatar, setAvatar] = useState<string>('');

	const [facultyId, setFacultyId] = useState<number>(-1);
	const [specialtyId, setSpecialtyId] = useState<number>(-1);
	const [yearEnter, setYearEnter] = useState<number>(-1);

	const [email, setEmail] = useState<string>('');
	const [telephone, setTelephone] = useState<string>('');
	const [telegram, setTelegram] = useState<string>('');
	const [facebook, setFacebook] = useState<string>('');

	const [status, setStatus] = useState<Statuses>(Statuses.NEWCOMER);
	const [statusId, setStatusId] = useState<number>(1);
	const [roleId, setRoleId] = useState<number>(-1);
	const [parentId, setParentId] = useState<number>(-1);
	const [generationId, setGenerationId] = useState<number>(-1);
	const [about, setAbout] = useState<string>('');

	const [date_fill_form, setDate_fill_form] = useState<string>('');
	const [date_vysviata, setDate_vysviata] = useState<string>('');
	const [date_poshanuvannia, setDate_poshanuvannia] = useState<string>('');
	const [date_exclusion, setDate_exclusion] = useState<string>('');

	const [showModal, setShowModal] = useState<boolean>(false);

	const resetError = () => dispatch(errorMessageSet(''));
	const resetFields = () => {
		setSurname('');
		setName('');
		setParental('');
		setDate_birth('');
		setAvatar('');
		setFacultyId(-1);
		setSpecialtyId(-1);
		setYearEnter(-1);
		setEmail('');
		setTelephone('');
		setTelegram('');
		setFacebook('');
		setStatus(Statuses.NEWCOMER);
		setStatusId(1);
		setRoleId(-1);
		setParentId(1);
		setGenerationId(1);
		setAbout('');
		setDate_fill_form('');
		setDate_vysviata('');
		setDate_poshanuvannia('');
		setDate_exclusion('');
	};

	useEffect(() => {
		/* eslint-disable eqeqeq*/
		const newStatus = statusesArray.find((value) => value.id == statusId);
		setStatus(
			newStatus === undefined ? Statuses.NEWCOMER : (newStatus.val as Statuses)
		);
	}, [statusId]);

	const createP = async () => {
		try {
			resetError();
			if (name === '') {
				dispatch(errorMessageSet("Ім'я не має бути пустим"));
				return;
			}
			if (surname === '') {
				dispatch(errorMessageSet('Прізвище не має бути пустим'));
				return;
			}
			if (statusId === -1) {
				dispatch(errorMessageSet('Статус не має бути пустим'));
				return;
			}
			let p: Person = { name, surname, status };
			if (parental !== '') {
				p.parental = parental;
			} else if (isRequired('avatar')) {
				dispatch(errorMessageSet("Ім'я по-батькові не має бути пустим"));
				return;
			}
			if (avatar !== '') {
				p.avatar = avatar;
			} else if (isRequired('avatar')) {
				dispatch(errorMessageSet('Аватар не має бути пустим'));
				return;
			}
			if (date_birth !== '') {
				p.date_birth = new Date(date_birth);
			} else if (isRequired('dateBirth')) {
				dispatch(errorMessageSet('Аватар не має бути пустим'));
				return;
			}
			if (facultyId !== -1) {
				p.faculty_id = facultyId;
			} else if (isRequired('faculty')) {
				dispatch(errorMessageSet('Факультет не має бути пустим'));
				return;
			}
			if (specialtyId !== -1) {
				p.specialty_id = specialtyId;
			} else if (isRequired('specialty')) {
				dispatch(errorMessageSet('Факультет не має бути пустим'));
				return;
			}
			if (yearEnter !== -1) {
				p.year_enter = yearEnter;
			} else if (isRequired('yearEnter')) {
				dispatch(errorMessageSet('Рік вступу не має бути пустим'));
				return;
			}
			if (email !== '' && /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
				p.email = email;
			} else if (isRequired('email')) {
				dispatch(
					errorMessageSet(
						'Електронна пошта має бути непустою та у валідному форматі'
					)
				);
				return;
			}
			if (telegram !== '') {
				p.telegram = telegram;
			} else if (isRequired('telegram')) {
				dispatch(errorMessageSet('Телеграм не має бути пустим'));
				return;
			}
			if (facebook !== '') {
				p.facebook = facebook;
			} else if (isRequired('facebook')) {
				dispatch(errorMessageSet('Facebook не має бути пустим'));
				return;
			}
			if (telephone !== '') {
				p.telephone = telephone;
			} else if (isRequired('telephone')) {
				dispatch(errorMessageSet('Електронна пошта не має бути пустим'));
				return;
			}
			/* eslint-disable eqeqeq*/
			const role = roles.find((r) => r.id == roleId);
			console.log(role);
			if (roleId !== -1 && role !== undefined) {
				p.role = role?.name as string;
			} else if (isRequired('role')) {
				dispatch(errorMessageSet('Посада не має бути пустою'));
				return;
			}
			if (parentId !== -1) {
				p.parent_id = parentId;
			} else if (isRequired('parent')) {
				dispatch(errorMessageSet('Патрон не має бути пустим'));
				return;
			}
			if (generationId !== -1) {
				p.generation_id = generationId;
			} else if (isRequired('generationId')) {
				dispatch(errorMessageSet('Покоління не має бути пустим'));
				return;
			}
			if (about !== '') {
				p.about = about;
			} else if (isRequired('about')) {
				dispatch(errorMessageSet('Опис не має бути пустим'));
				return;
			}
			if (date_fill_form !== '') {
				p.date_fill_form = new Date(date_fill_form);
			} else if (isRequired('dateFillForm')) {
				dispatch(errorMessageSet('Дата заповнення форми не має бути пустою'));
				return;
			}
			if (date_vysviata !== '') {
				p.date_vysviata = new Date(date_vysviata);
			} else if (isRequired('dateVysviata')) {
				dispatch(errorMessageSet('Дата висвяти не має бути пустою'));
				return;
			}
			if (date_poshanuvannia !== '') {
				p.date_poshanuvannia = new Date(date_poshanuvannia);
			} else if (isRequired('datePoshanuvannia')) {
				dispatch(errorMessageSet('Дата пошанування не має бути пустою'));
				return;
			}
			if (date_exclusion !== '') {
				p.date_exclusion = new Date(date_exclusion);
			} else if (isRequired('dateExclusion')) {
				dispatch(errorMessageSet('Дата виключення не має бути пустою'));
				return;
			}
			dispatch(
				saveNewPerson(p, (p1) => {
					onHide();
					resetFields();
				}) as any
			);
		} catch (e) {
			dispatch(errorMessageSet(errorToString(e)));
		}
	};

	const isRequired = (field: string): boolean => {
		if (!statusToNecessaryFields.has(status)) return false;
		return statusToNecessaryFields.get(status)?.includes(field) as boolean;
	};

	return (
		<Modal className='modal-xl' show={isShown} onHide={onHide}>
			<Modal.Header closeButton={true}>
				<Modal.Title>Додати людину</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<div className='w-100'>
					<Row xs={1} sm={1} md={1} lg={2} className='m-2'>
						<Col>
							<div className='m-2 justify-content-center d-flex'>
								{status !== Statuses.NEWCOMER && (
									<img
										src={avatar ? avatar : DEFAULT_AVATAR_URL}
										className='rounded'
										style={{
											maxWidth: '350px',
											maxHeight: '350px',
											cursor: 'pointer',
										}}
										alt='Аватар'
										onClick={() => setShowModal(!showModal)}
									/>
								)}
							</div>
							<EditAvatarUrlModal
								title={'Посилання на аватар'}
								setShow={setShowModal}
								show={showModal}
								avatarUrl={avatar}
								setAvatarUrl={setAvatar}
							/>
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
									placeholder={'Введіть прізвище...'}
									type='text'
									onChange={changeHandler(setSurname, resetError)}
									value={surname}
									label='Прізвище'
									required={isRequired('surname')}
								/>
								<Input
									id='name'
									placeholder={'Введіть ім`я...'}
									type='text'
									onChange={changeHandler(setName, resetError)}
									value={name}
									label='Ім`я'
									required={isRequired('name')}
								/>
								<Input
									id='parental'
									placeholder={'Введіть по батькові...'}
									type='text'
									onChange={changeHandler(setParental, resetError)}
									value={parental}
									label='По батькові'
									required={isRequired('parental')}
								/>
								{status !== Statuses.NEWCOMER && (
									<Input
										id='dateBirth'
										type='date'
										onChange={changeHandler(setDate_birth, resetError)}
										value={date_birth}
										label='Дата народження'
										required={isRequired('dateBirth')}
									/>
								)}
							</div>
						</Col>
					</Row>

					<Row xs={1} sm={1} md={1} lg={2} xl={3} className='m-2'>
						<Col className='d-flex'>
							<div className='border-secondary border border-1 p-2 rounded m-2 flex-fill'>
								<h6 className='text-center'>Навчання в КМА</h6>
								<FacultySelect
									setFacultyId={setFacultyId}
									facultyId={facultyId}
									isRequired={isRequired('faculty')}
								/>
								<SpecialtySelect
									setSpecialtyId={setSpecialtyId}
									specialtyId={specialtyId}
									isRequired={isRequired('specialty')}
								/>
								{[Statuses.POSHANOVANYI, Statuses.EX_BRATCHYK] && (
									<YearSelect
										setYearEnter={setYearEnter}
										yearEnter={yearEnter}
										isRequired={isRequired('yearEnter')}
									/>
								)}
							</div>
						</Col>
						<Col className='d-flex'>
							<div className='border-secondary border border-1 p-2 rounded m-2 flex-fill'>
								<h6 className='text-center'>Контакти</h6>
								<Input
									id='email'
									placeholder={'Введіть email...'}
									type='text'
									onChange={changeHandler(setEmail, resetError)}
									value={email}
									label='Email'
									required={isRequired('email')}
								/>
								<Input
									id='telephone'
									placeholder={'Введіть телефон...'}
									type='text'
									onChange={changeHandler(setTelephone, resetError)}
									value={telephone}
									label='Телефон'
									required={isRequired('telephone')}
								/>
								<Input
									id='telegram'
									placeholder={'Введіть телеграм...'}
									type='text'
									onChange={changeHandler(setTelegram, resetError)}
									value={telegram}
									label='Телеграм'
									required={isRequired('telegram')}
								/>
								<Input
									id='facebook'
									placeholder={'Введіть фейсбук...'}
									type='text'
									onChange={changeHandler(setFacebook, resetError)}
									value={facebook}
									label='Фейсбук'
									required={isRequired('facebook')}
								/>
							</div>
						</Col>
						<Col className='d-flex'>
							<div className='border-secondary border border-1 p-2 rounded m-2 flex-fill'>
								<h6 className='text-center'>Дані в СБ</h6>
								<StatusSelect
									setStatusId={setStatusId}
									statusId={statusId}
									isRequired={true}
								/>
								<Input
									id='about'
									placeholder={'Введіть опис...'}
									type='text'
									onChange={changeHandler(setAbout, resetError)}
									value={about}
									label='Опис'
									required={isRequired('about')}
								/>
								{status !== Statuses.NEWCOMER && (
									<ParentSelect
										setParentId={setParentId}
										parentId={parentId}
										isRequired={isRequired('parent')}
									/>
								)}
								{status === Statuses.BRATCHYK && (
									<RoleSelect
										setRoleId={setRoleId}
										roleId={roleId}
										isRequired={isRequired('role')}
									/>
								)}
								{[Statuses.POSHANOVANYI, Statuses.EX_BRATCHYK].includes(
									status
								) && (
									<GenerationSelect
										generationId={generationId}
										setGenerationId={setGenerationId}
										isRequired={isRequired('generation')}
									/>
								)}

								{[Statuses.NEWCOMER, Statuses.MALIUK].includes(status) && (
									<Input
										id='dateFillForm'
										type='date'
										onChange={changeHandler(setDate_fill_form, resetError)}
										value={date_fill_form}
										label='Дата заповнення форми для приєднання'
										required={isRequired('dateFillForm')}
									/>
								)}
								{status === Statuses.BRATCHYK && (
									<Input
										id='dateVysviata'
										type='date'
										onChange={changeHandler(setDate_vysviata, resetError)}
										value={date_vysviata}
										label='Дата висвяти'
										required={isRequired('dateVysviata')}
									/>
								)}
								{status === Statuses.POSHANOVANYI ? (
									<Input
										id='datePoshanuvannia'
										type='date'
										onChange={changeHandler(setDate_poshanuvannia, resetError)}
										value={date_poshanuvannia}
										label='Дата пошанування'
										required={isRequired('datePoshanuvannia')}
									/>
								) : null}
								{status === Statuses.EX_BRATCHYK && (
									<Input
										id='dateExclusion'
										type='date'
										onChange={changeHandler(setDate_exclusion, resetError)}
										value={date_exclusion}
										label='Дата виключення'
										required={isRequired('dateExclusion')}
									/>
								)}
							</div>
						</Col>
					</Row>
				</div>
				<ErrorMessage
					message={typeof errorMessage === 'string' ? errorMessage : ''}
				/>
			</Modal.Body>
			<Modal.Footer>
				<Button onClick={onHide} className='btn-danger'>
					Скасувати
				</Button>
				<Button onClick={createP}>Створити</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default AddPersonModal;