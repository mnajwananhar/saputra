import { supabase } from '../lib/supabase';
import bcrypt from 'bcryptjs';

// Auth API - Query User table directly (username/password login)
export const authApi = {
  login: async (username: string, password: string) => {
    // Query user by username - INCLUDE ROLE!
    const { data: user, error } = await supabase
      .from('User')
      .select('id, username, password, name, role')
      .eq('username', username)
      .single();
    
    if (error || !user) {
      throw new Error('Username tidak ditemukan');
    }
    
    // Verify password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new Error('Password salah');
    }
    
    // Return user without password
    return {
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role || 'employee' // Include role!
      }
    };
  },

  getMe: async () => {
    // Get user from localStorage
    const userData = localStorage.getItem('userData');
    if (!userData) {
      throw new Error('Not authenticated');
    }
    return JSON.parse(userData);
  }
};

// Helper to get current user ID
const getCurrentUserId = (): string => {
  const userData = localStorage.getItem('userData');
  if (!userData) throw new Error('Not authenticated');
  return JSON.parse(userData).id;
};

// Products API - Query Supabase directly
export const productsApi = {
  getAll: async () => {
    const userId = getCurrentUserId();
    
    const { data, error } = await supabase
      .from('Product')
      .select(`
        id,
        name,
        unit,
        currentStock,
        safetyStock,
        bestN,
        userId,
        HistoricalData (
          id,
          month,
          year,
          day,
          demand,
          periodLabel
        )
      `)
      .eq('userId', userId)
      .order('name');
    
    if (error) throw new Error('Gagal mengambil data produk');
    
    // Transform to match expected format
    return data.map(product => ({
      id: product.id,
      name: product.name,
      unit: product.unit,
      bestN: product.bestN,
      stock: {
        currentStock: product.currentStock,
        safetyStock: product.safetyStock
      },
      data: (product.HistoricalData || []).sort((a: any, b: any) => {
        if (a.year !== b.year) return a.year - b.year;
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'];
        return months.indexOf(a.month) - months.indexOf(b.month);
      })
    }));
  },
  
  // ... create ...
  create: async (data: { name: string; unit: string; currentStock: number; safetyStock: number }) => {
    const userId = getCurrentUserId();
    // Generate unique ID (similar to cuid)
    const id = 'c' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
    
    const { data: product, error } = await supabase
      .from('Product')
      .insert({
        id,
        name: data.name,
        unit: data.unit,
        currentStock: data.currentStock,
        safetyStock: data.safetyStock,
        bestN: 4,
        userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) {
      console.error('Supabase error:', error);
      throw new Error('Gagal membuat produk: ' + error.message);
    }
    
    return {
      id: product.id,
      name: product.name,
      unit: product.unit,
      bestN: product.bestN,
      stock: {
        currentStock: product.currentStock,
        safetyStock: product.safetyStock
      },
      data: []
    };
  },

  updateStock: async (id: string, currentStock: number, safetyStock: number) => {
    const { error } = await supabase
      .from('Product')
      .update({ currentStock, safetyStock })
      .eq('id', id);
    
    if (error) throw new Error('Gagal mengupdate stok');
    return { success: true };
  },

  delete: async (id: string) => {
    const { error } = await supabase
      .from('Product')
      .delete()
      .eq('id', id);
    
    if (error) throw new Error('Gagal menghapus produk');
    return { success: true };
  },

  updateHistoricalData: async (productId: string, historyId: string, updates: { demand?: number, day?: number }) => {
    const { error } = await supabase
      .from('HistoricalData')
      .update(updates)
      .eq('id', historyId);
    
    if (error) throw new Error('Gagal mengupdate data historis');
    return { success: true };
  },

  initializeHistory: async (productId: string) => {
    // ... logic ...
    const entries = [];
    const monthsList = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'];
    
    // Start from LAST MONTH (exclude current month) and go back 24 months
    const date = new Date();
    date.setDate(1); 
    date.setMonth(date.getMonth() - 1); // Mundur 1 bulan dari sekarang

    for (let i = 0; i < 24; i++) {
      const monthIndex = date.getMonth();
      const year = date.getFullYear();
      const monthLabel = monthsList[monthIndex];

      entries.push({
        id: 'h' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36) + i,
        productId,
        month: monthLabel,
        year: year,
        day: 1, // Default day
        demand: 0,
        // ... rest

        periodLabel: `${monthLabel} ${year}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      // Move back one month
      date.setMonth(date.getMonth() - 1);
    }
    
    // Clear existing data to avoid duplicates or partial states
    await supabase.from('HistoricalData').delete().eq('productId', productId);

    const { error } = await supabase.from('HistoricalData').insert(entries);
    if (error) throw new Error('Gagal inisialisasi data historis: ' + error.message);
    return { success: true };
  }
};
