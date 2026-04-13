const BASE_URL = 'https://task-manager-8snp.onrender.com/api/auth';
// const BASE_URL = 'http://localhost:5000/api/auth';
// http://localhost:5000/api/auth
// https://task-manager-8snp.onrender.com/api/auth

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
  try {
    const res = await fetch(`${BASE_URL}/login`, {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      return res.status(404).json({ message: 'Not login , user not found ' });
    }
    return res.json();
  } catch (error) {
    console.log('Login error ', error);
  }
};

export const logoutAPI = async () => {
  const res = await fetch(`${BASE_URL}/logout`, {
    method: 'post',
    credentials: 'include',
  });

  if (!res.ok) {
    throw new Error('Logout failed');
  }

  return res.json();
};

export const profileAPI = async () => {
  const res = await fetch(`${BASE_URL}/profile`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!res.ok) {
    console.log('Profile API returned status:', res.status);
    return null;
  }

  try {
    return await res.json();
  } catch (error) {
    console.error('Failed to parse profile response:', error);
    return null;
  }
};
