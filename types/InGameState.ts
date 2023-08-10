import { EventType, MobType } from './InGameEvent'

export interface InGameState {
  gameTime: number
  showLeaderBoard: 'xp' | 'gold' | false
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
  summonerName: string
  nickname: string
  level: number
  kills: number
  deaths: number
  assists: number
  creepScore: number
  experience: number
  currentGold: number
  totalGold: number
  items: Set<number>
  championName: string
  championId: string
  championKey: number
  alive: boolean
  team: 100 | 200
}

export interface Objective {
  type: EventType
  mob: MobType
  time: number
}

export interface TowerState {
  L: {
    [turret: string]: boolean
  }
  C: {
    [turret: string]: boolean
  }
  R: {
    [turret: string]: boolean
  }
}

export interface PlatingState {
  L: number
  C: number
  R: number
}

export interface InhibitorState {
  L1: {
    alive: boolean
    respawnIn: number
    respawnAt: number
    percent: number
    time: number
  }
  C1: {
    alive: boolean
    respawnIn: number
    respawnAt: number
    percent: number
    time: number
  }
  R1: {
    alive: boolean
    respawnIn: number
    respawnAt: number
    percent: number
    time: number
  }
}
