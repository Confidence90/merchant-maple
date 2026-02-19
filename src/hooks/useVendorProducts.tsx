// src/hooks/useVendorProducts.ts
import { useState, useEffect } from 'react';
import { vendorApi, VendorProduct } from '@/services/vendorApi';
import { listingsApi } from '@/services/listingsApi';

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
  const deeleteProduct = async (productId: number) => {
    await listingsApi.deleteListing(productId);
    setProducts(prev => prev.filter(p => p.id !== productId));
  };

  /*const updateProduct = async (id: number, data: Partial<VendorProduct>) => {
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
  };*/
  const updateProduct = async (productId: number, data: any) => {
    const updated = await listingsApi.updateListing(productId, data);
    setProducts(prev => prev.map(p => p.id === productId ? updated.listing : p));
    return updated;
  };
   const toggleProductStatus = async (productId: number, status: 'active' | 'expired') => {
    const updated = await listingsApi.toggleStatus(productId, status);
    setProducts(prev => prev.map(p => p.id === productId ? updated.listing : p));
    return updated;
  };

  const bulkDeleteProducts = async (ids: number[]) => {
    const result = await listingsApi.bulkDelete(ids);
    setProducts(prev => prev.filter(p => !ids.includes(p.id)));
    return result;
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
    deeleteProduct,
    toggleProductStatus,
    bulkDeleteProducts,
    updateProduct,
  };
}