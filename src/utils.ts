

export const errorMessage = (error: any) => {
  // if (showLog)
  console.log(`<<<<<<<<<<${JSON.stringify(error, null, 2)}>>>>>>>>>>`);
  return (
    error?.response?.data || error?.message || 'Something went wrong'
  );
};

export function generateRandomString(length: number): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length }, () => characters[Math.floor(Math.random() * characters.length)]).join('');
}


export const RequestMethods = {
  GET: "GET",
  POST: "POST",
  DELETE: "DELETE",
  PUT: "PUT"
}