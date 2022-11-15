import type { PluginContext } from '@rcv-prod-toolkit/types'
import { AllGameData, Player, Event } from '../types/AllGameData'
import { Config } from '../types/Config'
import { ItemEpicness } from '../types/Items'
import { InGameState as InGameStateType } from '../types/InGameState'
import { EventType, InGameEvent, MobType, TeamType } from '../types/InGameEvent'
import { randomUUID } from 'crypto'

export class InGameState {
  public gameState: InGameStateType
  public gameData: AllGameData[] = []
  public itemEpicness: number[]

  public actions: Map<string, (allGameData: AllGameData, id: string) => void> =
    new Map()

  constructor(
    private namespace: string,
    private ctx: PluginContext,
    private config: Config,
    private state: any,
    private statics: any
  ) {
    this.itemEpicness = this.config.items?.map((i) => ItemEpicness[i])

    this.gameState = {
      towers: {
        100: {
          L: {},
          C: {},
          R: {}
        },
        200: {
          L: {},
          C: {},
          R: {}
        }
      },
      platings: {
        showPlatings: false,
        100: {
          L: 0,
          C: 0,
          R: 0
        },
        200: {
          L: 0,
          C: 0,
          R: 0
        }
      },
      showInhibitors: null,
      inhibitors: {
        100: {
          L1: {
            alive: true,
            respawnAt: 0,
            respawnIn: 0,
            percent: 0,
            time: 0
          },
          C1: {
            alive: true,
            respawnAt: 0,
            respawnIn: 0,
            percent: 0,
            time: 0
          },
          R1: {
            alive: true,
            respawnAt: 0,
            respawnIn: 0,
            percent: 0,
            time: 0
          }
        },
        200: {
          L1: {
            alive: true,
            respawnAt: 0,
            respawnIn: 0,
            percent: 0,
            time: 0
          },
          C1: {
            alive: true,
            respawnAt: 0,
            respawnIn: 0,
            percent: 0,
            time: 0
          },
          R1: {
            alive: true,
            respawnAt: 0,
            respawnIn: 0,
            percent: 0,
            time: 0
          }
        }
      },
      player: {
        0: {
          summonerName: '',
          nickname: '',
          level: 0,
          items: new Set()
        },
        1: {
          summonerName: '',
          nickname: '',
          level: 0,
          items: new Set()
        },
        2: {
          summonerName: '',
          nickname: '',
          level: 0,
          items: new Set()
        },
        3: {
          summonerName: '',
          nickname: '',
          level: 0,
          items: new Set()
        },
        4: {
          summonerName: '',
          nickname: '',
          level: 0,
          items: new Set()
        },
        5: {
          summonerName: '',
          nickname: '',
          level: 0,
          items: new Set()
        },
        6: {
          summonerName: '',
          nickname: '',
          level: 0,
          items: new Set()
        },
        7: {
          summonerName: '',
          nickname: '',
          level: 0,
          items: new Set()
        },
        8: {
          summonerName: '',
          nickname: '',
          level: 0,
          items: new Set()
        },
        9: {
          summonerName: '',
          nickname: '',
          level: 0,
          items: new Set()
        }
      },
      objectives: {
        100: [],
        200: []
      }
    }

    this.ctx.LPTE.emit({
      meta: {
        namespace: this.namespace,
        type: 'update',
        version: 1
      },
      state: this.convertGameState()
    })
  }

  private convertGameState() {
    return {
      ...this.gameState,
      player: Object.values(this.gameState.player).map((p) => {
        return {
          ...p,
          items: [...p.items.values()]
        }
      })
    }
  }

  public updateState() {
    this.ctx.LPTE.emit({
      meta: {
        namespace: 'module-league-state',
        type: 'save-live-game-stats',
        version: 1
      },
      gameState: this.convertGameState()
    })
  }

  public handelData(allGameData: AllGameData): void {
    if (this.gameData.length > 0) {
      let previousGameData = this.gameData[this.gameData.length - 1]

      if (allGameData.gameData.gameTime < previousGameData.gameData.gameTime) {
        this.gameData = this.gameData.filter(
          (gd) => gd.gameData.gameTime < allGameData.gameData.gameTime
        )

        if (this.gameData.length <= 0) return
        previousGameData = this.gameData[this.gameData.length - 1]
      }

      setTimeout(() => {
        this.checkPlayerUpdate(allGameData)
        this.checkEventUpdate(allGameData, previousGameData)

        for (const [id, func] of this.actions.entries()) {
          func(allGameData, id)
        }
      }, this.config.delay / 2)
    }

    this.gameData.push(allGameData)
  }

