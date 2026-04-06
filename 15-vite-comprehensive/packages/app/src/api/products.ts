import type { Product, ProductListItem } from './types'

const productsData: Product[] = [
  {
    id: '1',
    name: 'iPhone 15 Pro',
    price: 8999,
    image: 'https://picsum.photos/id/1/400/400',
    description: 'iPhone 15 Pro 采用钛金属设计，配备 A17 Pro 芯片，性能强劲。',
    category: '手机',
    stock: 100
  },
  {
    id: '2',
    name: 'MacBook Pro 14',
    price: 15999,
    image: 'https://picsum.photos/id/2/400/400',
    description: 'MacBook Pro 14 英寸搭载 M3 Pro 芯片，性能出色，续航持久。',
    category: '电脑',
    stock: 50
  },
  {
    id: '3',
    name: 'AirPods Pro',
    price: 1899,
    image: 'https://picsum.photos/id/3/400/400',
    description: 'AirPods Pro 采用全新设计，支持主动降噪和空间音频。',
    category: '耳机',
    stock: 200
  },
  {
    id: '4',
    name: 'iPad Air',
    price: 4799,
    image: 'https://picsum.photos/id/4/400/400',
    description: 'iPad Air 轻薄便携，配备 M2 芯片，支持 Apple Pencil。',
    category: '平板',
    stock: 80
  },
  {
    id: '5',
    name: 'Apple Watch Ultra',
    price: 6499,
    image: 'https://picsum.photos/id/5/400/400',
    description: 'Apple Watch Ultra 专为户外探险设计，续航可达 36 小时。',
    category: '手表',
    stock: 60
  },
  {
    id: '6',
    name: 'iMac 24',
    price: 12999,
    image: 'https://picsum.photos/id/6/400/400',
    description: 'iMac 24 英寸配备 M3 芯片，超薄设计，七种颜色可选。',
    category: '电脑',
    stock: 30
  }
]

export async function getProductList(): Promise<ProductListItem[]> {
  // 模拟 API 延迟
  await new Promise(resolve => setTimeout(resolve, 100))
  return productsData.map(({ id, name, price, image, category }) => ({
    id,
    name,
    price,
    image,
    category
  }))
}

export async function getProductDetail(id: string): Promise<Product | null> {
  // 模拟 API 延迟
  await new Promise(resolve => setTimeout(resolve, 100))
  return productsData.find(p => p.id === id) || null
}
