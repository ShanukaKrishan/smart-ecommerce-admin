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