  public handelEvent(event: InGameEvent): void {
    if (event.eventname === EventType.StructureKill) return

    const team = event.sourceTeam === TeamType.Order ? 100 : 200

    setTimeout(() => {
      const time = this.gameData[this.gameData.length - 1].gameData.gameTime

      if (event.eventname === EventType.TurretPlateDestroyed) {
        const split = event.other.split('_') as string[]
        const lane = split[2] as 'L' | 'C' | 'R'
        this.gameState.platings[team][lane] += 1

        this.ctx.LPTE.emit({
          meta: {
            namespace: this.namespace,
            type: 'platings-update',
            version: 1
          },
          platings: this.gameState.platings
        })
        return
      }

      this.gameState.objectives[team].push({
        type: event.eventname,
        mob: event.other as MobType,
        time
      })

      this.updateState()

      if (
        event.eventname === EventType.DragonKill &&
        this.config.events?.includes('Dragons')
      ) {
        if (this.convertDragon(event.other) === 'Elder') {
          this.baronElderKill(event)
        } else {
          this.ctx.LPTE.emit({
            meta: {
              namespace: this.namespace,
              type: 'event',
              version: 1
            },
            name: 'Dragon',
            type: this.convertDragon(event.other),
            team,
            time
          })
        }
      } else if (
        event.eventname === EventType.BaronKill &&
        this.config.events?.includes('Barons')
      ) {
        this.baronElderKill(event)
      } else if (
        event.eventname === EventType.HeraldKill &&
        this.config.events?.includes('Heralds')
      ) {
        this.ctx.LPTE.emit({
          meta: {
            namespace: this.namespace,
            type: 'event',
            version: 1
          },
          name: 'Herald',
          type: 'Herald',
          team,
          time
        })
      }
    }, this.config.delay)
  }

  private convertDragon(dragon: MobType): string {
    switch (dragon) {
      case MobType.HextechDragon:
        return 'Hextech'
      case MobType.ChemtechDragon:
        return 'Chemtech'
      case MobType.CloudDragon:
        return 'Cloud'
      case MobType.ElderDragon:
        return 'Elder'
      case MobType.InfernalDragon:
        return 'Infernal'
      case MobType.MountainDragon:
        return 'Mountain'
      case MobType.OceanDragon:
        return 'Ocean'
      default:
        return 'Air'
    }
  }

  private baronElderKill(event: InGameEvent): void {
    const cAllGameData = this.gameData[this.gameData.length - 1]

    const team = event.sourceTeam === TeamType.Order ? 100 : 200
    const time = Math.round(cAllGameData.gameData.gameTime)
    const type = event.eventname === EventType.BaronKill ? 'Baron' : 'Elder'

    this.ctx.LPTE.emit({
      meta: {
        namespace: this.namespace,
        type: 'event',
        version: 1
      },
      name: event.eventname === EventType.BaronKill ? 'Baron' : 'Dragon',
      type,
      team,
      time
    })

    if (!this.config.ppTimer) return

    const respawnAt = time + 60 * 3

    const data = {
      time,
      ongoing: true,
      alive: cAllGameData.allPlayers
        .filter(
          (p) =>
            !p.isDead &&
            (team === 100 ? p.team === 'ORDER' : p.team === 'CHAOS')
        )
        .map((p) => p.summonerName),
      dead: cAllGameData.allPlayers
        .filter(
          (p) =>
            p.isDead && (team === 100 ? p.team === 'ORDER' : p.team === 'CHAOS')
        )
        .map((p) => p.summonerName),
      team,
      respawnAt: respawnAt,
      respawnIn: 60 * 3,
      percent: 100
    }

    this.ctx.LPTE.emit({
      meta: {
        namespace: this.namespace,
        type: 'pp-update',
        version: 1
      },
      type,
      team,
      ongoing: data.ongoing,
      percent: data.percent,
      respawnIn: data.respawnIn,
      respawnAt: data.respawnAt
    })

    this.actions.set(type + '-' + randomUUID(), (allGameData, i) => {
      const gameState = allGameData.gameData
      const diff = respawnAt - Math.round(gameState.gameTime)
      const percent = Math.round((diff * 100) / (60 * 3))

      data.alive = allGameData.allPlayers
        .filter(
          (p) =>
            !p.isDead &&
            (team === 100 ? p.team === 'ORDER' : p.team === 'CHAOS') &&
            !data.dead.includes(p.summonerName)
        )
        .map((p) => p.summonerName)
      data.dead = [
        ...data.dead,
        ...allGameData.allPlayers
          .filter(
            (p) =>
              p.isDead &&
              (team === 100 ? p.team === 'ORDER' : p.team === 'CHAOS')
          )
          .map((p) => p.summonerName)
      ]

      this.ctx.LPTE.emit({
        meta: {
          namespace: this.namespace,
          type: 'pp-update',
          version: 1
        },
        type: event.eventname === EventType.BaronKill ? 'Baron' : 'Elder',
        team,
        ongoing: data.ongoing,
        percent,
        respawnIn: diff
      })

      if (
        diff <= 0 ||
        data.alive.length <= 0 ||
        time > gameState.gameTime + this.config.delay / 1000
      ) {
        data.ongoing = false
        this.ctx.LPTE.emit({
          meta: {
            namespace: this.namespace,
            type: 'pp-update',
            version: 1
          },
          type: event.eventname === EventType.BaronKill ? 'Baron' : 'Elder',
          team,
          ongoing: data.ongoing,
          percent: 100,
          respawnIn: 60 * 3
        })

        this.actions.delete(i)
      }
    })
  }

