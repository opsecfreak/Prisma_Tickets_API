'use client';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const [agents, setAgents] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    fetch('/api/agents').then(res => res.json()).then(setAgents);
  }, []);

  const addAgent = async () => {
    await fetch('/api/agents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email }),
    });

    const refreshed = await fetch('/api/agents').then(res => res.json());
    setAgents(refreshed);
  };

  return (
    <main style={{ padding: 20 }}>
      <h1>Agent Manager</h1>
      <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <button onClick={addAgent}>Add Agent</button>
      <ul>
        {agents.map((a: any) => (
          <li key={a.id}>{a.name} - {a.email}</li>
        ))}
      </ul>
    </main>
  );
}
