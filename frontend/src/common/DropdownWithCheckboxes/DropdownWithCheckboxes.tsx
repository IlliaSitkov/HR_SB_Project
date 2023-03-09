import { FC } from 'react';
import { Dropdown } from 'react-bootstrap';

export const DropdownWithCheckboxes: FC<{
	id: string;
	name: string;
	labelText: string;
	items: Array<any>;
	updateFilters: Function;
}> = ({ id, name, labelText, items, updateFilters }) => {
	return (
		<Dropdown>
			<Dropdown.Toggle variant='outline-primary' id={id}>
				{labelText}
			</Dropdown.Toggle>

			<Dropdown.Menu>
				{items.map((item) => (
					<Dropdown.ItemText className='dropdown-item' key={item}>
						<input
							type='checkbox'
							name={name}
							value={item}
							onChange={() => {
								updateFilters(name);
							}}
						/>{' '}
						{item}
					</Dropdown.ItemText>
				))}
			</Dropdown.Menu>
		</Dropdown>
	);
};
