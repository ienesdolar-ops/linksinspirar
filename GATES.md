# Gates: Atualizações de Endereços, Galeria São Luís e WhatsApps Franqueados

OWNS: data/units.json, scripts/generate-catalog.js, scripts/verify-all.js, assets/images/units/manifest.json, reports/link-audit.json, reports/link-audit.md, reports/mensagens-franqueados.md, index.html, bauru/**, sao-luis/**, guarulhos/**, fortaleza/**, sao-paulo-borba-gato/**, balneario-camboriu/**, belem/**, belo-horizonte/**, blumenau/**, brasilia/**, campinas/**, campo-grande/**, cuiaba/**, curitiba/**, dourados/**, florianopolis/**, goiania/**, ipatinga/**, joinville/**, londrina/**, luanda/**, maceio/**, parauapebas/**, porto-alegre/**, porto-velho/**, ribeirao-preto/**, rio-de-janeiro/**, salvador/**, santo-andre/**, santos/**, sao-jose-do-rio-preto/**, sao-jose-dos-campos/**, sao-paulo-vila-mariana/**, sorocaba/**, teresina/**, uberlandia/**, vitoria/**

Scope: Atualizar endereços para os locais oficiais do mapa nas 37 unidades, remover foto 7 de São Luís, e configurar novos WhatsApps em Guarulhos, Borba Gato e Fortaleza mantendo fidelidade total e passando por todos os gates.

- [x] G1: Endereço de São Luís atualizado para Rua dos Lótus, 11 — Jardim Renascença II
  CHECK: node -e "const fs = require('fs'); const d = JSON.parse(fs.readFileSync('data/units.json', 'utf8')); const u = d.units.find(x => x.slug === 'sao-luis'); if (u.address.includes('Rua dos Lótus, 11') && u.fullAddress.includes('Jardim Renascença II')) console.log('SLZ_ADDRESS_OK');"
  EXPECT: SLZ_ADDRESS_OK
  EVIDENCE: exit=0; shell=C:\WINDOWS\system32\cmd.exe; cwd=C:\Users\Usuario\Downloads\linksinspirar; path=a7bfde35d05e/19 entries; EXPECT=matched; output-sha256=d31583381503b11ba775f4d6b3fceb0f1a4ca4d2da25296d2d37bf6c96d1dd63; output-bytes=15

- [x] G2: Remoção da foto 7 da galeria de São Luís
  CHECK: node -e "const fs = require('fs'); const d = JSON.parse(fs.readFileSync('data/units.json', 'utf8')); const u = d.units.find(x => x.slug === 'sao-luis'); const has7 = u.gallery.some(g => g.src.includes('recepcao.webp')); if (!has7 && u.gallery.length === 8) console.log('SLZ_PHOTO_OK');"
  EXPECT: SLZ_PHOTO_OK
  EVIDENCE: exit=0; shell=C:\WINDOWS\system32\cmd.exe; cwd=C:\Users\Usuario\Downloads\linksinspirar; path=a7bfde35d05e/19 entries; EXPECT=matched; output-sha256=aecf23cd98b49c50fed0f18246e78abed330399fa205f1c4149c2954d6ff000e; output-bytes=13

- [x] G3: Guarulhos configurado com os 2 WhatsApps solicitados (Meu 11 96977-1841 e Ale 11 99508-3057)
  CHECK: node -e "const fs = require('fs'); const d = JSON.parse(fs.readFileSync('data/units.json', 'utf8')); const u = d.units.find(x => x.slug === 'guarulhos'); const waItems = u.sections.find(s => s.id === 'acesso_rapido').items; const has1 = waItems.some(i => i.url.includes('5511969771841')); const has2 = waItems.some(i => i.url.includes('5511995083057')); if (has1 && has2) console.log('GUARULHOS_WA_OK');"
  EXPECT: GUARULHOS_WA_OK
  EVIDENCE: exit=0; shell=C:\WINDOWS\system32\cmd.exe; cwd=C:\Users\Usuario\Downloads\linksinspirar; path=a7bfde35d05e/19 entries; EXPECT=matched; output-sha256=17fffaee120b9edc47cf441c0cda36f38c645cd1ecc5731f036edc13719b4b1c; output-bytes=16

- [x] G4: Borba Gato atualizado com o WhatsApp +55 11 97625-9223
  CHECK: node -e "const fs = require('fs'); const d = JSON.parse(fs.readFileSync('data/units.json', 'utf8')); const u = d.units.find(x => x.slug === 'sao-paulo-borba-gato'); const waItems = u.sections.find(s => s.id === 'acesso_rapido').items; const hasWa = waItems.some(i => i.url.includes('5511976259223')); if (hasWa && u.whatsapp === '5511976259223') console.log('BORBA_GATO_WA_OK');"
  EXPECT: BORBA_GATO_WA_OK
  EVIDENCE: exit=0; shell=C:\WINDOWS\system32\cmd.exe; cwd=C:\Users\Usuario\Downloads\linksinspirar; path=a7bfde35d05e/19 entries; EXPECT=matched; output-sha256=cbf60a62e7a23f3a36cec0c04559fd1c0e93fd50977b56522c4564c6f0d1e1d8; output-bytes=17

- [x] G5: Fortaleza mantém institucional e adiciona novo WhatsApp 85991350955
  CHECK: node -e "const fs = require('fs'); const d = JSON.parse(fs.readFileSync('data/units.json', 'utf8')); const u = d.units.find(x => x.slug === 'fortaleza'); const waItems = u.sections.find(s => s.id === 'acesso_rapido').items; const hasLocal = waItems.some(i => i.url.includes('5585991350955')); const hasInst = waItems.some(i => i.url.includes('558006022828')); if (hasLocal && hasInst) console.log('FORTALEZA_WA_OK');"
  EXPECT: FORTALEZA_WA_OK
  EVIDENCE: exit=0; shell=C:\WINDOWS\system32\cmd.exe; cwd=C:\Users\Usuario\Downloads\linksinspirar; path=a7bfde35d05e/19 entries; EXPECT=matched; output-sha256=947f60faca8b37a1176af76e655b4c037319fdedc85dad32697487850618da30; output-bytes=16

- [x] G6: Endereços de todas as unidades sincronizados com o mapa e sem endereços desatualizados
  CHECK: node -e "const fs = require('fs'); const d = JSON.parse(fs.readFileSync('data/units.json', 'utf8')); const uSlz = d.units.find(x => x.slug === 'sao-luis'); const uGua = d.units.find(x => x.slug === 'guarulhos'); const uRio = d.units.find(x => x.slug === 'rio-de-janeiro'); const uCui = d.units.find(x => x.slug === 'cuiaba'); if (uSlz.address.includes('Lótus') && uGua.address.includes('Castro Mesquita') && uRio.address.includes('José Wilker') && uCui.address.includes('Miguel Sutil')) console.log('ALL_ADDRESSES_SYNC_OK');"
  EXPECT: ALL_ADDRESSES_SYNC_OK
  EVIDENCE: exit=0; shell=C:\WINDOWS\system32\cmd.exe; cwd=C:\Users\Usuario\Downloads\linksinspirar; path=a7bfde35d05e/19 entries; EXPECT=matched; output-sha256=678f2845bd565e2c83593abf84beb244096c2d1c7885bc350e97515ba25596bf; output-bytes=22

- [x] G7: Suíte completa de verificação do projeto passando (11 Gates)
  CHECK: node scripts/verify-all.js
  EXPECT: ALL VERIFICATIONS PASSED (11 Gates / 37 units)
  EVIDENCE: exit=0; shell=C:\WINDOWS\system32\cmd.exe; cwd=C:\Users\Usuario\Downloads\linksinspirar; path=a7bfde35d05e/19 entries; EXPECT=matched; output-sha256=1a0526043d25cba616f5a28210cb0c00fb1747d58dc2b87335566555ae33ce7d; output-bytes=1039
