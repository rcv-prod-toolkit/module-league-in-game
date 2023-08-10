import { PlayerType } from "../types/InGameState";

export class Player implements PlayerType {
  summonerName: string
  nickname: string = ''
  level: number = 0
  kills: number = 0
  deaths: number = 0
  assists: number = 0
  creepScore: number = 0
  experience: number = 0
  currentGold: number = 0
  totalGold: number = 0
  items: Set<number> = new Set()
  championName: string
  championId: string
  championKey: number
  alive: boolean = true
  team: 100 | 200

  constructor(summonerName: string, team: 'ORDER' | 'CHAOS', championName: string, championId: string, championKey: number) {
    this.summonerName = summonerName
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