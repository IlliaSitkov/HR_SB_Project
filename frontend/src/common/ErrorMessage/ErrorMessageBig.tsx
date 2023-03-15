import React, { FC } from 'react';

export const ErrorMessageBig: FC<{ message: string | undefined }> = ({
	message,
}) => {
	if (!message) {
		return null;
	}

	return (
		<div>
			<h5 style={{ color: 'red' }}>{message}</h5>
		</div>
	);
};