  private checkPlayerUpdate(allGameData: AllGameData) {
    if (this.config.items.length === 0) return
    if (allGameData.allPlayers.length === 0) return

    allGameData.allPlayers.forEach((player, i) => {
      this.checkNameUpdate(player, i)
      this.checkItemUpdate(player, i)
      this.checkLevelUpdate(player, i)
    })
  }

  private checkNameUpdate(currentPlayerState: Player, id: number) {
    if (
      this.gameState.player[id].summonerName === currentPlayerState.summonerName
    )
      return

    this.gameState.player[id].summonerName = currentPlayerState.summonerName
    const member = this.state.lcu.lobby?.members?.find(
      (m: any) => m.summonerName === currentPlayerState.summonerName
    )
    this.gameState.player[id].nickname =
      member?.nickname ?? currentPlayerState.summonerName
    this.updateState()

    this.ctx.LPTE.emit({
      meta: {
        type: 'name-update',
        namespace: this.namespace,
        version: 1
      },
      team: currentPlayerState.team === 'ORDER' ? 100 : 200,
      player: id,
      nickname: this.gameState.player[id].nickname
    })
  }

  private checkLevelUpdate(currentPlayerState: Player, id: number) {
    if (currentPlayerState.level === this.gameState.player[id].level) return
    if (!this.config.level.includes(currentPlayerState.level.toString())) return

    this.gameState.player[id].level = currentPlayerState.level
    this.updateState()

    this.ctx.LPTE.emit({
      meta: {
        type: 'level-update',
        namespace: this.namespace,
        version: 1
      },
      team: currentPlayerState.team === 'ORDER' ? 100 : 200,
      player: id,
      level: currentPlayerState.level
    })
  }

  private checkItemUpdate(currentPlayerState: Player, id: number) {
    const previousItems = this.gameState.player[id].items

    if (previousItems.has(3513)) {
      if (!currentPlayerState.items.find((i) => i.itemID === 3513)) {
        previousItems.delete(3513)
      }
    }

    for (const item of currentPlayerState.items) {
      const itemID = item.itemID
      if (previousItems.has(itemID)) continue

      const itemBinFind = this.statics.itemBin.find(
        (i: any) => i.itemID === itemID
      )
      if (itemBinFind === undefined) continue

      if (itemID === 3513) {
        this.handelEvent({
          eventname: EventType.HeraldKill,
          other: MobType.Herald,
          otherTeam: TeamType.Neutral,
          source: currentPlayerState.summonerName,
          sourceID: id,
          sourceTeam:
            currentPlayerState.team === 'CHAOS'
              ? TeamType.Chaos
              : TeamType.Order
        })
        this.gameState.player[id].items.add(itemID)
        return
      }

      if (!this.itemEpicness.includes(itemBinFind.epicness)) continue
      if (itemBinFind.epicness !== 7 && item.consumable) continue

      this.gameState.player[id].items.add(itemID)
      this.updateState()

      this.ctx.LPTE.emit({
        meta: {
          type: 'item-update',
          namespace: this.namespace,
          version: 1
        },
        team: currentPlayerState.team === 'ORDER' ? 100 : 200,
        player: id,
        item: itemID
      })
    }
  }

  private checkEventUpdate(
    allGameData: AllGameData,
    previousGameData: AllGameData
  ) {
    if (allGameData.events.Events.length === 0) return

    const newEvents = allGameData.events.Events.slice(
      previousGameData.events.Events.length || 0
    )

    newEvents.forEach((event) => {
      if (event.EventName === 'InhibKilled') {
        this.handleInhibEvent(event, allGameData)
      } else if (event.EventName === 'TurretKilled') {
        this.handleTowerEvent(event, allGameData)
      } else if (event.EventName === 'ChampionKill') {
        this.handleKillEvent(event, allGameData)
      }
    })
  }

