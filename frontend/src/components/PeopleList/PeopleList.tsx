/* eslint-disable react-hooks/exhaustive-deps*/
import { FC, useEffect, useState } from 'react';
import {
	getAllPeople,
	getFullName,
	Person,
	statusesForDropdown,
} from '../../api/person';
import { useDispatch, useSelector } from 'react-redux';
import { peopleGet } from '../../store/people/actionCreators';
import { SearchBar } from '../../common/SearchBar/SearchBar';
import { PersonItem } from './components/PersonItem/PersonItem';
import { Button, Col, Row } from 'react-bootstrap';
import { Generation, undefinedGeneration } from '../../api/generation';
import { DropdownWithCheckboxes } from '../../common/DropdownWithCheckboxes/DropdownWithCheckboxes';
import { getAllGenerations } from '../../api/generation/generation.service';
import { VALUE_NOT_SET } from '../../utils/constants';
import { getGotData } from '../../store/selectors';
import { gotDataSet } from '../../store/gotData/actionCreators';
import AddPersonModal from '../AddPersonModal/AddPersonModal';
import { Circles } from 'react-loader-spinner';
import { GotDataStatus } from '../../store/gotDataEnum';

export const getValuesOfChosenCheckboxes = (name: string) => {
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
	const [isPersonAddShown, setIsPersonAddShown] = useState<boolean>(false);

	const suitsSearch = (person: Person) => {
		let sT = searchText.trim();
		if (sT === '') return true;
		sT = sT.toLowerCase();
		return (
			getFullName(person).toLowerCase().includes(sT) ||
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

		if (
			gotData === GotDataStatus.NOT_YET_LOADED ||
			gotData === GotDataStatus.ERROR_WHILE_LOADING
		) {
			dispatch(gotDataSet(GotDataStatus.STARTED_LOADING));
			fetchData();
		} else if (gotData === GotDataStatus.LOADED_SUCCESSFULLY) {
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
		setIsPersonAddShown(true);
		// navigate('/members/add', { replace: true });
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

	return (
		<>
			<AddPersonModal
				isShown={isPersonAddShown}
				onHide={() => setIsPersonAddShown(false)}
			/>
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
			{gotData !== GotDataStatus.LOADED_SUCCESSFULLY ? (
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
				<Row
					xs={1}
					sm={2}
					md={4}
					lg={5}
					className='m-2 mb-5 justify-content-center'
				>
					{people.map((person: Person) => (
						<Col
							className='d-flex'
							style={{ minWidth: '280px', maxWidth: '330px' }}
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
