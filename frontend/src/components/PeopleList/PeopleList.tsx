import { FC, useEffect, useState } from 'react';
import {
	getAllPeople,
	getFullName,
	Person,
	statusesForDropdown,
} from '../../api/person';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
import { peopleGet } from '../../store/people/actionCreators';
import { SearchBar } from '../../common/SearchBar/SearchBar';
import { PersonItem } from './components/PersonItem/PersonItem';
import { Button, Col, Row } from 'react-bootstrap';
import { Generation, undefinedGeneration } from '../../api/generation';
import { DropdownWithCheckboxes } from '../../common/DropdownWithCheckboxes/DropdownWithCheckboxes';
import { getAllGenerations } from '../../api/generation/generation.service';
import { VALUE_NOT_SET } from '../../utils/constants';
import { UserRole } from '../../api/common/types';
import { getGotData, getUserRole } from '../../store/selectors';
import { gotDataSet } from '../../store/gotData/actionCreators';
import { Audio } from 'react-loader-spinner';

const getValuesOfChosenCheckboxes = (name: string) => {
	const checkboxes: NodeListOf<any> = document.getElementsByName(name);
	const res = [];
	for (let i = 0; i < checkboxes.length; i += 1) {
		if (checkboxes[i].checked) {
			res.push(checkboxes[i].getAttribute('value'));
		}
	}
	return res;
};

