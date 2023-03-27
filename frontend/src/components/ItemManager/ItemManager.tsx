import React, {
	createContext,
	Dispatch,
	FC,
	SetStateAction,
	useEffect,
	useState,
} from 'react';
import { Select } from '../../common/Select/SelectComponent';
import { Button } from 'react-bootstrap';
import { addIcon } from '../../common/icons/icons';
import { EditItemsModal } from './components/EditItemsModal/EditItemsModal';
import { changeHandler } from '../../shared';
import { IItem } from '../../api/common/types';

export const ItemsContext = createContext<{
	refresh: Function;
	updateFunc: Function;
	deleteFunc: Function;
	createFunc: Function;
	placeholder: string;
}>({
	refresh: () => {},
	createFunc: () => {},
	deleteFunc: () => {},
	updateFunc: () => {},
	placeholder: '',
});

export const ItemManager: FC<{
	selectedItem: any;
	setSelectedItem: Dispatch<SetStateAction<any>>;
	getAllFunc: Function;
	updateFunc: Function;
	deleteFunc: Function;
	createFunc: Function;
	selectTitle: string;
	modalTitle: string;
	placeholder: string;
	isRequired?: boolean;
}> = ({
	selectedItem,
	setSelectedItem,
	getAllFunc,
	updateFunc,
	deleteFunc,
	createFunc,
	selectTitle,
	modalTitle,
	placeholder,
	isRequired,
}) => {
	const [items, setItems] = useState<IItem[]>([]);

	const [showModal, setShowModal] = useState<boolean>(false);

	useEffect(() => {
		fetchData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const fetchData = async () => {
		const items = await getAllFunc();
		setItems(items);
	};

	return (
		<ItemsContext.Provider
			value={{
				refresh: fetchData,
				deleteFunc,
				updateFunc,
				createFunc,
				placeholder,
			}}
		>
			<section className='d-flex gap-2 align-items-end'>
				<Select
					id='select'
					noneSelectedOption={true}
					value={selectedItem}
					label={selectTitle}
					onChange={changeHandler(setSelectedItem)}
					data={items}
					idSelector={(d) => d.id}
					nameSelector={(d) => d.name}
					isRequired={isRequired}
				/>
				<Button
					onClick={() => setShowModal(!showModal)}
					className='d-flex align-content-center'
				>
					{addIcon()}
				</Button>
				<EditItemsModal
					title={modalTitle}
					listItems={items}
					setShow={setShowModal}
					show={showModal}
				/>
			</section>
		</ItemsContext.Provider>
	);
};
