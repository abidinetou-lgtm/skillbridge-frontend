const ITEMS = [
  /* ── Geometric shapes ── */
  { x: '2%',  y: '5%',  rot: -20, color: '#C8864B', opacity: 0.18, mobile: false,
    svg: <svg width="52" height="52" viewBox="0 0 52 52"><circle cx="26" cy="26" r="26" fill="currentColor"/></svg> },
  { x: '85%', y: '-8%', rot: 15,  color: '#3D5C28', opacity: 0.15, mobile: false,
    svg: <svg width="70" height="70" viewBox="0 0 70 70"><ellipse cx="35" cy="35" rx="35" ry="35" fill="currentColor"/></svg> },
  { x: '55%', y: '60%', rot: 30,  color: '#252840', opacity: 0.14, mobile: false,
    svg: <svg width="44" height="44" viewBox="0 0 44 44"><rect width="44" height="44" rx="12" fill="currentColor"/></svg> },
  { x: '30%', y: '-5%', rot: 8,   color: '#C8864B', opacity: 0.12, mobile: false,
    svg: <svg width="36" height="36" viewBox="0 0 36 36"><circle cx="18" cy="18" r="18" fill="none" stroke="currentColor" strokeWidth="6"/></svg> },
  { x: '70%', y: '50%', rot: -12, color: '#3D5C28', opacity: 0.16, mobile: false,
    svg: <svg width="40" height="46" viewBox="0 0 40 46"><polygon points="20,0 40,46 0,46" fill="currentColor"/></svg> },
  { x: '92%', y: '38%', rot: 22,  color: '#C8864B', opacity: 0.13, mobile: false,
    svg: <svg width="34" height="34" viewBox="0 0 34 34"><rect width="34" height="34" rx="17" fill="none" stroke="currentColor" strokeWidth="5"/></svg> },

  /* ── Thematic objects ── */
  { x: '6%',  y: '38%', rot: 10,  color: '#3D5C28', opacity: 0.17, mobile: false,
    /* Livre */ svg: <svg width="36" height="36" viewBox="0 0 36 36" fill="currentColor"><path d="M6 4h16a2 2 0 012 2v24a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2z"/><path d="M18 4v28" fill="none" stroke="white" strokeWidth="1.2" opacity="0.4"/><rect x="8" y="10" width="7" height="1.5" rx="0.75" fill="white" opacity="0.35"/><rect x="8" y="14" width="5" height="1.5" rx="0.75" fill="white" opacity="0.35"/></svg> },
  { x: '80%', y: '8%',  rot: -10, color: '#C8864B', opacity: 0.16, mobile: false,
    /* Guitare */ svg: <svg width="34" height="42" viewBox="0 0 34 42" fill="currentColor"><ellipse cx="17" cy="30" rx="11" ry="11"/><ellipse cx="17" cy="14" rx="6" ry="6"/><rect x="15.5" y="6" width="3" height="20" rx="1.5"/><rect x="11" y="5" width="12" height="3" rx="1.5"/></svg> },
  { x: '14%', y: '68%', rot: -8,  color: '#252840', opacity: 0.19, mobile: true,
    /* Ordinateur */ svg: <svg width="42" height="34" viewBox="0 0 42 34" fill="currentColor"><rect x="2" y="2" width="38" height="24" rx="4"/><path d="M14 30h14l-2-4H16z"/><rect x="5" y="5" width="32" height="18" rx="2" fill="white" opacity="0.15"/></svg> },
  { x: '82%', y: '60%', rot: 15,  color: '#3D5C28', opacity: 0.14, mobile: false,
    /* Note de musique */ svg: <svg width="30" height="36" viewBox="0 0 30 36" fill="currentColor"><path d="M12 4v18a6 6 0 10-1 5V8l12-4v14a6 6 0 10-1 5V0L12 4z"/></svg> },
  { x: '46%', y: '72%', rot: -5,  color: '#C8864B', opacity: 0.13, mobile: false,
    /* Pinceau */ svg: <svg width="28" height="40" viewBox="0 0 28 40" fill="currentColor"><rect x="12" y="0" width="4" height="22" rx="2"/><ellipse cx="14" cy="26" rx="6" ry="8"/><path d="M10 32 Q14 40 18 32" fill="none" stroke="currentColor" strokeWidth="2"/></svg> },
  { x: '22%', y: '10%', rot: 12,  color: '#252840', opacity: 0.15, mobile: false,
    /* Appareil photo */ svg: <svg width="40" height="30" viewBox="0 0 40 30" fill="currentColor"><rect x="2" y="8" width="36" height="20" rx="4"/><path d="M14 2h12l3 6H11z"/><circle cx="20" cy="18" r="7"/><circle cx="20" cy="18" r="4" fill="white" opacity="0.2"/></svg> },
  { x: '60%', y: '5%',  rot: -18, color: '#3D5C28', opacity: 0.16, mobile: false,
    /* Base de données */ svg: <svg width="32" height="38" viewBox="0 0 32 38" fill="currentColor"><ellipse cx="16" cy="8" rx="14" ry="6"/><path d="M2 8v22c0 3.3 6.3 6 14 6s14-2.7 14-6V8c0 3.3-6.3 6-14 6S2 11.3 2 8z"/><ellipse cx="16" cy="22" rx="14" ry="6" fill="none" stroke="white" strokeWidth="1" opacity="0.25"/></svg> },
  { x: '88%', y: '82%', rot: 8,   color: '#C8864B', opacity: 0.17, mobile: false,
    /* Danse (silhouette) */ svg: <svg width="30" height="44" viewBox="0 0 30 44" fill="currentColor"><circle cx="15" cy="5" r="5"/><path d="M8 12c1-2 3-3 7-3s6 1 7 3l3 12h-5l-2-6v18H17V24h-4v12H8V18l-2 6H1z"/><path d="M8 32l-3 10h4l2-7M22 32l3 10h-4l-2-7"/></svg> },
  { x: '5%',  y: '80%', rot: -15, color: '#3D5C28', opacity: 0.13, mobile: false,
    /* Gâteau */ svg: <svg width="38" height="36" viewBox="0 0 38 36" fill="currentColor"><rect x="4" y="18" width="30" height="16" rx="4"/><path d="M4 18 Q10 12 19 16 Q28 12 34 18"/><line x1="14" y1="2" x2="14" y2="12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/><line x1="24" y1="4" x2="24" y2="12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/><circle cx="14" cy="2" r="2" fill="currentColor"/><circle cx="24" cy="4" r="2" fill="currentColor"/></svg> },
]

export default function ProfileBackdrop() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {ITEMS.map((item, i) => (
        <div
          key={i}
          className={item.mobile ? 'block' : 'hidden sm:block'}
          style={{
            position: 'absolute',
            left: item.x,
            top: item.y,
            transform: `rotate(${item.rot}deg)`,
            color: item.color,
            opacity: item.opacity,
          }}
        >
          {item.svg}
        </div>
      ))}
    </div>
  )
}
