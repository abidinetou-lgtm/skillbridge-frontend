// src/pages/SessionsDashboard.jsx
import { useState, useEffect } from 'react';
import SessionCard from '../components/sessions/SessionCard';

export default function SessionsDashboard() {
  const [activeTab, setActiveTab] = useState('to-learn'); // 'to-learn' ou 'to-teach'
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    // TODO: Remplacer par ton appel API (ex: fetch('/api/sessions'))
    const mockSessions = [
      {
        id: "sess_01",
        title: "Perfectionnement React & Architecture Pro",
        category: "Développement Web",
        teacher: { name: "Alexandre (Prof)", id: "u_teacher" },
        student: { name: "Toi (Élève)", id: "u_student" },
        date: "2026-05-22T14:00:00.000Z",
        estimatedDuration: 60,
        pricePerMin: 2.5,
        status: "scheduled" // scheduled, active, completed
      }
    ];
    setSessions(mockSessions);
  }, []);

  const filteredSessions = sessions.filter(session => {
    // Simulation : ID utilisateur actuel = 'u_student'
    if (activeTab === 'to-learn') return session.student.id === 'u_student';
    return session.teacher.id === 'u_student';
  });

  return (
    <div className="min-h-screen bg-[#1a1c2e] text-white p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-black tracking-tight">Mon Espace Cours</h1>
          <p className="text-white/60 text-sm mt-1">Gère tes sessions individuelles et tes salons d'apprentissage.</p>
        </header>

        {/* Onglets style SaaS */}
        <div className="flex border-b border-white/10 mb-8 gap-2">
          <button
            onClick={() => setActiveTab('to-learn')}
            className={`pb-4 px-4 font-semibold text-sm transition-all border-b-2 ${
              activeTab === 'to-learn' ? 'border-amber-400 text-amber-400' : 'border-transparent text-white/50 hover:text-white'
            }`}
          >
            📖 Mes cours à suivre
          </button>
          <button
            onClick={() => setActiveTab('to-teach')}
            className={`pb-4 px-4 font-semibold text-sm transition-all border-b-2 ${
              activeTab === 'to-teach' ? 'border-transparent text-white/50 hover:text-white' : 'border-amber-400 text-amber-400' // Inverser logique selon activeTab
            }`}
          >
            👨‍🏫 Mes cours à donner
          </button>
        </div>

        {/* Grille de Sessions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSessions.map(session => (
            <SessionCard key={session.id} session={session} role={activeTab} />
          ))}
          {filteredSessions.length === 0 && (
            <p className="text-white/40 text-sm col-span-full py-12 text-center bg-[#212338] rounded-xl border border-dashed border-white/10">
              Aucun cours prévu dans cette catégorie pour le moment.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}