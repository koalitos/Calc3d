const fs = require('fs');
const path = require('path');
const toIco = require('to-ico');
const png2icons = require('png2icons');

console.log('🔧 Criando arquivos .ico e .icns...\n');

const buildDir = path.join(__dirname, '..', 'build');
const iconsDir = path.join(buildDir, 'icons');

async function createIcons() {
  try {
    // Criar .ico para Windows
    console.log('🪟 Criando icon.ico para Windows...');
    const icoPaths = [
      path.join(iconsDir, '16x16.png'),
      path.join(iconsDir, '32x32.png'),
      path.join(iconsDir, '48x48.png'),
      path.join(iconsDir, '64x64.png'),
      path.join(iconsDir, '128x128.png'),
      path.join(iconsDir, '256x256.png')
    ];
    
    const icoBuffers = icoPaths.map(p => fs.readFileSync(p));
    const icoBuffer = await toIco(icoBuffers);
    fs.writeFileSync(path.join(buildDir, 'icon.ico'), icoBuffer);
    console.log('  ✓ icon.ico criado com sucesso!');

    // Criar .icns para macOS
    console.log('\n🍎 Criando icon.icns para macOS...');
    const pngBuffer = fs.readFileSync(path.join(buildDir, 'icon-1024.png'));
    const icnsBuffer = png2icons.createICNS(pngBuffer, png2icons.BILINEAR, 0);
    fs.writeFileSync(path.join(buildDir, 'icon.icns'), icnsBuffer);
    console.log('  ✓ icon.icns criado com sucesso!');

    console.log('\n✅ Todos os ícones foram criados!');
    console.log('\n📁 Arquivos gerados:');
    console.log(`   - ${path.join(buildDir, 'icon.ico')} (Windows)`);
    console.log(`   - ${path.join(buildDir, 'icon.icns')} (macOS)`);
    console.log(`   - ${iconsDir}/*.png (Linux)`);
    console.log('\n🚀 Agora você pode executar: npm run dist:win');

  } catch (error) {
    console.error('❌ Erro ao criar ícones:', error);
    process.exit(1);
  }
}

createIcons();
