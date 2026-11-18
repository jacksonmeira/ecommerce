const labels: Record<string, string> = {
  beauty: 'Beleza',
  fragrances: 'Fragrâncias',
  furniture: 'Móveis',
  groceries: 'Mercearia',
  'home-decoration': 'Decoração',
  'kitchen-accessories': 'Acessórios de cozinha',
  laptops: 'Notebooks',
  'mens-shirts': 'Camisas masculinas',
  'mens-shoes': 'Calçados masculinos',
  'mens-watches': 'Relógios masculinos',
  'mobile-accessories': 'Acessórios para celular',
  motorcycle: 'Motocicletas',
  'skin-care': 'Cuidados com a pele',
  smartphones: 'Celulares',
  'sports-accessories': 'Acessórios esportivos',
  sunglasses: 'Óculos de sol',
  tablets: 'Tablets',
  tops: 'Blusas',
  vehicle: 'Automóveis',
  'womens-bags': 'Bolsas femininas',
  'womens-dresses': 'Vestidos femininos',
  'womens-jewellery': 'Joias femininas',
  'womens-shoes': 'Calçados femininos',
  'womens-watches': 'Relógios femininos',
}

export function categoryLabel(category: string): string {
  return labels[category] ?? category.replaceAll('-', ' ').replace(/^\w/, letter => letter.toUpperCase())
}
