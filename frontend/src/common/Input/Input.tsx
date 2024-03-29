import React, {
	ChangeEventHandler,
	FC,
	HTMLInputTypeAttribute,
	useEffect,
	useRef,
} from 'react';

export const Input: FC<{
	type: HTMLInputTypeAttribute;
	onChange?: ChangeEventHandler<HTMLInputElement>;
	required?: boolean;
	label?: string;
	id?: string;
	placeholder?: string;
	value: any;
	disabled?: boolean;
	step?: number;
	style?: object;
	inputStyle?: object;
	refCallback?: Function;
	min?: number;
	max?: number;
	accept?: string;
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
	min,
	max,
	accept,
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
			{label && required ? (
				<label htmlFor={id}>
					<span style={{ color: 'red', fontWeight: '600' }}>*</span>
					{label}
				</label>
			) : (
				<label htmlFor={id}>{label}</label>
			)}
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
				min={type === 'date' ? '1960-01-01' : min}
				max={max}
				autoComplete='off'
				style={inputStyle}
				accept={accept}
			/>
		</div>
	);
};
