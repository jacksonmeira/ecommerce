import { useCallback, useEffect, useState } from 'react'
import { getProducts } from '../services/products'
import type { Product } from '../types/product'

export function useProducts(category: string, search: string, sortBy: string, page: number, order: 'asc' | 'desc' = 'asc') {
  const [products, setProducts] = useState<Product[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const pageSize = 12
  const load = useCallback(async () => {
    setLoading(true); setError('')
    try {
      const data = await getProducts({ skip: (page - 1) * pageSize, limit: pageSize, category: category || undefined, search: search || undefined, sortBy: sortBy || undefined, order })
      setProducts(data.products); setTotal(data.total)
    } catch (err) { setError(err instanceof Error ? err.message : 'Ocorreu um erro.') }
    finally { setLoading(false) }
  }, [category, search, sortBy, order, page])
  useEffect(() => { void load() }, [load])
  return { products, total, loading, error, pageSize, retry: load }
}
