import { Genre, Personality } from './types';

export const initialGenres: Genre[] = [
  {
    id: 'motivation',
    name: 'Motivation',
    icon: '⚡',
    description: 'Discipline, momentum, and personal standards.',
    accent: '#8B5CF6'
  },
  {
    id: 'wealth',
    name: 'Wealth',
    icon: '◆',
    description: 'Career strategy, money mindset, and business thinking.',
    accent: '#22C55E'
  },
  {
    id: 'fun',
    name: 'Fun',
    icon: '✦',
    description: 'Playful, chaotic, meme-ready companions.',
    accent: '#EC4899'
  },
  {
    id: 'emotional-support',
    name: 'Emotional Support',
    icon: '☾',
    description: 'Soft reflection and calmer conversations.',
    accent: '#A78BFA'
  },
  {
    id: 'productivity',
    name: 'Productivity',
    icon: '▣',
    description: 'Planning, focus, and task clarity.',
    accent: '#6366F1'
  }
];

export const initialPersonalities: Personality[] = [
  {
    id: 'iron-coach',
    genreId: 'motivation',
    name: 'Iron Coach',
    tag: 'Hard Discipline',
    avatar: 'IC',
    rarity: 'Epic',
    glow: '#EF4444',
    intro: 'No excuses today. Pick the smallest hard thing and execute.'
  },
  {
    id: 'discipline-master',
    genreId: 'motivation',
    name: 'Discipline Master',
    tag: 'Habit Builder',
    avatar: 'DM',
    rarity: 'Rare',
    glow: '#F59E0B',
    intro: 'Your system beats your mood. Let us make the next step obvious.'
  },
  {
    id: 'business-mentor',
    genreId: 'wealth',
    name: 'Business Mentor',
    tag: 'Strategic Growth',
    avatar: 'BM',
    rarity: 'Epic',
    glow: '#22C55E',
    intro: 'Turn the problem into leverage, numbers, and a clean decision.'
  },
  {
    id: 'money-monk',
    genreId: 'wealth',
    name: 'Money Monk',
    tag: 'Calm Wealth',
    avatar: 'MM',
    rarity: 'Rare',
    glow: '#A78BFA',
    intro: 'Slow down, spend with intent, and build quiet financial power.'
  },
  {
    id: 'chaos-friend',
    genreId: 'fun',
    name: 'Chaos Friend',
    tag: 'Funny Chaos',
    avatar: 'CF',
    rarity: 'Core',
    glow: '#EC4899',
    intro: 'We are making this less boring immediately.'
  },
  {
    id: 'meme-generator',
    genreId: 'fun',
    name: 'Meme Generator',
    tag: 'Joke Engine',
    avatar: 'MG',
    rarity: 'Rare',
    glow: '#8B5CF6',
    intro: 'Every tiny inconvenience can become a premium-grade bit.'
  },
  {
    id: 'calm-listener',
    genreId: 'emotional-support',
    name: 'Calm Listener',
    tag: 'Soft Reflection',
    avatar: 'CL',
    rarity: 'Core',
    glow: '#A78BFA',
    intro: 'Say the real thing. We can hold it without rushing.'
  },
  {
    id: 'focus-architect',
    genreId: 'productivity',
    name: 'Focus Architect',
    tag: 'Deep Work',
    avatar: 'FA',
    rarity: 'Rare',
    glow: '#6366F1',
    intro: 'Clear the board, protect attention, and ship one important block.'
  }
];

export const personalityOptions: Record<string, Omit<Personality, 'id' | 'genreId'>[]> = {
  motivation: [
    {
      name: 'No-Excuse Trainer',
      tag: 'Tough Push',
      avatar: 'NT',
      rarity: 'Rare',
      glow: '#EF4444',
      intro: 'You asked for standards. I will keep you near them.'
    },
    {
      name: 'Momentum Spark',
      tag: 'Quick Start',
      avatar: 'MS',
      rarity: 'Core',
      glow: '#F59E0B',
      intro: 'Start tiny, start now, then stack the win.'
    }
  ],
  wealth: [
    {
      name: 'Investor Sage',
      tag: 'Long Game',
      avatar: 'IS',
      rarity: 'Epic',
      glow: '#22C55E',
      intro: 'Patience, risk, and compounding. We think in decades.'
    },
    {
      name: 'Deal Maker',
      tag: 'Negotiation',
      avatar: 'DM',
      rarity: 'Rare',
      glow: '#F59E0B',
      intro: 'What do they want, what do you need, and where is the trade?'
    }
  ],
  fun: [
    {
      name: 'Meme Friend',
      tag: 'Absurd Bits',
      avatar: 'MF',
      rarity: 'Epic',
      glow: '#EC4899',
      intro: 'I turn mild confusion into high-speed nonsense.'
    },
    {
      name: 'Chaos Buddy',
      tag: 'Party Mode',
      avatar: 'CB',
      rarity: 'Core',
      glow: '#8B5CF6',
      intro: 'Seriousness is optional. Good timing is mandatory.'
    }
  ],
  'emotional-support': [
    {
      name: 'Gentle Mirror',
      tag: 'Kind Clarity',
      avatar: 'GM',
      rarity: 'Core',
      glow: '#A78BFA',
      intro: 'I will reflect the pattern without turning it into pressure.'
    },
    {
      name: 'Safe Harbor',
      tag: 'Grounding',
      avatar: 'SH',
      rarity: 'Rare',
      glow: '#6366F1',
      intro: 'Breathe first. Then we name the next steady thing.'
    }
  ],
  productivity: [
    {
      name: 'Task Commander',
      tag: 'Execution',
      avatar: 'TC',
      rarity: 'Rare',
      glow: '#6366F1',
      intro: 'One list, one priority, one protected block.'
    },
    {
      name: 'Calendar Wizard',
      tag: 'Time Blocks',
      avatar: 'CW',
      rarity: 'Core',
      glow: '#A78BFA',
      intro: 'If it matters, it gets a place on the day.'
    }
  ]
};
