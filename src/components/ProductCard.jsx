import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const ProductCard = ({ product, onEdit, onDelete }) => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full">
      <div className="h-56 bg-gray-50/50 relative p-4 flex items-center justify-center border-b border-gray-50 overflow-hidden">
        {product.images && product.images.length > 0 ? (
          <img src={product.images[0]} alt={product.title} className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-sm" />
        ) : product.thumbnail ? (
           <img src={product.thumbnail} alt={product.title} className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-sm" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
        )}
        <div className="absolute top-2 right-2">
          <span className={`px-2 py-1 text-xs font-semibold rounded-full shadow-sm ${product.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {product.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2 gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-gray-900 line-clamp-2 leading-tight mb-1">{product.title}</h3>
            <p className="text-xs font-medium text-indigo-500 tracking-wide uppercase">{product.category}</p>
          </div>
          <span className="text-xl font-extrabold text-gray-900 shrink-0 tracking-tight">${product.price}</span>
        </div>
        <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">
          {product.description || 'No description available.'}
        </p>
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-500 font-medium">
            Stock: <span className={product.stock > 10 ? 'text-green-600' : 'text-orange-500'}>{product.stock}</span>
          </div>
          
          {isAdmin && (
            <div className="flex gap-2 transition-opacity duration-200">
              <button 
                onClick={() => onEdit(product)}
                className="p-2 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 rounded-full transition-colors bg-gray-50 border border-gray-100"
                title="Edit Product"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button 
                onClick={() => onDelete(product)}
                className="p-2 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-full transition-colors bg-gray-50 border border-gray-100"
                title="Delete Product"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
