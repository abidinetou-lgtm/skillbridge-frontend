// AvailabilityGrid — Grille de disponibilité hebdomadaire (lecture seule)
const DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
const SLOTS = ['Matin', 'Après-midi', 'Soir']

export default function AvailabilityGrid({ availability = {} }) {
  const hasAny = Object.values(availability).some(slots => slots.some(Boolean))

  if (!hasAny) {
    return (
      <p className="text-[13px] text-[#7A6E5C] italic">
        Disponibilités à confirmer via le chat.
      </p>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-[11px]">
        <thead>
          <tr>
            <th className="text-left text-[#7A6E5C] font-semibold pb-2 pr-3 w-[70px]"></th>
            {SLOTS.map(slot => (
              <th key={slot} className="text-center text-[#7A6E5C] font-semibold pb-2 px-1 min-w-[56px]">
                {slot}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {DAYS.map(day => {
            const slots = availability[day] ?? [false, false, false]
            const anyAvail = slots.some(Boolean)
            return (
              <tr key={day}>
                <td className={`text-[12px] font-bold py-[5px] pr-3 ${anyAvail ? 'text-[#1A1410]' : 'text-[#C0B8AC]'}`}>
                  {day}
                </td>
                {slots.map((avail, i) => (
                  <td key={i} className="px-1 py-[5px] text-center">
                    <div
                      className={`mx-auto w-[48px] h-[22px] rounded-md text-[10px] font-bold flex items-center justify-center transition-colors
                        ${avail
                          ? 'bg-[#E4EED8] text-[#3D5C28]'
                          : 'bg-[#F5F3EE] text-[#C0B8AC]'
                        }`}
                    >
                      {avail ? 'Dispo' : '—'}
                    </div>
                  </td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}