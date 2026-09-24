# Bio no Link — Faculdade Inspirar (Rede Nacional: 37 Unidades)

> Sistema centralizado de links na bio (Linktree multi-unidades) para todas as **37 unidades** da Faculdade Inspirar com atualização por prompt no Antigravity, expiração automática de eventos, fotos reais de cada campus e checagem de links quebrados.

---

## 📌 Visão Geral

- **Hub Central (`index.html`)**: Página principal com busca instantânea por cidade, estado e filtro por regiões (Todas, Sul, Sudeste, Centro-Oeste, Nordeste, Norte, Internacional), atalhos diretos para WhatsApp e Instagram, e direcionamento para a página oficial da bio de cada campus.
- **Páginas Oficiais por Unidade (`/[slug]/index.html`)**: Cada uma das 37 unidades da Faculdade Inspirar possui seu próprio link direto e independente para colocar na bio do Instagram (ex: `/curitiba/`, `/belem/`, `/campo-grande/`, `/rio-de-janeiro/`, etc.).
- **Fotos Reais dos Campi**: 135 fotografias reais de 22 unidades importadas e normalizadas (`assets/images/units/<slug>/`), com galerias interativas para visualização no celular.
- **Preservação Visual 100% Inspirar**: Tipografia proprietária `AmpleSoft Pro`, paleta oficial Inspirar (Azul e Ciano), selo de autenticidade verificado, tema escuro moderno e responsivo.
- **Dois recursos essenciais do projeto**:
  1. ⏳ **Eventos com data de início e fim**: Eventos com prazo de validade desaparecem sozinhos após a data de encerramento (`endDate`), eliminando links antigos de eventos passados.
  2. 🔍 **Verificador de links quebrados**: Ferramenta automática que audita todos os links cadastrados e gera relatórios em JSON e Markdown antes que algum aluno encontre um erro.

---

## 🏛️ Unidades Cadastradas (37 Unidades)

1. **Balneário Camboriú (SC)** (`/balneario-camboriu/`) 📸 *Com fotos da unidade*
2. **Bauru (SP)** (`/bauru/`) 📸 *Com fotos da unidade*
3. **Belém (PA)** (`/belem/`) 📸 *Com fotos da unidade*
4. **Belo Horizonte (MG)** (`/belo-horizonte/`) 📸 *Com fotos da unidade*
5. **Blumenau (SC)** (`/blumenau/`) 📸 *Com fotos da unidade*
6. **Brasília (DF)** (`/brasilia/`) 📸 *Com fotos da unidade*
7. **Campinas (SP)** (`/campinas/`) 📸 *Com fotos da unidade*
8. **Campo Grande (MS)** (`/campo-grande/`) 📸 *Com fotos da unidade*
9. **Cuiabá (MT)** (`/cuiaba/`) 📸 *Com fotos da unidade*
10. **Curitiba (PR)** (`/curitiba/`) 📸 *Com fotos da unidade (Original + Extras)*
11. **Dourados (MS)** (`/dourados/`)
12. **Florianópolis (SC)** (`/florianopolis/`) 📸 *Com fotos da unidade*
13. **Fortaleza (CE)** (`/fortaleza/`)
14. **Goiânia (GO)** (`/goiania/`)
15. **Guarulhos (SP)** (`/guarulhos/`) 📸 *Com fotos da unidade*
16. **Ipatinga (MG)** (`/ipatinga/`)
17. **Joinville (SC)** (`/joinville/`)
18. **Londrina (PR)** (`/londrina/`) 📸 *Com fotos da unidade*
19. **Luanda (Angola)** (`/luanda/`) 🌍 *Unidade Internacional*
20. **Maceió (AL)** (`/maceio/`)
21. **Parauapebas (PA)** (`/parauapebas/`)
22. **Porto Alegre (RS)** (`/porto-alegre/`) 📸 *Com fotos da unidade*
23. **Porto Velho (RO)** (`/porto-velho/`)
24. **Ribeirão Preto (SP)** (`/ribeirao-preto/`)
25. **Rio de Janeiro (RJ)** (`/rio-de-janeiro/`) 📸 *Com fotos da unidade*
26. **Salvador (BA)** (`/salvador/`)
27. **Santo André (SP)** (`/santo-andre/`)
28. **Santos (SP)** (`/santos/`)
29. **São José do Rio Preto (SP)** (`/sao-jose-do-rio-preto/`)
30. **São José dos Campos (SP)** (`/sao-jose-dos-campos/`) 📸 *Com fotos da unidade*
31. **São Luís (MA)** (`/sao-luis/`) 📸 *Com fotos da unidade*
32. **São Paulo - Borba Gato (SP)** (`/sao-paulo-borba-gato/`) 📸 *Com fotos da unidade*
33. **São Paulo - Vila Mariana (SP)** (`/sao-paulo-vila-mariana/`) 📸 *Com fotos da unidade*
34. **Sorocaba (SP)** (`/sorocaba/`) 📸 *Com fotos da unidade*
35. **Teresina (PI)** (`/teresina/`)
36. **Uberlândia (MG)** (`/uberlandia/`) 📸 *Com fotos da unidade*
37. **Vitória (ES)** (`/vitoria/`) 📸 *Com fotos da unidade*

