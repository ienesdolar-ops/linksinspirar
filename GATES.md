# Gates: Atualização do Número de WhatsApp de Maceió

OWNS: data/units.json, maceio/index.html, index.html, reports/mensagens-franqueados.md

Scope: Atualizar o número oficial de WhatsApp da unidade Maceió (AL) para (11) 94300-9787 (5511943009787) em data/units.json, maceio/index.html, index.html e reports/mensagens-franqueados.md.

- [x] G1: Contato de Maceió atualizado em data/units.json
  CHECK: node -e "const fs = require('fs'); const d = JSON.parse(fs.readFileSync('data/units.json', 'utf8')); const u = d.units.find(x => x.slug === 'maceio'); const sec = u.sections.find(s => s.id === 'acesso_rapido'); const hasWa = sec && sec.items.some(i => i.url.includes('5511943009787')); if (u.whatsapp === '5511943009787' && u.whatsappDisplay === '(11) 94300-9787' && hasWa) console.log('MACEIO_DATA_OK');"
  EXPECT: MACEIO_DATA_OK
  EVIDENCE: exit=0; shell=C:\WINDOWS\system32\cmd.exe; cwd=C:\Users\Usuario\Downloads\linksinspirar; path=a7bfde35d05e/19 entries; EXPECT=matched; output-sha256=15c1bc0b959432607f084a21f4738931d4d7234dbb0ff363a17d39a90e759398; output-bytes=15

- [x] G2: Página gerada de Maceió e Hub com o novo WhatsApp
  CHECK: node -e "const fs = require('fs'); const maceioHtml = fs.readFileSync('maceio/index.html', 'utf8'); const hubHtml = fs.readFileSync('index.html', 'utf8'); if (maceioHtml.includes('5511943009787') && hubHtml.includes('5511943009787')) console.log('MACEIO_BUILD_OK');"
  EXPECT: MACEIO_BUILD_OK
  EVIDENCE: exit=0; shell=C:\WINDOWS\system32\cmd.exe; cwd=C:\Users\Usuario\Downloads\linksinspirar; path=a7bfde35d05e/19 entries; EXPECT=matched; output-sha256=8a48a08c64ba22c32683594557f3657f49ac447b5ac2c65fde641c78a6be7380; output-bytes=16

- [x] G3: Relatório de mensagens para franqueados atualizado com feedback de Maceió
  CHECK: node -e "const fs = require('fs'); const md = fs.readFileSync('reports/mensagens-franqueados.md', 'utf8'); if (md.includes('5511943009787') && md.includes('Maceió')) console.log('MACEIO_REPORT_OK');"
  EXPECT: MACEIO_REPORT_OK
  EVIDENCE: exit=0; shell=C:\WINDOWS\system32\cmd.exe; cwd=C:\Users\Usuario\Downloads\linksinspirar; path=a7bfde35d05e/19 entries; EXPECT=matched; output-sha256=ee3ed94b239b7c383132abf3c4448675bc92a4fe5a175fff993280989528525c; output-bytes=17

- [x] G4: Suíte completa verify-all passando com todos os 11 gates
  CHECK: node scripts/verify-all.js
  EXPECT: ALL VERIFICATIONS PASSED (11 Gates / 37 units)
  EVIDENCE: exit=0; shell=C:\WINDOWS\system32\cmd.exe; cwd=C:\Users\Usuario\Downloads\linksinspirar; path=a7bfde35d05e/19 entries; EXPECT=matched; output-sha256=1a0526043d25cba616f5a28210cb0c00fb1747d58dc2b87335566555ae33ce7d; output-bytes=1039
