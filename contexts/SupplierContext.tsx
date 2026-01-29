import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Supplier } from '../types';
import { supplierService } from '../services/supabase';

interface SupplierContextType {
  suppliers: Supplier[];
  loading: boolean;
  addSupplier: (supplier: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateSupplier: (id: string, supplier: Partial<Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>>) => Promise<void>;
  deleteSupplier: (id: string) => Promise<void>;
}

const SupplierContext = createContext<SupplierContextType | undefined>(undefined);

export const SupplierProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSuppliers = async () => {
    try {
      const fetchedSuppliers = await supplierService.getAll();
      setSuppliers(fetchedSuppliers);
    } catch (error) {
      console.error('Error loading suppliers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const addSupplier = async (supplierData: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newSupplier = await supplierService.create(supplierData);
      setSuppliers(prev => [...prev, newSupplier]);
    } catch (error) {
      console.error('Error adding supplier:', error);
      throw error;
    }
  };

  const updateSupplier = async (id: string, supplierData: Partial<Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>>) => {
    try {
      const updatedSupplier = await supplierService.update(id, supplierData);
      setSuppliers(prev =>
        prev.map(supplier =>
          supplier.id === id
            ? updatedSupplier
            : supplier
        )
      );
    } catch (error) {
      console.error('Error updating supplier:', error);
      throw error;
    }
  };

  const deleteSupplier = async (id: string) => {
    try {
      await supplierService.delete(id);
      setSuppliers(prev => prev.filter(supplier => supplier.id !== id));
    } catch (error) {
      console.error('Error deleting supplier:', error);
      throw error;
    }
  };

  return (
    <SupplierContext.Provider value={{
      suppliers,
      loading,
      addSupplier,
      updateSupplier,
      deleteSupplier
    }}>
      {children}
    </SupplierContext.Provider>
  );
};

export const useSuppliers = () => {
  const context = useContext(SupplierContext);
  if (context === undefined) {
    throw new Error('useSuppliers must be used within a SupplierProvider');
  }
  return context;
};