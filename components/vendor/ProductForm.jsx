"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { useGetCategories } from '@/hooks/useCategory';
import { useGetAttributes } from '@/hooks/useAttribute';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/ui/Button';
import { Upload, X, Plus, Trash2, ArrowLeft } from 'lucide-react';
import { toast } from '@/components/ui/Toast';
import clsx from 'clsx';
import VariantForm from './VariantForm';
import { useGetVariants, useDeleteVariant } from '@/hooks/useVariant';

const ProductForm = ({ initialData = null, onSubmit, onCancel, isSubmitting }) => {
  const { user } = useAuth();
  const { data: categoryData } = useGetCategories();
  const { data: attributeData } = useGetAttributes();

  const [editingVariant, setEditingVariant] = useState(null);
  const [isVariantFormOpen, setIsVariantFormOpen] = useState(false);
  const productId = initialData?._id || initialData?.id;
  const { data: variantsData, isLoading: isLoadingVariants } = useGetVariants(productId);
  const deleteVariantMutation = useDeleteVariant(productId);

  const variants = variantsData?.data || [];

  const [formData, setFormData] = useState({
    product_name: '',
    product_url: '',
    sort_description: '',
    description: '',
    mrp_price: '',
    selling_price: '',
    stock: '',
    weight: '',
    weight_type: 'ml',
    // status: 'Active',
    skucode: '',
    meta_title: '',
    meta_keywords: '',
    meta_description: '',
  });

  const [selectedCategories, setSelectedCategories] = useState({
    l1: '',
    l2: '',
    l3: ''
  });

  const [productAttributes, setProductAttributes] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        product_name: initialData.product_name || initialData.name || '',
        product_url: initialData.product_url || initialData.url || '',
        sort_description: initialData.sort_description || '',
        description: initialData.description || '',
        mrp_price: initialData.mrp_price || '',
        selling_price: initialData.selling_price || initialData.price || '',
        stock: initialData.stock || initialData.stockQuantity || '',
        weight: initialData.weight || '',
        weight_type: initialData.weight_type || 'ml',
        status: initialData.status || (initialData.isActive ? 'Active' : 'Inactive'),
        skucode: initialData.skucode || '',
        meta_title: initialData.meta_title || '',
        meta_keywords: initialData.meta_keywords || '',
        meta_description: initialData.meta_description || '',
      });

      const catId = initialData.categoryId?._id || initialData.categoryId || '';
      const subCatId = initialData.subcategoryId?._id || initialData.subcategoryId || '';
      const subSubCatId = initialData.subsubcategoryId?._id || initialData.subsubcategoryId || '';

      if (initialData.parent_category && initialData.parent_category.length >= 3) {
        setSelectedCategories({
          l1: initialData.parent_category[0]?._id || initialData.parent_category[0],
          l2: initialData.parent_category[1]?._id || initialData.parent_category[1],
          l3: initialData.parent_category[2]?._id || initialData.parent_category[2]
        });
      } else if (subSubCatId) {
        setSelectedCategories({
          l1: catId,
          l2: subCatId,
          l3: subSubCatId
        });
      }

      if (initialData.dynamicAttributes) {
        setProductAttributes(JSON.parse(JSON.stringify(initialData.dynamicAttributes)));
      }

      if (initialData.product_images && initialData.product_images.length > 0) {
        setExistingImages(initialData.product_images);
        const existingPreviews = initialData.product_images.map(img =>
          img.startsWith('http') ? img : `http://localhost:8000/api/public/uploads/product/${img}`
        );
        setPreviewImages(existingPreviews);
      }
    }
  }, [initialData]);

  const categories = useMemo(() => categoryData?.data || [], [categoryData]);
  const l1Categories = useMemo(() => categories.filter(c => c.level === 1), [categories]);
  const l2Categories = useMemo(() => categories.filter(c => c.level === 2 && c.parentId === selectedCategories.l1), [categories, selectedCategories.l1]);
  const l3Categories = useMemo(() => categories.filter(c => c.level === 3 && c.parentId === selectedCategories.l2), [categories, selectedCategories.l2]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'product_name' && !formData.product_url && !initialData) {
      setFormData(prev => ({
        ...prev,
        product_url: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      }));
    }
  };

  const handleCategoryChange = (level, value) => {
    setSelectedCategories(prev => {
      const next = { ...prev, [level]: value };
      if (level === 'l1') { next.l2 = ''; next.l3 = ''; }
      if (level === 'l2') { next.l3 = ''; }
      return next;
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setNewImages(prev => [...prev, ...files]);
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setPreviewImages(prev => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index) => {
    if (index < existingImages.length) {
      setExistingImages(prev => prev.filter((_, i) => i !== index));
    } else {
      const newIdx = index - existingImages.length;
      setNewImages(prev => prev.filter((_, i) => i !== newIdx));
    }
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleEditVariant = (variant, e) => {
    if (e) e.preventDefault();
    setEditingVariant(variant);
    setIsVariantFormOpen(true);
  };

  const handleAddVariant = (e) => {
    if (e) e.preventDefault();
    setEditingVariant(null);
    setIsVariantFormOpen(true);
  };

  const handleDeleteVariant = async (id, e) => {
    if (e) e.preventDefault();
    if (confirm('Are you sure you want to delete this variant?')) {
      try {
        await deleteVariantMutation.mutateAsync(id);
        toast.success('Variant deleted successfully');
      } catch (err) {
        toast.error('Failed to delete variant');
      }
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.product_name) newErrors.product_name = "Product name is required";
    if (!formData.product_url) newErrors.product_url = "Product URL is required";
    if (!formData.skucode) newErrors.skucode = "SKU Code is required";
    if (!formData.sort_description) newErrors.sort_description = "Short description is required";
    if (!formData.description) newErrors.description = "Description is required";

    if (!selectedCategories.l3 && !initialData) newErrors.category = "Category selection is required";
    if (existingImages.length === 0 && newImages.length === 0 && !initialData) newErrors.images = "At least one image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fill required fields");
      return;
    }

    const submissionData = new FormData();
    Object.keys(formData).forEach(key => {
      submissionData.append(key, formData[key]);
    });

    if (selectedCategories.l3) {
      submissionData.append('subsubcategoryId', selectedCategories.l3);
      const parentCategoryArray = [selectedCategories.l1, selectedCategories.l2, selectedCategories.l3].filter(Boolean);
      submissionData.append('parent_category', JSON.stringify(parentCategoryArray));
    }

    if (productAttributes.length > 0) {
      submissionData.append('dynamicAttributes', JSON.stringify(productAttributes));
    }

    if (user?._id) submissionData.append('user_id', user._id);

    if (initialData) {
      submissionData.append('existingImages', JSON.stringify(existingImages));
    }
    newImages.forEach(image => {
      submissionData.append('product_images', image);
    });

    onSubmit(submissionData);
  };

  return (
    <>
      {isVariantFormOpen ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-4">
            <Button variant="outline" onClick={() => setIsVariantFormOpen(false)} className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Back to Product
            </Button>
          </div>
          <VariantForm
            productId={productId}
            editingVariant={editingVariant}
            onComplete={() => setIsVariantFormOpen(false)}
            onCancel={() => setIsVariantFormOpen(false)}
          />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8 pb-20">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-6 border-b pb-2">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-1">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Product Name *</label>
                <input name="product_name" value={formData.product_name} onChange={handleChange} className={clsx("w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-[#e09a74]", errors.product_name ? "border-red-500" : "border-gray-200")} />
              </div>
              <div className="col-span-1">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Product URL *</label>
                <input name="product_url" value={formData.product_url} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none bg-gray-50" />
              </div>
              <div className="col-span-1">
                <label className="block text-sm font-semibold text-gray-700 mb-2">SKU Code *</label>
                <input name="skucode" value={formData.skucode} onChange={handleChange} className={clsx("w-full px-4 py-2 border rounded-lg outline-none", errors.skucode ? "border-red-500" : "border-gray-200")} />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Short Description *</label>
                <textarea name="sort_description" value={formData.sort_description} onChange={handleChange} rows={2} className={clsx("w-full px-4 py-2 border rounded-lg outline-none", errors.sort_description ? "border-red-500" : "border-gray-200")} />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description *</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows={6} className={clsx("w-full px-4 py-2 border rounded-lg outline-none", errors.description ? "border-red-500" : "border-gray-200")} />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-6 border-b pb-2">Organization</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <select value={selectedCategories.l1} onChange={(e) => handleCategoryChange('l1', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none">
                <option value="">Select Category</option>
                {l1Categories.map(c => <option key={c._id || c.id} value={c._id || c.id}>{c.name}</option>)}
              </select>
              <select value={selectedCategories.l2} onChange={(e) => handleCategoryChange('l2', e.target.value)} disabled={!selectedCategories.l1} className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none disabled:bg-gray-50">
                <option value="">Select Sub-Category</option>
                {l2Categories.map(c => <option key={c._id || c.id} value={c._id || c.id}>{c.name}</option>)}
              </select>
              <select value={selectedCategories.l3} onChange={(e) => handleCategoryChange('l3', e.target.value)} disabled={!selectedCategories.l2} className={clsx("w-full px-4 py-2 border rounded-lg outline-none disabled:bg-gray-50", errors.category ? "border-red-500" : "border-gray-200")}>
                <option value="">Select Sub-Sub-Category</option>
                {l3Categories.map(c => <option key={c._id || c.id} value={c._id || c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-6 border-b pb-2">Images</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <label className="aspect-square border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
                <Upload className="w-6 h-6 text-gray-400 mb-2" />
                <span className="text-xs text-gray-500">Add Images</span>
                <input type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
              {previewImages.map((src, idx) => (
                <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 group">
                  <img src={src} alt="Preview" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeImage(idx)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {initialData && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6 border-b pb-2">
                <h3 className="text-lg font-bold text-gray-900 border-none">Product Variants</h3>
                <Button type="button" onClick={handleAddVariant} className="bg-[#e09a74] text-white hover:bg-[#d08963] text-sm py-1.5 px-4 rounded-lg flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Add Variant
                </Button>
              </div>

              {isLoadingVariants ? (
                <div className="py-8 text-center text-gray-500">Loading variants...</div>
              ) : variants.length === 0 ? (
                <div className="py-8 text-center text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200 italic">
                  No variants added yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase">Variant</th>
                        <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase">Attributes</th>
                        <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase">Price</th>
                        <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase">Stock</th>
                        <th className="px-4 py-3 text-right text-[10px] font-bold text-gray-400 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {variants.map(v => (
                        <tr key={v._id || v.id} className="hover:bg-gray-50">
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded bg-gray-100 overflow-hidden shrink-0">
                                {v.variant_images && v.variant_images[0] && (
                                  <img
                                    src={v.variant_images[0].startsWith('http') ? v.variant_images[0] : `http://localhost:8000/api/public/uploads/variant/${v.variant_images[0]}`}
                                    className="w-full h-full object-cover"
                                    alt=""
                                  />
                                )}
                                {!v.variant_images?.[0] && v.product_image1 && (
                                  <img
                                    src={v.product_image1.startsWith('http') ? v.product_image1 : `http://localhost:8000/api/public/uploads/variant/${v.product_image1}`}
                                    className="w-full h-full object-cover"
                                    alt=""
                                  />
                                )}
                              </div>
                              <span className="text-sm font-semibold">{v.product_name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex flex-wrap gap-1">
                              {v.size && <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] rounded-full">Size: {v.size}</span>}
                              {v.color && <span className="px-2 py-0.5 bg-purple-50 text-purple-700 text-[10px] rounded-full">Color: {v.color}</span>}
                            </div>
                          </td>
                          <td className="px-4 py-4 text-sm font-bold">₹{v.selling_price}</td>
                          <td className="px-4 py-4 text-sm">{v.stock} units</td>
                          <td className="px-4 py-4 text-right">
                            <div className="flex justify-end gap-3">
                              <button type="button" onClick={(e) => handleEditVariant(v, e)} className="text-[#e09a74] hover:text-[#d08963] text-xs font-bold uppercase">Edit</button>
                              <button type="button" onClick={(e) => handleDeleteVariant(v._id || v.id, e)} className="text-red-500 hover:text-red-700 text-xs font-bold uppercase">Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-6 border-b pb-2">SEO Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Meta Title</label>
                <input name="meta_title" value={formData.meta_title} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Meta Description</label>
                <textarea name="meta_description" value={formData.meta_description} onChange={handleChange} rows={3} className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none" />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6">
            <Button variant="outline" type="button" onClick={() => onCancel ? onCancel() : window.history.back()}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting} className="bg-[#e09a74] text-white hover:bg-[#d08963] min-w-[120px]">
              {isSubmitting ? 'Saving...' : initialData ? 'Save Changes' : 'Create Product'}
            </Button>
          </div>
        </form>
      )}
    </>
  );
};

export default ProductForm;
