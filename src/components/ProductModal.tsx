import { ShoppingBag, Star, X } from 'lucide-react'
import type { Product } from '../types/product'

const money = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)

export function ProductModal({ product, onClose, onAdd }: { product: Product; onClose: () => void; onAdd: (product: Product, quantity: number) => void }) {
  return <div className="overlay" onMouseDown={onClose}><section className="detail-modal" onMouseDown={event => event.stopPropagation()} role="dialog" aria-modal="true" aria-label={product.title}>
    <button className="icon-button modal-close" onClick={onClose} aria-label="Fechar"><X size={20} /></button>
    <div className="detail-image"><img src={product.images?.[0] || product.thumbnail} alt={product.title} /></div>
    <div className="detail-content"><div className="eyebrow">{product.brand || product.category}</div><h2>{product.title}</h2><div className="detail-rating"><Star size={15} fill="currentColor" /> {product.rating.toFixed(1)} <span>•</span> {product.stock} unidades disponíveis</div><p>{product.description}</p><div className="detail-price">{money(product.price)}<small> em até 3x sem juros</small></div><button className="primary-button detail-cta" onClick={() => { onAdd(product, 1); onClose() }}><ShoppingBag size={17} /> Adicionar ao carrinho</button><div className="shipping-note">✓ Frete grátis para compras acima de R$ 250</div></div>
  </section></div>
}
