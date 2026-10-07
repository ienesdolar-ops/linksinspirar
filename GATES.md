# Gates: Contatos (Campo Grande, Belém, Campinas), Endereço Teresina e Modo Claro (Light/Dark Toggle)

OWNS: data/units.json, scripts/build.js, scripts/generate-catalog.js, scripts/verify-all.js, assets/css/style-v2.css, assets/css/style.css, reports/link-audit.json, reports/link-audit.md, reports/mensagens-franqueados.md, index.html, teresina/**, campo-grande/**, belem/**, campinas/**

Scope: Atualizar endereço de Teresina, WhatsApps de Campo Grande, Belém e Campinas, e implementar alternador de Modo Claro/Escuro completo no Hub e nas 37 unidades com persistência em localStorage e a11y.

- [x] G1: Endereço de Teresina atualizado para Av. Universitária, 750, Lojas 74 — Fátima (Ed. Diamond Center)
  CHECK: node -e "const fs = require('fs'); const d = JSON.parse(fs.readFileSync('data/units.json', 'utf8')); const u = d.units.find(x => x.slug === 'teresina'); if (u.address.includes('Universitária, 750') && u.address.includes('Diamond Center')) console.log('TERESINA_ADDRESS_OK');"
  EXPECT: TERESINA_ADDRESS_OK
  EVIDENCE: exit=0; shell=C:\WINDOWS\system32\cmd.exe; cwd=C:\Users\Usuario\Downloads\linksinspirar; path=a7bfde35d05e/19 entries; EXPECT=matched; output-sha256=07067ad4613605e56528c36924d3b0a41b3fb67102014539ab2ff20cf6f6a575; output-bytes=20

- [x] G2: Contato WhatsApp de Campo Grande atualizado para (67) 98488-3987
  CHECK: node -e "const fs = require('fs'); const d = JSON.parse(fs.readFileSync('data/units.json', 'utf8')); const u = d.units.find(x => x.slug === 'campo-grande'); const sec = u.sections.find(s => s.id === 'acesso_rapido'); const hasWa = sec && sec.items.some(i => i.url.includes('5567984883987')); if (u.whatsapp === '5567984883987' && hasWa) console.log('CAMPO_GRANDE_WA_OK');"
  EXPECT: CAMPO_GRANDE_WA_OK
  EVIDENCE: exit=0; shell=C:\WINDOWS\system32\cmd.exe; cwd=C:\Users\Usuario\Downloads\linksinspirar; path=a7bfde35d05e/19 entries; EXPECT=matched; output-sha256=837ec62188a67c71f0ec17b012584735524ffc4dbf711afdda8d2ea9351ea33c; output-bytes=19

- [x] G3: Contato WhatsApp de Belém atualizado para (91) 99100-7794
  CHECK: node -e "const fs = require('fs'); const d = JSON.parse(fs.readFileSync('data/units.json', 'utf8')); const u = d.units.find(x => x.slug === 'belem'); const sec = u.sections.find(s => s.id === 'acesso_rapido'); const hasWa = sec && sec.items.some(i => i.url.includes('5591991007794')); if (u.whatsapp === '5591991007794' && hasWa) console.log('BELEM_WA_OK');"
  EXPECT: BELEM_WA_OK
  EVIDENCE: exit=0; shell=C:\WINDOWS\system32\cmd.exe; cwd=C:\Users\Usuario\Downloads\linksinspirar; path=a7bfde35d05e/19 entries; EXPECT=matched; output-sha256=ed6f3c7a730a4b2f77b02c4bd7264215e7d071bfd630fe56e10cf9ac05eb6d0f; output-bytes=12

- [x] G4: Contato WhatsApp de Campinas atualizado para (19) 99704-1183
  CHECK: node -e "const fs = require('fs'); const d = JSON.parse(fs.readFileSync('data/units.json', 'utf8')); const u = d.units.find(x => x.slug === 'campinas'); const sec = u.sections.find(s => s.id === 'acesso_rapido'); const hasWa = sec && sec.items.some(i => i.url.includes('5519997041183')); if (u.whatsapp === '5519997041183' && hasWa) console.log('CAMPINAS_WA_OK');"
  EXPECT: CAMPINAS_WA_OK
  EVIDENCE: exit=0; shell=C:\WINDOWS\system32\cmd.exe; cwd=C:\Users\Usuario\Downloads\linksinspirar; path=a7bfde35d05e/19 entries; EXPECT=matched; output-sha256=a3118a79642cc2f3d4c772d8aba8f569451d8ed428822c179435dad381d9d23d; output-bytes=15

- [x] G5: Botão e suporte a Modo Claro implementados no Hub e em todas as 37 unidades com persistência
  CHECK: node -e "const fs = require('fs'); const hub = fs.readFileSync('index.html', 'utf8'); const cwb = fs.readFileSync('curitiba/index.html', 'utf8'); const css1 = fs.readFileSync('assets/css/style-v2.css', 'utf8'); const css2 = fs.readFileSync('assets/css/style.css', 'utf8'); const hasHubBtn = hub.includes('theme-toggle-btn') && hub.includes('toggleTheme'); const hasUnitBtn = cwb.includes('theme-toggle-btn') && cwb.includes('toggleTheme'); const hasCss1 = css1.includes('[data-theme=\"light\"]'); const hasCss2 = css2.includes('[data-theme=\"light\"]'); if (hasHubBtn && hasUnitBtn && hasCss1 && hasCss2) console.log('LIGHT_MODE_OK');"
  EXPECT: LIGHT_MODE_OK
  EVIDENCE: exit=0; shell=C:\WINDOWS\system32\cmd.exe; cwd=C:\Users\Usuario\Downloads\linksinspirar; path=a7bfde35d05e/19 entries; EXPECT=matched; output-sha256=259b4bd236d853154ae2b3f97c8319e66ee269a02289e6e89a924ab1f6b80795; output-bytes=14

- [x] G6: Suíte de verificação completa passando com todos os 11 gates
  CHECK: node scripts/verify-all.js
  EXPECT: ALL VERIFICATIONS PASSED (11 Gates / 37 units)
  EVIDENCE: exit=0; shell=C:\WINDOWS\system32\cmd.exe; cwd=C:\Users\Usuario\Downloads\linksinspirar; path=a7bfde35d05e/19 entries; EXPECT=matched; output-sha256=1a0526043d25cba616f5a28210cb0c00fb1747d58dc2b87335566555ae33ce7d; output-bytes=1039
