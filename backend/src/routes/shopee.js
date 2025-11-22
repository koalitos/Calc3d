const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const axios = require('axios');

// Armazenamento temporário (em produção, usar banco de dados)
let shopeeConfig = {};
let notifications = [];

// Middleware de autenticação (simplificado)
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token não fornecido' });
  next();
};

// Gerar assinatura para API da Shopee
function generateSignature(partnerId, path, timestamp, accessToken, shopId, partnerKey) {
  const baseString = `${partnerId}${path}${timestamp}${accessToken}${shopId}`;
  return crypto.createHmac('sha256', partnerKey).update(baseString).digest('hex');
}

// GET - Obter configuração
router.get('/config', auth, (req, res) => {
  res.json(shopeeConfig);
});

// POST - Salvar configuração
router.post('/config', auth, (req, res) => {
  shopeeConfig = req.body;
  res.json({ success: true, message: 'Configuração salva' });
});

// POST - Testar conexão
router.post('/test', auth, async (req, res) => {
  try {
    if (!shopeeConfig.partnerId || !shopeeConfig.partnerKey || !shopeeConfig.shopId) {
      return res.json({ success: false, message: 'Configuração incompleta' });
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const path = '/api/v2/shop/get_shop_info';
    const signature = generateSignature(
      shopeeConfig.partnerId,
      path,
      timestamp,
      '',
      shopeeConfig.shopId,
      shopeeConfig.partnerKey
    );

    // Teste de conexão (simulado - em produção fazer chamada real)
    res.json({ 
      success: true, 
      message: 'Conexão testada com sucesso',
      shopId: shopeeConfig.shopId
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});

// GET - Obter notificações
router.get('/notifications', auth, (req, res) => {
  res.json(notifications);
});

// POST - Webhook da Shopee (recebe notificações de vendas)
router.post('/webhook', async (req, res) => {
  try {
    const { code, data } = req.body;
    
    // code = 0 significa nova venda
    if (code === 0) {
      const notification = {
        orderId: data.ordersn,
        productName: data.item_list?.[0]?.item_name || 'Produto',
        quantity: data.item_list?.[0]?.model_quantity_purchased || 1,
        total: data.total_amount,
        status: data.order_status,
        timestamp: new Date().toISOString()
      };
      
      notifications.unshift(notification);
      
      // Manter apenas as últimas 50 notificações
      if (notifications.length > 50) {
        notifications = notifications.slice(0, 50);
      }
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Erro no webhook:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET - Obter pedidos
router.get('/orders', auth, async (req, res) => {
  try {
    if (!shopeeConfig.partnerId || !shopeeConfig.partnerKey) {
      return res.status(400).json({ error: 'Configuração incompleta' });
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const path = '/api/v2/order/get_order_list';
    
    // Aqui você faria a chamada real para a API da Shopee
    // const response = await axios.get(`https://partner.shopeemobile.com${path}`, {...});
    
    res.json({ 
      orders: [],
      message: 'Funcionalidade em desenvolvimento'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Obter produtos
router.get('/products', auth, async (req, res) => {
  try {
    res.json({ 
      products: [],
      message: 'Funcionalidade em desenvolvimento'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST - Atualizar estoque
router.post('/inventory/update', auth, async (req, res) => {
  try {
    const { itemId, stock } = req.body;
    
    res.json({ 
      success: true,
      message: 'Funcionalidade em desenvolvimento'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
