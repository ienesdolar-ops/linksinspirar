# Guia de Prompts para o Antigravity — Bio no Link

Com a arquitetura centralizada do **Bio no Link**, qualquer alteração em uma ou todas as páginas de unidades da Faculdade Inspirar é feita enviando um comando em português claro aqui no Antigravity.

---

## 🎯 Exemplos Prontos de Prompts

### 1. Adicionar um evento com data de início e fim
> "Adicione o evento 'Open Day Inspirar 2026' nas unidades de Curitiba e Belém. Ele deve começar hoje e sair do ar no dia 2026-10-15. O link é https://faculdadeinspirar.com.br/openday e o badge é 'Gratuito'."

O que o Antigravity fará:
1. Atualiza `data/units.json` inserindo o item na seção `eventos` das unidades indicadas, preenchendo `startDate` e `endDate`.
2. Executa `node scripts/build.js`.
3. As páginas de Curitiba e Belém passam a exibir o evento até a data informada e ele expira sozinho após o dia 15/10.

---

### 2. Adicionar um novo curso de pós-graduação
> "Adicione o curso 'Pós em Fisioterapia Traumato-Ortopédica' na unidade Curitiba com o link https://faculdadeinspirar.com.br/traumato e o badge 'Turmas 2026'."

---

### 3. Cadastrar uma nova unidade da Faculdade Inspirar
> "Cadastre uma nova unidade: Fortaleza (CE). Endereço: 'Av. Santos Dumont, 1200 — Aldeota', WhatsApp '(85) 98765-2828', Instagram 'https://www.instagram.com/inspirarfortaleza/'. Adicione os cursos de Fisioterapia em UTI e Estética."

O que o Antigravity fará:
1. Cria o registro com slug `fortaleza` em `data/units.json`.
2. Roda o gerador `node scripts/build.js`.
3. Cria automaticamente a pasta `fortaleza/index.html` e insere o card correspondente no Hub Principal com busca por "Fortaleza" e "CE".

---

### 4. Alterar o WhatsApp ou telefone de uma unidade
> "Atualize o WhatsApp da unidade Belém para o número (91) 99999-1234."

---

### 5. Verificar se algum link do site está quebrado
> "Execute o verificador de links quebrados em todas as unidades e me mostre o relatório."

O que o Antigravity fará:
1. Executa `node scripts/check-links.js`.
2. Testa todas as URLs e gera o relatório atualizado em `reports/link-audit.md`.
3. Apresenta o resumo de status para você.

---

### 6. Destacar um anúncio especial (Card Spotlight)
> "Coloque um card de destaque no topo da página de São Paulo anunciando o 'Vestibular de Medicina Veterinária' com o link https://faculdadeinspirar.com.br/vestibular até 30/11."
