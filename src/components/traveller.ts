import { Animation } from './animation'
import { Counter } from './counter'
import { EventDispatcher } from './eventDispatcher'
import { Target, TargetFinder } from './targetFinder'
import { Vector1D } from './vector1d'

type Params = {
  animation: Animation
  target: Vector1D
  index: Counter
  findTarget: TargetFinder
  events: EventDispatcher
}

export type Traveller = {
  toNext: () => Traveller
  toPrevious: () => Traveller
  toIndex: (target: number) => Traveller
  toDistance: (from: number, distance: number) => Traveller
}

export function Traveller(params: Params): Traveller {
  const { index, findTarget, animation } = params

  function travelTo(next: Target): Traveller {
    const { events, target } = params
    const nextIndex = next.index
    const distanceDiff = next.distance
    const indexDiff = nextIndex !== index.get()

    if (distanceDiff) {
      animation.start()
      target.addNumber(distanceDiff)
    }
    if (indexDiff) {
      index.set(nextIndex)
      events.dispatch('select')
    }

    return self
  }

  function findIndex(target: Counter): Traveller {
    const next = findTarget.byIndex(target.get())
    travelTo(next)
    return self
  }

  function toIndex(target: number): Traveller {
    const next = index.clone().set(target)
    findIndex(next)
    return self
  }

  function toDistance(from: number, distance: number): Traveller {
    const next = findTarget.byDistance(from, distance)
    travelTo(next)
    return self
  }

  function toNext(): Traveller {
    const next = index.clone().add(1)
    findIndex(next)
    return self
  }

  function toPrevious(): Traveller {
    const next = index.clone().add(-1)
    findIndex(next)
    return self
  }

  const self: Traveller = {
    toDistance,
    toIndex,
    toNext,
    toPrevious,
  }
  return Object.freeze(self)
}
