import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ProductData, MonthlyData } from '../types';
import { useAuth } from './AuthContext';
import { productService } from '../services/supabase';

interface ProductContextType {
  products: ProductData[];
  loading: boolean;
  error: string | null;
  refreshProducts: () => Promise<void>;
  updateProduct: (id: string, updates: Partial<Omit<ProductData, 'id' | 'data' | 'createdAt' | 'updatedAt'>>) => Promise<void>;
  addProduct: (product: Omit<ProductData, 'id' | 'data' | 'createdAt' | 'updatedAt'>) => Promise<void>;
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

      const fetchedProducts = await productService.getAll();
      setProducts(fetchedProducts);
    } catch (err) {
      setError('Gagal mengambil data produk');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      refreshProducts();
    } else {
      setProducts([]);
    }
  }, [isAuthenticated]);

  const updateProduct = async (id: string, updates: Partial<Omit<ProductData, 'id' | 'data' | 'createdAt' | 'updatedAt'>>) => {
    try {
      const updatedProduct = await productService.update(id, updates);
      setProducts(prev =>
        prev.map(product =>
          product.id === id ? updatedProduct : product
        )
      );
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  };

  const addProduct = async (productData: Omit<ProductData, 'id' | 'data' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newProduct = await productService.create(productData);
      setProducts(prev => [...prev, newProduct]);
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await productService.delete(id);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  };

  const updateHistoricalData = async (productId: string, historyId: string, updates: { demand?: number, day?: number }) => {
    // This would typically be handled by a separate historical data service
    // For now, we'll just refresh the products
    await refreshProducts();
  };

  const initializeHistory = async (productId: string) => {
    // This would typically be handled by a separate historical data service
    // For now, we'll just refresh the products
    await refreshProducts();
  };

  return (
    <ProductContext.Provider value={{
      products,
      loading,
      error,
      refreshProducts,
      updateProduct,
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
