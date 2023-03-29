import React from 'react';
import { changeHandler } from '../../shared';
import { Select } from '../../common/Select/SelectComponent';
import { getFullName, getStatusUkr } from '../../api/person';
import { useSelector } from 'react-redux';
import { getPeoplePossibleParents } from '../../store/selectors';

const ParentSelect: React.FC<{
	setParentId: Function;
	parentId: number;
	isRequired?: boolean;
}> = ({ setParentId, parentId, isRequired }) => {
	const possibleParents = useSelector(getPeoplePossibleParents);

	return (
		<div>
			<Select
				id='selectParent'
				noneSelectedOption={true}
				value={parentId}
				label='Патрон'
				onChange={changeHandler(setParentId)}
				data={possibleParents}
				idSelector={(p) => p.id}
				nameSelector={(p) =>
					//@ts-ignore
					`${getFullName(p)} (${getStatusUkr(p.status)})`
				}
				isRequired={isRequired}
			/>
		</div>
	);
};

export default ParentSelect;
