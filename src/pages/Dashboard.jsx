import React, { useState, useMemo } from 'react';
import { useProducts } from '../contexts/ProductContext';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';
import ProductCard from '../components/ProductCard';
import Modal from '../components/Modal';
import CustomSelect from '../components/CustomSelect';
import { Search, Plus, ChevronLeft, ChevronRight, Tag, Activity, ArrowUpDown } from 'lucide-react';

const Dashboard = () => {
  const { products, categories, loading, addProduct, editProduct, deleteProduct } = useProducts();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  // Local state for UI
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [sortBy, setSortBy] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Modal states
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [currentProduct, setCurrentProduct] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '', description: '', price: '', category: '', stock: '', isActive: true, image: ''
  });
  const [formLoading, setFormLoading] = useState(false);

  // Derived available categories based on existing products
  const availableCategories = useMemo(() => {
    const cats = new Set();
    products.forEach(p => {
      if (p.category) cats.add(p.category);
    });
    return Array.from(cats).sort();
  }, [products]);

  // Derived filtered & sorted products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (searchTerm) {
      result = result.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    if (selectedCategory) {
      result = result.filter(p => p.category === selectedCategory);
    }

    if (selectedStatus !== '') {
      const isActiveFilter = selectedStatus === 'active';
      result = result.filter(p => p.isActive === isActiveFilter);
    }

    if (sortBy) {
      if (sortBy === 'price-asc') result.sort((a, b) => a.price - b.price);
      if (sortBy === 'price-desc') result.sort((a, b) => b.price - a.price);
      if (sortBy === 'name-asc') result.sort((a, b) => a.title.localeCompare(b.title));
      if (sortBy === 'name-desc') result.sort((a, b) => b.title.localeCompare(a.title));
    }

    return result;
  }, [products, searchTerm, selectedCategory, selectedStatus, sortBy]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handlers
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleEditClick = (product) => {
    setCurrentProduct(product);
    setFormData({
      title: product.title,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock,
      isActive: product.isActive,
      image: (product.images && product.images[0]) || product.thumbnail || ''
    });
    setIsEditOpen(true);
  };

  const handleDeleteClick = (product) => {
    setCurrentProduct(product);
    setIsDeleteOpen(true);
  };

  const handleFormSubmit = async (e, type) => {
    e.preventDefault();
    setFormLoading(true);

    if (type === 'add') {
      await addProduct(formData);
      setIsAddOpen(false);
    } else if (type === 'edit') {
      await editProduct(currentProduct.id, formData);
      setIsEditOpen(false);
    }

    setFormLoading(false);
    setFormData({ title: '', description: '', price: '', category: '', stock: '', isActive: true, image: '' });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const confirmDelete = async () => {
    setFormLoading(true);
    await deleteProduct(currentProduct.id);
    setFormLoading(false);
    setIsDeleteOpen(false);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Products</h2>
          <p className="text-sm text-gray-500">Manage your product inventory</p>
        </div>
        {isAdmin && (
          <button
            onClick={() => {
              setFormData({ title: '', description: '', price: '', category: '', stock: '', isActive: true, image: '' });
              setIsAddOpen(true);
            }}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Product
          </button>
        )}
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 flex flex-col xl:flex-row gap-4 justify-between items-start xl:items-center">
        {/* Search */}
        <div className="relative w-full xl:w-96 shrink-0">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all shadow-sm min-h-[42px]"
          />
        </div>

        {/* Filters Group */}
        <div className="flex flex-wrap gap-3 sm:gap-4 w-full xl:w-auto xl:justify-end">
          <CustomSelect
            className="w-full sm:w-[180px] shrink-0"
            icon={Tag}
            value={selectedCategory}
            onChange={(val) => { setSelectedCategory(val); setCurrentPage(1); }}
            placeholder="All Categories"
            options={[
              { label: 'All Categories', value: '' },
              ...availableCategories.map(c => ({ label: c, value: c }))
            ]}
          />

          <CustomSelect
            className="w-full sm:w-[150px] shrink-0"
            icon={Activity}
            value={selectedStatus}
            onChange={(val) => { setSelectedStatus(val); setCurrentPage(1); }}
            placeholder="All Status"
            options={[
              { label: 'All Status', value: '' },
              { label: 'Active', value: 'active' },
              { label: 'Inactive', value: 'inactive' }
            ]}
          />

          <CustomSelect
            className="w-full sm:w-[180px] shrink-0"
            icon={ArrowUpDown}
            value={sortBy}
            onChange={(val) => setSortBy(val)}
            placeholder="Sort By"
            options={[
              { label: 'Sort By', value: '' },
              { label: 'Price: Low to High', value: 'price-asc' },
              { label: 'Price: High to Low', value: 'price-desc' },
              { label: 'Name: A-Z', value: 'name-asc' },
              { label: 'Name: Z-A', value: 'name-desc' }
            ]}
          />
        </div>
      </div>

      {/* Grid */}
      {paginatedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {paginatedProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="text-gray-400 mb-2">No products found matching your criteria.</div>
          <button
            onClick={() => { setSearchTerm(''); setSelectedCategory(''); setSelectedStatus(''); }}
            className="text-indigo-600 hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <span className="text-sm text-gray-600 hidden sm:inline">
            Showing <span className="font-semibold text-gray-900">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-semibold text-gray-900">{Math.min(currentPage * itemsPerPage, filteredProducts.length)}</span> of <span className="font-semibold text-gray-900">{filteredProducts.length}</span> entries
          </span>
          <div className="flex gap-2 w-full sm:w-auto justify-between sm:justify-end">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex items-center px-4 font-medium text-gray-700">
              {currentPage} / {totalPages}
            </div>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 hover:bg-gray-50 transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isAddOpen || isEditOpen}
        onClose={() => { setIsAddOpen(false); setIsEditOpen(false); }}
        title={isAddOpen ? "Add New Product" : "Edit Product"}
      >
        <form onSubmit={(e) => handleFormSubmit(e, isAddOpen ? 'add' : 'edit')} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title <span className="text-red-500">*</span></label>
            <input required type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description <span className="text-red-500">*</span></label>
            <textarea required value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 outline-none" rows="3"></textarea>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price ($) <span className="text-red-500">*</span></label>
              <input required type="number" step="0.01" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value === '' ? '' : parseFloat(e.target.value) })} className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock <span className="text-red-500">*</span></label>
              <input required type="number" value={formData.stock} onChange={e => setFormData({ ...formData, stock: e.target.value === '' ? '' : parseInt(e.target.value) })} className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {isEditOpen ? 'Edit Product Image' : 'Product Image'}
            </label>
            <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 outline-none bg-white text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
            {formData.image && (
              <div className="mt-2 h-20 w-20 relative rounded-md overflow-hidden border border-gray-200">
                <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="relative z-20">
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <CustomSelect
                value={formData.category}
                onChange={val => setFormData({ ...formData, category: val })}
                placeholder="Select Category"
                options={[
                  { label: 'Select Category', value: '' },
                  ...categories.map(c => ({ label: c, value: c }))
                ]}
              />
            </div>
            <div className="relative z-10">
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <CustomSelect
                value={formData.isActive ? 'active' : 'inactive'}
                onChange={val => setFormData({ ...formData, isActive: val === 'active' })}
                placeholder="Select Status"
                options={[
                  { label: 'Active', value: 'active' },
                  { label: 'Inactive', value: 'inactive' }
                ]}
              />
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={() => { setIsAddOpen(false); setIsEditOpen(false); }} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={formLoading} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50">
              {formLoading ? 'Saving...' : 'Save Product'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} title="Confirm Deletion">
        <div className="text-gray-700">
          <p>Are you sure you want to delete <strong>{currentProduct?.title}</strong>?</p>
          <p className="text-sm text-red-500 mt-2">This action cannot be undone.</p>
        </div>
        <div className="pt-6 flex justify-end gap-3">
          <button onClick={() => setIsDeleteOpen(false)} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">Cancel</button>
          <button onClick={confirmDelete} disabled={formLoading} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50">
            {formLoading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </Modal>

    </Layout>
  );
};

export default Dashboard;
