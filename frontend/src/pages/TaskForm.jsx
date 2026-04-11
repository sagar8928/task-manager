import { useState } from 'react';
import { createTaskAPI } from '../api/task.api.js';
import './TaskForm.css';
import { useNavigate } from 'react-router-dom';

export default function TaskForm() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    dueDate: '',
    assignedTo: '',
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      title: form.title,
      description: form.description,
      dueDate: form.dueDate || null,
      assignedTo: form.assignedTo || null,
    };

    await createTaskAPI(payload);

    setForm({ title: '', description: '', dueDate: '', assignedTo: '' });
    
    navigate('/');
  };

  return (
    <form className="taskform" onSubmit={handleSubmit}>
      <h3 className="taskform-title">Create Task</h3>

      <div className="taskform-grid">
        <input
          className="taskform-input"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <textarea
          className="taskform-input taskform-textarea"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <input
          className="taskform-input"
          type="date"
          value={form.dueDate}
          onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
        />

        <input
          className="taskform-input"
          placeholder="Assign to userId (optional)"
          value={form.assignedTo}
          onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
        />
      </div>

      <button className="taskform-btn" type="submit">
        Create Task
      </button>
    </form>
  );
}
