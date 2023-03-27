import React from 'react';

export const HelloPage = ({ helloText }: { helloText: string }) => {
	return (
		<div className='mt-5 d-flex justify-content-center flex-column gap-4'>
			<h2 className='text-center' style={{ whiteSpace: 'pre-wrap' }}>
				{helloText}
			</h2>
			<div className='d-flex justify-content-center'>
				<img width='300' src='shared/images/sb_logo.png' alt='' />
			</div>
		</div>
	);
};
