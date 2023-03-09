import React, { ChangeEventHandler, FC } from 'react';
import './SelectComponent.css';
import RequiredStar from '../../components/common/RequiredStar';

export const Select: FC<{
	id: string;
	noneSelectedOption: boolean;
	value: number;
	label: string;
	onChange: ChangeEventHandler<HTMLSelectElement>;
	data: any[];
	idSelector: (d: any) => string;
	nameSelector: (d: any) => string;
	isRequired?: boolean;
}> = ({
	id,
	noneSelectedOption,
	value,
	label,
	onChange,
	data,
	idSelector,
	nameSelector,
	isRequired,
}) => {
	return (
		<div className='d-flex flex-column gap-2'>
			<label htmlFor={id}>
				{isRequired && <RequiredStar />}
				{label}
			</label>
			<select
				value={value}
				onChange={onChange}
				id={id}
				name={id}
				className='form-select'
			>
				{noneSelectedOption && <option value={-1}>Не встановлено</option>}
				{data.map((d) => {
					const optId = idSelector(d);
					return (
						<option key={optId} value={optId}>
							{nameSelector(d)}
						</option>
					);
				})}
			</select>
		</div>
	);
};
