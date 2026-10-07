# Gates: Modo Claro como Padrão na Unidade Campinas

OWNS: data/units.json, scripts/build.js, campinas/index.html, curitiba/index.html, rio-de-janeiro/index.html

Scope: Configurar a unidade de Campinas para carregar nativamente em Modo Claro por padrão (com data-theme="light" no HTML estático e anti-FOUC), preservando o modo escuro como padrão para as demais unidades e permitindo alternância.

- [x] G1: Campinas configurada com defaultTheme light em data/units.json e campinas/index.html
  CHECK: node -e "const fs = require('fs'); const d = JSON.parse(fs.readFileSync('data/units.json', 'utf8')); const camp = d.units.find(u => u.slug === 'campinas'); const html = fs.readFileSync('campinas/index.html', 'utf8'); if (camp.defaultTheme === 'light' && /<html[^>]*data-theme=[\"']light[\"']/.test(html)) console.log('CAMPINAS_LIGHT_DEFAULT_OK');"
  EXPECT: CAMPINAS_LIGHT_DEFAULT_OK
  EVIDENCE: exit=0; shell=C:\WINDOWS\system32\cmd.exe; cwd=C:\Users\Usuario\Downloads\linksinspirar; path=a7bfde35d05e/19 entries; EXPECT=matched; output-sha256=f01fe218a9f4dcd8591c43015f2eea69c4cd0eb32f867256ec8e24d908017c5e; output-bytes=26

- [x] G2: Demais unidades permanecem com modo escuro por padrão
  CHECK: node -e "const fs = require('fs'); const cwb = fs.readFileSync('curitiba/index.html', 'utf8'); const rj = fs.readFileSync('rio-de-janeiro/index.html', 'utf8'); if (!/<html[^>]*data-theme=[\"']light[\"']/.test(cwb) && !/<html[^>]*data-theme=[\"']light[\"']/.test(rj)) console.log('OTHER_UNITS_DARK_DEFAULT_OK');"
  EXPECT: OTHER_UNITS_DARK_DEFAULT_OK
  EVIDENCE: exit=0; shell=C:\WINDOWS\system32\cmd.exe; cwd=C:\Users\Usuario\Downloads\linksinspirar; path=a7bfde35d05e/19 entries; EXPECT=matched; output-sha256=332577e22678e4aed18b79a93c49f4a79d35f2e10f6a7faa0a98531a8533ae4e; output-bytes=28

- [x] G3: Alternador e persistência preservados na página de Campinas
  CHECK: node -e "const fs = require('fs'); const html = fs.readFileSync('campinas/index.html', 'utf8'); if (html.includes('theme-toggle-btn') && html.includes('toggleTheme') && html.includes('inspirar-theme-campinas')) console.log('CAMPINAS_TOGGLE_OK');"
  EXPECT: CAMPINAS_TOGGLE_OK
  EVIDENCE: exit=0; shell=C:\WINDOWS\system32\cmd.exe; cwd=C:\Users\Usuario\Downloads\linksinspirar; path=a7bfde35d05e/19 entries; EXPECT=matched; output-sha256=0cfea372d3c08b9be302933fb9975c65cb45c98f68319f83e7009f662bb98e9d; output-bytes=19

- [x] G4: Suíte completa verify-all passando com todos os 11 gates
  CHECK: node scripts/verify-all.js
  EXPECT: ALL VERIFICATIONS PASSED (11 Gates / 37 units)
  EVIDENCE: exit=0; shell=C:\WINDOWS\system32\cmd.exe; cwd=C:\Users\Usuario\Downloads\linksinspirar; path=a7bfde35d05e/19 entries; EXPECT=matched; output-sha256=1a0526043d25cba616f5a28210cb0c00fb1747d58dc2b87335566555ae33ce7d; output-bytes=1039
