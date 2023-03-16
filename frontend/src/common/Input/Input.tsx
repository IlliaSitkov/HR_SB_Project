import React, { ChangeEventHandler, FC, useEffect, useRef } from 'react';

export const Input: FC<{
	type: string;
	onChange: ChangeEventHandler<HTMLInputElement>;
	required?: boolean;
	label?: string;
	id?: string;
	placeholder?: string;
	value: string;
	disabled?: boolean;
	step?: number;
	style?: object;
	inputStyle?: object;
	refCallback?: Function;
}> = ({
	type,
	onChange,
	required,
	label,
	id,
	placeholder,
	value,
	disabled,
	step,
	style,
    inputStyle,
	refCallback,
}) => {
	const inputRef = useRef(null);

	useEffect(() => {
		if (refCallback) {
			refCallback(inputRef);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [inputRef]);

	return (
		<div style={style}>
			{label && <label htmlFor={id}>{label}</label>}
			<input
				ref={inputRef}
				step={step}
				disabled={disabled}
				className='form-control'
				id={id}
				value={value}
				name={id}
				type={type}
				onChange={onChange}
				required={required}
				placeholder={placeholder}
				min={type === 'date' ? '1960-01-01' : 0}
				autoComplete='off'
				style={inputStyle}
			/>
		</div>
	);
};
