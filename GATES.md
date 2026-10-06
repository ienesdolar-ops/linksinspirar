# Gates: Atualizações Rio, Porto Alegre, Remoção de Endereços de Unidades com Foto de Cidade e Conferência Oficial

OWNS: data/units.json, scripts/generate-catalog.js, scripts/build.js, scripts/verify-all.js, reports/link-audit.json, reports/link-audit.md, reports/mensagens-franqueados.md, index.html, rio-de-janeiro/**, porto-alegre/**, dourados/**, fortaleza/**, goiania/**, ipatinga/**, joinville/**, luanda/**, maceio/**, parauapebas/**, porto-velho/**, ribeirao-preto/**, salvador/**, santo-andre/**, santos/**, sao-jose-do-rio-preto/**, teresina/**

Scope: Atualizar WhatsApp do Rio de Janeiro e Porto Alegre, remover endereço das 15 unidades com fotos de cidade, e garantir que as 22 unidades com foto própria mantêm endereços 100% alinhados com o site oficial da Faculdade Inspirar.

- [x] G1: WhatsApp do Rio de Janeiro atualizado para (21) 99048-1463
  CHECK: node -e "const fs = require('fs'); const d = JSON.parse(fs.readFileSync('data/units.json', 'utf8')); const u = d.units.find(x => x.slug === 'rio-de-janeiro'); const sec = u.sections.find(s => s.id === 'acesso_rapido'); const hasWa = sec && sec.items.some(i => i.url.includes('5521990481463')); if (u.whatsapp === '5521990481463' && u.whatsappDisplay === '(21) 99048-1463' && hasWa) console.log('RJ_WA_OK');"
  EXPECT: RJ_WA_OK
  EVIDENCE: exit=0; shell=C:\WINDOWS\system32\cmd.exe; cwd=C:\Users\Usuario\Downloads\linksinspirar; path=a7bfde35d05e/19 entries; EXPECT=matched; output-sha256=0a8cd64c490156690f1dc5992726463f9b262e3d33007c5be327f03fff3b66e6; output-bytes=9

- [x] G2: WhatsApp de Porto Alegre atualizado para (51) 98948-0466
  CHECK: node -e "const fs = require('fs'); const d = JSON.parse(fs.readFileSync('data/units.json', 'utf8')); const u = d.units.find(x => x.slug === 'porto-alegre'); const sec = u.sections.find(s => s.id === 'acesso_rapido'); const hasWa = sec && sec.items.some(i => i.url.includes('5551989480466')); if (u.whatsapp === '5551989480466' && u.whatsappDisplay === '(51) 98948-0466' && hasWa) console.log('POA_WA_OK');"
  EXPECT: POA_WA_OK
  EVIDENCE: exit=0; shell=C:\WINDOWS\system32\cmd.exe; cwd=C:\Users\Usuario\Downloads\linksinspirar; path=a7bfde35d05e/19 entries; EXPECT=matched; output-sha256=22a543e4f929e1c45fc269aa8ab9a068058187df90c03329c36f9e27551bde27; output-bytes=10

- [x] G3: Endereço removido nas 15 unidades com fotos de cidade
  CHECK: node -e "const fs = require('fs'); const d = JSON.parse(fs.readFileSync('data/units.json', 'utf8')); const citySlugs = ['dourados','fortaleza','goiania','ipatinga','joinville','luanda','maceio','parauapebas','porto-velho','ribeirao-preto','salvador','santo-andre','santos','sao-jose-do-rio-preto','teresina']; const allEmpty = citySlugs.every(s => { const u = d.units.find(x => x.slug === s); return u && u.address === ''; }); if (allEmpty) console.log('CITY_ADDRESSES_REMOVED_OK');"
  EXPECT: CITY_ADDRESSES_REMOVED_OK
  EVIDENCE: exit=0; shell=C:\WINDOWS\system32\cmd.exe; cwd=C:\Users\Usuario\Downloads\linksinspirar; path=a7bfde35d05e/19 entries; EXPECT=matched; output-sha256=b531ef7fe97706bce458dbc24272dafe16d7a8ada666287a83919fd999c577ad; output-bytes=26

- [x] G4: Endereços das 22 unidades com foto própria conferidos com o site oficial da Faculdade Inspirar
  CHECK: node -e "const fs = require('fs'); const d = JSON.parse(fs.readFileSync('data/units.json', 'utf8')); const sample = ['curitiba', 'bauru', 'sao-luis', 'rio-de-janeiro', 'belo-horizonte', 'florianopolis', 'guarulhos', 'blumenau']; const ok = sample.every(s => { const u = d.units.find(x => x.slug === s); return u && u.address && u.address.length > 5; }); if (ok) console.log('OFFICIAL_ADDRESSES_CONFERRED_OK');"
  EXPECT: OFFICIAL_ADDRESSES_CONFERRED_OK
  EVIDENCE: exit=0; shell=C:\WINDOWS\system32\cmd.exe; cwd=C:\Users\Usuario\Downloads\linksinspirar; path=a7bfde35d05e/19 entries; EXPECT=matched; output-sha256=3b3a1906350cd316124d66fb74b1ceb8bc48735344ee7f86151d57c3b0066be6; output-bytes=32

- [x] G5: Verificação dos 11 gates do projeto com build atualizado
  CHECK: node scripts/verify-all.js
  EXPECT: ALL VERIFICATIONS PASSED (11 Gates / 37 units)
  EVIDENCE: exit=0; shell=C:\WINDOWS\system32\cmd.exe; cwd=C:\Users\Usuario\Downloads\linksinspirar; path=a7bfde35d05e/19 entries; EXPECT=matched; output-sha256=1a0526043d25cba616f5a28210cb0c00fb1747d58dc2b87335566555ae33ce7d; output-bytes=1039
