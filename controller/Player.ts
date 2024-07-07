import { PlayerType } from "../types/InGameState";

export class Player implements PlayerType {
  riotIdGameName: string
  nickname: string = ''
  level: number = 0
  experience: number = 0
  currentGold: number = 0
  totalGold: number = 0
  items: Set<number> = new Set()
  championName: string
  championId: string
  championKey: number
  team: 100 | 200

  constructor(riotIdGameName: string, team: 'ORDER' | 'CHAOS', championName: string, championId: string, championKey: number) {
    this.riotIdGameName = riotIdGameName
    this.championName = championName
    this.championId = championId
    this.championKey = championKey
    this.team = team === 'ORDER' ? 100 : 200
  }

  addItem (item: number): Set<number> {
    return this.items.add(item)
  }

  removeItem (item: number): Set<number> {
    this.items.delete(item)
    return this.items
  }

  updateItems (items: number[]): Set<number> {
    return this.items = new Set(items)
  }
}