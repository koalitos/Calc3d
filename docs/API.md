# 🔌 Documentação da API - Calc 3D Print

Documentação completa da API REST do backend.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Autenticação](#autenticação)
- [Endpoints](#endpoints)
  - [Auth](#auth)
  - [Filamentos](#filamentos)
  - [Máquinas](#máquinas)
  - [Projetos](#projetos)
- [Códigos de Status](#códigos-de-status)
- [Exemplos](#exemplos)

## 🌐 Visão Geral

### Base URL

```
http://localhost:3001/api
```

### Formato

- **Request:** JSON
- **Response:** JSON
- **Encoding:** UTF-8

### Headers Padrão

```http
Content-Type: application/json
Accept: application/json
```

### Autenticação

A maioria dos endpoints requer autenticação via JWT token no header:

```http
Authorization: Bearer {token}
```

## 🔐 Autenticação

### Registro de Usuário

Cria uma nova conta de usuário.

**Endpoint:** `POST /api/auth/register`

**Body:**
```json
{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "senha123"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "Usuário criado com sucesso",
  "data": {
    "user": {
      "id": 1,
      "name": "João Silva",
      "email": "joao@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Erros:**
- `400` - Email já cadastrado
- `400` - Dados inválidos

---

### Login

Autentica um usuário existente.

**Endpoint:** `POST /api/auth/login`

**Body:**
```json
{
  "email": "joao@example.com",
  "password": "senha123"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Login realizado com sucesso",
  "data": {
    "user": {
      "id": 1,
      "name": "João Silva",
      "email": "joao@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Erros:**
- `401` - Email ou senha incorretos
- `400` - Dados inválidos

---

### Verificar Token

Valida um token JWT.

**Endpoint:** `GET /api/auth/verify`

**Headers:**
```http
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "name": "João Silva",
      "email": "joao@example.com"
    }
  }
}
```

**Erros:**
- `401` - Token inválido ou expirado

---

## 🧵 Filamentos

### Listar Filamentos

Retorna todos os filamentos do usuário autenticado.

**Endpoint:** `GET /api/filaments`

**Headers:**
```http
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "PLA Branco",
      "type": "PLA",
      "weight": 1000,
      "cost": 80.00,
      "costPerGram": 0.08,
      "userId": 1,
      "createdAt": "2024-01-15T10:30:00.000Z"
    },
    {
      "id": 2,
      "name": "ABS Preto",
      "type": "ABS",
      "weight": 1000,
      "cost": 90.00,
      "costPerGram": 0.09,
      "userId": 1,
      "createdAt": "2024-01-16T14:20:00.000Z"
    }
  ]
}
```

---

### Buscar Filamento

Retorna um filamento específico.

**Endpoint:** `GET /api/filaments/:id`

**Headers:**
```http
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "PLA Branco",
    "type": "PLA",
    "weight": 1000,
    "cost": 80.00,
    "costPerGram": 0.08,
    "userId": 1,
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Erros:**
- `404` - Filamento não encontrado

---

### Criar Filamento

Cria um novo filamento.

**Endpoint:** `POST /api/filaments`

**Headers:**
```http
Authorization: Bearer {token}
```

**Body:**
```json
{
  "name": "PETG Transparente",
  "type": "PETG",
  "weight": 1000,
  "cost": 95.00
}
```

**Tipos válidos:** `PLA`, `ABS`, `PETG`, `TPU`, `Nylon`

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "Filamento criado com sucesso",
  "data": {
    "id": 3,
    "name": "PETG Transparente",
    "type": "PETG",
    "weight": 1000,
    "cost": 95.00,
    "costPerGram": 0.095,
    "userId": 1,
    "createdAt": "2024-01-17T09:15:00.000Z"
  }
}
```

**Erros:**
- `400` - Dados inválidos
- `400` - Tipo de filamento inválido

---

### Atualizar Filamento

Atualiza um filamento existente.

**Endpoint:** `PUT /api/filaments/:id`

**Headers:**
```http
Authorization: Bearer {token}
```

**Body:**
```json
{
  "name": "PETG Transparente Premium",
  "cost": 100.00
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Filamento atualizado com sucesso",
  "data": {
    "id": 3,
    "name": "PETG Transparente Premium",
    "type": "PETG",
    "weight": 1000,
    "cost": 100.00,
    "costPerGram": 0.10,
    "userId": 1,
    "updatedAt": "2024-01-17T10:00:00.000Z"
  }
}
```

**Erros:**
- `404` - Filamento não encontrado
- `403` - Sem permissão

---

### Deletar Filamento

Remove um filamento.

**Endpoint:** `DELETE /api/filaments/:id`

**Headers:**
```http
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Filamento deletado com sucesso"
}
```

**Erros:**
- `404` - Filamento não encontrado
- `403` - Sem permissão
- `400` - Filamento em uso em projetos

---

## 🖨️ Máquinas

### Listar Máquinas

Retorna todas as máquinas do usuário.

**Endpoint:** `GET /api/machines`

**Headers:**
```http
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Ender 3 V2",
      "power": 350,
      "costPerKwh": 0.80,
      "machineCost": 1500.00,
      "lifespan": 5000,
      "energyCostPerHour": 0.28,
      "depreciationPerHour": 0.30,
      "userId": 1,
      "createdAt": "2024-01-15T11:00:00.000Z"
    }
  ]
}
```

---

### Buscar Máquina

Retorna uma máquina específica.

**Endpoint:** `GET /api/machines/:id`

**Headers:**
```http
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Ender 3 V2",
    "power": 350,
    "costPerKwh": 0.80,
    "machineCost": 1500.00,
    "lifespan": 5000,
    "energyCostPerHour": 0.28,
    "depreciationPerHour": 0.30,
    "userId": 1,
    "createdAt": "2024-01-15T11:00:00.000Z"
  }
}
```

---

### Criar Máquina

Cria uma nova máquina.

**Endpoint:** `POST /api/machines`

**Headers:**
```http
Authorization: Bearer {token}
```

**Body:**
```json
{
  "name": "Prusa i3 MK3S",
  "power": 120,
  "costPerKwh": 0.80,
  "machineCost": 3500.00,
  "lifespan": 10000
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "Máquina criada com sucesso",
  "data": {
    "id": 2,
    "name": "Prusa i3 MK3S",
    "power": 120,
    "costPerKwh": 0.80,
    "machineCost": 3500.00,
    "lifespan": 10000,
    "energyCostPerHour": 0.096,
    "depreciationPerHour": 0.35,
    "userId": 1,
    "createdAt": "2024-01-17T12:00:00.000Z"
  }
}
```

**Cálculos automáticos:**
- `energyCostPerHour = (power / 1000) * costPerKwh`
- `depreciationPerHour = machineCost / lifespan`

---

### Atualizar Máquina

Atualiza uma máquina existente.

**Endpoint:** `PUT /api/machines/:id`

**Headers:**
```http
Authorization: Bearer {token}
```

**Body:**
```json
{
  "name": "Prusa i3 MK3S+",
  "power": 150
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Máquina atualizada com sucesso",
  "data": {
    "id": 2,
    "name": "Prusa i3 MK3S+",
    "power": 150,
    "energyCostPerHour": 0.12,
    "updatedAt": "2024-01-17T13:00:00.000Z"
  }
}
```

---

### Deletar Máquina

Remove uma máquina.

**Endpoint:** `DELETE /api/machines/:id`

**Headers:**
```http
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Máquina deletada com sucesso"
}
```

---

## 📦 Projetos

### Listar Projetos

Retorna todos os projetos do usuário.

**Endpoint:** `GET /api/projects`

**Headers:**
```http
Authorization: Bearer {token}
```

**Query Parameters:**
- `status` (opcional): `pending`, `completed`, `cancelled`
- `limit` (opcional): número de resultados (padrão: 50)
- `offset` (opcional): paginação (padrão: 0)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Vaso Decorativo",
      "client": "João Silva",
      "filamentId": 1,
      "machineId": 1,
      "printTime": 5.5,
      "profitMargin": 50,
      "stlFile": "vaso-decorativo.stl",
      "volume": 45000,
      "weight": 54,
      "costs": {
        "filament": 4.32,
        "energy": 1.54,
        "depreciation": 1.65,
        "total": 7.51
      },
      "salePrice": 15.02,
      "status": "completed",
      "userId": 1,
      "createdAt": "2024-01-17T14:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 1,
    "limit": 50,
    "offset": 0
  }
}
```

---

### Buscar Projeto

Retorna um projeto específico.

**Endpoint:** `GET /api/projects/:id`

**Headers:**
```http
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Vaso Decorativo",
    "client": "João Silva",
    "filament": {
      "id": 1,
      "name": "PLA Branco",
      "type": "PLA",
      "costPerGram": 0.08
    },
    "machine": {
      "id": 1,
      "name": "Ender 3 V2",
      "energyCostPerHour": 0.28,
      "depreciationPerHour": 0.30
    },
    "printTime": 5.5,
    "profitMargin": 50,
    "stlFile": "vaso-decorativo.stl",
    "volume": 45000,
    "weight": 54,
    "costs": {
      "filament": 4.32,
      "energy": 1.54,
      "depreciation": 1.65,
      "total": 7.51
    },
    "salePrice": 15.02,
    "status": "completed",
    "createdAt": "2024-01-17T14:00:00.000Z"
  }
}
```

---

### Criar Projeto

Cria um novo projeto.

**Endpoint:** `POST /api/projects`

**Headers:**
```http
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Body (FormData):**
```
name: "Suporte de Celular"
client: "Maria Santos" (opcional)
filamentId: 1
machineId: 1
printTime: 3.5
profitMargin: 40
stlFile: [arquivo .stl]
```

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "Projeto criado com sucesso",
  "data": {
    "id": 2,
    "name": "Suporte de Celular",
    "client": "Maria Santos",
    "filamentId": 1,
    "machineId": 1,
    "printTime": 3.5,
    "profitMargin": 40,
    "stlFile": "suporte-celular-1705501234567.stl",
    "volume": 28000,
    "weight": 33.6,
    "costs": {
      "filament": 2.69,
      "energy": 0.98,
      "depreciation": 1.05,
      "total": 4.72
    },
    "salePrice": 9.44,
    "status": "pending",
    "userId": 1,
    "createdAt": "2024-01-17T15:00:00.000Z"
  }
}
```

**Cálculos automáticos:**
- `volume` - Extraído do arquivo STL (mm³)
- `weight` - volume * densidade do filamento (g)
- `costs.filament` - weight * costPerGram
- `costs.energy` - printTime * energyCostPerHour
- `costs.depreciation` - printTime * depreciationPerHour
- `costs.total` - soma de todos os custos
- `salePrice` - total * (1 + profitMargin/100)

---

### Atualizar Projeto

Atualiza um projeto existente.

**Endpoint:** `PUT /api/projects/:id`

**Headers:**
```http
Authorization: Bearer {token}
```

**Body:**
```json
{
  "name": "Suporte de Celular Premium",
  "status": "completed",
  "profitMargin": 50
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Projeto atualizado com sucesso",
  "data": {
    "id": 2,
    "name": "Suporte de Celular Premium",
    "status": "completed",
    "profitMargin": 50,
    "salePrice": 11.80,
    "updatedAt": "2024-01-17T16:00:00.000Z"
  }
}
```

---

### Deletar Projeto

Remove um projeto.

**Endpoint:** `DELETE /api/projects/:id`

**Headers:**
```http
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Projeto deletado com sucesso"
}
```

---

### Analisar STL

Analisa um arquivo STL sem criar projeto.

**Endpoint:** `POST /api/projects/analyze-stl`

**Headers:**
```http
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Body (FormData):**
```
stlFile: [arquivo .stl]
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "volume": 45000,
    "volumeCm3": 45,
    "estimatedWeight": {
      "PLA": 54,
      "ABS": 47.7,
      "PETG": 56.7,
      "TPU": 51.3,
      "Nylon": 51.3
    },
    "boundingBox": {
      "x": 80,
      "y": 80,
      "z": 50
    }
  }
}
```

---

## 📊 Códigos de Status

### Sucesso
- `200 OK` - Requisição bem-sucedida
- `201 Created` - Recurso criado com sucesso
- `204 No Content` - Sucesso sem conteúdo

### Erro do Cliente
- `400 Bad Request` - Dados inválidos
- `401 Unauthorized` - Não autenticado
- `403 Forbidden` - Sem permissão
- `404 Not Found` - Recurso não encontrado
- `409 Conflict` - Conflito (ex: email já existe)
- `422 Unprocessable Entity` - Validação falhou

### Erro do Servidor
- `500 Internal Server Error` - Erro interno
- `503 Service Unavailable` - Serviço indisponível

## 📝 Formato de Erro

Todos os erros seguem o formato:

```json
{
  "success": false,
  "error": {
    "message": "Descrição do erro",
    "code": "ERROR_CODE",
    "details": {}
  }
}
```

**Exemplo:**
```json
{
  "success": false,
  "error": {
    "message": "Email já cadastrado",
    "code": "EMAIL_EXISTS",
    "details": {
      "field": "email"
    }
  }
}
```

## 🔍 Exemplos de Uso

### cURL

**Login:**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"joao@example.com","password":"senha123"}'
```

**Listar Filamentos:**
```bash
curl -X GET http://localhost:3001/api/filaments \
  -H "Authorization: Bearer {seu_token}"
```

**Criar Projeto:**
```bash
curl -X POST http://localhost:3001/api/projects \
  -H "Authorization: Bearer {seu_token}" \
  -F "name=Vaso" \
  -F "filamentId=1" \
  -F "machineId=1" \
  -F "printTime=5.5" \
  -F "profitMargin=50" \
  -F "stlFile=@vaso.stl"
```

### JavaScript (Axios)

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Login
const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  const token = response.data.data.token;
  
  // Salvar token
  localStorage.setItem('token', token);
  
  // Configurar para próximas requisições
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  
  return response.data;
};

// Listar filamentos
const getFilaments = async () => {
  const response = await api.get('/filaments');
  return response.data.data;
};

// Criar projeto com STL
const createProject = async (projectData, stlFile) => {
  const formData = new FormData();
  formData.append('name', projectData.name);
  formData.append('filamentId', projectData.filamentId);
  formData.append('machineId', projectData.machineId);
  formData.append('printTime', projectData.printTime);
  formData.append('profitMargin', projectData.profitMargin);
  formData.append('stlFile', stlFile);
  
  const response = await api.post('/projects', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  
  return response.data.data;
};
```

### Python (Requests)

```python
import requests

BASE_URL = 'http://localhost:3001/api'

# Login
def login(email, password):
    response = requests.post(
        f'{BASE_URL}/auth/login',
        json={'email': email, 'password': password}
    )
    data = response.json()
    return data['data']['token']

# Listar filamentos
def get_filaments(token):
    headers = {'Authorization': f'Bearer {token}'}
    response = requests.get(f'{BASE_URL}/filaments', headers=headers)
    return response.json()['data']

# Criar projeto
def create_project(token, project_data, stl_file_path):
    headers = {'Authorization': f'Bearer {token}'}
    files = {'stlFile': open(stl_file_path, 'rb')}
    
    response = requests.post(
        f'{BASE_URL}/projects',
        headers=headers,
        data=project_data,
        files=files
    )
    
    return response.json()['data']
```

## 🔒 Rate Limiting

Atualmente não há rate limiting implementado, mas está planejado para versões futuras:

- **Login:** 5 tentativas por minuto
- **API Geral:** 100 requisições por minuto

## 📚 Recursos Adicionais

- [Postman Collection](https://github.com/koalitos/calc3D/tree/main/postman)
- [Swagger/OpenAPI](http://localhost:3001/api-docs) (em desenvolvimento)
- [Guia de Desenvolvimento](DESENVOLVIMENTO.md)

## 💡 Dicas

1. **Sempre valide** o token antes de fazer requisições
2. **Use HTTPS** em produção
3. **Trate erros** adequadamente
4. **Cache** dados quando possível
5. **Implemente retry** para requisições falhadas

---

**Desenvolvido com ❤️ para a comunidade de impressão 3D**

**Site:** https://koalitos.github.io/calc3D/  
**GitHub:** https://github.com/koalitos/calc3D  
**Issues:** https://github.com/koalitos/calc3D/issues
