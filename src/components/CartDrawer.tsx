import { useState } from 'react'
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react'
import type { CartItem } from '../types/product'

const money = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)

export function CartDrawer({ items, onClose, onChange, onCheckout }: { items: CartItem[]; onClose: () => void; onChange: (id: number, delta: number) => void; onCheckout: () => void }) {
  const [removeTarget, setRemoveTarget] = useState<CartItem | null>(null)
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const shippingProgress = Math.min(subtotal / 250, 1) * 100
  const remainingForFreeShipping = Math.max(250 - subtotal, 0)
  return <div className="overlay drawer-overlay" onMouseDown={onClose}><aside className="cart-drawer" onMouseDown={event => event.stopPropagation()} aria-label="Seu carrinho">
    <header className="drawer-header"><div><div className="eyebrow">SUA SELEÇÃO</div><h2>Sacola <span>({items.reduce((n, i) => n + i.quantity, 0)})</span></h2></div><button className="icon-button" onClick={onClose} aria-label="Fechar carrinho"><X size={20} /></button></header>
    {items.length === 0 ? <div className="empty-cart"><div className="empty-icon"><ShoppingBag size={24} /></div><h3>Sua sacola está vazia</h3><p>Encontre algo especial para levar para casa.</p><button className="outline-button" onClick={onClose}>Explorar coleção <ArrowRight size={15} /></button></div> : <>
      <div className="cart-items">{items.map(item => { const { product, quantity } = item; return <article className="cart-item" key={product.id}><img src={product.thumbnail} alt={product.title} /><div className="cart-item-info"><strong>{product.title}</strong><span>{money(product.price)}</span><div className="quantity"><button disabled={quantity <= 1} onClick={() => onChange(product.id, -1)} aria-label="Diminuir quantidade"><Minus size={13} /></button><span>{quantity}</span><button onClick={() => onChange(product.id, 1)} aria-label="Aumentar quantidade"><Plus size={13} /></button></div></div><button className="remove-item" onClick={() => setRemoveTarget(item)} aria-label={`Remover ${product.title}`}><Trash2 size={16} /></button></article> })}</div>
      <div className="cart-footer"><div className="shipping-progress"><span>{remainingForFreeShipping > 0 ? `Faltam ${money(remainingForFreeShipping)} para ganhar frete grátis` : 'Você ganhou frete grátis ✨'}</span><div><i style={{ width: `${shippingProgress}%` }} /></div></div><div className="subtotal"><span>Subtotal</span><strong>{money(subtotal)}</strong></div><p>Frete e impostos calculados na finalização.</p><button className="primary-button checkout-button" onClick={onCheckout}>Finalizar compra <ArrowRight size={16} /></button><div className="secure-note">Compra segura · Pagamento protegido</div></div>
    </>}
    {removeTarget && <div className="confirm-backdrop" onMouseDown={() => setRemoveTarget(null)}><section className="confirm-dialog" role="alertdialog" aria-modal="true" aria-labelledby="remove-title" onMouseDown={event => event.stopPropagation()}><h3 id="remove-title">Remover produto?</h3><p>Deseja remover <strong>{removeTarget.product.title}</strong> da sua sacola?</p><div><button className="cancel-remove" onClick={() => setRemoveTarget(null)}>Manter na sacola</button><button className="confirm-remove" onClick={() => { onChange(removeTarget.product.id, -removeTarget.quantity); setRemoveTarget(null) }}>Remover</button></div></section></div>}
  </aside></div>
}
