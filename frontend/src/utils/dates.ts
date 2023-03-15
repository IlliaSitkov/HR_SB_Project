export const dateToString = (date: Date): string => {
	let month: string | number = date.getMonth() + 1;
	if (month < 10) month = '0' + month;
	let day: string | number = date.getDate();
	if (day < 10) day = '0' + day;
	return date.getFullYear() + '-' + month + '-' + day;
};
