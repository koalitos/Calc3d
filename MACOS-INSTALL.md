# 🍎 Instalação no macOS

## ⚠️ Erro: "O app está danificado e não pode ser aberto"

Este erro aparece porque o app não está assinado com um certificado Apple Developer (custa $99/ano). É **seguro** usar o app, você só precisa permitir manualmente.

## ✅ Solução 1: Permitir nas Configurações (Recomendado)

1. **Baixe o DMG** apropriado:
   - Intel: `Calc3DPrint-1.0.0-x64.dmg`
   - Apple Silicon (M1/M2/M3): `Calc3DPrint-1.0.0-arm64.dmg`

2. **Abra o DMG** e arraste o app para Applications

3. **Tente abrir** o app (vai dar erro)

4. **Vá em Configurações do Sistema** → **Privacidade e Segurança**

5. **Role até o final** e você verá uma mensagem sobre o app bloqueado

6. **Clique em "Abrir Mesmo"**

7. **Confirme** clicando em "Abrir"

8. **Pronto!** O app vai abrir normalmente

## ✅ Solução 2: Remover Quarentena (Terminal)

Se a Solução 1 não funcionar, use o Terminal:

```bash
# Navegue até a pasta Applications
cd /Applications

# Remova o atributo de quarentena
xattr -cr "Calc 3D Print.app"

# Agora abra o app normalmente
open "Calc 3D Print.app"
```

## ✅ Solução 3: Permitir Apps de Qualquer Lugar

**Atenção:** Isso reduz a segurança do seu Mac.

```bash
# Permitir apps de qualquer lugar
sudo spctl --master-disable

# Depois de abrir o app pela primeira vez, reative a proteção:
sudo spctl --master-enable
```

## 🔐 Por que isso acontece?

- O macOS tem o **Gatekeeper** que bloqueia apps não assinados
- Para assinar um app, precisa de um **Apple Developer Account** ($99/ano)
- Este é um projeto **open source gratuito**, então não temos assinatura
- O código é **100% seguro** e pode ser auditado no GitHub

## 🛡️ É seguro?

✅ **Sim!** O código é open source: https://github.com/koalitos/calc3D

Você pode:
- Ver todo o código fonte
- Compilar você mesmo
- Auditar por vírus/malware
- Verificar que não há telemetria

## 📱 Verificar a Arquitetura do seu Mac

Não sabe se tem Intel ou Apple Silicon?

1. Clique no **ícone da Apple** (canto superior esquerdo)
2. Clique em **Sobre Este Mac**
3. Veja o **Chip** ou **Processador**:
   - **Apple M1/M2/M3** → Baixe `arm64.dmg`
   - **Intel Core** → Baixe `x64.dmg`

## 🆘 Ainda não funciona?

1. **Verifique se baixou o DMG correto** (Intel vs Apple Silicon)
2. **Reinicie o Mac** e tente novamente
3. **Abra uma issue**: https://github.com/koalitos/calc3D/issues

## 🔄 Atualizações Futuras

Quando tivermos um Apple Developer Account, vamos:
- ✅ Assinar o app com certificado válido
- ✅ Fazer notarização pela Apple
- ✅ Eliminar esse problema

---

**Desenvolvido com ❤️ para a comunidade de impressão 3D**
