// Electron Production Entry Point
// Este arquivo força o modo de produção antes de carregar o electron.js principal

const { app } = require('electron');

// Forçar modo de produção
process.env.NODE_ENV = 'production';

console.log('🚀 Iniciando Calc 3D Print em modo PRODUÇÃO');
console.log('📍 NODE_ENV:', process.env.NODE_ENV);

// Carregar o electron.js principal
require('./electron');
