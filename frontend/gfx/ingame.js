const blueTeam = document.querySelector('#blue')
const redTeam = document.querySelector('#red')
let showNicknames,
  showTournament,
  showLeaderBoard,
  showScoreBoard,
  score,
  tags,
  standings,
  barons,
  heralds,
  tower,
  gameState

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

const platingDiv = document.querySelector('#platings')
const bluePlates = platingDiv.querySelector('.team-plates.blue')
const redPlates = platingDiv.querySelector('.team-plates.red')

function calcK(amount) {
  switch (true) {
    case amount === 0:
      return 0
    case amount === undefined:
      return 0
    case amount > 1000:
      return `${(amount / 1000).toFixed(1)}K`
    case amount < -1000:
      return `${(amount / 1000).toFixed(1)}K`
    default:
      return amount.toFixed(0)
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

    teamDiv.querySelector('.gold span').innerText = calcK(total * 125)
  }
}

const scoreboard = document.querySelector('.scoreboard')
const sbTime = scoreboard.querySelector('.sb-time')
const sbBlue = scoreboard.querySelector('.sb-team.sb-blue')
const sbRed = scoreboard.querySelector('.sb-team.sb-red')

const sbBluePP = document.querySelector('.sb-blue.power-play')
const sbRedPP = document.querySelector('.sb-red.power-play')

const sbBlueTag = sbBlue.querySelector('.sb-tag')
const sbBlueLogo = sbBlue.querySelector('.sb-logo')
const sbBlueStanding = sbBlue.querySelector('.sb-standing')
const sbRedTag = sbRed.querySelector('.sb-tag')
const sbRedLogo = sbRed.querySelector('.sb-logo')
const sbRedStanding = sbRed.querySelector('.sb-standing')

const sbBlueKills = scoreboard.querySelector('.sb-kills-blue')
const sbRedKills = scoreboard.querySelector('.sb-kills-red')

const sbBlueBaron = sbBlue.querySelector('.sb-baron-blue')
const sbBlueHerald = sbBlue.querySelector('.sb-herald-blue')
const sbBlueTower = sbBlue.querySelector('.sb-tower-blue')
const sbBlueGold = sbBlue.querySelector('.sb-gold-blue')

const sbRedBaron = sbRed.querySelector('.sb-baron-red')
const sbRedHerald = sbRed.querySelector('.sb-herald-red')
const sbRedTower = sbRed.querySelector('.sb-tower-red')
const sbRedGold = sbRed.querySelector('.sb-gold-red')

const xpLeaderBoard = document.querySelector('#xp')
const goldLeaderBoard = document.querySelector('#gold')

function setGameState(e) {
  const state = e.state
  gameState = state

  for (const i in state.player) {
    const id = parseInt(i)
    const playerId = getPlayerId(id)

    const team = id > 4 ? blueTeam : redTeam
    const playerDiv = team.children[playerId].querySelector('.nickname')
    playerDiv.innerText = state.player[i].nickname

    const xpLbItem = createLeaderBoardItem(state.player[i], 0, 'xp')
    const goldLbItem = createLeaderBoardItem(state.player[i], 0, 'gold')

    xpLeaderBoard.appendChild(xpLbItem)
    goldLeaderBoard.appendChild(goldLbItem)
  }

  showLeaderBoard = e.state.showLeaderBoard

  if (!showLeaderBoard) {
    goldLeaderBoard.classList.remove('show')
    xpLeaderBoard.classList.remove('show')
  } else if (showLeaderBoard === 'xp') {
    goldLeaderBoard.classList.remove('show')
    xpLeaderBoard.classList.add('show')
  } else if (showLeaderBoard === 'gold') {
    goldLeaderBoard.classList.add('show')
    xpLeaderBoard.classList.remove('show')
  }
}

