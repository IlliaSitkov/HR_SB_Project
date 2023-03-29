import React from 'react';
import { changeHandler } from '../../shared';
import { Select } from '../../common/Select/SelectComponent';
import { roles } from '../../api/person';

const RoleSelect: React.FC<{
	setRoleId: Function;
	roleId: number;
	isRequired?: boolean;
}> = ({ setRoleId, roleId, isRequired }) => (
	<Select
		id='selectRole'
		noneSelectedOption={true}
		value={roleId}
		label='Посада'
		onChange={changeHandler(setRoleId)}
		data={roles}
		idSelector={(r) => r.id}
		nameSelector={(r) => r.ukr}
		isRequired={isRequired}
	/>
);

export default RoleSelect;
