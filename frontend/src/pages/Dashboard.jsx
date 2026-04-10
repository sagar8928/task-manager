import { useEffect, useState } from 'react';
import { fetchTaskAPI, deleteTaskAPI } from '../api/task.api';
import TaskForm from './TaskForm.jsx';
import TaskEditModal from '../components/TaskEditModal';
import { useAuth } from '../context/useAuth.jsx';
import './Dashboard.css';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editTask, setEditTask] = useState(null);

  const { user } = useAuth();

  const loadTasks = async () => {
    setLoading(true);

    const data = await fetchTaskAPI();

    if (Array.isArray(data)) {
      setTasks(data);
    } else {
      setTasks([]);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleDelete = async (id) => {
    await deleteTaskAPI(id);
    loadTasks();
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Dashboard</h2>
        <p className="dashboard-subtitle">
          Manage your tasks efficiently and stay productive.
        </p>
      </div>

      <div className="task-section">
        {loading ? (
          <p className="loading-text">Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p className="empty-text">No tasks found.</p>
        ) : (
          <div className="task-grid">
            {tasks.map((task) => (
              <div key={task._id} className="task-card">
                <div className="task-top">
                  <h3 className="task-title">{task.title}</h3>

                  {/* <span className={`task-status`}>{task.status}</span> */}
                </div>

                <p className="task-desc">{task.description}</p>

                <div className="task-meta">
                  <p>
                    <b>Type:</b> {task.taskType}
                  </p>

                  {task.status && (
                    <p>
                      <b>Status:</b> {task.status}
                    </p>
                  )}
                  {task.dueDate && (
                    <p>
                      <b>Due:</b> {task.dueDate.split('T')[0]}
                    </p>
                  )}

                  {task.assignedTo && (
                    <p>
                      <b>Assigned:</b> {task.assignedTo.name}
                    </p>
                  )}
                </div>

                <div className="task-actions">
                  <button
                    className="btn btn-edit"
                    onClick={() => setEditTask(task)}
                  >
                    Edit
                  </button>

                  <button
                    className="btn btn-delete"
                    onClick={() => handleDelete(task._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {editTask && (
        <TaskEditModal
          task={editTask}
          currentUser={user}
          onClose={() => setEditTask(null)}
          onUpdated={loadTasks}
        />
      )}
    </div>
  );
}
