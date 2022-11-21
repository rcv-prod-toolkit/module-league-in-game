const blueTeam = document.querySelector('#blue')
const redTeam = document.querySelector('#red')
let showNicknames

function getPlayerId(id) {
  if (id > 4) return id - 5
  else return id
}

function levelUpdate(e) {
  const playerId = getPlayerId(e.player)

  const team = e.team === 100 ? blueTeam : redTeam
  const playerDiv = team.children[playerId].querySelector('.player-event')

  const levelContainer = playerDiv.querySelector('.level')

  if (
    playerDiv.classList.contains('levelUp') ||
    playerDiv.classList.contains('itemBuy')
  ) {
    return setTimeout(() => {
      levelUpdate(e)
    }, 3000)
  }

  levelContainer.innerHTML = e.level
  playerDiv.classList.add('levelUp')
  setTimeout(() => {
    playerDiv.classList.remove('levelUp')
  }, 6000)
}

function itemUpdate(e) {
  const playerId = getPlayerId(e.player)

  const team = e.team === 100 ? blueTeam : redTeam
  const playerDiv = team.children[playerId].querySelector('.player-event')

  const levelContainer = playerDiv.querySelector('.item')

  if (
    playerDiv.classList.contains('levelUp') ||
    playerDiv.classList.contains('itemBuy')
  ) {
    return setTimeout(() => {
      itemUpdate(e)
    }, 3000)
  }

  levelContainer.src = `/serve/module-league-static/img/item/${e.item}.png`
  playerDiv.classList.add('itemBuy')
  setTimeout(() => {
    playerDiv.classList.remove('itemBuy')
  }, 6000)
}

function nameUpdate(e) {
  const playerId = getPlayerId(e.player)

  const team = e.team === 100 ? blueTeam : redTeam
  const playerDiv = team.children[playerId].querySelector('.nickname')
  playerDiv.innerText = e.nickname
}

const inhibDiv = document.querySelector('#inhibDiv')
const blueSide = inhibDiv.querySelector('#blueSide')
const redSide = inhibDiv.querySelector('#redSide')

function inhibUpdate(e) {
  const team = parseInt(e.team) === 100 ? blueSide : redSide
  const inhib = team.querySelector(`.${e.lane}`)
  inhib.style.setProperty('--percent', e.percent)
  inhib.querySelector('p').innerText = convertSecsToTime(e.respawnIn)
}

/* const turretDiv = document.querySelector('#turrets')
const blueTurrets = turretDiv.querySelector('#blueTurrets')
const redTurrets = turretDiv.querySelector('#redTurrets')

function towerUpdate (e) {
  const team = e.team === '100' ? redTurrets : blueTurrets
  const value = team.querySelector('.value')
  const newValue = (Number(value.innerText) || 0) + 1
  value.innerText = newValue
} */

const platingDiv = document.querySelector('#platings')
const bluePlates = platingDiv.querySelector('.team-plates.blue')
const redPlates = platingDiv.querySelector('.team-plates.red')

function calcK(amount) {
  switch (true) {
    case amount > 1000:
      return `${(amount / 1000).toFixed(2)} K`
    default:
      return amount
  }
}

function platingsUpdate(e) {
  const platings = e.state?.platings ?? e.platings

  if (platings.showPlatings) {
    platingDiv.classList.remove('hide')
  } else {
    platingDiv.classList.add('hide')
  }

  for (const [teamId, team] of Object.entries(platings)) {
    if (teamId === 'showPlatings') continue
    const teamDiv = teamId === '100' ? bluePlates : redPlates
    let total = 0

    for (const [lane, number] of Object.entries(team)) {
      total += number

      if (lane === 'L') {
        teamDiv.querySelector('.top span').innerText = number
      } else if (lane === 'C') {
        teamDiv.querySelector('.mid span').innerText = number
      } else if (lane === 'R') {
        teamDiv.querySelector('.bot span').innerText = number
      }
    }

    teamDiv.querySelector('.gold span').innerText = calcK(total * 175)
  }
}

