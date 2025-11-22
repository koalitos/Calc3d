#!/bin/bash

echo "🧹 Limpando processos do Calc 3D Print..."
echo ""

# Matar todos os processos relacionados
pkill -f "node.*server.js" 2>/dev/null && echo "✅ Backend encerrado"
pkill -f electron 2>/dev/null && echo "✅ Electron encerrado"
pkill -f "react-scripts" 2>/dev/null && echo "✅ Frontend encerrado"
pkill -f "webpack" 2>/dev/null && echo "✅ Webpack encerrado"

sleep 1

# Verificar se a porta 3001 está livre
if lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo ""
    echo "⚠️  Porta 3001 ainda está em uso!"
    echo "Matando processo..."
    lsof -ti:3001 | xargs kill -9 2>/dev/null
    sleep 1
    echo "✅ Porta 3001 liberada"
fi

# Verificar se a porta 3000 está livre
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo ""
    echo "⚠️  Porta 3000 ainda está em uso!"
    echo "Matando processo..."
    lsof -ti:3000 | xargs kill -9 2>/dev/null
    sleep 1
    echo "✅ Porta 3000 liberada"
fi

echo ""
echo "✅ Tudo limpo! Pode iniciar o app agora."
echo ""
echo "Para iniciar: ./INICIAR.sh"
