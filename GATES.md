# Gates: Logo Preta na Versão Clara (Modo Claro)

OWNS: assets/css/style-v2.css, assets/css/style.css, scripts/build.js, index.html, curitiba/index.html

Scope: Configurar a exibição da logo e símbolo em preto (filter: brightness(0)) e fundo claro na versão clara do Hub e de todas as 37 unidades da Faculdade Inspirar.

- [x] G1: Logo do Hub e Footer configuradas para preto em modo claro nos estilos
  CHECK: node -e "const fs = require('fs'); const css1 = fs.readFileSync('assets/css/style.css', 'utf8'); const css2 = fs.readFileSync('assets/css/style-v2.css', 'utf8'); const ok1 = css1.includes('.hub-logo') && css1.includes('filter: brightness(0);'); const ok2 = css2.includes('.hub-logo') && css2.includes('filter: brightness(0);'); if (ok1 && ok2) console.log('HUB_LOGO_BLACK_OK');"
  EXPECT: HUB_LOGO_BLACK_OK
  EVIDENCE: exit=0; shell=C:\WINDOWS\system32\cmd.exe; cwd=C:\Users\Usuario\Downloads\linksinspirar; path=a7bfde35d05e/19 entries; EXPECT=matched; output-sha256=c1b96089383156b9db9615f47ee0613a9c102350435a0052384353a199c6b033; output-bytes=18

- [x] G2: Símbolo/Logo das unidades com filtro preto e caixa branca no perfil em modo claro
  CHECK: node -e "const fs = require('fs'); const css = fs.readFileSync('assets/css/style-v2.css', 'utf8'); const hasBox = css.includes('.hero-logo-box') && css.includes('background: #FFFFFF;'); const hasImg = css.includes('.hero-logo-img') && css.includes('filter: brightness(0);'); if (hasBox && hasImg) console.log('UNIT_LOGO_BLACK_OK');"
  EXPECT: UNIT_LOGO_BLACK_OK
  EVIDENCE: exit=0; shell=C:\WINDOWS\system32\cmd.exe; cwd=C:\Users\Usuario\Downloads\linksinspirar; path=a7bfde35d05e/19 entries; EXPECT=matched; output-sha256=f935c197dbdc0a4ce039e8aaf62735f27549a07950707d45eeacabe5e297e761; output-bytes=19

- [x] G3: Regeneração e compilação do site completo concluída sem erros
  CHECK: node -e "const fs = require('fs'); const hub = fs.readFileSync('index.html', 'utf8'); const cwb = fs.readFileSync('curitiba/index.html', 'utf8'); if (hub.includes('hub-logo') && cwb.includes('hero-logo-box')) console.log('SITE_BUILD_OK');"
  EXPECT: SITE_BUILD_OK
  EVIDENCE: exit=0; shell=C:\WINDOWS\system32\cmd.exe; cwd=C:\Users\Usuario\Downloads\linksinspirar; path=a7bfde35d05e/19 entries; EXPECT=matched; output-sha256=b58e08c65a9da2cc9f019f4d11da0f378d448249d4eed81292fcfd6dfb9ef58b; output-bytes=14

- [x] G4: Suíte de verificação completa passando com todos os 11 gates
  CHECK: node scripts/verify-all.js
  EXPECT: ALL VERIFICATIONS PASSED (11 Gates / 37 units)
  EVIDENCE: exit=0; shell=C:\WINDOWS\system32\cmd.exe; cwd=C:\Users\Usuario\Downloads\linksinspirar; path=a7bfde35d05e/19 entries; EXPECT=matched; output-sha256=1a0526043d25cba616f5a28210cb0c00fb1747d58dc2b87335566555ae33ce7d; output-bytes=1039
