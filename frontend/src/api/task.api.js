const BASE_URL = 'https://task-manager-8snp.onrender.com/api/tasks';
// http://localhost:5000/api/tasks
// https://task-manager-8snp.onrender.com/api/tasks

export const fetchTaskAPI = async () => {
  const res = await fetch(`${BASE_URL}`, {
    credentials: 'include',
  });
  return res.json();
};

export const createTaskAPI = async (data) => {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });

  return res.json();
};

export const updateTaskAPI = async (id, data) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });

  return res.json();
};

export const deleteTaskAPI = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  return res.json();
};
