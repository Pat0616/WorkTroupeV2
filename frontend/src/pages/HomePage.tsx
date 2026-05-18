import { useState } from 'react';
import Layout from '../components/Layout';
import './home.css';

function GroupCard({
  group,
  onClick,
}: {
  group: any;
  onClick: () => void;
}) {
  return (
    <div className="group-card" onClick={onClick}>
      <div className="group-top-accent" />

      <div className="group-title">
        {group.name}
      </div>

      <div className="group-meta">
        <div>👤 {group.leader}</div>

        <div
          className={`role-badge ${
            group.role === 'leader'
              ? 'leader'
              : 'member'
          }`}
        >
          {group.role === 'leader'
            ? '⭐ Leader'
            : '👥 Member'}
        </div>
      </div>

      <div className="group-code">
        Code <span>{group.code}</span>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [groups] = useState([
    {
      id: 1,
      name: 'Design Team Alpha',
      leader: 'Juan Dela Cruz',
      role: 'leader',
      code: 'AB12CD',
    },
    {
      id: 2,
      name: 'Frontend Squad',
      leader: 'Maria Santos',
      role: 'member',
      code: 'XY99ZZ',
    },
    {
      id: 3,
      name: 'Project Builders',
      leader: 'Alex Rivera',
      role: 'member',
      code: 'LM44PQ',
    },
  ]);

  const [showCreate, setShowCreate] =
    useState(false);

  const [showJoin, setShowJoin] =
    useState(false);

  return (
    <Layout>
      <div className="home-page">

        {/* HEADER */}
        <div className="home-header">

          <div>

            <div className="home-badge">
              ✦ Workspace Overview
            </div>

            <h1>
              Welcome back 👋
            </h1>

            <p>
              Manage your groups, collaborate,
              and track progress in one place.
            </p>

          </div>

          <div className="home-actions">

            <button
              className="btn-glass"
              onClick={() => {
                setShowJoin(!showJoin);
                setShowCreate(false);
              }}
            >
              🔗 Join Group
            </button>

            <button
              className="btn-primary"
              onClick={() => {
                setShowCreate(!showCreate);
                setShowJoin(false);
              }}
            >
              ➕ New Group
            </button>

          </div>

        </div>

        {/* CREATE / JOIN CARDS */}
        {showCreate && (
          <div className="action-card">

            <h3>Create New Group</h3>

            <div className="action-row">

              <input
                placeholder="Group name"
              />

              <button className="btn-primary">
                Create
              </button>

            </div>

          </div>
        )}

        {showJoin && (
          <div className="action-card">

            <h3>Join Group</h3>

            <div className="action-row">

              <input
                placeholder="Invite code"
              />

              <button className="btn-accent">
                Join
              </button>

            </div>

          </div>
        )}

        {/* EMPTY STATE */}
        {groups.length === 0 ? (
          <div className="empty-state">
            <div className="emoji">👥</div>
            <h2>No groups yet</h2>
            <p>
              Create or join a group to get
              started.
            </p>
          </div>
        ) : (
          <div className="group-grid">

            {groups.map((g) => (
              <GroupCard
                key={g.id}
                group={g}
                onClick={() =>
                  alert(`Open group ${g.id}`)
                }
              />
            ))}

          </div>
        )}

      </div>
    </Layout>
  );
}