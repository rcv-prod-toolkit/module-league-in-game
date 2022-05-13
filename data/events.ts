import data from './InGame-data (1).json'

const eventsMap: Map<string, any> = new Map()

function findEvents (): void {
  for (const dataPoint of data as any[]) {
    const events = dataPoint.events.Events as any[]

    for (const event of events) {
      if (!eventsMap.has(event.EventName)) {
        eventsMap.set(event.EventName, event)
      }
    }
  }
}

findEvents()