import React from 'react';
import { changeHandler } from '../../shared';
import { Select } from '../../common/Select/SelectComponent';

const YearSelect: React.FC<{
	setYearEnter: Function;
	yearEnter: number;
	isRequired?: boolean;
}> = ({ setYearEnter, yearEnter, isRequired }) => {
	const yearsEnter = [];
	const currentYear = new Date().getFullYear();
	for (let i = 1992; i <= currentYear; i++) yearsEnter.push(i);

	return (
		<div>
			<Select
				id='selectYearEnter'
				noneSelectedOption={true}
				value={yearEnter}
				label='Рік вступу в КМА'
				onChange={changeHandler(setYearEnter)}
				data={yearsEnter}
				idSelector={(y) => y}
				nameSelector={(y) => y}
				isRequired={isRequired}
			/>
		</div>
	);
};

export default YearSelect;
