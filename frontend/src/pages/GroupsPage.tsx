// GroupPage.tsx

import { useState } from 'react';
import Layout from '../components/Layout';
import TaskModal from '../components/Modal';
import './groups.css';

const STATUS = [
  { key: 'todo', label: 'To Do', emoji: '📋' },
  { key: 'progress', label: 'In Progress', emoji: '⚡' },
  { key: 'done', label: 'Done', emoji: '✅' },
];

const MOCK_GROUP = {
  name: 'Frontend Squad',
  code: 'AB12CD',
};

const MOCK_MEMBERS = [
  { id: 1, name: 'Juan Dela Cruz', email: 'juan@mail.com', role: 'leader' },
  { id: 2, name: 'Maria Santos', email: 'maria@mail.com', role: 'member' },
  { id: 3, name: 'Alex Rivera', email: 'alex@mail.com', role: 'member' },
];

const MOCK_TASKS = [
  {
    id: 1,
    title: 'Design Landing Page UI',
    description: 'Create responsive homepage layout',
    status: 'todo',
    priority: 'High',
    due: '2026-05-25',
    assignees: [1, 2],
  },
  {
    id: 2,
    title: 'Setup API Integration',
    description: 'Connect frontend to backend API',
    status: 'progress',
    priority: 'Medium',
    due: '2026-05-20',
    assignees: [2],
  },
  {
    id: 3,
    title: 'Fix Responsive Bugs',
    description: 'Resolve mobile layout issues',
    status: 'done',
    priority: 'Low',
    due: '2026-05-10',
    assignees: [3],
  },
];

function PriorityBadge({ value }: { value: string }) {
  return (
    <span className={`priority ${value.toLowerCase()}`}>
      {value}
    </span>
  );
}

/* =========================
   TASK CARD
========================= */
function TaskCard({
  task,
  onClick,
}: {
  task: any;
  onClick: (task: any) => void;
}) {
  return (
    <div className="task-card" onClick={() => onClick(task)}>
      <div className="task-title">{task.title}</div>

      <div className="task-meta">
        <PriorityBadge value={task.priority} />
        <span className="task-date">📅 {task.due}</span>
      </div>
    </div>
  );
}

/* =========================
   KANBAN COLUMN
========================= */
function KanbanColumn({
  title,
  emoji,
  tasks,
  onTaskClick,
}: {
  title: string;
  emoji: string;
  tasks: any[];
  onTaskClick: (task: any) => void;
}) {
  return (
    <div className="kanban-col">
      <div className="kanban-header">
        <span>{emoji}</span>
        <h3>{title}</h3>
        <span className="count">{tasks.length}</span>
      </div>

      <div className="kanban-body">
        {tasks.length === 0 ? (
          <div className="empty-col">No tasks</div>
        ) : (
          tasks.map((t) => (
            <TaskCard
              key={t.id}
              task={t}
              onClick={onTaskClick}
            />
          ))
        )}
      </div>
    </div>
  );
}

/* =========================
   MEMBERS
========================= */
function MembersPanel() {
  return (
    <div className="members">
      {MOCK_MEMBERS.map((m) => (
        <div key={m.id} className="member-card">
          <div className="avatar">
            {m.name.charAt(0)}
          </div>

          <div>
            <div className="member-name">{m.name}</div>
            <div className="member-email">{m.email}</div>
          </div>

          <div className={`role ${m.role}`}>
            {m.role}
          </div>
        </div>
      ))}
    </div>
  );
}

/* =========================
   DASHBOARD
========================= */
function Dashboard() {
  return (
    <div className="dashboard">
      <div className="stat-grid">
        <div className="stat">
          <h3>12</h3>
          <p>Total Tasks</p>
        </div>

        <div className="stat green">
          <h3>5</h3>
          <p>Done</p>
        </div>

        <div className="stat amber">
          <h3>4</h3>
          <p>In Progress</p>
        </div>

        <div className="stat red">
          <h3>3</h3>
          <p>Overdue</p>
        </div>
      </div>

      <div className="progress-bar">
        <div className="progress-fill" />
      </div>
    </div>
  );
}

/* =========================
   MAIN PAGE
========================= */
export default function GroupPage() {
  const [tab, setTab] = useState<
    'board' | 'dashboard' | 'members'
  >('board');

  const [tasks] = useState(MOCK_TASKS);

  // undefined = CLOSED
  // null = ADD TASK
  // object = VIEW TASK
  const [modalTask, setModalTask] =
    useState<any | null | undefined>(undefined);

  const filtered = (status: string) =>
    tasks.filter((t) => t.status === status);

  return (
    <Layout>
      <div className="group-page">

        {/* HEADER */}
        <div className="group-header">
          <div>
            <button className="back-btn">
              ← Groups
            </button>

            <h1>{MOCK_GROUP.name}</h1>

            <p>
              Invite Code: <span>{MOCK_GROUP.code}</span>
            </p>
          </div>

          {/* OPEN ADD TASK MODAL */}
          <button
            className="primary-btn"
            onClick={() => setModalTask(null)}
          >
            ➕ Add Task
          </button>
        </div>

        {/* TABS */}
        <div className="tabs">
          <button
            className={tab === 'board' ? 'active' : ''}
            onClick={() => setTab('board')}
          >
            🗂 Board
          </button>

          <button
            className={tab === 'dashboard' ? 'active' : ''}
            onClick={() => setTab('dashboard')}
          >
            📊 Dashboard
          </button>

          <button
            className={tab === 'members' ? 'active' : ''}
            onClick={() => setTab('members')}
          >
            👥 Members
          </button>
        </div>

        {/* CONTENT */}
        {tab === 'board' && (
          <div className="kanban">
            {STATUS.map((s) => (
              <KanbanColumn
                key={s.key}
                title={s.label}
                emoji={s.emoji}
                tasks={filtered(s.key)}
                onTaskClick={(task) =>
                  setModalTask(task)
                }
              />
            ))}
          </div>
        )}

        {tab === 'dashboard' && <Dashboard />}

        {tab === 'members' && <MembersPanel />}
      </div>

      {/* MODAL */}
      {modalTask !== undefined && (
        <TaskModal
          task={modalTask}
          members={MOCK_MEMBERS}
          onClose={() => setModalTask(undefined)}
          onSave={(task) => {
            console.log('Saved:', task);
            setModalTask(undefined);
          }}
          onDelete={(id) => {
            console.log('Delete:', id);
            setModalTask(undefined);
          }}
        />
      )}
    </Layout>
  );
}