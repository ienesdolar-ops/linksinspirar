# Bio no Link — Faculdade Inspirar

> Sistema centralizado de links na bio (Linktree multi-unidades) para todas as unidades da Faculdade Inspirar com atualização por prompt no Antigravity, expiração automática de eventos e checagem de links quebrados.

---

## 📌 Visão Geral

- **Hub Central (`index.html`)**: Página principal com busca interativa por cidade, estado e região, atalhos diretos para WhatsApp e Instagram, e direcionamento para a página oficial da bio de cada campus.
- **Páginas Oficiais por Unidade (`/[slug]/index.html`)**: Cada unidade da Faculdade Inspirar possui seu próprio link direto e independente para colocar na bio do Instagram (ex: `/curitiba`, `/belem`, `/campogrande`, etc.).
- **Preservação Visual 100% Inspirar**: Tipografia proprietária `AmpleSoft Pro`, paleta oficial Inspirar (Azul e Ciano), selo de autenticidade verificado, tema escuro moderno e responsivo para celulares.
- **Dois recursos essenciais do projeto**:
  1. ⏳ **Eventos com data de início e fim**: Eventos com prazo de validade desaparecem sozinhos após a data de encerramento (`endDate`), eliminando links antigos de eventos passados.
  2. 🔍 **Verificador de links quebrados**: Ferramenta automática que audita todos os links cadastrados e gera relatórios em JSON e Markdown antes que algum aluno encontre um erro.

---

## 🗂️ Estrutura do Projeto

```text
Bio no link/
├── assets/
│   ├── css/
│   │   └── style.css                     # Design System oficial Inspirar
│   ├── fonts/
│   │   └── ample-soft-pro/               # Família tipográfica completa
│   └── images/
│       ├── Logo branca - horizontal.png  # Marca Inspirar em alta definição
│       ├── UNIDADE CWB sem gourmet.png   # Imagem da fachada
│       └── UNIDADE CWB sem gourmet 2.png # Entrada e convivência
├── data/
│   └── units.json                        # Fonte única da verdade (todas as unidades)
├── scripts/
│   ├── build.js                          # Gerador estático do Hub e das páginas
│   ├── validate-data.js                  # Validador de esquema, datas e slugs
│   ├── test-event-dates.js               # Teste de expiração automática de eventos
│   ├── check-links.js                    # Auditor e verificador de links quebrados
│   └── verify-all.js                     # Suíte de verificação completa (Gates 1-5)
├── reports/
│   ├── link-audit.json                   # Relatório estruturado de checagem de links
│   └── link-audit.md                     # Relatório formatado em tabela Markdown
├── curitiba/index.html                   # Página da Bio — Curitiba (PR)
├── belem/index.html                      # Página da Bio — Belém (PA)
├── campogrande/index.html                 # Página da Bio — Campo Grande (MS)
├── saopaulo/index.html                    # Página da Bio — São Paulo (SP)
├── florianopolis/index.html               # Página da Bio — Florianópolis (SC)
├── belohorizonte/index.html               # Página da Bio — Belo Horizonte (MG)
├── index.html                            # Hub Principal com Busca
├── GATES.md                              # Critérios de aceitação e verificações
├── PROMPTS.md                            # Guia de atualização por prompt
└── package.json                          # Scripts de automação
```

---

## 🚀 Como Executar

### 1. Construir o site estático
```bash
node scripts/build.js
# ou
npm run build
```

### 2. Verificar integridade dos dados
```bash
node scripts/validate-data.js
# ou
npm run validate
```

### 3. Testar expiração de eventos
```bash
node scripts/test-event-dates.js
# ou
npm run test:dates
```

### 4. Verificar links quebrados
```bash
# Validação sintática rápida
node scripts/check-links.js --dry-run
# ou
npm run check-links:dry

# Checagem HTTP online completa
node scripts/check-links.js
# ou
npm run check-links
```

### 5. Rodar todos os testes de aceitação
```bash
node scripts/verify-all.js
# ou
npm test
```

---

## 🌐 Como Funciona a Hospedagem e os Links na Bio

Como todas as páginas são geradas estaticamente em diretórios limpos:
- **Instagram de Curitiba**: Coloca o link `https://seusite.com.br/curitiba/`
- **Instagram de Belém**: Coloca o link `https://seusite.com.br/belem/`
- **Instagram de Campo Grande**: Coloca o link `https://seusite.com.br/campogrande/`
- **Hub Geral**: Coloca o link `https://seusite.com.br/`

Compatível com qualquer servidor ou hospedagem gratuita (GitHub Pages, Vercel, Netlify, Cloudflare Pages, Apache, Nginx, cPanel).

---

## 💬 Atualização por Prompt no Antigravity

Consulte o arquivo [`PROMPTS.md`](file:///d:/Users/Leandro/Downloads/Bio%20num%20link/PROMPTS.md) para ver exemplos prontos de prompts para pedir ao Antigravity.
