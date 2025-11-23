# 💾 Onde os Dados São Salvos

## 📁 Localização dos Dados

Seus dados (banco de dados, configurações, etc.) são salvos em uma pasta segura do sistema operacional que **NÃO é apagada** quando você:
- Atualiza o aplicativo
- Desinstala o aplicativo (opcional)
- Reinstala o aplicativo

### Windows
```
C:\Users\[SeuUsuario]\AppData\Roaming\Calc 3D Print\data\database.db
```

### macOS
```
~/Library/Application Support/Calc 3D Print/data/database.db
```

### Linux
```
~/.config/Calc 3D Print/data/database.db
```

## 🔄 Migração Automática

Se você tinha dados na versão antiga (salvos na pasta do app), eles serão **migrados automaticamente** para a nova localização na primeira execução.

## 💾 Backup Manual

Para fazer backup dos seus dados:

### Windows
1. Pressione `Win + R`
2. Digite: `%APPDATA%\Calc 3D Print\data`
3. Copie o arquivo `database.db`

### macOS
1. Abra o Finder
2. Pressione `Cmd + Shift + G`
3. Digite: `~/Library/Application Support/Calc 3D Print/data`
4. Copie o arquivo `database.db`

### Linux
```bash
cp ~/.config/Calc\ 3D\ Print/data/database.db ~/backup-calc3d.db
```

## 🔄 Restaurar Backup

Para restaurar um backup:

1. Feche o aplicativo
2. Substitua o arquivo `database.db` pelo seu backup
3. Abra o aplicativo novamente

## 🗑️ Remover Dados Completamente

Se você desinstalar o app, os dados **NÃO são apagados automaticamente** (para sua segurança).

Para remover completamente:

### Windows
```
rmdir /s "%APPDATA%\Calc 3D Print"
```

### macOS
```bash
rm -rf ~/Library/Application\ Support/Calc\ 3D\ Print
```

### Linux
```bash
rm -rf ~/.config/Calc\ 3D\ Print
```

## ✅ Vantagens desta Abordagem

- ✅ Dados persistem entre atualizações
- ✅ Dados não são perdidos ao desinstalar
- ✅ Backup fácil (apenas um arquivo)
- ✅ Restauração simples
- ✅ Segue padrões do sistema operacional

---

**Desenvolvido com ❤️ para a comunidade de impressão 3D**
