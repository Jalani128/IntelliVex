// Editable Home copy; must match StudioHomePageRequest in the API. Stats live on Our Studio, partners on the Partners page.
export const HOME_FIELDS = [
  { title: 'Hero slides', fields: Array.from({ length: 3 }, (_, i) => [
    [`hero_${i}_eyebrow`, `Slide ${i + 1} eyebrow`, 'Game development studio'],
    ...['Create.', 'Play.', 'Experience.'].map((text, n) => [`hero_${i}_line_${n}`, `Slide ${i + 1} heading line ${n + 1}`, text]),
    [`hero_${i}_text`, `Slide ${i + 1} description`, i === 2 ? '' : 'Our team consists of highly skilled professionals who have a deep understanding of the game development.'],
  ]).flat() },
  { title: 'Call to action', fields: [
    ['cta_title','Title','Turn Your Game Idea Into Reality'],
    ['cta_text','Description','Lorem ipsum dolor sit amet consectetur adipiscing elit. Mauris any nullam the as integer'],
  ] },
]
export const HOME_DEFAULTS = Object.fromEntries(HOME_FIELDS.flatMap((group) => group.fields.map(([key,,value]) => [key,value])))
export const HOME_IMAGE_SLOTS = [
  ...Array.from({length:3},(_,i) => [`hero_${i}`, `Hero slide ${i + 1}`]),
]
