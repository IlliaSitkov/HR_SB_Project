import React from 'react';
import { changeHandler } from '../../shared';
import { Select } from '../../common/Select/SelectComponent';
import { statusesArray } from '../../api/person';

const StatusSelect: React.FC<{
	setStatusId: Function;
	statusId: number;
	isRequired?: boolean;
}> = ({ setStatusId, statusId, isRequired }) => (
	<div>
		<Select
			id='selectStatus'
			noneSelectedOption={true}
			value={statusId}
			label='Статус'
			onChange={changeHandler(setStatusId)}
			data={statusesArray}
			idSelector={(r) => r.id}
			nameSelector={(r) => r.name}
			isRequired={isRequired}
		/>
	</div>
);

export default StatusSelect;
