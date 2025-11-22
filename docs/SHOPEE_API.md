# 🛍️ Integração com API da Shopee

## O que você pode fazer com a API da Shopee

### 1. 📦 Gerenciamento de Pedidos
- **Listar pedidos** - Ver todos os pedidos da loja
- **Detalhes do pedido** - Informações completas de cada pedido
- **Atualizar status** - Marcar como processado, enviado, etc.
- **Cancelar pedidos** - Cancelar pedidos quando necessário
- **Histórico** - Ver histórico completo de pedidos

### 2. 🏷️ Gerenciamento de Produtos
- **Listar produtos** - Ver todos os produtos da loja
- **Adicionar produtos** - Criar novos produtos
- **Atualizar produtos** - Editar informações, preços, descrições
- **Deletar produtos** - Remover produtos
- **Upload de imagens** - Adicionar fotos dos produtos
- **Variações** - Gerenciar tamanhos, cores, etc.

### 3. 📊 Controle de Estoque
- **Ver estoque atual** - Quantidade disponível de cada produto
- **Atualizar estoque** - Adicionar ou remover quantidades
- **Alertas de estoque baixo** - Notificações automáticas
- **Sincronização** - Manter estoque atualizado em tempo real

### 4. 🚚 Logística e Envios
- **Gerar etiquetas** - Criar etiquetas de envio automaticamente
- **Rastreamento** - Adicionar códigos de rastreio
- **Calcular frete** - Obter valores de frete
- **Transportadoras** - Integração com diferentes transportadoras
- **Status de entrega** - Acompanhar entregas

### 5. 🎁 Promoções e Descontos
- **Criar promoções** - Configurar ofertas especiais
- **Cupons de desconto** - Gerar e gerenciar cupons
- **Flash sales** - Criar vendas relâmpago
- **Combos** - Criar pacotes de produtos

### 6. 📈 Relatórios e Analytics
- **Relatório de vendas** - Ver vendas por período
- **Produtos mais vendidos** - Ranking de produtos
- **Receita** - Análise financeira
- **Performance** - Métricas de desempenho da loja
- **Exportar dados** - Baixar relatórios em CSV/Excel

### 7. 💬 Chat com Clientes
- **Mensagens** - Ler e responder mensagens
- **Notificações** - Alertas de novas mensagens
- **Histórico** - Ver conversas anteriores
- **Respostas automáticas** - Configurar mensagens automáticas

### 8. 🔔 Webhooks (Notificações em Tempo Real)
- **Nova venda** - Notificação instantânea de vendas
- **Mudança de status** - Quando pedido muda de status
- **Mensagem nova** - Quando cliente envia mensagem
- **Estoque baixo** - Alerta de produtos acabando
- **Cancelamento** - Quando pedido é cancelado

## Como Configurar

### 1. Obter Credenciais da Shopee

1. Acesse o [Shopee Open Platform](https://open.shopee.com/)
2. Faça login com sua conta de vendedor
3. Crie um novo aplicativo
4. Anote as credenciais:
   - **Partner ID**
   - **Partner Key**
   - **Shop ID**

### 2. Configurar no Calc 3D Print

1. Abra o aplicativo
2. Vá em **Dashboard > Shopee**
3. Preencha as credenciais:
   - Partner ID
   - Partner Key
   - Shop ID
4. Clique em **Salvar**
5. Clique em **Testar Conexão**

### 3. Ativar Notificações

1. Marque a opção **Ativar Notificações**
2. Configure o webhook na Shopee:
   - URL: `http://seu-servidor.com/api/shopee/webhook`
   - Eventos: Selecione os eventos desejados

## Endpoints Disponíveis

### Configuração
```
GET  /api/shopee/config          - Obter configuração
POST /api/shopee/config          - Salvar configuração
POST /api/shopee/test            - Testar conexão
```

### Notificações
```
GET  /api/shopee/notifications   - Listar notificações
POST /api/shopee/webhook         - Receber webhooks da Shopee
```

### Pedidos
```
GET  /api/shopee/orders          - Listar pedidos
GET  /api/shopee/orders/:id      - Detalhes do pedido
POST /api/shopee/orders/:id/ship - Marcar como enviado
```

### Produtos
```
GET  /api/shopee/products        - Listar produtos
POST /api/shopee/products        - Criar produto
PUT  /api/shopee/products/:id    - Atualizar produto
DEL  /api/shopee/products/:id    - Deletar produto
```

### Estoque
```
POST /api/shopee/inventory/update - Atualizar estoque
GET  /api/shopee/inventory/:id    - Ver estoque do produto
```

## Exemplo de Uso

### Receber Notificação de Nova Venda

Quando uma venda é realizada na Shopee, o webhook envia:

```json
{
  "code": 0,
  "data": {
    "ordersn": "210123ABC456",
    "order_status": "READY_TO_SHIP",
    "total_amount": 150.00,
    "item_list": [
      {
        "item_name": "Miniatura 3D Personalizada",
        "model_quantity_purchased": 2
      }
    ]
  }
}
```

O sistema automaticamente:
1. Recebe a notificação
2. Salva no banco de dados
3. Exibe na interface
4. Pode enviar notificação desktop (futuro)

## Segurança

- Todas as requisições usam autenticação JWT
- Assinaturas HMAC-SHA256 para validar webhooks
- Credenciais armazenadas de forma segura
- HTTPS obrigatório em produção

## Próximos Passos

- [ ] Implementar sincronização automática de estoque
- [ ] Adicionar notificações desktop
- [ ] Criar dashboard de analytics
- [ ] Integrar chat com clientes
- [ ] Gerar etiquetas de envio automaticamente
- [ ] Relatórios de vendas detalhados

## Recursos Úteis

- [Documentação Oficial da Shopee API](https://open.shopee.com/documents)
- [Guia de Webhooks](https://open.shopee.com/documents/v2/v2.push.get_config)
- [Exemplos de Código](https://github.com/shopee-open-platform)
