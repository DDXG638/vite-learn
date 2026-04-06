export interface ProductListItem {
  id: string
  name: string
  price: number
  image: string
  category: string
}

export interface Product extends ProductListItem {
  description: string
  stock: number
}
