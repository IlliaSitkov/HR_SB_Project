export const errorToString = (error: any) => {
    console.log(error);
    const data = (error as any).response.data;
    return data.errors ? arrayOfErrorsToString(data.errors) : data.message;
};

const arrayOfErrorsToString = (
    errors: Array<{ field: string; message: string }>
) => {
    return errors.map((e) => e.message).toString();
};