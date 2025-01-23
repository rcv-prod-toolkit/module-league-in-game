import { EventType, MobType } from './InGameEvent'

export interface InGameState {
  gameTime: number
  currentPlayer: string
  showLeaderBoard: 'xp' | 'gold' | false
  scoreboard: boolean
  targetFrameCover: boolean
  towers: {
    100: TowerState
    200: TowerState
  }
  platings: {
    showPlatings: boolean
    100: PlatingState
    200: PlatingState
  }
  showInhibitors: 100 | 200 | 300 | null
  inhibitors: {
    100: InhibitorState
    200: InhibitorState
  }
  player: PlayerType[]
  gold: {
    100: number
    200: number
  }
  kills: {
    100: number
    200: number
  }
  goldGraph: {
    [t: number]: number
  }
  objectives: {
    100: Objective[]
    200: Objective[]
  }
}

export interface PlayerType {
  riotIdGameName: string
  nickname: string
  level: number
  experience: number
  currentGold: number
  totalGold: number
  items: Set<number>
  championName: string
  championId: string
  championKey: number
  team: 100 | 200
  isDead: boolean
}

export interface Objective {
  type: EventType
  mob: MobType
  time: number
}

export interface TowerState {
  L2: {
    [turret: string]: boolean
  }
  L1: {
    [turret: string]: boolean
  }
  L0: {
    [turret: string]: boolean
  }
}

export interface PlatingState {
  L2: number
  L1: number
  L0: number
}

export interface InhibitorState {
  L2: {
    alive: boolean
    respawnIn: number
    respawnAt: number
    percent: number
    time: number
  }
  L1: {
    alive: boolean
    respawnIn: number
    respawnAt: number
    percent: number
    time: number
  }
  L0: {
    alive: boolean
    respawnIn: number
    respawnAt: number
    percent: number
    time: number
  }
}
