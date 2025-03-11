

export const errorMessage = (error: any) => {
    // if (showLog)
    console.log(`<<<<<<<<<<${JSON.stringify(error, null, 2)}>>>>>>>>>>`);
    return (
      error?.response?.data?.message || error?.message || 'Something went wrong'
    );
  };