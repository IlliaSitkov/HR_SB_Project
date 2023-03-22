import React, { FC } from 'react';

export const ErrorMessage: FC<{ message: string | undefined }> = ({
	message,
}) => {
	if (!message) {
		return null;
	}

	return (
		<div>
			<small style={{ fontSize: '0.9em', color: 'red' }}>{message}</small>
		</div>
	);
};
