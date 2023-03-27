/* eslint-disable react-hooks/exhaustive-deps*/
import React, { FC, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { SearchBar } from '../../common/SearchBar/SearchBar';
import { Button, Col, Row } from 'react-bootstrap';
import { DropdownWithCheckboxes } from '../../common/DropdownWithCheckboxes/DropdownWithCheckboxes';
import { getEventsData } from '../../store/selectors';
import { Event, getAllEvents } from '../../api/event';
import { eventsGet } from '../../store/events/actionCreators';
import { EventItem } from './components/EventItem/EventItem';
import { Category } from '../../api/category';
import { getAllCategories } from '../../api/category';
import { CreateEventModal } from '../CreateEvent/CreateEventModal';
import { gotEventDataSet } from '../../store/gotEventData/actionCreators';
import { Circles } from 'react-loader-spinner';
import { GotDataStatus } from '../../store/gotDataEnum';
import { getValuesOfChosenCheckboxes } from '../PeopleList/PeopleList';

export const EventsList: FC = () => {
	const gotData = useSelector<number>(getEventsData);
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
		state.allEvents.filter(
			(event: Event) => suitsSearch(event) && suitsFilter(event)
		)
	);

	const fetchCategories = async () => {
		let categories = await getAllCategories();
		setPossibleCategories(categories);
	};

	const dispatch = useDispatch();

	useEffect(() => {
		async function fetchData() {
			const eventsRes = await getAllEvents();
			if (eventsRes) {
				dispatch(gotEventDataSet(GotDataStatus.LOADED_SUCCESSFULLY));
				dispatch(eventsGet(eventsRes));
				const categories = await getAllCategories();
				setPossibleCategories(categories);
			} else {
				alert('Помилка при завантаженні подій!');
				dispatch(gotEventDataSet(GotDataStatus.ERROR_WHILE_LOADING));
			}
		}

		if (
			gotData === GotDataStatus.NOT_YET_LOADED ||
			gotData === GotDataStatus.ERROR_WHILE_LOADING
		) {
			dispatch(gotEventDataSet(GotDataStatus.STARTED_LOADING));
			fetchData();
		}
		fetchCategories();
	}, []);

	const updateFilters = (param: string) => {
		let vals = getValuesOfChosenCheckboxes(param);
		if (vals.length !== 0) {
			if (param === 'category') {
				const newCategories: Array<Category> = [];
				vals.forEach((val) => {
					const cat = possibleCategories.find((c) => c.name === val);
					if (cat) newCategories.push(cat);
				});
				setFilterCategories(newCategories);
			}
		} else {
			setFilterCategories([]);
		}
	};

	const [show, setShow] = useState(false);

	const toggleModal = () => {
		setShow(!show);
	};

	return (
		<>
			<h2 className='text-center'>Події СБ</h2>
			<CreateEventModal showModal={show} toggleModal={toggleModal} />
			<Button
				onClick={toggleModal}
				variant='primary'
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
						labelText='Категорії'
						items={possibleCategories.map((c) => c.name)}
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
				<Row xs={1} sm={2} md={4} lg={5} className='m-2'>
					{events.map((event: Event) => (
						<Col
							className='d-flex'
							style={{ minWidth: '280px' }}
							key={event.id}
						>
							<EventItem event={event} />
						</Col>
					))}
				</Row>
			)}
		</>
	);
};
