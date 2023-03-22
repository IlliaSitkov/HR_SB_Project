import { FC, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
import { SearchBar } from '../../common/SearchBar/SearchBar';
import { Button, Col, Row } from 'react-bootstrap';
import { DropdownWithCheckboxes } from '../../common/DropdownWithCheckboxes/DropdownWithCheckboxes';
import { UserRole } from '../../api/common/types';
import { getGotData, getUserRole } from '../../store/selectors';
import { gotDataSet } from '../../store/gotData/actionCreators';
import { Event, getAllEvents } from '../../api/event';
import { eventsGet } from '../../store/events/actionCreators';
import { EventItem } from './components/EventItem/EventItem';
import { Category } from '../../api/category';
import { getAllCategories } from '../../api/category';

export const EventsList: FC = () => {
	const userRole = useSelector<UserRole>(getUserRole);
	const gotData = useSelector<number>(getGotData);
	const [searchText, setSearchText] = useState('');
	const [filterCategories, setFilterCategories] = useState<Array<Category>>([]);
	const [possibleCategories, setPossibleCategories] = useState<Array<Category>>(
		[]
	);
	const suitsSearch = (event: Event) => {
		let sT = searchText.trim();
		if (sT === '') return true;
		sT = sT.toLowerCase();
		return event.name.toLowerCase().includes(sT);
	};
	const suitsFilter = (event: Event) => {
		let suitable = true;
		if (
			filterCategories.length === 0 ||
			filterCategories.length === possibleCategories.length
		)
			suitable = true;
		else if (
			!event.category_id ||
			!filterCategories.find((c) => c.id === event.category_id)
		)
			return false;

		return suitable;
	};

	const events = useSelector((state: any) =>
		state.events.filter(
			(event: Event) => suitsSearch(event) && suitsFilter(event)
		)
	);

	const navigate = useNavigate();
	const dispatch = useDispatch();

	useEffect(() => {
		async function fetchData() {
			const eventsRes = await getAllEvents();
			if (eventsRes) {
				dispatch(gotDataSet(3));
				dispatch(eventsGet(eventsRes));
				const categories = await getAllCategories();
				setPossibleCategories(categories);
			} else {
				alert('Помилка при завантаженні подій!');
				dispatch(gotDataSet(2));
			}
		}

		if (gotData === 0 || gotData === 2) {
			dispatch(gotDataSet(1));
			fetchData();
		}
	}, []);

	const addEvent = () => {
		navigate('/members/add', { replace: true }); // ?
	};

	const updateFilters = (param: string) => {
		const checkboxes: NodeListOf<any> = document.getElementsByName(param);
		let val: string;
		if (checkboxes[0].checked) {
			val = checkboxes[0].getAttribute('value');
			if (param === 'category') {
				const newCategories: Array<Category> = [];
				const cat = possibleCategories.find((c) => c.name === val);
				if (cat) newCategories.push(cat);
				setFilterCategories(newCategories);
			}
		} else {
			setFilterCategories([]);
		}
	};

	return userRole !== UserRole.HR ? (
		<Navigate to='/' />
	) : (
		<>
			<h2 className='text-center'>Події СБ</h2>
			<Button
				variant='primary'
				onClick={addEvent}
				id='addEvent'
				className='ms-4 m-2 align-self-start'
			>
				Додати подію
			</Button>
			<SearchBar
				searchText={searchText}
				setSearchText={setSearchText}
				placeholder='Пошук події...'
			/>
			<Row>
				<Col>
					<DropdownWithCheckboxes
						id='dropdownMenuCategory'
						name='category'
						labelText='Категорія'
						items={possibleCategories.map((c) => c.name)}
						updateFilters={updateFilters}
					/>
				</Col>
			</Row>
			<Row xs={1} sm={2} md={4} lg={5} className='m-2'>
				{events.map((event: Event) => (
					<Col className='d-flex' style={{ minWidth: '280px' }} key={event.id}>
						<EventItem event={event} />
					</Col>
				))}
			</Row>
		</>
	);
};
