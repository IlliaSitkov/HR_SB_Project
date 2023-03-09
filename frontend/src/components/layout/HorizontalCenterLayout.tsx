import { FC, ReactElement } from 'react';

const HorizontalCenterLayout: FC<{
	children?: ReactElement;
	style?: object;
}> = ({ children, style = {} }) => {
	return (
		<div
			className='d-flex w-100 flex-column align-items-center'
			style={{
				...style,
			}}
		>
			{children}
		</div>
	);
};

export default HorizontalCenterLayout;
