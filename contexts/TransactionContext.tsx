import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Transaction } from "../types";
import { transactionService } from "../services/supabase";

interface TransactionContextType {
  transactions: Transaction[];
  loading: boolean;
  addTransaction: (
    transaction: Omit<Transaction, "id" | "date" | "createdAt" | "updatedAt">,
  ) => Promise<void>;
  updateTransaction: (
    id: string,
    transaction: Partial<
      Omit<Transaction, "id" | "date" | "createdAt" | "updatedAt">
    >,
  ) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
}

const TransactionContext = createContext<TransactionContextType | undefined>(
  undefined,
);

export const TransactionProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    try {
      const fetchedTransactions = await transactionService.getAll();
      setTransactions(fetchedTransactions);
    } catch (error) {
      console.error("Error loading transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const addTransaction = async (
    transactionData: Omit<
      Transaction,
      "id" | "date" | "createdAt" | "updatedAt"
    >,
  ) => {
    try {
      const newTransaction = await transactionService.create(transactionData);
      setTransactions((prev) => [newTransaction, ...prev]); // Add to the beginning for newest first
    } catch (error) {
      console.error("Error adding transaction:", error);
      throw error;
    }
  };

  const updateTransaction = async (
    id: string,
    transactionData: Partial<
      Omit<Transaction, "id" | "date" | "createdAt" | "updatedAt">
    >,
  ) => {
    try {
      const updatedTransaction = await transactionService.update(
        id,
        transactionData,
      );
      setTransactions((prev) =>
        prev.map((transaction) =>
          transaction.id === id ? updatedTransaction : transaction,
        ),
      );
    } catch (error) {
      console.error("Error updating transaction:", error);
      throw error;
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      await transactionService.delete(id);
      setTransactions((prev) =>
        prev.filter((transaction) => transaction.id !== id),
      );
    } catch (error) {
      console.error("Error deleting transaction:", error);
      throw error;
    }
  };

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        loading,
        addTransaction,
        updateTransaction,
        deleteTransaction,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error(
      "useTransactions must be used within a TransactionProvider",
    );
  }
  return context;
};
