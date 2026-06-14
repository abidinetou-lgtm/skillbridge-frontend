const PaletteSvg = ({ color }) => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M40 8C22 8 8 22 8 40s12 32 32 32c5 0 8-4 5-9-2-6 1-11 7-11h8c8 0 12-5 12-12C72 22 58 8 40 8z"
      fill={color} fillOpacity=".35" stroke={color} strokeWidth="3" strokeLinejoin="round"/>
    <circle cx="24" cy="30" r="4" fill={color}/>
    <circle cx="38" cy="20" r="4" fill={color} fillOpacity=".7"/>
    <circle cx="52" cy="28" r="4" fill={color} fillOpacity=".5"/>
    <circle cx="56" cy="44" r="4" fill={color} fillOpacity=".4"/>
  </svg>
)

const BookSvg = ({ color }) => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 18c10-5 22-5 28 0v44c-6-5-18-5-28 0V18z" fill={color} fillOpacity=".4"/>
    <path d="M68 18c-10-5-22-5-28 0v44c6-5 18-5 28 0V18z" fill={color} fillOpacity=".25"/>
    <line x1="12" y1="54" x2="40" y2="54" stroke={color} strokeWidth="2"/>
    <line x1="40" y1="54" x2="68" y2="54" stroke={color} strokeWidth="2"/>
  </svg>
)

const CakeSvg = ({ color }) => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="12" y="46" width="56" height="22" rx="4" fill={color} fillOpacity=".35"/>
    <rect x="20" y="32" width="40" height="16" rx="3" fill={color} fillOpacity=".25"/>
    <path d="M28 32c0-6 4-10 4-14" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M40 32c0-6 4-10 4-14" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M52 32c0-6 4-10 4-14" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
    <circle cx="32" cy="17" r="3.5" fill={color}/>
    <circle cx="44" cy="17" r="3.5" fill={color}/>
    <circle cx="56" cy="17" r="3.5" fill={color}/>
  </svg>
)

const CameraSvg = ({ color }) => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 28a4 4 0 014-4h8l6-8h28l6 8h8a4 4 0 014 4v32a4 4 0 01-4 4H12a4 4 0 01-4-4V28z"
      fill={color} fillOpacity=".3" stroke={color} strokeWidth="3"/>
    <circle cx="40" cy="44" r="12" stroke={color} strokeWidth="3"/>
    <circle cx="40" cy="44" r="6" fill={color} fillOpacity=".4"/>
    <circle cx="58" cy="32" r="3" fill={color} fillOpacity=".5"/>
  </svg>
)

const NoteSvg = ({ color }) => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M34 14h28v12c0 4-4 6-10 6s-10-2-10-6v26a10 10 0 1 1-8-10V14z"
      fill={color} fillOpacity=".4" stroke={color} strokeWidth="2.5" strokeLinejoin="round"/>
  </svg>
)

const StarSvg = ({ color }) => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M40 8l8 22 24 2-18 16 6 24-20-13-20 13 6-24-18-16 24-2 8-22z"
      fill={color} fillOpacity=".45" stroke={color} strokeWidth="2" strokeLinejoin="round"/>
  </svg>
)

const ITEMS = [
  { Svg: PaletteSvg, color: '#9B7EC8',  top: '4%',    left: '3%',   size: 100, rot: '-12deg' },
  { Svg: BookSvg,    color: '#D98E4A',  top: '3%',    right: '4%',  size: 94,  rot: '10deg'  },
  { Svg: StarSvg,    color: '#C86B6B',  top: '30%',   left: '4%',   size: 84,  rot: '-18deg' },
  { Svg: CakeSvg,    color: '#4E9B7A',  top: '34%',   right: '3%',  size: 92,  rot: '8deg'   },
  { Svg: CameraSvg,  color: '#4A8FBF',  bottom: '18%',left: '3%',   size: 96,  rot: '-8deg'  },
  { Svg: NoteSvg,    color: '#C8A84A',  bottom: '5%', right: '5%',  size: 86,  rot: '14deg'  },
]

export default function ChatBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden select-none">
      {ITEMS.map((item, i) => {
        const style = {
          position: 'absolute',
          width: item.size,
          height: item.size,
          opacity: 0.12,
          transform: `rotate(${item.rot})`,
        }
        if (item.top)    style.top    = item.top
        if (item.bottom) style.bottom = item.bottom
        if (item.left)   style.left   = item.left
        if (item.right)  style.right  = item.right
        return (
          <div key={i} style={style}>
            <item.Svg color={item.color} />
          </div>
        )
      })}
    </div>
  )
}
