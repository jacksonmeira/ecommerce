import { useEffect, useMemo, useState } from 'react'
import { ArrowRight, Check, ChevronDown, Heart, Menu, Moon, Search, ShoppingBag, SlidersHorizontal, Sun, X } from 'lucide-react'
import { CartDrawer } from './components/CartDrawer'
import { ProductCard } from './components/ProductCard'
import { ProductModal } from './components/ProductModal'
import { getCategories } from './services/products'
import { useProducts } from './hooks/useProducts'
import type { CartItem, Product } from './types/product'
import { categoryLabel } from './utils/categoryLabels'

const readStorage = <T,>(key: string, fallback: T): T => {
  try { return JSON.parse(localStorage.getItem(key) || 'null') ?? fallback } catch { return fallback }
}

const categoryCards = [
  { id: 'furniture', image: 'photo-1616486338812-3dadae4b4ace' },
  { id: 'beauty', image: 'photo-1608248543803-ba4f8c70ae0b' },
  { id: 'smartphones', image: 'photo-1511707171634-5f897ff02aa9' },
  { id: 'womens-bags', image: 'photo-1584917865442-de89df76afd3' },
  { id: 'fragrances', image: 'photo-1594035910387-fea47794261f' },
  { id: 'sunglasses', image: 'photo-1511499767150-a48a237f0083' },
]

