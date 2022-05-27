interface CreateAdminResponse {
  success: boolean;
  id: string;
}

interface GetAdminResponse {
  success: boolean;
  displayName: string;
  email: string;
}

export const createAdmin = async (
  email: string,
  password: string,
  displayName: string
) => {
  // make request
  const res = await fetch('/api/admin/create', {
    method: 'POST',
    body: JSON.stringify({ email, password, displayName }),
  });
  // decode response
  const resJson: CreateAdminResponse = await res.json();
  // check error
  if (!res.ok || !resJson.success) {
    throw new Error('admin creation error');
  }
  // return data
  return resJson.id;
};

export const deleteAdmin = async (id: string) => {
  // make request
  const res = await fetch(`/api/admin/${id}`, {
    method: 'DELETE',
  });
  // decode response
  const resJson: CreateAdminResponse = await res.json();
  // check error
  if (!res.ok || !resJson.success) {
    throw new Error('admin creation error');
  }
  // return
  return;
};

export const getAdmin = async (id: string) => {
  // make request
  const res = await fetch(`/api/admin/${id}`, {
    method: 'GET',
  });
  // decode response
  const resJson: GetAdminResponse = await res.json();
  // check error
  if (!res.ok || !resJson.success) {
    throw new Error('admin creation error');
  }
  // return data
  return { displayName: resJson.displayName, email: resJson.email };
};

export const updateAdminPassword = async ({
  id,
  password,
}: {
  id: string;
  password: string;
}) => {
  // register in iam
  const response = await fetch(`/api/admin/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ password }),
  });
  // get response json
  const responseJson = await response.json();
  // check success
  if (!response.ok || !responseJson.success) {
    throw new Error('admin update error');
  }
};
