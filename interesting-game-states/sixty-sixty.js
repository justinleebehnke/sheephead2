const playersAndSeedThatLedToA60Game = [
  {
    name: 'hostNewGame',
    params: {
      hostId: '11068930-7a28-4047-8923-1de932affafb',
      hostName: 'Justin',
    },
  },
  {
    name: 'addPlayer',
    params: {
      hostId: '11068930-7a28-4047-8923-1de932affafb',
      playerId: 'aff38c70-1ea4-48fc-8def-c59f73bcabf1',
      playerName: 'Private',
    },
  },
  {
    name: 'addPlayer',
    params: {
      hostId: '11068930-7a28-4047-8923-1de932affafb',
      playerId: 'bc5ed297-8bcb-4b34-870c-86a3f7b8f140',
      playerName: 'Fire',
    },
  },
  {
    name: 'addPlayer',
    params: {
      hostId: '11068930-7a28-4047-8923-1de932affafb',
      playerId: '6c4640f4-432b-4c36-8e92-5ad504bcd0dc',
      playerName: 'Inogn',
    },
  },
  {
    name: 'startGame',
    params: {
      hostId: '11068930-7a28-4047-8923-1de932affafb',
      shuffleSeed: 1675642421969,
      firstDealerIndex: 0,
    },
  },
]

const commandsThatLeadToA60Game = [
  {
    name: 'pass',
    params: null,
  },
  {
    name: 'pass',
    params: null,
  },
  {
    name: 'pass',
    params: null,
  },
  {
    name: 'pick',
    params: null,
  },
  {
    name: 'bury',
    params: {
      cards: ['ah', 'tc'],
      isGoingAlone: false,
    },
  },
  {
    name: 'play',
    params: {
      card: 'th',
    },
  },
  {
    name: 'play',
    params: {
      card: 'ts',
    },
  },
  {
    name: 'play',
    params: {
      card: 'as',
    },
  },
  {
    name: 'play',
    params: {
      card: 'kh',
    },
  },
  {
    name: 'play',
    params: {
      card: 'ks',
    },
  },
  {
    name: 'play',
    params: {
      card: 'qh',
    },
  },
  {
    name: 'play',
    params: {
      card: '9s',
    },
  },
  {
    name: 'play',
    params: {
      card: 'qs',
    },
  },
  {
    name: 'play',
    params: {
      card: '7d',
    },
  },
  {
    name: 'play',
    params: {
      card: 'ad',
    },
  },
  {
    name: 'play',
    params: {
      card: '9d',
    },
  },
  {
    name: 'play',
    params: {
      card: 'js',
    },
  },
  {
    name: 'play',
    params: {
      card: 'qc',
    },
  },
  {
    name: 'play',
    params: {
      card: 'jh',
    },
  },
  {
    name: 'play',
    params: {
      card: 'jc',
    },
  },
  {
    name: 'play',
    params: {
      card: 'qd',
    },
  },
  {
    name: 'play',
    params: {
      card: '8d',
    },
  },
  {
    name: 'play',
    params: {
      card: 'td',
    },
  },
  {
    name: 'play',
    params: {
      card: 'kd',
    },
  },
  {
    name: 'play',
    params: {
      card: 'ac',
    },
  },
  {
    name: 'play',
    params: {
      card: '9h',
    },
  },
  {
    name: 'play',
    params: {
      card: 'kc',
    },
  },
  {
    name: 'play',
    params: {
      card: '9c',
    },
  },
  {
    name: 'play',
    params: {
      card: 'jd',
    },
  },
  {
    name: 'playAgain',
    params: {},
  },
]
