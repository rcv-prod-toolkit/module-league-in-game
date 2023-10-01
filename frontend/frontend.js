document.querySelector('#settings').addEventListener('submit', (e) => {
  e.preventDefault()

  LPTE.emit({
    meta: {
      namespace: 'module-league-in-game',
      type: 'set-settings',
      version: 1
    },
    items: Array.from(document.querySelector('#items').options)
      .filter((el) => el.selected)
      .map((el) => el.value),
    level: Array.from(document.querySelector('#level').options)
      .filter((el) => el.selected)
      .map((el) => el.value),
    events: Array.from(document.querySelector('#events').options)
      .filter((el) => el.selected)
      .map((el) => el.value),
    killfeed: document.querySelector('#killfeed').checked,
    ppTimer: document.querySelector('#ppTimer').checked,
    delay: parseInt(document.querySelector('#delay').value),
    showNicknames: document.querySelector('#showNicknames').checked,
    showTournament: document.querySelector('#showTournament').checked,
    scoreboard: {
      active: document.querySelector('#scoreboard-active').checked,
      score: document.querySelector('#scoreboard-score').checked,
      tags: document.querySelector('#scoreboard-tags').checked,
      standings: document.querySelector('#scoreboard-standings').checked,
      barons: document.querySelector('#scoreboard-barons').checked,
      heralds: document.querySelector('#scoreboard-heralds').checked,
      tower: document.querySelector('#scoreboard-tower').checked
    }
  })
})

function showInhibs(side) {
  LPTE.emit({
    meta: {
      namespace: 'module-league-in-game',
      type: 'show-inhibs',
      version: 1
    },
    side
  })
}
function showLeaderBoard(leaderboard) {
  LPTE.emit({
    meta: {
      namespace: 'module-league-in-game',
      type: 'show-leader-board',
      version: 1
    },
    leaderboard
  })
}
function showPlatings() {
  LPTE.emit({
    meta: {
      namespace: 'module-league-in-game',
      type: 'show-platings',
      version: 1
    }
  })
}

function hideInhibs() {
  LPTE.emit({
    meta: {
      namespace: 'module-league-in-game',
      type: 'hide-inhibs',
      version: 1
    }
  })
}
function hideLeaderBoard() {
  LPTE.emit({
    meta: {
      namespace: 'module-league-in-game',
      type: 'hide-leader-board',
      version: 1
    }
  })
}
function hidePlatings() {
  LPTE.emit({
    meta: {
      namespace: 'module-league-in-game',
      type: 'hide-platings',
      version: 1
    }
  })
}

function resetGame() {
  LPTE.emit({
    meta: {
      namespace: 'module-league-in-game',
      type: 'reset-game',
      version: 1
    }
  })
}

function testLvl(team) {
  LPTE.emit({
    meta: {
      namespace: 'module-league-in-game',
      type: 'test-level-up',
      version: 1
    },
    team,
    level: document.querySelector('#testLevel').value
  })
}
function testItem(team) {
  LPTE.emit({
    meta: {
      namespace: 'module-league-in-game',
      type: 'test-item',
      version: 1
    },
    team
  })
}
function testEvent(team) {
  LPTE.emit({
    meta: {
      namespace: 'module-league-in-game',
      type: 'test-event',
      version: 1
    },
    team,
    event:
      document.getElementById('events-test').options[
        document.getElementById('events-test').selectedIndex
      ].text
  })
}
function testKillfeed(team) {
  LPTE.emit({
    meta: {
      namespace: 'module-league-in-game',
      type: 'test-killfeed',
      version: 1
    },
    team,
    event:
      document.getElementById('killfeed-test').options[
        document.getElementById('killfeed-test').selectedIndex
      ].text
  })
}

function testPPTimer(shouldShow) {
  LPTE.emit({
    meta: {
      namespace: 'module-league-in-game',
      type: 'pp-update',
      version: 1
    },
    type: document.getElementById('pp-test').options[
      document.getElementById('pp-test').selectedIndex
    ].text,
    ongoing: shouldShow,
    percent: 10,
    goldDiff: 11525,
    respawnIn: 300,
    respawnAt: 0,
    team: 100
  })
}

function initSettings(settings) {
  const itemOptions = document.querySelector('#items').options
  for (let i = 0; i < itemOptions.length; i++) {
    const item = itemOptions[i]

    if (settings.items.includes(item.value)) {
      item.selected = true
    }
  }

  const levelOptions = document.querySelector('#level').options
  for (let i = 0; i < levelOptions.length; i++) {
    const level = levelOptions[i]

    if (settings.level.includes(level.value)) {
      level.selected = true
    }
  }

  const eventsOptions = document.querySelector('#events').options
  for (let i = 0; i < eventsOptions.length; i++) {
    const event = eventsOptions[i]

    if (settings.events.includes(event.value)) {
      event.selected = true
    }
  }

  document.querySelector('#killfeed').checked = settings.killfeed
  document.querySelector('#ppTimer').checked = settings.ppTimer
  document.querySelector('#delay').value = settings.delay
  document.querySelector('#showNicknames').checked = settings.showNicknames
  document.querySelector('#showTournament').checked = settings.showTournament

  document.querySelector('#scoreboard-active').checked =
    settings.scoreboard.active
  document.querySelector('#scoreboard-score').checked =
    settings.scoreboard.score
  document.querySelector('#scoreboard-tags').checked = settings.scoreboard.tags
  document.querySelector('#scoreboard-standings').checked =
    settings.scoreboard.standings
  document.querySelector('#scoreboard-barons').checked =
    settings.scoreboard.barons
  document.querySelector('#scoreboard-heralds').checked =
    settings.scoreboard.heralds
  document.querySelector('#scoreboard-tower').checked =
    settings.scoreboard.tower
}

let server = ''

LPTE.onready(async () => {
  server = await window.constants.getWebServerPort()
  const location = `${window.location.protocol}//${server}/pages/op-module-league-in-game/gfx`

  const apiKey = await window.constants.getApiKey()

  document.querySelector('#ingame-embed').value = `${location}/ingame.html${
    apiKey !== null ? '?apikey=' + apiKey : ''
  }`
  document.querySelector('#ingame-gfx').src = `${location}/ingame.html${
    apiKey !== null ? '?apikey=' + apiKey : ''
  }`

  const settings = await LPTE.request({
    meta: {
      namespace: 'module-league-in-game',
      type: 'get-settings',
      version: 1
    }
  })
  initSettings(settings)

  LPTE.on('module-league-in-game', 'set-settings', initSettings)
})
