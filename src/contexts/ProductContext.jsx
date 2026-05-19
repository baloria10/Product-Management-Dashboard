import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const ProductContext = createContext();

export const useProducts = () => useContext(ProductContext);

export const ProductProvider = ({ children }) => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // Initialize products
  useEffect(() => {
    if (!user) return;

    const fetchInitialData = async () => {
      try {
        setLoading(true);
        // Load from local storage
        const storedProducts = localStorage.getItem('pmd_products');
        
        if (storedProducts && JSON.parse(storedProducts).length > 0) {
          setProducts(JSON.parse(storedProducts));
        } else {
          // Fetch from DummyJSON initially
          const response = await axios.get('https://dummyjson.com/products?limit=100');
          const data = response.data.products.map(p => ({
            ...p,
            isActive: p.stock > 0 // derive status
          }));
          setProducts(data);
          localStorage.setItem('pmd_products', JSON.stringify(data));
        }

        // Fetch categories
        const catRes = await axios.get('https://dummyjson.com/products/categories');
        setCategories(catRes.data.map(c => typeof c === 'string' ? c : c.slug));
        
      } catch (error) {
        console.error("Failed to fetch initial data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [user]);

  // Sync state when localStorage changes in another tab
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'pmd_products' && e.newValue) {
        setProducts(JSON.parse(e.newValue));
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const addProduct = async (newProduct) => {
    try {
      // Call dummy api
      const response = await axios.post('https://dummyjson.com/products/add', newProduct);
      const addedProduct = {
        ...response.data,
        ...newProduct,
        id: Date.now(), // unique local id
        isActive: newProduct.isActive !== undefined ? newProduct.isActive : true,
        images: newProduct.image ? [newProduct.image] : [],
        thumbnail: newProduct.image || ''
      };
      
      setProducts(prevProducts => {
        const updatedProducts = [addedProduct, ...prevProducts];
        localStorage.setItem('pmd_products', JSON.stringify(updatedProducts));
        return updatedProducts;
      });
      return { success: true };
    } catch (error) {
      console.error(error);
      return { success: false, message: 'Failed to add product' };
    }
  };

  const editProduct = async (id, updatedData) => {
    try {
      try {
         await axios.put(`https://dummyjson.com/products/${id}`, updatedData);
      } catch (e) {
         console.warn("DummyJSON API edit failed, continuing locally.");
      }

      setProducts(prevProducts => {
        const updatedProducts = prevProducts.map(p => {
           if (String(p.id) === String(id)) {
              return { 
                 ...p, 
                 ...updatedData, 
                 images: updatedData.image ? [updatedData.image] : p.images,
                 thumbnail: updatedData.image || p.thumbnail
              };
           }
           return p;
        });
        localStorage.setItem('pmd_products', JSON.stringify(updatedProducts));
        return updatedProducts;
      });
      return { success: true };
    } catch (error) {
       console.error(error);
       return { success: false, message: 'Failed to edit product' };
    }
  };

  const deleteProduct = async (id) => {
    try {
       try {
         await axios.delete(`https://dummyjson.com/products/${id}`);
       } catch (e) {
         console.warn("DummyJSON API delete failed, continuing locally.");
       }

      setProducts(prevProducts => {
        const updatedProducts = prevProducts.filter(p => String(p.id) !== String(id));
        localStorage.setItem('pmd_products', JSON.stringify(updatedProducts));
        return updatedProducts;
      });
      return { success: true };
    } catch (error) {
      console.error(error);
      return { success: false, message: 'Failed to delete product' };
    }
  };

  return (
    <ProductContext.Provider value={{ 
      products, 
      categories, 
      loading, 
      addProduct, 
      editProduct, 
      deleteProduct 
    }}>
      {children}
    </ProductContext.Provider>
  );
};