const baron = document.querySelector('#baron')
const elder = document.querySelector('#elder')
function setGameState(e) {
  const state = e.state

  baron.classList.add('hide')
  elder.classList.add('hide')

  for (const [i, player] of Object.entries(state.player)) {
    const id = parseInt(i)
    const playerId = getPlayerId(id)

    const team = id > 4 ? blueTeam : redTeam
    const playerDiv = team.children[playerId].querySelector('.nickname')
    playerDiv.innerText = player.nickname
  }

  /* for (const [teamId, team] of Object.entries(state.towers)) {
    for (const lane of Object.values(team)) {
      const teamDiv = teamId === '100' ? redTurrets : blueTurrets
      const value = teamDiv.querySelector('.value')
      let newValue = 0

      for (const alive of Object.values(lane)) {
        if (alive) continue

        newValue += 1
        value.textContent = newValue + 1
      }

      value.textContent = (Number(value.innerText) || 0)
    }
  } */

  platingsUpdate(e)

  for (const [teamId, team] of Object.entries(state.inhibitors)) {
    for (const [lane, data] of Object.entries(team)) {
      const teamDiv = parseInt(teamId) === 100 ? blueSide : redSide
      const div = teamDiv.querySelector(`.${lane}`)

      if (data.alive) {
        div.style.setProperty('--percent', '0')
        div.querySelector('p').innerText = convertSecsToTime(0)
      } else {
        div.style.setProperty('--percent', data.percent)
        div.querySelector('p').innerText = convertSecsToTime(data.respawnIn)
      }
    }
  }

  if (state.showInhibitors !== null) {
    inhibDiv.classList.remove('hide')
    if (parseInt(e.side) === 100) {
      inhibDiv.classList.remove('both')
      redSide.classList.add('hide')
    } else if (parseInt(e.side) === 200) {
      inhibDiv.classList.remove('both')
      blueSide.classList.add('hide')
      redSide.classList.remove('hide')
    } else {
      inhibDiv.classList.add('both')
      redSide.classList.remove('hide')
    }
  } else {
    inhibDiv.classList.add('hide')
    inhibDiv.classList.remove('both')
    blueSide.classList.add('hide')
    redSide.classList.add('hide')
  }
}

function ppUpdate(e) {
  const typeDiv = e.type === 'Baron' ? baron : elder
  const div = typeDiv.querySelector('.pp-bar')
  const timer = typeDiv.querySelector('.timer')

  if (!e.ongoing) {
    div.style.setProperty('--percent', 100)
    timer.innerText = convertSecsToTime(0)

    typeDiv.classList.add('hide')
  } else {
    div.style.setProperty('--percent', e.percent)
    timer.innerText = convertSecsToTime(e.respawnIn)

    if (typeDiv.classList.contains('hide')) {
      setTimeout(() => {
        typeDiv.classList.remove('hide')
      }, 5000)
    }
  }
}

function convertSecsToTime(secs) {
  const newSecs = Math.round(secs)
  const minutes = Math.floor(newSecs / 60)
  const seconds = newSecs % 60
  return `${('0' + minutes).slice(-2)}:${('0' + seconds).slice(-2)}`
}

const themeBlue = document
  .querySelector(':root')
  .style.getPropertyValue('--blue-team')
const themeBlueDark = document
  .querySelector(':root')
  .style.getPropertyValue('--blue-team-dark')
const themeRed = document
  .querySelector(':root')
  .style.getPropertyValue('--red-team')
const themeRedDark = document
  .querySelector(':root')
  .style.getPropertyValue('--red-team-dark')

function shadeColor(color, percent) {
  var R = parseInt(color.substring(1, 3), 16)
  var G = parseInt(color.substring(3, 5), 16)
  var B = parseInt(color.substring(5, 7), 16)

  R = parseInt((R * (100 + percent)) / 100)
  G = parseInt((G * (100 + percent)) / 100)
  B = parseInt((B * (100 + percent)) / 100)

  R = R < 255 ? R : 255
  G = G < 255 ? G : 255
  B = B < 255 ? B : 255

  var RR = R.toString(16).length == 1 ? '0' + R.toString(16) : R.toString(16)
  var GG = G.toString(16).length == 1 ? '0' + G.toString(16) : G.toString(16)
  var BB = B.toString(16).length == 1 ? '0' + B.toString(16) : B.toString(16)

  return '#' + RR + GG + BB
}

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      }
    : null
}

function changeColor(color) {
  const rgb = hexToRgb(color)
  const brightness = Math.round(
    (parseInt(rgb.r) * 299 + parseInt(rgb.g) * 587 + parseInt(rgb.b) * 114) /
      1000
  )
  return brightness < 150 ? '--text-color' : '--text-color-dark'
}

