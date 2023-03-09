import React from 'react';
import { Dropdown } from 'react-bootstrap';
import { plusIcon } from '../../../../common/icons/icons';

export const ActivityPersonDropdownItem = ({
	person,
	onClick,
}: {
	person: any;
	onClick: any;
}) => {
	return (
		<Dropdown.Item className='show-on-hover' onClick={onClick}>
			<div className='d-flex justify-content-between gap-2 align-items-center'>
				<div>
					{person.surname} {person.name}
				</div>
				<div className='visible-on-hover'>
					<button className='empty'>{plusIcon(16, 'blue')}</button>
				</div>
			</div>
		</Dropdown.Item>
	);
};
