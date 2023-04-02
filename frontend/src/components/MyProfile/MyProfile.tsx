/*eslint-disable react-hooks/exhaustive-deps*/
import React, { FC, useEffect, useState } from 'react';
import {
	getFullName,
	getPerson,
	getStatusStyle,
	getStatusUkr,
	Person,
	roles,
	Statuses,
} from '../../api/person';
import { useSelector } from 'react-redux';
import { getCurrentUserPersonId } from '../../store/selectors';
import { TextField } from '../../common/TextField/TextField';
import { Col, Row } from 'react-bootstrap';
import { UserActivities } from '../UserActivities/UserActivities';
import { DEFAULT_AVATAR_URL, VALUE_NOT_SET } from '../../utils/constants';

export const MyProfile: FC = () => {
	const personId = useSelector<number>(getCurrentUserPersonId);
	const [person, setPerson] = useState<Person | null>(null);

	useEffect(() => {
		fetchPerson();
	}, []);

	const fetchPerson = async () => {
		if (personId && typeof personId === 'number') {
			const p = await getPerson(personId);
			console.log(p);
			setPerson(p);
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

	return (
		<>
			<div className='w-100'>
				<h3 className='text-center'>Мій профіль</h3>
				<Row xs={1} sm={1} md={2} lg={2} className='m-2'>
					<Col>
						<div className='m-2 justify-content-center d-flex'>
							{person && person.status !== Statuses.NEWCOMER ? (
								<img
									src={person.avatar ? person.avatar : DEFAULT_AVATAR_URL}
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
							style={person ? getStatusStyle(person.status) : getStatusStyle()}
							className='rounded mt-2 p-1 text-center ms-5 me-5'
						>
							{person ? getStatusUkr(person.status) : getStatusUkr()}
						</h5>
					</Col>
					<Col className='d-flex'>
						<div className='border-secondary border border-1 p-2 rounded m-2 flex-fill'>
							<h6 className='text-center'>Загальні дані</h6>
							<TextField
								value={person ? getFullName(person) : VALUE_NOT_SET}
								label='ПІБ'
								id='pib'
							/>
							{person && person.status !== Statuses.NEWCOMER ? (
								<TextField
									value={getDateFieldValue('date_birth')}
									label='Дата народження'
									id='dateBirth'
								/>
							) : null}
						</div>
					</Col>
				</Row>
				<Row xs={1} sm={1} md={2} lg={3} className='m-2'>
					<Col className='d-flex'>
						<div className='border-secondary border border-1 p-2 rounded m-2 flex-fill'>
							<h6 className='text-center'>Навчання в КМА</h6>
							<TextField
								value={getDeepFieldValue('faculty', 'name')}
								label='Факультет'
								id='faculty'
							/>
							<TextField
								value={getDeepFieldValue('specialty', 'name')}
								label='Спеціальність'
								id='specialty'
							/>
							{person &&
							person.status !== Statuses.POSHANOVANYI &&
							person.status !== Statuses.EX_BRATCHYK ? (
								<TextField
									value={getFieldValue('year_enter')}
									label='Рік вступу в КМА'
									id='year_enter'
								/>
							) : null}
						</div>
					</Col>
					<Col className='d-flex'>
						<div className='border-secondary border border-1 p-2 rounded m-2 flex-fill'>
							<h6 className='text-center'>Контакти</h6>
							<TextField
								value={getFieldValue('email')}
								label='Email'
								id='email'
							/>
							<TextField
								value={getFieldValue('telephone')}
								label='Телефон'
								id='telephone'
							/>
							<TextField
								value={getFieldValue('telegram')}
								label='Телеграм'
								id='telegram'
							/>
							<TextField
								value={getFieldValue('facebook')}
								label='Фейсбук'
								id='facebook'
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
									value={getFieldValue('about')}
									disabled={true}
									style={{ background: 'white' }}
								/>
							</div>
							{person && person.status !== Statuses.NEWCOMER ? (
								<TextField
									value={
										person && person.parent
											? `${getFullName(person.parent)} (${getStatusUkr(
													person.parent.status
											  )})`
											: VALUE_NOT_SET
									}
									label='Патрон'
									id='parent'
								/>
							) : null}
							{person && person.status === Statuses.BRATCHYK ? (
								<TextField
									value={
										person && person.role
											? // @ts-ignore
											  roles.find((r) => r.name === person.role).ukr
											: VALUE_NOT_SET
									}
									label='Посада'
									id='role'
								/>
							) : null}
							{person &&
							(person.status === Statuses.POSHANOVANYI ||
								person.status === Statuses.EX_BRATCHYK) ? (
								<TextField
									value={getDeepFieldValue('generation', 'name')}
									label='Покоління'
									id='generation'
								/>
							) : null}

							{person &&
							(person.status === Statuses.NEWCOMER ||
								person.status === Statuses.MALIUK) ? (
								<TextField
									value={getDateFieldValue('date_fill_form')}
									label='Дата заповнення форми для приєднання'
									id='date_fill_form'
								/>
							) : null}
							{person && person.status === Statuses.BRATCHYK ? (
								<TextField
									value={getDateFieldValue('date_vysviata')}
									label='Дата висвяти'
									id='date_vysviata'
								/>
							) : null}
							{person && person.status === Statuses.POSHANOVANYI ? (
								<TextField
									value={getDateFieldValue('date_poshanuvannia')}
									label='Дата пошанування'
									id='date_poshanuvannia'
								/>
							) : null}
							{person && person.status === Statuses.EX_BRATCHYK ? (
								<TextField
									value={getDateFieldValue('date_exclusion')}
									label='Дата виключення'
									id='date_exclusion'
								/>
							) : null}
						</div>
					</Col>
				</Row>
			</div>
			<UserActivities
				personId={personId && typeof personId === 'number' ? personId : -1}
			/>
		</>
	);
};
