import React, { useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import { ActivityPersonDropdownItem } from '../ActivityPerson/ActivityPersonDropdownItem';
import { Person } from '../../../../api/person';
import { useDispatch, useSelector } from 'react-redux';
import { createEventActivitiesThunk } from '../../../../store/eventActivities/thunk';

export const AddEventPerson = ({
	eventId,
	eventPersonSelector,
	buttonTitle,
}: {
	eventId: number;
	eventPersonSelector: Function;
	buttonTitle: string;
}) => {
	const [show, setShow] = useState<boolean>(false);

	const members: Person[] = useSelector(eventPersonSelector(eventId));

	const dispatch = useDispatch();

	const addOrganizer = async (personId: number) => {
		dispatch(createEventActivitiesThunk(eventId, personId) as any);
	};

	return (
		<Dropdown
			show={show}
			onToggle={(nextShow: boolean, meta: any) => {
				if (meta.source !== 'select') {
					setShow(nextShow);
				}
			}}
		>
			<Dropdown.Toggle variant='outline-primary'>{buttonTitle}</Dropdown.Toggle>

			<Dropdown.Menu>
				{members.length <= 0 && (
					<div className='p-2 text-center'>Усіх додано</div>
				)}
				{members.map((person: Person) => (
					<ActivityPersonDropdownItem
						key={person.id}
						person={person}
						onClick={() => addOrganizer(person.id!)}
					/>
				))}
			</Dropdown.Menu>
		</Dropdown>
	);
};
