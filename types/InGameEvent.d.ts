export type InGameEvent = {
    eventname: EventType
    other: MobType,
    otherTeam: TeamType.Neutral
    source: string
    sourceID: number
    sourceTeam: TeamType
} | {
  eventname: EventType.StructureKill
  other: StructureType
  otherTeam: TeamType
  source: string
  sourceID: number
  sourceTeam: TeamType
}

export const enum EventType {
  DragonKill = 'OnKillDragon_Spectator',
  HeraldKill = 'OnKillRiftHerald_Spectator',
  BaronKill = 'OnKillWorm_Spectator',
  StructureKill = 'OnStructureKill',
  HeraldSummon = 'OnSummonRiftHerald'
}

export const enum MobType {
  HextechDragon = 'SRU_Dragon_Hextech',
  ChemtechDragon = 'SRU_Dragon_Chemtech',
  CloudDragon = 'SRU_Dragon_Air',
  ElderDragon = 'SRU_Dragon_Elder',
  InfernalDragon = 'SRU_Dragon_Fire',
  OceanDragon = 'SRU_Dragon_Water',
  MountainDragon = 'SRU_Dragon_Earth'
}

export const enum StructureType {
  
}

export const enum TeamType {
  Neutral = 'Neutral',
  Order = 'Order',
  Chaos = 'Chaos'
}