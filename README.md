# E-commerce

Uma experiência de e-commerce responsiva para portfólio, criada com React, TypeScript, Vite, Tailwind CSS e a API pública do [DummyJSON](https://dummyjson.com/).

## Começar

```bash
npm install
npm run dev
```

Para gerar a versão de produção:

```bash
npm run build
npm run preview
```

## Funcionalidades

- Catálogo conectado à API com busca, filtros por categoria e preço, ordenação e paginação.
- Detalhes do produto, favoritos, sacola com controle de quantidade e finalização demonstrativa.
- Tema claro/escuro e estado de sacola, tema e favoritos persistidos no navegador.
- Layout responsivo, estados de carregamento, mensagens de erro e interface em português.

## Organização

```text
src/
├── components/       # CartDrawer, ProductCard e ProductModal
├── hooks/            # Estado e carregamento do catálogo
├── services/         # Integração HTTP com DummyJSON
├── types/            # Modelos TypeScript
├── App.tsx           # Composição da experiência e estado global da página
├── index.css         # Entrada das diretivas Tailwind e fontes
└── global.css        # Tokens, layout e estilos responsivos
```

O checkout é propositalmente uma simulação de interface; não processa pagamentos nem cria pedidos reais.
