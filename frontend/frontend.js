$('#ingame-embed').val(
  `${location.href}/gfx/ingame.html${
    window.apiKey !== null ? '?apikey=' + window.apiKey : ''
  }`
)

const namespace = 'module-league-in-game'

$('#settings').on('submit', (e) => {
  e.preventDefault()

  LPTE.emit({
    meta: {
      namespace,
      type: 'set-settings',
      version: 1
    },
    items: $('#items').val(),
    level: $('#level').val()
  })
})

function showInhibs(side) {
  LPTE.emit({
    meta: {
      namespace,
      type: 'show-inhibs',
      version: 1
    },
    side
  })
}

function hideInhibs() {
  LPTE.emit({
    meta: {
      namespace,
      type: 'hide-inhibs',
      version: 1
    }
  })
}

function testLvl(team) {
  LPTE.emit({
    meta: {
      namespace,
      type: 'test-level-up',
      version: 1
    },
    team,
    level: $('#testLevel').val()
  })
}
function testItem(team) {
  LPTE.emit({
    meta: {
      namespace,
      type: 'test-item',
      version: 1
    },
    team
  })
}

function initSettings(settings) {
  $('#items').val(settings.items)
  $('#level').val(settings.level)
}

LPTE.onready(async () => {
  const settings = await LPTE.request({
    meta: {
      namespace,
      type: 'get-settings',
      version: 1
    }
  })
  initSettings(settings)

  LPTE.on(namespace, 'set-settings', initSettings)
})
