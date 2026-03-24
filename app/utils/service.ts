/* eslint-disable @typescript-eslint/no-explicit-any */

export const baseUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1`;
export const baseDesignedUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}`;
export const baseUrlLocation = `${process.env.NEXT_PUBLIC_BACKEND_URL}`;
export const socketUrl = `${process.env.SOCKET_URL}` || "http://localhost:3010";
export const getRequest = async (url: string) => {
  const response = await fetch(`${baseUrl}/${url}`);

  const res = await response.json();
  if (!response.ok) {
    let message = "An error occurred...";
    const data = await response.json();
    if (data?.message) {
      message = data.message;
      return { error: true, message };
    }
  }

  return res;
};

export const postRequest = async (url: string, data: any) => {
  // console.log("Data accepted, ", data);
  const response = await fetch(`${baseUrl}/${url}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const res = await response.json();
  if (!response.ok) {
    let message = "An error occurred...";
    const errorData = res; // Store the JSON response in a variable
    if (errorData?.message) {
      message = errorData.message;
    }
    return { error: true, message };
  }

  // console.log(res);
  return res;
};

export const putRequest = async (url: string, data: FormData) => {
  const response = await fetch(`${baseUrl}/${url}`, {
    method: "PUT", // or 'PUT' if you're updating data
    headers: {
      "Content-Type": "application/json", // Specify the content type
    },
    body: JSON.stringify(data),
  });

  const res = await response.json();
  if (!response.ok) {
    let message = "An error occurred...";
    const data = await response.json();
    if (data?.message) {
      message = data.message;
      return { error: true, message };
    }
  }

  return res;
};
