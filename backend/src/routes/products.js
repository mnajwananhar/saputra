const express = require('express');
const prisma = require('../lib/prisma');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// GET /api/products - Get all products with historical data
router.get('/', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        history: {
          orderBy: [
            { year: 'asc' },
            { month: 'asc' }
          ]
        }
      },
      orderBy: { createdAt: 'asc' }
    });

    // Transform to match frontend format
    const transformed = products.map(p => ({
      id: p.id,
      name: p.name,
      unit: p.unit,
      stock: {
        currentStock: p.currentStock,
        safetyStock: p.safetyStock
      },
      bestN: p.bestN,
      data: p.history.map(h => ({
        id: h.id,
        month: h.month,
        year: h.year,
        periodLabel: h.periodLabel,
        demand: h.demand
      }))
    }));

    res.json(transformed);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Gagal mengambil data produk' });
  }
});

// POST /api/products - Create new product
router.post('/', async (req, res) => {
  try {
    const { name, unit, currentStock, safetyStock } = req.body;

    if (!name || !unit) {
      return res.status(400).json({ error: 'Nama dan unit produk wajib diisi' });
    }

    // Generate 24 bulan rolling data dengan demand 0
    const rolling = getRolling24Months();

    const product = await prisma.product.create({
      data: {
        name,
        unit,
        currentStock: currentStock || 0,
        safetyStock: safetyStock || 0,
        bestN: 4,
        history: {
          create: rolling.map(period => ({
            month: period.month,
            year: period.year,
            periodLabel: period.periodLabel,
            demand: 0
          }))
        }
      },
      include: { history: true }
    });

    res.status(201).json({
      id: product.id,
      name: product.name,
      unit: product.unit,
      stock: {
        currentStock: product.currentStock,
        safetyStock: product.safetyStock
      },
      bestN: product.bestN,
      data: product.history.map(h => ({
        id: h.id,
        month: h.month,
        year: h.year,
        periodLabel: h.periodLabel,
        demand: h.demand
      }))
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Gagal membuat produk' });
  }
});

// PUT /api/products/:id - Update product stock
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { currentStock, safetyStock } = req.body;

    const product = await prisma.product.update({
      where: { id },
      data: {
        currentStock: currentStock !== undefined ? currentStock : undefined,
        safetyStock: safetyStock !== undefined ? safetyStock : undefined
      }
    });

    res.json({
      id: product.id,
      currentStock: product.currentStock,
      safetyStock: product.safetyStock
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Gagal mengupdate produk' });
  }
});

// DELETE /api/products/:id - Delete product
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.product.delete({
      where: { id }
    });

    res.json({ message: 'Produk berhasil dihapus' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Gagal menghapus produk' });
  }
});

// PUT /api/products/:id/history/:historyId - Update historical data
router.put('/:id/history/:historyId', async (req, res) => {
  try {
    const { historyId } = req.params;
    const { demand } = req.body;

    const history = await prisma.historicalData.update({
      where: { id: historyId },
      data: { demand: demand || 0 }
    });

    res.json(history);
  } catch (error) {
    console.error('Update history error:', error);
    res.status(500).json({ error: 'Gagal mengupdate data historis' });
  }
});

// PUT /api/products/:id/history - Batch update historical data
router.put('/:id/history', async (req, res) => {
  try {
    const { id } = req.params;
    const { updates } = req.body; // Array of { historyId, demand }

    if (!Array.isArray(updates)) {
      return res.status(400).json({ error: 'Format data tidak valid' });
    }

    const results = await Promise.all(
      updates.map(update =>
        prisma.historicalData.update({
          where: { id: update.historyId },
          data: { demand: update.demand || 0 }
        })
      )
    );

    res.json(results);
  } catch (error) {
    console.error('Batch update history error:', error);
    res.status(500).json({ error: 'Gagal mengupdate data historis' });
  }
});

// Helper: Generate 24 bulan rolling
function getRolling24Months() {
  const result = [];
  const now = new Date();
  
  for (let i = 24; i > 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'];
    const monthLabel = monthNames[d.getMonth()];
    const yearLabel = d.getFullYear();
    
    result.push({
      month: monthLabel,
      year: yearLabel,
      periodLabel: `${monthLabel}-${yearLabel.toString().slice(-2)}`
    });
  }
  return result;
}

module.exports = router;
