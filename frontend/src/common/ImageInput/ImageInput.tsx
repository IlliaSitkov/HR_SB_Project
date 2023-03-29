import { Input } from '../Input/Input';
import { ChangeEventHandler, FC } from 'react';

export const ImageInput: FC<{
	value: any;
	onChange?: ChangeEventHandler<HTMLInputElement>;
	id?: string;
	disabled?: boolean;
}> = ({ value, onChange, id, disabled }) => {
	return (
		<Input
			type='file'
			value={value}
			onChange={onChange}
			id={id ? id : 'selectImage'}
			accept='image/png, image/jpeg, image/gif'
			disabled={disabled}
			style={{ visibility: 'hidden', width: 0, height: 0 }}
		/>
	);
};
