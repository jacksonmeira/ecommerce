import type { Product, ProductResponse } from '../types/product'

const API = 'https://dummyjson.com'

export async function getProducts({ skip = 0, limit = 12, category, search, sortBy, order }: {
  skip?: number; limit?: number; category?: string; search?: string; sortBy?: string; order?: 'asc' | 'desc'
} = {}): Promise<ProductResponse> {
  const endpoint = category ? `${API}/products/category/${encodeURIComponent(category)}` : search ? `${API}/products/search` : `${API}/products`

  const params = new URLSearchParams({ limit: '0', skip: '0' })
  if (search && !category) params.set('q', search)
  if (sortBy) { params.set('sortBy', sortBy); params.set('order', order ?? 'asc') }
  const response = await fetch(`${endpoint}?${params}`)
  if (!response.ok) throw new Error('Não foi possível carregar os produtos. Tente novamente.')
  const data = await response.json() as ProductResponse
  const products = data.products.filter(product => product.category !== 'groceries')
  return { products: products.slice(skip, skip + limit), total: products.length, skip, limit }
}

export async function getCategories(): Promise<string[]> {
  const response = await fetch(`${API}/products/category-list`)
  if (!response.ok) throw new Error('Não foi possível carregar as categorias.')
  return response.json() as Promise<string[]>
}

export async function getProduct(id: number): Promise<Product> {
  const response = await fetch(`${API}/products/${id}`)
  if (!response.ok) throw new Error('Produto não encontrado.')
  return response.json() as Promise<Product>
}
