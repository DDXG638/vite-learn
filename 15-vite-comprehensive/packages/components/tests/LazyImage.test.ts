import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import LazyImage from '../src/LazyImage/index.vue'

const IntersectionObserverMock = vi.fn(() => ({
  disconnect: vi.fn(),
  observe: vi.fn(),
  takeRecords: vi.fn(),
  unobserve: vi.fn(),
}))

vi.stubGlobal('IntersectionObserver', IntersectionObserverMock)

describe('LazyImage', () => {
  it('renders with placeholder', () => {
    const wrapper = mount(LazyImage, {
      props: {
        src: 'test.jpg',
        aspectRatio: '4:3'
      }
    })
    expect(wrapper.find('.lazy-image').exists()).toBe(true)
  })

  it('shows image when firstScreen is true', () => {
    const wrapper = mount(LazyImage, {
      props: {
        src: 'test.jpg',
        firstScreen: true
      }
    })
    expect(wrapper.find('img').exists()).toBe(true)
  })
})
