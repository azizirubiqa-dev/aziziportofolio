// Data bawaan Toolkit & Process. Dipakai situs bila tabel Supabase kosong, dan sebagai "data awal" di admin.
export const DEFAULT_TOOLS = [
  { name: 'CapCut', icon_url: './Asset/svg/cc.svg' },
  { name: 'Premiere Pro', icon_url: './Asset/svg/pr.svg' },
  { name: 'After Effects', icon_url: './Asset/svg/ae.svg' },
  { name: 'Affinity by Canva', icon_url: './Asset/img/tools/tool-green.png' },
];
export const DEFAULT_STEPS = [
  { title: 'Idea', description: 'Listening to your story. Defining the message, the visual direction, and the feeling to carry.', tags: 'Brief, References' },
  { title: 'Plan', description: 'Developing the concept, references, and a workflow that fits what the production needs.', tags: 'Storyboard, Workflow' },
  { title: 'Craft', description: 'Editing, compositing, and visual effects. Shaping every detail into one story.', tags: 'Editing, VFX' },
  { title: 'Polish', description: 'Aligning color, rhythm, and sound. Making sure every frame does its job.', tags: 'Color, Sound' },
  { title: 'Final frame', description: 'Review together, final touches, then a result ready to meet its audience.', tags: 'Review, Delivery' },
];
export const splitTags = v => (Array.isArray(v) ? v : String(v || '').split(',')).map(t => t.trim()).filter(Boolean);

export const DEFAULT_CLIENTS = [
  { name: 'Vizard', logo_url: './Asset/img/clients/vizard.png', dark_chip: '' },
  { name: 'Agent Opus', logo_url: './Asset/img/clients/agent-opus.png', dark_chip: '' },
  { name: 'Twizl', logo_url: './Asset/img/clients/twizl.png', dark_chip: '' },
  { name: 'CIMB Niaga Syariah', logo_url: './Asset/img/clients/cimb-niaga-syariah.png', dark_chip: '' },
  { name: 'Trends by Masterhooks', logo_url: './Asset/img/clients/trends-masterhooks.png', dark_chip: 'light' },
];
