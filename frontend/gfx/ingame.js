const namespace = 'module-league-in-game'
const blueTeam = document.querySelector('#blue')
const redTeam = document.querySelector('#red')

function getPlayerId(id) {
  if (id > 4) return id - 5
  else return id
}

function levelUpdate(e) {
  const playerId = getPlayerId(e.player)

  const team = e.team === 100 ? blueTeam : redTeam
  const playerDiv = team.children[playerId]

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
  const playerDiv = team.children[playerId]

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

function setGameState(e) {
  const state = e.state

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
    if (state.showInhibitors === 100) {
      blueSide.classList.remove('hide')
      redSide.classList.add('hide')
    } else {
      blueSide.classList.add('hide')
      redSide.classList.remove('hide')
    }
  } else {
    inhibDiv.classList.add('hide')
    blueSide.classList.add('hide')
    redSide.classList.add('hide')
  }
}

function convertSecsToTime(secs) {
  const minutes = Math.floor(secs / 60)
  const seconds = secs - minutes * 60
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
function fmtMSS(s){return(s-(s%=60))/60+(9<s?':':':0')+s}
function emitEvent(e) {
  console.log(e)

  if (hasEvent) {
    return setTimeout(() => {
      emitEvent(e)
    }, 2000)
  }

  hasEvent = true
  const eventDiv = e.event.team === 100 ? blueTeam.querySelector('.event') : redTeam.querySelector('.event')

  eventDiv.querySelector('.event-name').innerText = e.event.name
  eventDiv.querySelector('.event-time').innerText = `AT ${fmtMSS(e.event.time)}`
  eventDiv.querySelector('.event-img').src = `img/${e.event.type.toLowerCase()}.png`

  eventDiv.classList.add(e.event.type.toLowerCase(), 'show')

  setTimeout(() => {
    eventDiv.classList.remove('show')
  }, 5000)
  setTimeout(() => {
    eventDiv.classList.remove(e.event.name.toLowerCase())
    hasEvent = false
  }, 6500)
}

LPTE.onready(async () => {
  LPTE.on(namespace, 'level-update', levelUpdate)
  LPTE.on(namespace, 'item-update', itemUpdate)
  LPTE.on(namespace, 'inhib-update', inhibUpdate)
  /* LPTE.on(namespace, 'tower-update', towerUpdate) */
  LPTE.on(namespace, 'update', setGameState)
  LPTE.on(namespace, 'event', emitEvent)

  LPTE.on(namespace, 'show-inhibs', (e) => {
    inhibDiv.classList.remove('hide')

    if (parseInt(e.side) === 100) {
      blueSide.classList.remove('hide')
      redSide.classList.add('hide')
    } else {
      blueSide.classList.add('hide')
      redSide.classList.remove('hide')
    }
  })

  LPTE.on(namespace, 'hide-inhibs', () => {
    inhibDiv.classList.add('hide')
    blueSide.classList.add('hide')
    redSide.classList.add('hide')
  })

  LPTE.on(namespace, 'test-level-up', (e) => {
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

  LPTE.on(namespace, 'test-item', (e) => {
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

  const res = await LPTE.request({
    meta: {
      namespace,
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
