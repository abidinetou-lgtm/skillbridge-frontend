export const CATEGORIES = [
  {
    key: 'all',
    label: 'Tous les membres',
    skills: [],
  },
  {
    key: 'languages',
    label: 'Langues & Communication',
    skills: ['French', 'English', 'Spanish', 'Arabic', 'Japanese', 'Chinese', 'Portuguese', 'Italian', 'German'],
  },
  {
    key: 'tech',
    label: 'Tech & Code',
    skills: ['Python', 'JavaScript', 'TypeScript', 'React', 'Node.js', 'Video editing', 'Photography', 'Data Analysis'],
  },
  {
    key: 'design',
    label: 'Design & Créativité',
    skills: ['Design', 'Figma', 'Illustration', 'Drawing', 'Painting', 'Graphic Design'],
  },
  {
    key: 'music',
    label: 'Musique & Arts',
    skills: ['Guitar', 'Piano', 'Drums', 'Singing', 'Music Theory', 'Violin', 'Bass'],
  },
  {
    key: 'science',
    label: 'Sciences & Maths',
    skills: ['Mathematics', 'Physics', 'Chemistry', 'Philosophy', 'Biology', 'Statistics'],
  },
  {
    key: 'wellness',
    label: 'Sport & Bien-être',
    skills: ['Yoga', 'Cooking', 'Chess', 'Writing', 'Meditation', 'Running', 'Swimming'],
  },
  {
    key: 'business',
    label: 'Business & Finance',
    skills: ['Business', 'Finance', 'Marketing', 'Entrepreneurship', 'Accounting', 'Sales'],
  },
]

export const SKILL_TO_CATEGORY = {}
CATEGORIES.forEach(cat => {
  cat.skills.forEach(skill => {
    SKILL_TO_CATEGORY[skill] = cat.key
  })
})