function updateGameState(e) {
  const state = e.state
  gameState = state

  sbBlueGold.innerText = calcK(state.gold[100])
  sbRedGold.innerText = calcK(state.gold[200])

  sbBlueKills.innerText = state.kills[100]
  sbRedKills.innerText = state.kills[200]

  sbTime.innerText = convertSecsToTime(state.gameTime)

  sbBlueBaron.innerText = state.objectives[100].filter(
    (o) => o.type === 'OnKillWorm_Spectator'
  ).length
  sbRedBaron.innerText = state.objectives[200].filter(
    (o) => o.type === 'OnKillWorm_Spectator'
  ).length

  sbBlueHerald.innerText = state.objectives[100].filter(
    (o) => o.type === 'OnKillRiftHerald_Spectator'
  ).length
  sbRedHerald.innerText = state.objectives[200].filter(
    (o) => o.type === 'OnKillRiftHerald_Spectator'
  ).length

  for (const [teamId, team] of Object.entries(state.towers)) {
    const value = teamId === '100' ? sbRedTower : sbBlueTower
    let newValue = 0

    for (const lane of Object.values(team)) {
      for (const alive of Object.values(lane)) {
        if (alive) continue

        newValue += 1
      }
    }

    value.textContent = newValue
  }

  platingsUpdate(e)

  if (showLeaderBoard === 'gold') {
    const maxGold = Math.max(...state.player.map((p) => p.totalGold))
    const sortedForGold = [...state.player].sort((a, b) => {
      return a.totalGold < b.totalGold ? 1 : a.totalGold > b.totalGold ? -1 : 0
    })

    for (const player in state.player) {
      const playerGoldDiv = goldLeaderBoard.children[parseInt(player) + 1]
      playerGoldDiv.children[2].innerText = calcK(
        state.player[player].totalGold
      )
      playerGoldDiv.children[3].max = maxGold
      playerGoldDiv.children[3].value = state.player[player].totalGold

      playerGoldDiv.style.transform = `translate(0, ${
        sortedForGold.findIndex(
          (gp) => gp.summonerName === state.player[player].summonerName
        ) * 100
      }%)`
    }
  }

  if (showLeaderBoard === 'xp') {
    const maxXP = Math.max(...state.player.map((p) => p.experience))
    const sortedForXP = [...state.player].sort((a, b) => {
      return a.experience < b.experience
        ? 1
        : a.experience > b.experience
          ? -1
          : 0
    })

    for (const player in state.player) {
      const playerXPDiv = xpLeaderBoard.children[parseInt(player) + 1]
      playerXPDiv.children[2].innerHTML = `${
        state.player[player].level
      } - <thin>${calcK(state.player[player].experience)}</thin>`
      playerXPDiv.children[3].max = maxXP
      playerXPDiv.children[3].value = state.player[player].experience

      playerXPDiv.style.transform = `translate(0, ${
        sortedForXP.findIndex(
          (gp) => gp.summonerName === state.player[player].summonerName
        ) * 100
      }%)`
    }
  }

  if (state.showInhibitors !== null) {
    inhibDiv.classList.remove('hide')

    if (parseInt(state.showInhibitors) === 100) {
      inhibDiv.classList.remove('both')
      blueSide.classList.remove('hide')
      redSide.classList.add('hide')
    } else if (parseInt(state.showInhibitors) === 200) {
      inhibDiv.classList.remove('both')
      blueSide.classList.add('hide')
      redSide.classList.remove('hide')
    } else {
      inhibDiv.classList.add('both')
      redSide.classList.remove('hide')
      blueSide.classList.remove('hide')
    }
  } else {
    inhibDiv.classList.add('hide')
    inhibDiv.classList.remove('both')
    blueSide.classList.add('hide')
    redSide.classList.add('hide')
  }
}

