import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ProductData, MonthlyData } from '../types';
import { productsApi } from '../services/api';
import { useAuth } from './AuthContext';

interface ProductContextType {
  products: ProductData[];
  loading: boolean;
  error: string | null;
  refreshProducts: () => Promise<void>;
  updateProductStock: (id: string, current: number, safety: number) => Promise<void>;
  addProduct: (name: string, unit: string, currentStock: number, safetyStock: number) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  updateHistoricalData: (productId: string, historyId: string, updates: { demand?: number, day?: number }) => Promise<void>;
  initializeHistory: (productId: string) => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  const refreshProducts = async () => {
    if (!isAuthenticated) {
      setProducts([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await productsApi.getAll();
      setProducts(data);
    } catch (err) {
      setError('Gagal mengambil data produk');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshProducts();
  }, [isAuthenticated]);

  const updateProductStock = async (id: string, current: number, safety: number) => {
    try {
      await productsApi.updateStock(id, current, safety);
      setProducts(prev => prev.map(p => 
        p.id === id ? { ...p, stock: { currentStock: current, safetyStock: safety } } : p
      ));
    } catch (err) {
      console.error('Error updating stock:', err);
      throw err;
    }
  };

  const addProduct = async (name: string, unit: string, currentStock: number, safetyStock: number) => {
    try {
      const newProduct = await productsApi.create({ name, unit, currentStock, safetyStock });
      setProducts(prev => [...prev, newProduct]);
    } catch (err) {
      console.error('Error adding product:', err);
      throw err;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await productsApi.delete(id);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error('Error deleting product:', err);
      throw err;
    }
  };


  const updateHistoricalData = async (productId: string, historyId: string, updates: { demand?: number, day?: number }) => {
    try {
      await productsApi.updateHistoricalData(productId, historyId, updates);
      setProducts(prev => prev.map(p => {
        if (p.id !== productId) return p;
        return {
          ...p,
          data: p.data.map(d => d.id === historyId ? { ...d, ...updates } : d)
        };
      }));
    } catch (err: any) {
      console.error(err);
      alert(err.message);
    }
  };

  const initializeHistory = async (productId: string) => {
    try {
      setLoading(true);
      await productsApi.initializeHistory(productId);
      await refreshProducts(); // Refresh to get the new data
    } catch (err: any) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProductContext.Provider value={{ 
      products, 
      loading, 
      error, 
      refreshProducts, 
      updateProductStock, 
      addProduct, 
      deleteProduct,
      updateHistoricalData,
      initializeHistory
    }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};
