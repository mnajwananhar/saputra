import { ProductData, Supplier, Transaction } from '../types';
import { supabase, mockSupabase } from '../lib/supabaseClient';

// Use mock client if supabase is not available
const client = supabase || mockSupabase;

// Product Service
export const productService = {
  getAll: async (): Promise<ProductData[]> => {
    const { data, error } = await client
      .from('Product')
      .select(`
        id,
        name,
        unit,
        price,
        cost,
        currentStock,
        safetyStock,
        bestN,
        createdAt,
        updatedAt,
        supplierId,
        Supplier (id, name, contact, address, phone, email, createdAt, updatedAt)
      `)
      .order('createdAt', { ascending: false });

    if (error) throw new Error(error.message);

    if (!data) return []; // Handle case where no data is returned

    return data.map(item => ({
      id: item.id,
      name: item.name,
      unit: item.unit,
      price: item.price,
      cost: item.cost,
      stock: {
        currentStock: item.currentStock,
        safetyStock: item.safetyStock
      },
      bestN: item.bestN,
      supplierId: item.supplierId,
      supplier: item.Supplier ? {
        id: item.Supplier.id,
        name: item.Supplier.name,
        contact: item.Supplier.contact,
        address: item.Supplier.address,
        phone: item.Supplier.phone,
        email: item.Supplier.email,
        createdAt: item.Supplier.createdAt,
        updatedAt: item.Supplier.updatedAt
      } : undefined,
      data: [], // Historical data would be fetched separately if needed
      createdAt: item.createdAt,
      updatedAt: item.updatedAt
    }));
  },

  getById: async (id: string): Promise<ProductData | null> => {
    const { data, error } = await supabase
      .from('Product')
      .select(`
        id, 
        name, 
        unit, 
        price, 
        cost, 
        currentStock, 
        safetyStock, 
        bestN,
        createdAt,
        updatedAt,
        supplierId,
        Supplier (id, name, contact, address, phone, email, createdAt, updatedAt)
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Row not found
      throw new Error(error.message);
    }

    return {
      id: data.id,
      name: data.name,
      unit: data.unit,
      price: data.price,
      cost: data.cost,
      stock: {
        currentStock: data.currentStock,
        safetyStock: data.safetyStock
      },
      bestN: data.bestN,
      supplierId: data.supplierId,
      supplier: data.Supplier ? {
        id: data.Supplier.id,
        name: data.Supplier.name,
        contact: data.Supplier.contact,
        address: data.Supplier.address,
        phone: data.Supplier.phone,
        email: data.Supplier.email,
        createdAt: data.Supplier.createdAt,
        updatedAt: data.Supplier.updatedAt
      } : undefined,
      data: [], // Historical data would be fetched separately if needed
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    };
  },

  create: async (product: Omit<ProductData, 'id' | 'data' | 'createdAt' | 'updatedAt'>): Promise<ProductData> => {
    const { data, error } = await supabase
      .from('Product')
      .insert([{
        name: product.name,
        unit: product.unit,
        price: product.price,
        cost: product.cost,
        currentStock: product.stock.currentStock,
        safetyStock: product.stock.safetyStock,
        bestN: product.bestN,
        supplierId: product.supplierId
      }])
      .select()
      .single();

    if (error) throw new Error(error.message);

    return {
      id: data.id,
      name: data.name,
      unit: data.unit,
      price: data.price,
      cost: data.cost,
      stock: {
        currentStock: data.currentStock,
        safetyStock: data.safetyStock
      },
      bestN: data.bestN,
      supplierId: data.supplierId,
      data: [],
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    };
  },

  update: async (id: string, updates: Partial<Omit<ProductData, 'id' | 'data' | 'createdAt' | 'updatedAt'>>): Promise<ProductData> => {
    const { data, error } = await supabase
      .from('Product')
      .update({
        name: updates.name,
        unit: updates.unit,
        price: updates.price,
        cost: updates.cost,
        currentStock: updates.stock?.currentStock,
        safetyStock: updates.stock?.safetyStock,
        bestN: updates.bestN,
        supplierId: updates.supplierId,
        updatedAt: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);

    return {
      id: data.id,
      name: data.name,
      unit: data.unit,
      price: data.price,
      cost: data.cost,
      stock: {
        currentStock: data.currentStock,
        safetyStock: data.safetyStock
      },
      bestN: data.bestN,
      supplierId: data.supplierId,
      data: [],
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    };
  },

  delete: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('Product')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
  },

  updateStock: async (id: string, currentStock: number, safetyStock: number): Promise<ProductData> => {
    const { data, error } = await supabase
      .from('Product')
      .update({
        currentStock,
        safetyStock,
        updatedAt: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);

    return {
      id: data.id,
      name: data.name,
      unit: data.unit,
      price: data.price,
      cost: data.cost,
      stock: {
        currentStock: data.currentStock,
        safetyStock: data.safetyStock
      },
      bestN: data.bestN,
      supplierId: data.supplierId,
      data: [],
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    };
  }
};

// Supplier Service
export const supplierService = {
  getAll: async (): Promise<Supplier[]> => {
    const { data, error } = await supabase
      .from('Supplier')
      .select('*')
      .order('createdAt', { ascending: false });

    if (error) throw new Error(error.message);

    return data;
  },

  getById: async (id: string): Promise<Supplier | null> => {
    const { data, error } = await supabase
      .from('Supplier')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Row not found
      throw new Error(error.message);
    }

    return data;
  },

  create: async (supplier: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>): Promise<Supplier> => {
    const { data, error } = await supabase
      .from('Supplier')
      .insert([{
        name: supplier.name,
        contact: supplier.contact,
        address: supplier.address,
        phone: supplier.phone,
        email: supplier.email
      }])
      .select()
      .single();

    if (error) throw new Error(error.message);

    return data;
  },

  update: async (id: string, updates: Partial<Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Supplier> => {
    const { data, error } = await supabase
      .from('Supplier')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);

    return data;
  },

  delete: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('Supplier')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
  }
};

// Transaction Service
export const transactionService = {
  getAll: async (): Promise<Transaction[]> => {
    const { data, error } = await supabase
      .from('Transaction')
      .select(`
        id,
        date,
        totalAmount,
        note,
        createdAt,
        updatedAt,
        items:TransactionItem (
          id,
          productId,
          quantity,
          price,
          subtotal,
          Product (
            id,
            name,
            unit,
            price,
            cost
          )
        )
      `)
      .order('date', { ascending: false });

    if (error) throw new Error(error.message);

    return data.map(item => ({
      id: item.id,
      date: item.date,
      totalAmount: item.totalAmount,
      note: item.note,
      items: item.items.map(i => ({
        id: i.id,
        transactionId: i.transactionId,
        productId: i.productId,
        product: i.Product ? {
          id: i.Product.id,
          name: i.Product.name,
          unit: i.Product.unit,
          price: i.Product.price,
          cost: i.Product.cost,
          stock: { currentStock: 0, safetyStock: 0 }, // Placeholder
          bestN: 4, // Placeholder
          data: [], // Placeholder
          createdAt: '', // Placeholder
          updatedAt: '', // Placeholder
        } : undefined,
        quantity: i.quantity,
        price: i.price,
        subtotal: i.subtotal
      })),
      createdAt: item.createdAt,
      updatedAt: item.updatedAt
    }));
  },

  getById: async (id: string): Promise<Transaction | null> => {
    const { data, error } = await supabase
      .from('Transaction')
      .select(`
        id,
        date,
        totalAmount,
        note,
        createdAt,
        updatedAt,
        items:TransactionItem (
          id,
          productId,
          quantity,
          price,
          subtotal,
          Product (
            id,
            name,
            unit,
            price,
            cost
          )
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Row not found
      throw new Error(error.message);
    }

    return {
      id: data.id,
      date: data.date,
      totalAmount: data.totalAmount,
      note: data.note,
      items: data.items.map(i => ({
        id: i.id,
        transactionId: i.transactionId,
        productId: i.productId,
        product: i.Product ? {
          id: i.Product.id,
          name: i.Product.name,
          unit: i.Product.unit,
          price: i.Product.price,
          cost: i.Product.cost,
          stock: { currentStock: 0, safetyStock: 0 }, // Placeholder
          bestN: 4, // Placeholder
          data: [], // Placeholder
          createdAt: '', // Placeholder
          updatedAt: '', // Placeholder
        } : undefined,
        quantity: i.quantity,
        price: i.price,
        subtotal: i.subtotal
      })),
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    };
  },

  create: async (transaction: Omit<Transaction, 'id' | 'date' | 'createdAt' | 'updatedAt'>): Promise<Transaction> => {
    // Generate ID manually
    const id = 'trx_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
    
    const now = new Date().toISOString();
    
    // First, insert the transaction (without paymentMethod)
    const { data: transactionData, error: transactionError } = await supabase
      .from('Transaction')
      .insert([{
        id,
        totalAmount: transaction.totalAmount,
        note: transaction.note || null,
        createdAt: now,
        updatedAt: now
      }])
      .select()
      .single();

    if (transactionError) throw new Error(transactionError.message);


    // Then, insert the transaction items with generated IDs
    const itemsToInsert = transaction.items.map((item, index) => ({
      id: `ti_${Date.now().toString(36)}${index}_${Math.random().toString(36).substring(2, 7)}`,
      transactionId: transactionData.id,
      productId: item.productId,
      quantity: item.quantity,
      price: item.price,
      subtotal: item.subtotal
    }));

    const { error: itemsError } = await supabase
      .from('TransactionItem')
      .insert(itemsToInsert);

    if (itemsError) throw new Error(itemsError.message);

    // Return the created transaction
    return await transactionService.getById(transactionData.id);
  },

  update: async (id: string, updates: Partial<Omit<Transaction, 'id' | 'date' | 'createdAt' | 'updatedAt'>>): Promise<Transaction> => {
    const { data, error } = await supabase
      .from('Transaction')
      .update({
        totalAmount: updates.totalAmount,
        note: updates.note,
        updatedAt: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);

    return {
      id: data.id,
      date: data.date,
      totalAmount: data.totalAmount,
      note: data.note,
      items: [], // Would need to fetch separately
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    };
  },

  delete: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('Transaction')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
  }
};