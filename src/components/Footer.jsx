import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-[#1A1410] text-white mt-auto">
      <div className="px-8 md:px-20 py-16 max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Colonne 1 — Logo + tagline */}
          <div className="flex flex-col gap-4">
            <span className="text-[22px] font-black tracking-tight leading-none">
              <span className="text-white">Skill</span>
              <span className="text-[#C8864B]">Bridge</span>
            </span>
            <p className="text-[13px] text-[#9A8E7E] leading-[1.7] max-w-[200px]">
              Partager ce qu'on sait.<br />Apprendre ce qu'on aime.
            </p>
          </div>

          {/* Colonne 2 — Navigation */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[1px] text-[#C8864B] mb-4">Navigation</p>
            <ul className="flex flex-col gap-3 list-none p-0 m-0">
              {[
                { to: '/connection', label: 'Connexion' },
                { to: '/feed',       label: 'Feed' },
                { to: '/sessions',   label: 'Sessions' },
                { to: '/chat',       label: 'Chat' },
                { to: '/profile',    label: 'Profil' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-[13px] text-[#9A8E7E] hover:text-white transition-colors no-underline">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Colonne 3 — Légal */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[1px] text-[#C8864B] mb-4">Légal</p>
            <ul className="flex flex-col gap-3 list-none p-0 m-0">
              {[
                { to: '/mentions-legales',          label: 'Mentions légales' },
                { to: '/politique-confidentialite', label: 'Politique de confidentialité' },
                { to: '/cgu',                       label: 'CGU' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-[13px] text-[#9A8E7E] hover:text-white transition-colors no-underline">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Colonne 4 — Équipe */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[1px] text-[#C8864B] mb-4">Équipe</p>
            <p className="text-[13px] text-[#9A8E7E] leading-[1.7]">Projet HETIC Fast Tracks 2026</p>
            <div className="flex flex-wrap gap-2 mt-3">
              {['Jimel', 'Yanis', 'Mahamane', 'Yahia'].map(name => (
                <span key={name} className="px-3 py-[5px] rounded-full bg-white/[0.06] text-[12px] text-[#C8C0B4] font-medium border border-white/[0.08]">
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bas */}
        <div className="border-t border-white/[0.08] mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[12px] text-[#6A5E50]">© 2026 SkillBridge — Tous droits réservés</p>
          <p className="text-[11px] text-[#6A5E50]">Fait avec passion à Paris</p>
        </div>
      </div>
    </footer>
  )
}