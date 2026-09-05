import { useState } from 'react';
import Profile from './pages/Profile';

// Minimal demo user until the login screen is wired up end-to-end.
const DEMO_USER = { name: 'Vecino de El Montmell', email: 'vecino@elmontmell.cat' };

export default function App() {
  const [user] = useState(DEMO_USER);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-700 p-4 text-white shadow">
        <h1 className="text-lg font-bold">El Montmell Connect</h1>
      </header>
      <main>
        <Profile user={user} />
      </main>
    </div>
  );
}
