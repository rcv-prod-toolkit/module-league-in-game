export type InGameEvent =
  | {
      eventname: EventType
      other: MobType
      otherTeam: TeamType.Neutral
      source: string
      sourceID: number
      sourceTeam: TeamType
    }
  | {
      eventname: EventType.StructureKill | EventType.TurretPlateDestroyed
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
  TurretPlateDestroyed = 'OnTurretPlateDestroyed',
  HeraldSummon = 'OnSummonRiftHerald'
}

export const enum MobType {
  HextechDragon = 'SRU_Dragon_Hextech',
  ChemtechDragon = 'SRU_Dragon_Chemtech',
  CloudDragon = 'SRU_Dragon_Air',
  ElderDragon = 'SRU_Dragon_Elder',
  InfernalDragon = 'SRU_Dragon_Fire',
  OceanDragon = 'SRU_Dragon_Water',
  MountainDragon = 'SRU_Dragon_Earth',
  Herald = 'SRU_Herald',
  Baron = 'SRU_Baron'
}

export const enum StructureType {
  Turret_T2_R_03_A = 'Turret_T2_R_03_A',
  Turret_T2_C_03_A = 'Turret_T2_C_03_A',
  Turret_T2_L_03_A = 'Turret_T2_L_03_A'
}

export const enum TeamType {
  Neutral = 'Neutral',
  Order = 'Order',
  Chaos = 'Chaos'
}
