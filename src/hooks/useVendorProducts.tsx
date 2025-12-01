// src/hooks/useVendorProducts.ts
import { useState, useEffect } from 'react';
import { vendorApi, VendorProduct } from '@/services/vendorApi';

export function useVendorProducts() {
  const [products, setProducts] = useState<VendorProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await vendorApi.getVendorProducts();
      setProducts(response.results || []);
    } catch (err) {
      setError('Erreur lors du chargement des produits');
      console.error('Error fetching vendor products:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: number) => {
    try {
      await vendorApi.deleteProduct(id);
      setProducts(prev => prev.filter(product => product.id !== id));
      return true;
    } catch (err) {
      console.error('Error deleting product:', err);
      throw new Error('Erreur lors de la suppression du produit');
    }
  };

  const updateProduct = async (id: number, data: Partial<VendorProduct>) => {
    try {
      const updatedProduct = await vendorApi.updateProduct(id, data);
      setProducts(prev => prev.map(product => 
        product.id === id ? { ...product, ...updatedProduct } : product
      ));
      return updatedProduct;
    } catch (err) {
      console.error('Error updating product:', err);
      throw new Error('Erreur lors de la mise à jour du produit');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    loading,
    error,
    refetch: fetchProducts,
    deleteProduct,
    updateProduct,
  };
}