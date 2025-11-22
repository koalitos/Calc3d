const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🎨 Gerando ícones para o aplicativo...\n');

// Verificar se o sharp está instalado
try {
  require.resolve('sharp');
} catch (e) {
  console.log('📦 Instalando sharp...');
  execSync('npm install sharp --no-save', { stdio: 'inherit' });
}

const sharp = require('sharp');

const buildDir = path.join(__dirname, '..', 'build');
const iconsDir = path.join(buildDir, 'icons');
const svgPath = path.join(buildDir, 'icon.svg');

// Criar diretório de ícones se não existir
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Tamanhos necessários
const sizes = [16, 24, 32, 48, 64, 128, 256, 512, 1024];

async function generateIcons() {
  try {
    console.log('📐 Gerando PNGs em vários tamanhos...');
    
    // Gerar PNGs para cada tamanho
    for (const size of sizes) {
      const outputPath = path.join(iconsDir, `${size}x${size}.png`);
      await sharp(svgPath)
        .resize(size, size)
        .png()
        .toFile(outputPath);
      console.log(`  ✓ ${size}x${size}.png`);
    }

    // Gerar PNG de 256x256 para o .ico do Windows
    const icon256Path = path.join(buildDir, 'icon-256.png');
    await sharp(svgPath)
      .resize(256, 256)
      .png()
      .toFile(icon256Path);
    console.log(`  ✓ icon-256.png (para Windows .ico)`);

    // Gerar PNG de 1024x1024 para o .icns do Mac
    const icon1024Path = path.join(buildDir, 'icon-1024.png');
    await sharp(svgPath)
      .resize(1024, 1024)
      .png()
      .toFile(icon1024Path);
    console.log(`  ✓ icon-1024.png (para macOS .icns)`);

    console.log('\n✅ Ícones PNG gerados com sucesso!');
    console.log('\n📝 Próximos passos:');
    console.log('   Para Windows (.ico): Use uma ferramenta online como https://convertio.co/png-ico/');
    console.log(`   - Faça upload de: ${icon256Path}`);
    console.log(`   - Salve como: ${path.join(buildDir, 'icon.ico')}`);
    console.log('\n   Para macOS (.icns): Use o comando iconutil (apenas no macOS)');
    console.log(`   - ou use: https://cloudconvert.com/png-to-icns`);
    console.log(`   - Faça upload de: ${icon1024Path}`);
    console.log(`   - Salve como: ${path.join(buildDir, 'icon.icns')}`);
    console.log('\n   Para Linux: Os PNGs já estão prontos em build/icons/');

  } catch (error) {
    console.error('❌ Erro ao gerar ícones:', error);
    process.exit(1);
  }
}

generateIcons();
