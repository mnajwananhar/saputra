import React, { useState, useEffect } from 'react';
import { useProducts } from '../contexts/ProductContext';
import { useTransactions } from '../contexts/TransactionContext';
import { Trash2, Plus, Minus, Search, ShoppingBag } from 'lucide-react';

const POS: React.FC = () => {
  const { products } = useProducts();
  const { addTransaction } = useTransactions();
  const [cart, setCart] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(products);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredProducts(products);
    } else {
      const term = searchTerm.toLowerCase();
      setFilteredProducts(
        products.filter(product => 
          product.name.toLowerCase().includes(term)
        )
      );
    }
  }, [searchTerm, products]);

  const addToCart = (product: any) => {
    const existingItem = cart.find(item => item.productId === product.id);
    
    if (existingItem) {
      setCart(cart.map(item => 
        item.productId === product.id 
          ? { 
              ...item, 
              quantity: item.quantity + 1,
              subtotal: item.price * (item.quantity + 1)
            } 
          : item
      ));
    } else {
      setCart([
        ...cart,
        {
          productId: product.id,
          product: product,
          quantity: 1,
          price: product.price,
          subtotal: product.price
        }
      ]);
    }
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(cart.map(item => 
      item.productId === productId 
        ? { ...item, quantity: newQuantity, subtotal: item.price * newQuantity } 
        : item
    ));
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.productId !== productId));
  };

  const getTotal = () => cart.reduce((total, item) => total + item.subtotal, 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    
    try {
      await addTransaction({
        totalAmount: getTotal(),
        items: cart.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          subtotal: item.subtotal
        }))
      });
      setCart([]);
      setSearchTerm('');
      alert('Transaksi berhasil!');
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Gagal menyimpan transaksi: ' + (error as Error).message);
    }
  };

  return (
    <div className="flex h-[calc(100vh-6rem)] gap-4">
      {/* Kiri: Daftar Produk */}
      <div className="flex-1 flex flex-col bg-white rounded-2xl border border-slate-200 overflow-hidden">
        {/* Search */}
        <div className="p-4 border-b border-slate-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari produk..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border-0 rounded-xl text-sm focus:ring-2 focus:ring-indigo-100 outline-none"
            />
          </div>
        </div>

        {/* Product List */}
        <div className="flex-1 overflow-auto">
          {filteredProducts.map((product) => (
            <div 
              key={product.id} 
              className="flex items-center justify-between px-5 py-4 border-b border-slate-100 hover:bg-slate-50"
            >
              <div className="flex-1">
                <div className="font-medium text-slate-900">{product.name}</div>
                <div className="text-xs text-slate-400">{product.unit}</div>
              </div>
              <div className="font-semibold text-slate-700 mr-4">
                Rp {product.price.toLocaleString('id-ID')}
              </div>
              <button
                onClick={() => addToCart(product)}
                className="w-9 h-9 flex items-center justify-center bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>
          ))}
          
          {filteredProducts.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              Produk tidak ditemukan
            </div>
          )}
        </div>
      </div>

      {/* Kanan: Keranjang */}
      <div className="w-[380px] flex flex-col bg-white rounded-2xl border border-slate-200 overflow-hidden">
        {/* Cart Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-indigo-600" />
            <span className="font-bold text-lg text-slate-900">Keranjang</span>
          </div>
          <span className="text-sm text-slate-400">{cart.length} item</span>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-auto">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-300">
              <ShoppingBag className="h-12 w-12 mb-2" />
              <p className="text-sm">Keranjang kosong</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {cart.map((item) => (
                <div key={item.productId} className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1 min-w-0 pr-2">
                      <div className="font-medium text-sm text-slate-900">{item.product.name}</div>
                      <div className="text-xs text-slate-400">Rp {item.price.toLocaleString('id-ID')}</div>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.productId)}
                      className="text-slate-300 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center bg-slate-100 rounded-lg hover:bg-slate-200"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-10 text-center font-semibold">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center bg-slate-100 rounded-lg hover:bg-slate-200"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <div className="font-bold text-slate-900">
                      Rp {item.subtotal.toLocaleString('id-ID')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Total & Checkout */}
        <div className="p-4 border-t border-slate-200 bg-slate-50">
          <div className="flex justify-between items-center mb-4">
            <span className="text-slate-600">Total</span>
            <span className="text-2xl font-bold text-slate-900">
              Rp {getTotal().toLocaleString('id-ID')}
            </span>
          </div>
          
          <button
            onClick={handleCheckout}
            disabled={cart.length === 0}
            className={`w-full py-4 rounded-xl font-bold transition-all ${
              cart.length === 0 
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            Bayar
          </button>
        </div>
      </div>
    </div>
  );
};

export default POS;