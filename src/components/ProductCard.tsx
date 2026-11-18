import { Heart, Plus, Star } from 'lucide-react'
import type { Product } from '../types/product'
import { categoryLabel } from '../utils/categoryLabels'

const money = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)

export function ProductCard({ product, onAdd, onOpen, favorite, onFavorite }: {
  product: Product; onAdd: (product: Product) => void; onOpen: (product: Product) => void; favorite: boolean; onFavorite: (id: number) => void
}) {
  return <article className="product-card">
    <button className="product-image" onClick={() => onOpen(product)} aria-label={`Ver ${product.title}`}>
      <img src={product.thumbnail} alt={product.title} loading="lazy" />
      {product.discountPercentage > 12 && <span className="discount">-{Math.round(product.discountPercentage)}%</span>}
    </button>
    <button className={`favorite ${favorite ? 'is-favorite' : ''}`} onClick={() => onFavorite(product.id)} aria-label={favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}><Heart size={17} fill={favorite ? 'currentColor' : 'none'} /></button>
    <div className="product-info">
      <div className="product-category">{categoryLabel(product.category)}</div>
      <button className="product-title" onClick={() => onOpen(product)}>{product.title}</button>
      <div className="rating"><Star size={13} fill="currentColor" /> <span>{product.rating.toFixed(1)}</span><span className="stock-note"> · {product.stock > 0 ? 'Em estoque' : 'Indisponível'}</span></div>
      <div className="product-bottom"><strong>{money(product.price)}</strong><button className="add-button" onClick={() => onAdd(product)} aria-label={`Adicionar ${product.title} ao carrinho`}><Plus size={17} /></button></div>
    </div>
  </article>
}