function changeColors(e) {
  if (e.teams.blueTeam?.color && e.teams.blueTeam?.color !== '#000000') {
    document
      .querySelector(':root')
      .style.setProperty('--blue-team', e.teams.blueTeam.color)
    document
      .querySelector(':root')
      .style.setProperty(
        '--blue-team-dark',
        shadeColor(e.teams.blueTeam.color, -30)
      )

    document.querySelectorAll('#blue .player .level').forEach((i) => {
      i.style.color = `var(${changeColor(e.teams.blueTeam.color)})`
    })
  } else {
    document.querySelector(':root').style.setProperty('--blue-team', themeBlue)
    document
      .querySelector(':root')
      .style.setProperty('--blue-team-dark', themeBlueDark)

    document.querySelectorAll('#blue .player .level').forEach((i) => {
      i.style.color = 'var(--background-color)'
    })
  }
  if (e.teams.redTeam?.color && e.teams.redTeam?.color !== '#000000') {
    document
      .querySelector(':root')
      .style.setProperty('--red-team', e.teams.redTeam.color)
    document
      .querySelector(':root')
      .style.setProperty(
        '--red-team-dark',
        shadeColor(e.teams.redTeam.color, -30)
      )

    document.querySelectorAll('#red .player .level').forEach((i) => {
      i.style.color = `var(${changeColor(e.teams.redTeam.color)})`
    })
  } else {
    document.querySelector(':root').style.setProperty('--red-team', themeRed)
    document
      .querySelector(':root')
      .style.setProperty('--red-team-dark', themeRedDark)

    document.querySelectorAll('#red .player .level').forEach((i) => {
      i.style.color = 'var(--text-color)'
    })
  }
}

let hasEvent = false
function emitEvent(e) {
  if (hasEvent) {
    return setTimeout(() => {
      emitEvent(e)
    }, 2000)
  }

  hasEvent = true
  const eventDiv =
    e.team === 100
      ? blueTeam.querySelector('.event')
      : redTeam.querySelector('.event')

  eventDiv.querySelector('.event-name').innerText = e.name
  eventDiv.querySelector('.event-time').innerText = `AT ${convertSecsToTime(
    e.time
  )}`
  eventDiv.querySelector('.event-img').src = `img/${e.type.toLowerCase()}.png`

  eventDiv.classList.add(e.type.toLowerCase(), 'show')

  setTimeout(() => {
    eventDiv.classList.remove('show')
  }, 5000)
  setTimeout(() => {
    eventDiv.classList.remove(e.type.toLowerCase())
    hasEvent = false
  }, 6500)
}

const killfeed = document.querySelector('#killfeed')
function addKill(event) {
  if (killfeed.children.length >= 5) {
    return setTimeout(() => {
      addKill(event)
    }, 3000)
  }

  const killDiv = document.createElement('div')
  killDiv.classList.add('kill')
  killDiv.style.setProperty(
    '--team',
    event.team === 100 ? 'var(--blue-team)' : 'var(--red-team)'
  )

  const other = document.createElement('img')
  other.classList.add('other')
  if (event.other === 'Turret') {
    other.src = './img/tower.png'
  } else if (event.other === 'Inhib') {
    other.src = './img/inhib.png'
  } else {
    other.src = `/serve/module-league-static/img/champion/tiles/${event.other}_0.jpg`
  }

  const sword = document.createElement('img')
  sword.classList.add('sword')
  sword.src = './img/sword.png'

  const source = document.createElement('img')
  source.classList.add('source')
  if (typeof event.source === 'number') {
    source.src = `/serve/module-league-static/img/champion/tiles/${event.source}_0.jpg`
  } else if (event.source === 'Turret') {
    source.src = './img/tower.png'
  } else if (event.source === 'Baron') {
    source.src = './img/baron-icon.png'
  } else if (event.source === 'Herald') {
    source.src = './img/herald-icon.png'
  } else if (event.source === 'Dragon') {
    source.src = './img/dragon-icon.png'
  } else {
    source.src = './img/minion.png'
  }

  killDiv.appendChild(other)
  killDiv.appendChild(sword)
  killDiv.appendChild(source)

  for (const a of event.assists) {
    const assist = document.createElement('img')
    assist.classList.add('assist')
    assist.src = `/serve/module-league-static/img/champion/tiles/${a}_0.jpg`
    killDiv.appendChild(assist)
  }

  killfeed.appendChild(killDiv)

  setTimeout(() => {
    killDiv.remove()
  }, 5000)
}

function updateSettings(e) {
  if (e.showNicknames === showNicknames) return

  showNicknames = e.showNicknames
  if (!e.showNicknames) {
    document.querySelectorAll('.nickname').forEach((n) => {
      n.style.display = 'none'
    })
  } else {
    document.querySelectorAll('.nickname').forEach((n) => {
      n.style.display = 'block'
    })
  }
}

