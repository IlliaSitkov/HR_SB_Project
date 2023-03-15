import { ChangeEventHandler, FC } from 'react';
import './SelectComponent.css';

export const Select: FC<{
	id: string;
	noneSelectedOption: boolean;
	value: number;
	label: string;
	onChange: ChangeEventHandler<HTMLSelectElement>;
	data: any[];
	idSelector: (d: any) => string;
	nameSelector: (d: any) => string;
}> = ({
	id,
	noneSelectedOption,
	value,
	label,
	onChange,
	data,
	idSelector,
	nameSelector,
}) => {
	return (
		<div className='d-flex flex-column gap-2'>
			<label htmlFor={id}>{label}</label>
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
