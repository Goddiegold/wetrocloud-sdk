

export const errorMessage = (error: any) => {
  // if (showLog)
  console.log(`<<<<<<<<<<${JSON.stringify(error, null, 2)}>>>>>>>>>>`);
  return (
    error?.response?.data || error?.message || 'Something went wrong'
  );
};

export const RequestMethods = {
  GET: "GET",
  POST: "POST",
  DELETE: "DELETE",
  PUT: "PUT"
}