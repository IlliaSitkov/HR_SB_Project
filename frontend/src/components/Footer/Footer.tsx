import React from 'react';
import './Footer.css';

export const Footer = () => {
	const supportContact =
		'Тех. підтримка: ' + process.env.REACT_APP_SUPPORT_CONTACT;

	return (
		<footer className='footer-bar fixed-bottom'>
			<div>
				<img
					width='28'
					src='shared/images/sb_logo.png'
					className='me-3'
					alt=''
				/>
				<span className='footer-text'>{supportContact}</span>
			</div>
		</footer>
	);
};