---

## 🗂️ Estrutura do Projeto

```text
Bio num link/
├── assets/
│   ├── css/
│   │   └── style.css                     # Design System oficial Inspirar
│   ├── fonts/
│   │   └── ample-soft-pro/               # Família tipográfica completa
│   └── images/
│       ├── Logo branca - horizontal.png  # Marca Inspirar em alta definição
│       ├── UNIDADE CWB sem gourmet.png   # Imagem da fachada
│       └── units/                        # Fotos reais das unidades (135 fotos)
├── data/
│   └── units.json                        # Fonte única da verdade (37 unidades)
├── scripts/
│   ├── build.js                          # Gerador estático do Hub e das páginas
│   ├── import-photos.js                  # Ingestão e normalização de fotos
│   ├── generate-catalog.js               # Gerador/sincronizador do catálogo
│   ├── validate-data.js                  # Validador de esquema, datas e slugs
│   ├── test-event-dates.js               # Teste de expiração automática de eventos
│   ├── check-links.js                    # Auditor e verificador de links quebrados
│   └── verify-all.js                     # Suíte de verificação completa (Gates 1-6)
├── reports/
│   ├── link-audit.json                   # Relatório estruturado de checagem de links
│   └── link-audit.md                     # Relatório formatado em tabela Markdown
├── [slug]/index.html                     # 37 páginas independentes de unidade
├── index.html                            # Hub Principal com Busca e Filtros
├── GATES.md                              # Critérios de aceitação e verificações
├── PROMPTS.md                            # Guia de atualização por prompt
└── package.json                          # Scripts de automação
```

---

## 🚀 Como Executar

### 1. Construir o site estático (Hub + 37 Unidades)
```bash
npm run build
# ou
node scripts/build.js
```

### 2. Importar e normalizar fotos de unidades
```bash
npm run import-photos
# ou
node scripts/import-photos.js
```

### 3. Verificar integridade dos dados (37 unidades)
```bash
npm run validate
# ou
node scripts/validate-data.js
```

### 4. Testar expiração de eventos
```bash
npm run test:dates
# ou
node scripts/test-event-dates.js
```

### 5. Verificar links quebrados (336 URLs auditadas)
```bash
# Validação sintática rápida
npm run check-links:dry

# Checagem HTTP online completa
npm run check-links
```

### 6. Rodar todos os testes de aceitação (Gates 1-6)
```bash
npm test
# ou
node scripts/verify-all.js
```

---

## 🌐 Como Funciona a Hospedagem e os Links na Bio

Como todas as páginas são geradas estaticamente em diretórios limpos:
- **Instagram de Curitiba**: Coloca o link `https://seusite.com.br/curitiba/`
- **Instagram de Belém**: Coloca o link `https://seusite.com.br/belem/`
- **Instagram de Campo Grande**: Coloca o link `https://seusite.com.br/campo-grande/`
- **Instagram de SP Borba Gato**: Coloca o link `https://seusite.com.br/sao-paulo-borba-gato/`
- **Hub Geral**: Coloca o link `https://seusite.com.br/`

Compatível com qualquer servidor ou hospedagem gratuita (GitHub Pages, Vercel, Netlify, Cloudflare Pages, Apache, Nginx, cPanel).

---

## 💬 Atualização por Prompt no Antigravity

Consulte o arquivo [`PROMPTS.md`](file:///d:/Users/Leandro/Downloads/Bio%20num%20link/PROMPTS.md) para ver exemplos prontos de prompts para pedir ao Antigravity.
