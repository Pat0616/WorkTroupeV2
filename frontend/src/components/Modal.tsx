import { useEffect, useState } from 'react';
import './modal.css';

const STATUS = ['To Do', 'In Progress', 'Done'];
const PRIORITY = ['Low', 'Medium', 'High'];

type Member = {
  id: number;
  name: string;
};

type Task = {
  id?: number;
  title: string;
  description?: string;
  status: string;
  priority: string;
  due: string;
  assignees: number[];
};

type Props = {
  task: Task | null;
  members?: Member[];
  onClose: () => void;
  onSave: (task: Task) => void;
  onDelete?: (id: number) => void;
};

export default function TaskModal({
  task,
  members = [], // ✅ safe default
  onClose,
  onSave,
  onDelete,
}: Props) {
  const isNew = !task;

  // ✅ safe + reset when task changes
  const [form, setForm] = useState<Task>({
    title: '',
    description: '',
    status: 'To Do',
    priority: 'Medium',
    due: '',
    assignees: [],
  });

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'To Do',
        priority: task.priority || 'Medium',
        due: task.due || '',
        assignees: task.assignees || [],
      });
    } else {
      setForm({
        title: '',
        description: '',
        status: 'To Do',
        priority: 'Medium',
        due: '',
        assignees: [],
      });
    }
  }, [task]);

  const toggleMember = (id: number) => {
    setForm((prev) => ({
      ...prev,
      assignees: (prev.assignees || []).includes(id)
        ? prev.assignees.filter((x) => x !== id)
        : [...(prev.assignees || []), id],
    }));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>

        {/* HEADER */}
        <div className="modal-header">
          <h2>{isNew ? '➕ New Task' : '📝 Task'}</h2>
          <button onClick={onClose}>✕</button>
        </div>

        {/* BODY */}
        <div className="modal-body">

          <input
            placeholder="Task title"
            value={form.title}
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
          />

          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />

          <div className="grid-2">
            <select
              value={form.status}
              onChange={(e) =>
                setForm({ ...form, status: e.target.value })
              }
            >
              {STATUS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            <select
              value={form.priority}
              onChange={(e) =>
                setForm({ ...form, priority: e.target.value })
              }
            >
              {PRIORITY.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <input
            type="date"
            value={form.due}
            onChange={(e) =>
              setForm({ ...form, due: e.target.value })
            }
          />

          {/* MEMBERS */}
          <div className="members">
            {(members || []).map((m) => (
              <button
                key={m.id}
                type="button"
                className={`member ${
                  (form.assignees || []).includes(m.id)
                    ? 'active'
                    : ''
                }`}
                onClick={() => toggleMember(m.id)}
              >
                {m.name}
              </button>
            ))}
          </div>
        </div>

        {/* ACTIONS */}
        <div className="modal-actions">

          {!isNew && onDelete && (
            <button
              className="danger"
              onClick={() => task?.id && onDelete(task.id)}
            >
              Delete
            </button>
          )}

          <button onClick={onClose}>Cancel</button>

          <button
            className="primary"
            onClick={() => onSave(form)}
          >
            {isNew ? 'Create' : 'Save'}
          </button>
        </div>

      </div>
    </div>
  );
}