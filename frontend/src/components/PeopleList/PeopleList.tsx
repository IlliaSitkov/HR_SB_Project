import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
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

const getValuesOfChosenCheckboxes = (name: string) => {
	const checkboxes: NodeListOf<any> = document.getElementsByName(name);
	const res = [];
	for (let i = 0; i < checkboxes.length; i += 1) {
		console.log(typeof checkboxes[i]);
		if (checkboxes[i].checked) {
			res.push(checkboxes[i].getAttribute('value'));
		}
	}
	return res;
};

export const PeopleList: FC<{
	gotData: number;
	setGotData: Dispatch<SetStateAction<number>>;
}> = ({ gotData, setGotData }) => {
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
		else if (!person.year_enter && filterYears.includes('???? ??????????????????????'))
			suitable = true;
		else if (
			!person.year_enter ||
			!filterYears.includes(person.year_enter.toString())
		)
			return false;

		if (filterHasParent.length === 0 || filterHasParent.length === 2)
			suitable = true;
		else if (filterHasParent.includes('??????????') && person.parent) return false;
		else if (filterHasParent.includes('??') && !person.parent) return false;

		if (
			filterGenerations.length === 0 ||
			filterGenerations.length === possibleGenerations.length
		)
			suitable = true;
		else if (
			!person.generation &&
			filterGenerations.includes(undefinedGeneration)
		)
			suitable = true;
		else if (
			!person.generation ||
			!filterGenerations.includes(person.generation)
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
		async function fetchData() {
			setGotData(1);
			const peopleRes = await getAllPeople();
			if (peopleRes) {
				setGotData(3);
				dispatch(peopleGet(peopleRes));
				const yearsCopy: Array<string> = [];
				yearsCopy.push('???? ??????????????????????');
				const generationsCopy: Array<Generation> = [];
				generationsCopy.push(undefinedGeneration);
				peopleRes.forEach((person) => {
					if (
						person.year_enter &&
						!yearsCopy.includes(person.year_enter.toString())
					) {
						yearsCopy.push(person.year_enter.toString());
					}
					if (
						person.generation &&
						!generationsCopy.includes(person.generation)
					) {
						generationsCopy.push(person.generation);
					}
				});
				setPossibleYears(yearsCopy);
				setPossibleGenerations(generationsCopy);
			} else {
				alert('?????????????? ?????? ???????????????????????? ??????????!');
				setGotData(2);
			}
		}
		if (gotData === 0 || gotData === 2) {
			setGotData(1);
			fetchData();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const addPerson = () => {
		//OR open popup
		navigate('/people/add', { replace: true });
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

	return !localStorage.getItem('token') ? (
		<Navigate to='/' />
	) : (
		<>
			<h2 className='text-center'>???????? ????</h2>
			<Button
				variant='primary'
				onClick={addPerson}
				id='addPerson'
				className='ms-4 m-2 align-self-start'
			>
				???????????? ????????????
			</Button>
			<SearchBar
				searchText={searchText}
				setSearchText={setSearchText}
				placeholder='?????????? ????????????...'
			/>
			<Row>
				<Col>
					<DropdownWithCheckboxes
						id='dropdownMenuStatus'
						name='status'
						labelText='??????????????'
						items={statusesForDropdown.map((s) => s.ukrMany)}
						updateFilters={updateFilters}
					/>
				</Col>
				<Col>
					<DropdownWithCheckboxes
						id='dropdownMenuYear'
						name='year'
						labelText='???????? ???????????? ?? ??????'
						items={possibleYears}
						updateFilters={updateFilters}
					/>
				</Col>
				<Col>
					<DropdownWithCheckboxes
						id='dropdownMenuHasParent'
						name='hasParent'
						labelText='?????????????????? ??????????????'
						items={['??', '??????????']}
						updateFilters={updateFilters}
					/>
				</Col>
				<Col>
					<DropdownWithCheckboxes
						id='dropdownMenuGeneration'
						name='generation'
						labelText='??????????????????'
						items={possibleGenerations.map((g) => g.name)}
						updateFilters={updateFilters}
					/>
				</Col>
			</Row>
			<Row xs={1} sm={2} md={4} lg={6} className='m-2'>
				{people.map((person: Person) => (
					<Col className='d-flex' style={{ minWidth: '210px' }} key={person.id}>
						<PersonItem person={person} />
					</Col>
				))}
			</Row>
		</>
	);
};
