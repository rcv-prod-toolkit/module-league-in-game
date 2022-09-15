document.querySelector('#settings').addEventListener('submit', (e) => {
  e.preventDefault()

  LPTE.emit({
    meta: {
      namespace: 'module-league-in-game',
      type: 'set-settings',
      version: 1
    },
    items: document.querySelector('#items').value,
    level: document.querySelector('#level').value
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

function hideInhibs() {
  LPTE.emit({
    meta: {
      namespace: 'module-league-in-game',
      type: 'hide-inhibs',
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

function initSettings(settings) {
  document.querySelector('#items').value = settings.items
  document.querySelector('#level').value = settings.level
}

LPTE.onready(async () => {
  const port =  await window.constants.getWebServerPort()
  const location = `http://localhost:${port}/pages/op-module-league-in-game/gfx`

  const apiKey =  await window.constants.getApiKey()

  document.querySelector('#ingame-embed').value = `${location}/ingame.html${apiKey !== null ? '?apikey=' + apiKey: ''}`
  document.querySelector('#ingame-gfx').src = `${location}/ingame.html${apiKey !== null ? '?apikey=' + apiKey: ''}`

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
