const BASE_URL = 'https://task-manager-8snp.onrender.com/api/auth';

export const registerAPI = async (data) => {
  const res = await fetch(`${BASE_URL}/register`, {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  return res.json();
};

export const loginAPI = async (data) => {
  const res = await fetch(`${BASE_URL}/login`, {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  return res.json();
};

export const logoutAPI = async () => {
  const res = await fetch(`${BASE_URL}/logout`, {
    method: 'post',
    credentials: 'include',
  });
  return res.json();
};

export const profileAPI = async () => {
  const res = await fetch(`${BASE_URL}/profile`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!res.ok) {
    return null;
  }

  return res.json();
};