  private handleInhibEvent(event: Event, allGameData: AllGameData) {
    const split = event.InhibKilled.split('_') as string[]
    const team = split[1] === 'T1' ? 100 : 200
    const lane = split[2] as 'L1' | 'C1' | 'R1'
    const respawnAt = Math.round(event.EventTime) + 60 * 5
    const time = event.EventTime

    if (!this.gameState.inhibitors[team][lane].alive) return

    this.gameState.inhibitors[team][lane] = {
      alive: false,
      respawnAt: respawnAt,
      respawnIn: 60 * 5,
      percent: 100,
      time
    }
    this.updateState()

    this.actions.set(event.InhibKilled, (allGameData, i) => {
      const gameState = allGameData.gameData
      const diff = respawnAt - Math.round(gameState.gameTime)
      const percent = Math.round((diff * 100) / (60 * 5))

      this.gameState.inhibitors[team][lane] = {
        alive: false,
        respawnAt: respawnAt,
        respawnIn: diff,
        percent: 100,
        time: this.gameState.inhibitors[team][lane].time
      }

      this.ctx.LPTE.emit({
        meta: {
          namespace: this.namespace,
          type: 'inhib-update',
          version: 1
        },
        team,
        lane,
        percent,
        respawnIn: diff
      })

      if (diff <= 0 || time > gameState.gameTime) {
        this.gameState.inhibitors[team][lane] = {
          alive: true,
          respawnAt: 0,
          respawnIn: 0,
          percent: 0,
          time: 0
        }

        this.updateState()
        this.actions.delete(i)
      }
    })

    if (this.config.killfeed) {
      this.ctx.LPTE.emit({
        meta: {
          namespace: this.namespace,
          type: 'kill-update',
          version: 1
        },
        assists: event.Assisters.map((a: string) => {
          return allGameData.allPlayers
            .find((p) => {
              return p.summonerName === a
            })
            ?.rawChampionName.split('_')[3]
        }),
        other: 'Inhib',
        source: event.KillerName.startsWith('Minion')
          ? 'Minion'
          : allGameData.allPlayers
              .find((p) => {
                return p.summonerName === event.KillerName
              })
              ?.rawChampionName.split('_')[3],
        team: team === 100 ? 200 : 100
      })
    }
  }

  private handleTowerEvent(event: Event, allGameData: AllGameData) {
    if (event.TurretKilled === 'Obelisk') return

    const split = event.TurretKilled.split('_') as string[]
    const team = split[1] === 'T1' ? 100 : 200
    const lane = split[2] as 'L' | 'C' | 'R'
    const turret = split[3]

    if (this.config.killfeed) {
      this.ctx.LPTE.emit({
        meta: {
          namespace: this.namespace,
          type: 'kill-update',
          version: 1
        },
        assists: event.Assisters.map((a: string) => {
          return allGameData.allPlayers
            .find((p) => {
              return p.summonerName === a
            })
            ?.rawChampionName.split('_')[3]
        }),
        other: 'Turret',
        source: event.KillerName.startsWith('Minion')
          ? 'Minion'
          : allGameData.allPlayers
              .find((p) => {
                return p.summonerName === event.KillerName
              })
              ?.rawChampionName.split('_')[3],
        team: team === 100 ? 200 : 100
      })
    }

    if (this.gameState.towers[team][lane][turret] === false) return

    this.gameState.towers[team][lane][turret] = false
    this.updateState()

    this.ctx.LPTE.emit({
      meta: {
        namespace: this.namespace,
        type: 'tower-update',
        version: 1
      },
      team,
      lane,
      turret
    })
  }

  private handleKillEvent(event: Event, allGameData: AllGameData) {
    if (!this.config.killfeed) return

    this.ctx.LPTE.emit({
      meta: {
        namespace: this.namespace,
        type: 'kill-update',
        version: 1
      },
      assists: event.Assisters.map((a: string) => {
        return allGameData.allPlayers
          .find((p) => {
            return p.summonerName === a
          })
          ?.rawChampionName.split('_')[3]
      }),
      other: allGameData.allPlayers
        .find((p) => {
          return p.summonerName === event.VictimName
        })
        ?.rawChampionName.split('_')[3],
      source: event.KillerName.startsWith('Minion')
        ? 'Minion'
        : event.KillerName.startsWith('Turret')
        ? 'Turret'
        : allGameData.allPlayers
            .find((p) => {
              return p.summonerName === event.KillerName
            })
            ?.rawChampionName.split('_')[3],
      team:
        allGameData.allPlayers.find((p) => {
          return p.summonerName === event.VictimName
        })?.team === 'CHAOS'
          ? 100
          : 200
    })
  }
}