function ppUpdate(e) {
  const teamDiv = e.team === 100 ? sbBluePP : sbRedPP
  const title = teamDiv.querySelector('.pp-text')
  const timer = teamDiv.querySelector('.timer')
  const gold = teamDiv.querySelector('h1')
  const image = teamDiv.querySelector('img')

  if (!e.ongoing) {
    title.innerText = e.type
    timer.innerText = convertSecsToTime(0)
    gold.innerText = calcK(e.goldDiff || 0)

    teamDiv.classList.add('hide')
  } else {
    title.innerText = e.type
    timer.innerText = convertSecsToTime(e.respawnIn)
    gold.innerText =
      e.goldDiff < 0 ? calcK(e.goldDiff) : '+' + calcK(e.goldDiff)

    if (e.team === 100) {
      teamDiv.style.background = `linear-gradient(to left, var(--blue-team) ${
        e.percent
      }%, var(--background-light-color) ${e.percent + 3}%)`
    }
    if (e.team === 200) {
      sbRedPP.style.backgroundImage = `linear-gradient(to right, var(--red-team) ${
        e.percent
      }%, var(--background-light-color) ${e.percent + 3}%)`
    }
    if (e.type === 'Dragon') {
      image.src = 'img/elder.png'
      teamDiv.classList.add('dragon')
      teamDiv.classList.remove('baron')
    } else {
      image.src = 'img/baron.png'
      teamDiv.classList.remove('dragon')
      teamDiv.classList.add('baron')
    }

    if (teamDiv.classList.contains('hide')) {
      setTimeout(() => {
        teamDiv.classList.remove('hide')
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

const sbBlueScore = scoreboard.querySelector('.sb-score-blue')
const sbRedScore = scoreboard.querySelector('.sb-score-red')
const tournamentDiv = document.querySelector('#tournament')
const roundOfSpan = tournamentDiv.querySelector('.phase')
const nameSpan = tournamentDiv.querySelector('.name')
const roundOfMap = {
  0: 'Upper Bracket Final',
  1: 'Upper Bracket Final',
  2: 'Finals',
  4: 'Semi Finals',
  8: 'Quarter Finals'
}

function changeColors(e) {
  sbBlueTag.innerText = e.teams.blueTeam?.tag || 'Tag'
  sbRedTag.innerText = e.teams.redTeam?.tag || 'Tag'
  sbBlueLogo.style.display = `none`
  sbRedLogo.style.display = `none`
  sbBlueStanding.innerText = e.teams.blueTeam?.standing || ''
  sbRedStanding.innerText = e.teams.redTeam?.standing || ''

  roundOfSpan.textContent =
    e.roundOf <= 8 ? roundOfMap[e.roundOf] : `Round of ${e.roundOf}`
  nameSpan.textContent = e.tournamentName
  resizeText(tournamentDiv)

  if (e.teams.blueTeam?.logo !== undefined && e.teams.blueTeam?.logo !== '') {
    sbBlueLogo.src = `/pages/op-module-teams/img/${e.teams.blueTeam.logo}`
    sbBlueLogo.style.display = 'block'
  }
  if (e.teams.redTeam?.logo !== undefined && e.teams.redTeam?.logo !== '') {
    sbRedLogo.src = `/pages/op-module-teams/img/${e.teams.redTeam.logo}`
    sbRedLogo.style.display = 'block'
  }

  sbBlueScore.innerHTML = ''
  sbRedScore.innerHTML = ''

  for (let i = 0; i < Math.ceil(e.bestOf / 2); i++) {
    const bluePoint = document.createElement('div')
    bluePoint.classList.add('sb-score-point')
    const redPoint = document.createElement('div')
    redPoint.classList.add('sb-score-point')

    if (e.teams.blueTeam?.score >= i + 1) {
      bluePoint.classList.add('sb-score-point-win')
    }
    if (e.teams.redTeam?.score >= i + 1) {
      redPoint.classList.add('sb-score-point-win')
    }

    sbBlueScore.appendChild(bluePoint)
    sbRedScore.appendChild(redPoint)
  }

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
  if (showLeaderBoard) return

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

  const eventName = eventDiv.querySelector('.event-name')
  eventName.querySelector('span').innerText = e.name
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

  if (event.source === 'Minion') {
    source.src = './img/minion.png'
  } else if (event.source === 'Turret') {
    source.src = './img/tower.png'
  } else if (event.source === 'Baron') {
    source.src = './img/baron-icon.png'
  } else if (event.source === 'Herald') {
    source.src = './img/herald-icon.png'
  } else if (event.source === 'Dragon') {
    source.src = './img/dragon-icon.png'
  } else {
    source.src = `/serve/module-league-static/img/champion/tiles/${event.source}_0.jpg`
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
  if (e.showNicknames !== showNicknames) {
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
  if (e.showTournament !== showTournament) {
    showTournament = e.showTournament
    document.querySelector('#tournament').style.display = e.showTournament
      ? 'flex'
      : 'none'
  }

  if (showScoreBoard !== e.scoreboard.active) {
    showScoreBoard = e.scoreboard.active
    if (!e.scoreboard.active) {
      document.querySelectorAll('.scoreboard').forEach((n) => {
        n.style.display = 'none'
      })
    } else {
      document.querySelectorAll('.scoreboard').forEach((n) => {
        n.style.display = 'flex'
      })
    }
  }

  if (score !== e.scoreboard.score) {
    score = e.scoreboard.score
    if (!e.scoreboard.score) {
      document.querySelectorAll('.sb-score').forEach((n) => {
        n.style.display = 'none'
      })
    } else {
      document.querySelectorAll('.sb-score').forEach((n) => {
        n.style.display = 'flex'
      })
    }
  }

  if (tags !== e.scoreboard.tags) {
    tags = e.scoreboard.tags
    if (!e.scoreboard.tags) {
      document.querySelectorAll('.sb-tag').forEach((n) => {
        n.style.display = 'none'
      })
    } else {
      document.querySelectorAll('.sb-tag').forEach((n) => {
        n.style.display = 'block'
      })
    }
  }

  if (standings !== e.scoreboard.standings) {
    standings = e.scoreboard.standings
    if (!e.scoreboard.standings) {
      document.querySelectorAll('.sb-standing').forEach((n) => {
        n.style.display = 'none'
      })
    } else {
      document.querySelectorAll('.sb-standing').forEach((n) => {
        n.style.display = 'block'
      })
    }
  }

  if (barons !== e.scoreboard.barons) {
    barons = e.scoreboard.barons
    if (!e.scoreboard.barons) {
      document.querySelectorAll('.sb-baron').forEach((n) => {
        n.style.display = 'none'
      })
    } else {
      document.querySelectorAll('.sb-baron').forEach((n) => {
        n.style.display = 'flex'
      })
    }
  }

  if (heralds !== e.scoreboard.heralds) {
    heralds = e.scoreboard.heralds
    if (!e.scoreboard.heralds) {
      document.querySelectorAll('.sb-herald').forEach((n) => {
        n.style.display = 'none'
      })
    } else {
      document.querySelectorAll('.sb-herald').forEach((n) => {
        n.style.display = 'flex'
      })
    }
  }

  if (tower !== e.scoreboard.tower) {
    tower = e.scoreboard.tower
    if (!e.scoreboard.tower) {
      document.querySelectorAll('.sb-tower').forEach((n) => {
        n.style.display = 'none'
      })
    } else {
      document.querySelectorAll('.sb-tower').forEach((n) => {
        n.style.display = 'flex'
      })
    }
  }
}

const players = document.querySelectorAll('#tab .player')
const bluePlayers = document.querySelector('#bluePlayers')
const redPlayers = document.querySelector('#redPlayers')
function highlightPlayer(e) {
  const team = e.teamId === 100 ? bluePlayers : redPlayers

  if (team.children[e.playerId].classList.contains('highlight')) {
    for (const player of players) {
      player.classList.remove('highlight', 'dark')
    }
  } else {
    for (const player of players) {
      player.classList.add('dark')
      player.classList.remove('highlight')
    }
    team.children[e.playerId].classList.add('highlight')
    team.children[e.playerId].classList.remove('dark')
  }
}

function createLeaderBoardItem(player, max, type = 'xp') {
  const lbItem = document.createElement('div')
  lbItem.classList.add('lb-item')
  if (player.team === 100) {
    lbItem.classList.add('blue')
  } else {
    lbItem.classList.add('red')
  }

  const lbChampion = document.createElement('img')
  lbChampion.classList.add('lb-champion')
  lbChampion.src = `/serve/module-league-static/img/champion/tiles/${player.championId}_0.jpg`
  lbItem.appendChild(lbChampion)

  const lbName = document.createElement('h2')
  lbName.classList.add('lb-name')
  lbName.innerText = player.summonerName
  lbItem.appendChild(lbName)

  const lbCount = document.createElement('h2')
  lbCount.classList.add('lb-count')
  if (type === 'xp') {
    lbCount.innerHTML = `${player.level} - <thin>${calcK(
      player.experience
    )}<thin/>`
  } else {
    lbCount.innerText = calcK(player.totalGold)
  }
  lbItem.appendChild(lbCount)

  const lbMeter = document.createElement('meter')
  lbMeter.classList.add('lb-meter')
  lbMeter.max = max
  if (type === 'xp') {
    lbMeter.value = player.experience
  } else {
    lbMeter.value = player.totalGold
  }
  lbItem.appendChild(lbMeter)

  return lbItem
}

const isOverflown = ({
  clientHeight,
  scrollHeight,
  clientWidth,
  scrollWidth
}) => scrollHeight > clientHeight || scrollWidth > clientWidth

const resizeText = (parent) => {
  let i = 10
  let overflow = false
  const maxSize = 50

  while (!overflow && i < maxSize) {
    parent.style.fontSize = `${i}px`
    overflow = isOverflown(parent)
    if (!overflow) i++
  }

  parent.style.fontSize = `${i - 1}px`
}

function secsToMinutesAndSeconds(secs) {
  const minutes = Math.floor(secs / 60);
  const seconds = (secs - minutes * 60).toFixed(0);
  return minutes + ':' + (seconds < 10 ? '0' : '') + seconds
}

/**
 * 
 * @param {any[]} array 
 */
function shrinkArray (array, sliceSize = 30) {
  let newArray = []

  if (array.length < sliceSize) {
    sliceSize = array.length
  }

  for (i = 0; i < array.length - sliceSize + 1; i += sliceSize) {
    const sum = array
      .slice(i, i + sliceSize) //get the range
      .reduce((a,b) => a + b) //sum up
      / sliceSize
    newArray.push(sum)
  }

  return newArray
}

const goldGraphContainer = document.getElementById('gold-graph-container')
const goldGraph = document.getElementById('gold-graph')
const gg2D = goldGraph.getContext('2d')
function showGoldGraph(data) {
  let blue = getComputedStyle(document.body).getPropertyValue('--blue-team')
  let red = getComputedStyle(document.body).getPropertyValue('--red-team')
  const white = 'rgba(250,250,250,1)'
  const whiteTransparent = 'rgba(250,250,250,0.1)'

    // Add new type of chart to chart.js
    Chart.defaults.NegativeTransparentLine = Chart.helpers.clone(
      Chart.defaults.line
    )
    Chart.controllers.NegativeTransparentLine = Chart.controllers.line.extend({
      update: function () {
        // get the min and max values
        var min = Math.min.apply(null, [...this.chart.data.datasets[0].data, -100])
        var max = Math.max.apply(null, [...this.chart.data.datasets[0].data, 100])
        var yScale = this.getScaleForId(this.getDataset().yAxisID)
  
        // figure out the pixels for these and the value 0
        var top = yScale.getPixelForValue(max)
        var zero = yScale.getPixelForValue(0)
        var bottom = yScale.getPixelForValue(min)
  
        // build a gradient that switches color at the 0 point
        var ctx = this.chart.chart.ctx
        var gradient = ctx.createLinearGradient(0, top, 0, bottom)
        var ratio = Math.min((zero - top) / (bottom - top), 1)
        if (ratio < 0) {
          ratio = 0
          gradient.addColorStop(1, red)
        } else if (ratio == 1) {
          gradient.addColorStop(1, blue)
        } else {
          gradient.addColorStop(0, blue)
          gradient.addColorStop(ratio, blue)
          gradient.addColorStop(ratio, red)
          gradient.addColorStop(1, red)
        }
        this.chart.data.datasets[0].backgroundColor = gradient
  
        return Chart.controllers.line.prototype.update.apply(this, arguments)
      }
    })

  const frames = data.goldGraph
  const keys = shrinkArray(Object.keys(frames).map(f => parseInt(f)))
  const values = shrinkArray(Object.values(frames))

  const chart = new Chart(gg2D, {
    type: 'NegativeTransparentLine',
    data: {
      labels: keys,
      datasets: [
        {
          yAxisID: 'y-axis-0',
          strokeColor: white,
          pointColor: white,
          pointStrokeColor: white,
          data: values
        }
      ]
    },
    options: {
      maintainAspectRatio: false,
      responsive: true,
      scales: {
        yAxes: [
          {
            ticks: {
              autoskip: true,
              autoSkipPadding: 50,
              beginAtZero: true,
              stepSize: 500,
              fontSize: 14,
              fontColor: white,
              callback: function (value, index, values) {
                return value.toFixed(0).replace(/-/g, '')
              }
            },
            gridLines: {
              color: whiteTransparent
            }
          }
        ],
        xAxes: [
          {
            ticks: {
              autoskip: true,
              autoSkipPadding: 30,
              fontSize: 14,
              fontColor: white,
              callback: function (value, index, values) {
                return secsToMinutesAndSeconds(value)
              }
            },
            gridLines: {
              color: whiteTransparent
            }
          }
        ]
      },
      legend: {
        display: false
      }
    }
  })

  const interval = setInterval(() => {
    if (!goldGraphContainer.classList.contains('hide')) {
      const frames = gameState.goldGraph
      const keys = shrinkArray(Object.keys(frames).map(f => parseInt(f)))
      const values = shrinkArray(Object.values(frames))
      addData(chart, keys, values)
    } else {
      clearInterval(interval)
      return
    }
  }, 30_000);
}

function addData(chart, labels, newData) {
  chart.data.labels = labels
  chart.data.datasets[0].data = newData
  chart.update()
}

LPTE.onready(async () => {
  LPTE.on('module-league-in-game', 'level-update', levelUpdate)
  LPTE.on('module-league-in-game', 'item-update', itemUpdate)
  LPTE.on('module-league-in-game', 'inhib-update', inhibUpdate)
  LPTE.on('module-league-in-game', 'kill-update', addKill)
  LPTE.on('module-league-in-game', 'platings-update', platingsUpdate)
  LPTE.on('module-league-in-game', 'update', updateGameState)
  LPTE.on('module-league-in-game', 'event', emitEvent)
  LPTE.on('module-league-in-game', 'pp-update', ppUpdate)
  LPTE.on('module-league-in-game', 'name-update', nameUpdate)
  LPTE.on('module-league-in-game', 'set-settings', updateSettings)
  LPTE.on('module-league-in-game', 'highlight-player', highlightPlayer)

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
  LPTE.on('module-league-in-game', 'show-leader-board', (e) => {
    if (e.leaderboard === 'xp') {
      showLeaderBoard = 'xp'
      goldLeaderBoard.classList.remove('show')
      xpLeaderBoard.classList.add('show')
    } else if (e.leaderboard === 'gold') {
      showLeaderBoard = 'gold'
      goldLeaderBoard.classList.add('show')
      xpLeaderBoard.classList.remove('show')
    }
  })
  LPTE.on('module-league-in-game', 'show-platings', (e) => {
    platingDiv.classList.remove('hide')
  })

  LPTE.on('module-league-in-game', 'show-gold-graph', (e) => {
    goldGraphContainer.classList.toggle('hide')
    if (!goldGraphContainer.classList.contains('hide')) {
      showGoldGraph(gameState)
    }
  })

  LPTE.on('module-league-in-game', 'hide-inhibs', () => {
    inhibDiv.classList.add('hide')
    setTimeout(() => {
      inhibDiv.classList.remove('both')
      blueSide.classList.add('hide')
      redSide.classList.add('hide')
    }, 1000)
  })
  LPTE.on('module-league-in-game', 'hide-leader-board', () => {
    goldLeaderBoard.classList.remove('show')
    xpLeaderBoard.classList.remove('show')
    showLeaderBoard = false
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
        setTimeout(
          () => {
            levelUpdate({
              player: i,
              level: e.level,
              team: e.team
            })
          },
          2500 * (i - 5)
        )
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
        setTimeout(
          () => {
            itemUpdate({
              player: i,
              item: 3006,
              team: e.team
            })
          },
          2500 * (i - 5)
        )
      }
    }
  })
  LPTE.on('module-league-in-game', 'test-event', (e) => {
    emitEvent({
      team: e.team,
      name: e.event,
      time: 160000,
      type: e.event
    })
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
