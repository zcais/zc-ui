import type { InjectionKey, Ref } from 'vue'

export interface CarouselItemData {
  uid: number
  name?: string | number
}

export interface CarouselContext {
  activeIndex: Ref<number>
  items: Ref<CarouselItemData[]>
  isCard: Ref<boolean>
  loop: Ref<boolean>
  addItem: (item: CarouselItemData) => void
  removeItem: (uid: number) => void
  setActiveItem: (index: number) => void
}

export const CAROUSEL_KEY: InjectionKey<CarouselContext> = Symbol('zcCarousel')
