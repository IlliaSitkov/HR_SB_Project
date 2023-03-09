import React, { useState } from 'react';
import { ItemManager } from './components/ItemManager/ItemManager';
import {
	createCategory,
	deleteCategory,
	getAllCategories,
	updateCategory,
} from './api/category';

export const ItemManagerDemo = () => {
	const [category, setCategory] = useState(-1);

	return (
		<ItemManager
			selectedItem={category}
			setSelectedItem={setCategory}
			getAllFunc={getAllCategories}
			updateFunc={updateCategory}
			deleteFunc={deleteCategory}
			createFunc={createCategory}
			selectTitle='Категорія події'
			modalTitle='Усі категорії подій'
			placeholder='Нова категорія'
		/>
	);
};