LPTE.onready(async () => {
  LPTE.on('module-league-in-game', 'level-update', levelUpdate)
  LPTE.on('module-league-in-game', 'item-update', itemUpdate)
  LPTE.on('module-league-in-game', 'inhib-update', inhibUpdate)
  LPTE.on('module-league-in-game', 'kill-update', addKill)
  LPTE.on('module-league-in-game', 'platings-update', platingsUpdate)
  /* LPTE.on(namespace, 'tower-update', towerUpdate) */
  LPTE.on('module-league-in-game', 'update', setGameState)
  LPTE.on('module-league-in-game', 'event', emitEvent)
  LPTE.on('module-league-in-game', 'pp-update', ppUpdate)
  LPTE.on('module-league-in-game', 'name-update', nameUpdate)
  LPTE.on('module-league-in-game', 'set-settings', updateSettings)

  LPTE.on('module-league-in-game', 'show-inhibs', (e) => {
    inhibDiv.classList.remove('hide')

    if (parseInt(e.side) === 100) {
      inhibDiv.classList.remove('both')
      blueSide.classList.remove('hide')
      redSide.classList.add('hide')
    } else if (parseInt(e.side) === 200) {
      inhibDiv.classList.remove('both')
      blueSide.classList.add('hide')
      redSide.classList.remove('hide')
    } else {
      inhibDiv.classList.add('both')
      blueSide.classList.remove('hide')
      redSide.classList.remove('hide')
    }
  })
  LPTE.on('module-league-in-game', 'show-platings', (e) => {
    platingDiv.classList.remove('hide')
  })

  LPTE.on('module-league-in-game', 'hide-inhibs', () => {
    inhibDiv.classList.add('hide')
    setTimeout(() => {
      inhibDiv.classList.remove('both')
      blueSide.classList.add('hide')
      redSide.classList.add('hide')
    }, 1000)
  })
  LPTE.on('module-league-in-game', 'hide-platings', () => {
    platingDiv.classList.add('hide')
  })

  LPTE.on('module-league-in-game', 'test-level-up', (e) => {
    if (e.team === 100) {
      for (let i = 0; i < 5; i++) {
        setTimeout(() => {
          levelUpdate({
            player: i,
            level: e.level,
            team: e.team
          })
        }, 2500 * i)
      }
    } else if (e.team === 200) {
      for (let i = 5; i < 10; i++) {
        setTimeout(() => {
          levelUpdate({
            player: i,
            level: e.level,
            team: e.team
          })
        }, 2500 * (i - 5))
      }
    }
  })

  LPTE.on('module-league-in-game', 'test-item', (e) => {
    if (e.team === 100) {
      for (let i = 0; i < 5; i++) {
        setTimeout(() => {
          itemUpdate({
            player: i,
            item: 3006,
            team: e.team
          })
        }, 2500 * i)
      }
    } else if (e.team === 200) {
      for (let i = 5; i < 10; i++) {
        setTimeout(() => {
          itemUpdate({
            player: i,
            item: 3006,
            team: e.team
          })
        }, 2500 * (i - 5))
      }
    }
  })
  LPTE.on('module-league-in-game', 'test-event', (e) => {
    if (e.team === 100) {
      emitEvent({
        team: 100,
        name: e.event,
        time: 160000,
        type: e.event === 'Dragon' ? 'cloud' : e.event
      })
    } else if (e.team === 200) {
      emitEvent({
        team: 200,
        name: e.event,
        time: 160000,
        type: e.event === 'Dragon' ? 'cloud' : e.event
      })
    }
  })
  LPTE.on('module-league-in-game', 'test-killfeed', (e) => {
    if (e.team === 100) {
      addKill({
        team: 100,
        other: e.event === 'Kill' ? 'Bard' : e.event,
        source: 'Aatrox',
        assists: ['Leona', 'Trundle']
      })
    } else if (e.team === 200) {
      addKill({
        team: 200,
        other: e.event === 'Kill' ? 'Bard' : e.event,
        source: 'Aatrox',
        assists: ['Leona', 'Trundle']
      })
    }
  })

  const settingsRes = await LPTE.request({
    meta: {
      namespace: 'module-league-in-game',
      type: 'get-settings',
      version: 1
    }
  })

  updateSettings(settingsRes)

  const res = await LPTE.request({
    meta: {
      namespace: 'module-league-in-game',
      type: 'request',
      version: 1
    }
  })

  setGameState(res)

  const teams = await window.LPTE.request({
    meta: {
      namespace: 'module-teams',
      type: 'request-current',
      version: 1
    }
  })

  if (teams !== undefined) {
    changeColors(teams)
  }

  window.LPTE.on('module-teams', 'update', changeColors)
})
