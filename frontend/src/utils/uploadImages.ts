import axios from 'axios';

const UPLOAD_IMAGE_URL = 'https://api.imgbb.com/1/upload';

export const uploadImageAndGetUrl = async (
	img: File,
	imgName: string
): Promise<string> => {
	const loadedFile = await loadFile(img);
	const body = new FormData();
	body.set('key', process.env.REACT_APP_UPLOAD_IMAGE_API_KEY!);
	body.append('image', loadedFile);
	body.append('name', imgName ? imgName : getRandomFileName());
	const res = await axios.post(UPLOAD_IMAGE_URL, body);
	console.log(res.data);
	return res.data.data.url;
};

export const loadFile = (file: File): Promise<any> => {
	return new Promise((resolve, reject) => {
		const rf = new FileReader();
		rf.readAsDataURL(file);
		rf.onloadend = function (event) {
			// @ts-ignore
			resolve(event.target.result.split(',').pop());
		};
	});
};

export const getRandomFileName = () => {
	const minMax = 1000000;
	return Math.floor(Math.random() * minMax) + 1000000 + '';
};
