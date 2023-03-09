export const customSessionStorage = {
	setAuthToken: (authToken: string) =>
		sessionStorage.setItem('token', authToken),
	getAuthToken: () => sessionStorage.getItem('token'),
	resetAuthToken: () => sessionStorage.removeItem('token'),
};
