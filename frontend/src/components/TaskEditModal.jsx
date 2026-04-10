import { useState } from 'react';
import { updateTaskAPI } from '../api/task.api';

export default function TaskEditModal({
  task,
  currentUser,
  onClose,
  onUpdated,
}) {
  const [form, setForm] = useState({
    title: task.title,
    description: task.description || '',
    status: task.status,
    dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
  });

  const [error, setError] = useState('');

  //  Role detection
  const isCreator = task.createdBy?._id === currentUser?.id;
  const isAssignee = task.assignedTo?._id === currentUser?.id;

  //   UI permissions (disable inputs) 
  let disableTitle = false;
  let disableDescription = false;
  let disableStatus = false;
  let disableDueDate = false;

  // Personal task
  if (task.taskType === 'personal') {
    if (!isCreator) {
      disableTitle = true;
      disableDescription = true;
      disableStatus = true;
      disableDueDate = true;
    }
  }

  // Assigned task
  if (task.taskType === 'assigned') {
    // Assignee can only update status
    if (isAssignee && !isCreator) {
      disableTitle = true;
      disableDescription = true;
      disableDueDate = true;
    }

    // Assigner (creator) can only update dueDate
    if (isCreator) {
      disableTitle = true;
      disableDescription = true;
      disableStatus = true;
    }
  }

  const handleSave = async () => {
    setError('');

    let payload = {};

    // PERSONAL: creator can update everything
    if (task.taskType === 'personal' && isCreator) {
      payload = {
        title: form.title,
        description: form.description,
        status: form.status,
        dueDate: form.dueDate || null,
      };
    }

    // ASSIGNED: assignee can update only status
    if (task.taskType === 'assigned' && isAssignee && !isCreator) {
      payload = {
        status: form.status,
      };
    }

    // ASSIGNED: assigner (creator) can update only dueDate
    if (task.taskType === 'assigned' && isCreator) {
      payload = {
        dueDate: form.dueDate || null,
      };
    }

    // If payload is empty
    if (Object.keys(payload).length === 0) {
      return setError('You are not allowed to update this task');
    }

    const res = await updateTaskAPI(task._id, payload);

    if (res.message && !res._id) {
      return setError(res.message);
    }

    onUpdated();
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.4)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          background: '#fff',
          padding: 20,
          borderRadius: 10,
          width: 400,
        }}
      >
        <h3>Edit Task</h3>

        <input
          placeholder="Title"
          value={form.title}
          disabled={disableTitle}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          style={{
            width: '100%',
            marginBottom: 10,
            opacity: disableTitle ? 0.5 : 1,
          }}
        />

        <textarea
          placeholder="Description"
          value={form.description}
          disabled={disableDescription}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          style={{
            width: '100%',
            marginBottom: 10,
            opacity: disableDescription ? 0.5 : 1,
          }}
        />

        <select
          value={form.status}
          disabled={disableStatus}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
          style={{
            width: '100%',
            marginBottom: 10,
            opacity: disableStatus ? 0.5 : 1,
          }}
        >
          <option value="Todo">Todo</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>

        <input
          type="date"
          value={form.dueDate}
          disabled={disableDueDate}
          onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
          style={{
            width: '100%',
            marginBottom: 10,
            opacity: disableDueDate ? 0.5 : 1,
          }}
        />

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
}