export const PeopleList: FC = () => {
	const userRole = useSelector<UserRole>(getUserRole);
	const gotData = useSelector<number>(getGotData);

	const [searchText, setSearchText] = useState('');
	const [filterStatuses, setFilterStatuses] = useState<Array<string>>([]);
	const [filterYears, setFilterYears] = useState<Array<string>>([]);
	const [filterHasParent, setFilterHasParent] = useState<Array<string>>([]);
	const [filterGenerations, setFilterGenerations] = useState<Array<Generation>>(
		[]
	);

	const [possibleYears, setPossibleYears] = useState<Array<string>>([]);
	const [possibleGenerations, setPossibleGenerations] = useState<
		Array<Generation>
	>([]);

	const suitsSearch = (person: Person) => {
		let sT = searchText.trim();
		if (sT === '') return true;
		sT = sT.toLowerCase();
		return (
			getFullName(person).toLowerCase().includes(sT) ||
			person.email?.toLowerCase().includes(sT) ||
			person.telegram?.toLowerCase().includes(sT)
		);
	};

	const suitsFilter = (person: Person) => {
		let suitable = true;

		if (filterStatuses.length === 0 || filterStatuses.length === 5)
			suitable = true;
		else if (!filterStatuses.includes(person.status)) return false;

		if (filterYears.length === 0 || filterYears.length === possibleYears.length)
			suitable = true;
		else if (!person.year_enter && filterYears.includes(VALUE_NOT_SET))
			suitable = true;
		else if (
			!person.year_enter ||
			!filterYears.includes(person.year_enter.toString())
		)
			return false;

		if (filterHasParent.length === 0 || filterHasParent.length === 2)
			suitable = true;
		else if (filterHasParent.includes('Немає') && person.parent_id)
			return false;
		else if (filterHasParent.includes('Є') && !person.parent_id) return false;

		if (
			filterGenerations.length === 0 ||
			filterGenerations.length === possibleGenerations.length
		)
			suitable = true;
		else if (
			!person.generation_id &&
			filterGenerations.includes(undefinedGeneration)
		)
			suitable = true;
		else if (
			!person.generation_id ||
			!filterGenerations.find((g) => g.id === person.generation_id)
		)
			return false;

		return suitable;
	};

	const people = useSelector((state: any) =>
		state.people.filter(
			(person: Person) => suitsSearch(person) && suitsFilter(person)
		)
	);

	const navigate = useNavigate();
	const dispatch = useDispatch();

	useEffect(() => {
		//console.log(gotData + ' P in useEffect: ');
		//console.log(people);
		async function fetchData() {
			//console.log('fetch');
			const peopleRes = await getAllPeople();
			if (peopleRes) {
				dispatch(gotDataSet(3));
				dispatch(peopleGet(peopleRes));

				fillYears(peopleRes);
			} else {
				alert('Помилка при завантаженні людей!');
				dispatch(gotDataSet(2));
			}
		}
		if (gotData === 0 || gotData === 2) {
			dispatch(gotDataSet(1));
			fetchData();
		} else if (gotData === 3) {
			fillYears(people);
		}
		fetchGenerations();
	}, []);

	const fetchGenerations = async () => {
		const generationsCopy = [undefinedGeneration];
		let generations = await getAllGenerations();
		generations = generationsCopy.concat(generations);
		setPossibleGenerations(generations);
	};

	const fillYears = (people: Array<Person>) => {
		const yearsCopy: Array<string> = [];
		yearsCopy.push(VALUE_NOT_SET);
		people.forEach((person: Person) => {
			if (
				person.year_enter &&
				!yearsCopy.includes(person.year_enter.toString())
			) {
				yearsCopy.push(person.year_enter.toString());
			}
		});
		setPossibleYears(yearsCopy);
	};

	const addPerson = () => {
		//OR open popup
		navigate('/members/add', { replace: true });
	};

	const updateFilters = (param: string) => {
		let vals = getValuesOfChosenCheckboxes(param);
		if (vals.length !== 0) {
			if (param === 'status') {
				const newStatuses: Array<string> = [];
				vals.forEach((val) => {
					const st = statusesForDropdown.find((s) => s.ukrMany === val);
					if (st) newStatuses.push(st.name);
				});
				setFilterStatuses(newStatuses);
			} else if (param === 'year') setFilterYears(vals);
			else if (param === 'hasParent') setFilterHasParent(vals);
			else if (param === 'generation') {
				const newGenerations: Array<Generation> = [];
				vals.forEach((val) => {
					const gen = possibleGenerations.find((g) => g.name === val);
					if (gen) newGenerations.push(gen);
				});
				setFilterGenerations(newGenerations);
			}
		} else {
			setFilterStatuses([]);
			setFilterYears([]);
			setFilterHasParent([]);
			setFilterGenerations([]);
		}
	};

	return userRole !== UserRole.HR ? (
		<Navigate to='/' />
	) : (
		<>
			<h2 className='text-center'>Люди СБ</h2>
			<Button
				variant='primary'
				onClick={addPerson}
				id='addPerson'
				className='ms-4 m-2 align-self-start'
			>
				Додати людину
			</Button>
			<SearchBar
				searchText={searchText}
				setSearchText={setSearchText}
				placeholder='Пошук людини...'
			/>
			<Row>
				<Col>
					<DropdownWithCheckboxes
						id='dropdownMenuStatus'
						name='status'
						labelText='Статуси'
						items={statusesForDropdown.map((s) => s.ukrMany)}
						updateFilters={updateFilters}
					/>
				</Col>
				<Col>
					<DropdownWithCheckboxes
						id='dropdownMenuYear'
						name='year'
						labelText='Роки вступу в КМА'
						items={possibleYears}
						updateFilters={updateFilters}
					/>
				</Col>
				<Col>
					<DropdownWithCheckboxes
						id='dropdownMenuHasParent'
						name='hasParent'
						labelText='Наявність патрона'
						items={['Є', 'Немає']}
						updateFilters={updateFilters}
					/>
				</Col>
				<Col>
					<DropdownWithCheckboxes
						id='dropdownMenuGeneration'
						name='generation'
						labelText='Покоління'
						items={possibleGenerations.map((g) => g.name)}
						updateFilters={updateFilters}
					/>
				</Col>
			</Row>
			{gotData !== 3 ? (
				<Audio
					height='150'
					width='150'
					//@ts-ignore
					radius='9'
					color='blue'
					ariaLabel='loading'
					//@ts-ignore
					wrapperStyle
					//@ts-ignore
					wrapperClass
					className='mt-5'
				/>
			) : (
				<Row xs={1} sm={2} md={4} lg={5} className='m-2'>
					{people.map((person: Person) => (
						<Col
							className='d-flex'
							style={{ minWidth: '280px' }}
							key={person.id}
						>
							<PersonItem person={person} />
						</Col>
					))}
				</Row>
			)}
		</>
	);
};