function App() {
  const [category, setCategory] = useState('')
  const [query, setQuery] = useState('')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('')
  const [page, setPage] = useState(1)
  const [categories, setCategories] = useState<string[]>([])
  const [cart, setCart] = useState<CartItem[]>(() => readStorage('atelier-cart', []))
  const [favorites, setFavorites] = useState<number[]>(() => readStorage('atelier-favorites', []))
  const [theme, setTheme] = useState<'light' | 'dark'>(() => readStorage('atelier-theme', 'light'))
  const [cartOpen, setCartOpen] = useState(false)
  const [mobileMenu, setMobileMenu] = useState(false)
  const [selected, setSelected] = useState<Product | null>(null)
  const [checkoutDone, setCheckoutDone] = useState(false)
  const [toast, setToast] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [onlyFavorites, setOnlyFavorites] = useState(false)
  const [priceLimit, setPriceLimit] = useState(2000)

  useEffect(() => { void getCategories().then(setCategories).catch(() => setCategories([])) }, [])
  useEffect(() => { localStorage.setItem('atelier-cart', JSON.stringify(cart)) }, [cart])
  useEffect(() => { localStorage.setItem('atelier-favorites', JSON.stringify(favorites)) }, [favorites])
  useEffect(() => {
    localStorage.setItem('atelier-theme', JSON.stringify(theme))
    document.documentElement.dataset.theme = theme
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#17191d' : '#ffffff')
  }, [theme])
  useEffect(() => { const timer = window.setTimeout(() => { setSearch(query.trim()); setPage(1); if (query.trim()) document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' }) }, 350); return () => window.clearTimeout(timer) }, [query])
  useEffect(() => { if (!toast) return; const timer = window.setTimeout(() => setToast(''), 2600); return () => window.clearTimeout(timer) }, [toast])

  const [sortBy, order] = sort ? sort.split(':') : ['', 'asc']
  const { products, total, loading, error, pageSize, retry } = useProducts(category, search, sortBy, page, order as 'asc' | 'desc')
  const visibleCategories = categories.filter(item => item !== 'groceries')
  const visibleProducts = useMemo(() => products.filter(product => product.price <= priceLimit && (!onlyFavorites || favorites.includes(product.id))), [products, priceLimit, onlyFavorites, favorites])
  const pages = Math.max(1, Math.ceil(total / pageSize))
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  const addToCart = (product: Product, quantity = 1) => {
    setCart(current => {
      const found = current.find(item => item.product.id === product.id)
      return found
        ? current.map(item => item.product.id === product.id ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock) } : item)
        : [...current, { product, quantity }]
    })
    setToast(`${product.title} adicionado à sacola`)
  }
  const changeQuantity = (id: number, delta: number) => setCart(current => current.map(item => item.product.id === id ? { ...item, quantity: item.quantity + delta } : item).filter(item => item.quantity > 0))
  const toggleFavorite = (id: number) => setFavorites(current => current.includes(id) ? current.filter(favorite => favorite !== id) : [...current, id])
  const chooseCategory = (value: string) => {
    setCategory(value); setPage(1); setMobileMenu(false)
    document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' })
  }
  const resetCollection = () => { setCategory(''); setQuery(''); setSearch(''); setPage(1); setMobileMenu(false) }
  const showAllProducts = () => {
    resetCollection()
    document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' })
  }
  const goHome = () => {
    resetCollection()
    setSort('')
    setOnlyFavorites(false)
    setPriceLimit(2000)
    setShowFilters(false)
    setMobileMenu(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const changePage = (nextPage: number) => {
    setPage(nextPage)
    document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return <div className="app-shell" data-theme={theme}>
    <header className="site-header">
      <button className="mobile-menu icon-button" onClick={() => setMobileMenu(!mobileMenu)} aria-label="Abrir menu">{mobileMenu ? <X /> : <Menu />}</button>
      <button type="button" className="brand brand-home" onClick={goHome} aria-label="Voltar ao início da loja"><span className="brand-word">Loja virtual</span></button>
      <label className="header-search"><Search size={18} /><input aria-label="Buscar produtos" placeholder="Buscar produtos e marcas" value={query} onChange={event => setQuery(event.target.value)} /></label>
      <div className="header-actions">
        <button className="icon-button theme-toggle" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} aria-label="Alternar tema">{theme === 'light' ? <Moon size={19} /> : <Sun size={19} />}</button>
        <button className="bag-button" onClick={() => setCartOpen(true)} aria-label={`Sacola com ${cartCount} itens`}><ShoppingBag size={19} /><span>Sacola</span><i>{cartCount}</i></button>
      </div>
    </header>
    <nav className={`main-nav ${mobileMenu ? 'nav-open' : ''}`} aria-label="Categorias">
      <button className={!category ? 'nav-selected' : ''} onClick={showAllProducts}>Todas as peças</button>
      {visibleCategories.slice(0, 8).map(item => <button className={category === item ? 'nav-selected' : ''} key={item} onClick={() => chooseCategory(item)}>{categoryLabel(item)}</button>)}
      <button className="nav-deals" onClick={() => { setSort('discountPercentage:desc'); setPage(1); document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' }) }}>Ofertas</button>
    </nav>

    <main id="top" className="store-main">
      <>
        <section className="banner-grid" aria-label="Destaques">
          <button className="banner-card banner-main" onClick={() => chooseCategory('furniture')}>
            <img src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1500&q=85" alt="Sala com móveis e decoração em tons naturais" />
            <span className="banner-shade" /><span className="banner-copy"><small>CASA, DO SEU JEITO</small><strong>Um espaço<br />com a sua cara.</strong><i>Descobrir móveis <ArrowRight size={15} /></i></span>
          </button>
          <button className="banner-card banner-beauty" onClick={() => chooseCategory('beauty')}>
            <img src="https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=900&q=85" alt="Produtos de autocuidado" />
            <span className="banner-shade" /><span className="banner-copy"><small>BELEZA E AUTOCUIDADO</small><strong>Um cuidado<br />só seu.</strong><i>Ver bem-estar <ArrowRight size={15} /></i></span>
          </button>
          <button className="banner-card banner-tech" onClick={() => chooseCategory('smartphones')}>
            <img src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=85" alt="Smartphone em destaque" />
            <span className="banner-shade" /><span className="banner-copy"><small>TECNOLOGIA NO SEU RITMO</small><strong>Tecnologia que<br />acompanha você.</strong><i>Explorar <ArrowRight size={15} /></i></span>
          </button>
        </section>

        <section className="category-section"><div className="compact-heading"><h2>Explore categorias</h2></div><div className="category-row">{categoryCards.map(item => <button className="category-card" key={item.id} onClick={() => chooseCategory(item.id)}><span><img src={`https://images.unsplash.com/${item.image}?auto=format&fit=crop&w=360&q=80`} alt="" loading="lazy" /></span><strong>{categoryLabel(item.id)}</strong></button>)}</div></section>
      </>

      <section id="collection" className="collection-section">
        <div className="compact-heading collection-heading"><div><h2>{search ? `Resultados para “${search}”` : category ? categoryLabel(category) : onlyFavorites ? 'Seus favoritos' : 'Escolhas para você'}</h2><span>{total} produtos</span></div><button className="view-all" onClick={resetCollection}>Ver coleção completa <ArrowRight size={15} /></button></div>
        <div className="toolbar"><div><button className="filter-trigger" onClick={() => setShowFilters(!showFilters)}><SlidersHorizontal size={16} /> Filtros <ChevronDown size={13} /></button><span>{total} produtos</span></div><label className="sort-control">Ordenar por <select value={sort} onChange={event => { setSort(event.target.value); setPage(1) }}><option value="">Relevância</option><option value="price:asc">Menor preço</option><option value="price:desc">Maior preço</option><option value="rating:desc">Mais bem avaliados</option><option value="title:asc">Nome A–Z</option></select><ChevronDown size={14} /></label></div>
        {showFilters && <aside className="filter-popover"><div className="filter-group"><strong>Categoria</strong><button className={!category ? 'active-filter' : ''} onClick={() => chooseCategory('')}>Todas as peças</button>{visibleCategories.map(item => <button className={category === item ? 'active-filter' : ''} key={item} onClick={() => chooseCategory(item)}>{categoryLabel(item)}</button>)}</div><label className="price-range">Preço até R$ {priceLimit}<input type="range" min="20" max="2000" step="20" value={priceLimit} onChange={event => setPriceLimit(Number(event.target.value))} /></label><label className="favorites-filter"><input type="checkbox" checked={onlyFavorites} onChange={event => setOnlyFavorites(event.target.checked)} /><Heart size={15} /> Mostrar apenas favoritos</label><button className="clear-filters" onClick={() => { setCategory(''); setOnlyFavorites(false); setPriceLimit(2000) }}>Limpar filtros</button></aside>}
        {error ? <div className="status-panel"><h3>Não foi possível carregar os produtos</h3><p>{error}</p><button className="outline-button" onClick={() => void retry()}>Tentar novamente <ArrowRight size={15} /></button></div> : loading ? <div className="product-grid">{Array.from({ length: 10 }, (_, i) => <div className="skeleton-card" key={i}><div className="skeleton-image" /><div className="skeleton-line" /><div className="skeleton-line short" /><div className="skeleton-line tiny" /></div>)}</div> : visibleProducts.length ? <div className="product-grid">{visibleProducts.map(product => <ProductCard key={product.id} product={product} onAdd={item => addToCart(item)} onOpen={setSelected} favorite={favorites.includes(product.id)} onFavorite={toggleFavorite} />)}</div> : <div className="status-panel"><h3>Nenhum produto encontrado</h3><p>{onlyFavorites ? 'Toque no coração de um produto para salvá-lo aqui.' : 'Tente ajustar os filtros para encontrar o que procura.'}</p><button className="outline-button" onClick={() => { setOnlyFavorites(false); setPriceLimit(2000); resetCollection() }}>Limpar filtros <ArrowRight size={15} /></button></div>}
        {!loading && !error && total > pageSize && <div className="pagination"><span>Página <strong>{page}</strong> de <strong>{pages}</strong></span><div><button disabled={page === 1} onClick={() => changePage(page - 1)} aria-label="Página anterior">←</button>{Array.from({ length: Math.min(5, pages) }, (_, i) => { const number = Math.min(Math.max(page - 2, 1) + i, pages); return <button className={page === number ? 'current-page' : ''} key={number} onClick={() => changePage(number)}>{number}</button> })}<button disabled={page === pages} onClick={() => changePage(page + 1)} aria-label="Próxima página">→</button></div></div>}
      </section>

      <section className="promo-row" aria-label="Coleções em destaque"><button onClick={() => chooseCategory('womens-bags')}><img src="https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=85" alt="Bolsa em couro" /><span><small>DETALHES QUE FICAM</small><strong>Seu próximo<br />favorito está aqui.</strong><i>Descobrir <ArrowRight size={15} /></i></span></button><button onClick={() => chooseCategory('fragrances')}><img src="https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1000&q=85" alt="Fragrância" /><span><small>UM PRESENTE PARA VOCÊ</small><strong>Pequenos prazeres,<br />todos os dias.</strong><i>Ver fragrâncias <ArrowRight size={15} /></i></span></button></section>
    </main>

    <footer className="site-footer"><button type="button" className="brand brand-home" onClick={goHome} aria-label="Voltar ao início da loja"><span className="brand-word">Loja virtual</span></button><span>© 2026 Todos os direitos reservados.</span></footer>
    {cartOpen && <CartDrawer items={cart} onClose={() => setCartOpen(false)} onChange={changeQuantity} onCheckout={() => { setCart([]); setCartOpen(false); setCheckoutDone(true) }} />}
    {selected && <ProductModal product={selected} onClose={() => setSelected(null)} onAdd={addToCart} />}
    {checkoutDone && <div className="overlay" onMouseDown={() => setCheckoutDone(false)}><section className="success-modal" onMouseDown={event => event.stopPropagation()}><button className="icon-button modal-close" onClick={() => setCheckoutDone(false)} aria-label="Fechar"><X size={20} /></button><span className="success-check"><Check size={26} /></span><div className="eyebrow">PEDIDO CONFIRMADO</div><h2>Que bom ter você por aqui.</h2><p>Esta é uma demonstração de compra. Seu pedido foi finalizado com sucesso!</p><button className="primary-button" onClick={() => setCheckoutDone(false)}>Continuar explorando <ArrowRight size={15} /></button></section></div>}
    {toast && <div className="toast"><Check size={16} />{toast}<button onClick={() => setToast('')} aria-label="Fechar"><X size={14} /></button></div>}
  </div>
}

export default App
