import React, { useState, useEffect, useMemo } from 'react';
import { useGetCategories } from '@/hooks/useCategory';
import { useGetAttributes } from '@/hooks/useAttribute';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/ui/Button';
import { Upload, X, Plus, Trash2 } from 'lucide-react';
import { toast } from '@/components/ui/Toast';
import clsx from 'clsx';
import AddAttributeModal from './AddAttributeModal';
import AddVariantModal from './AddVariantModal';
import { useGetVariants, useDeleteVariant } from '@/hooks/useVariant';

const ProductForm = ({ initialData = null, onSubmit, onCancel, isSubmitting }) => {
  const { user } = useAuth();
  const { data: categoryData } = useGetCategories(user?._id);
  const { data: attributeData } = useGetAttributes();

  const [isAttributeModalOpen, setIsAttributeModalOpen] = useState(false);
  const [isVariantModalOpen, setIsVariantModalOpen] = useState(false);
  const [editingVariant, setEditingVariant] = useState(null);


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
    status: 'Active',
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

  const [existingImages, setExistingImages] = useState([]); // Array of server filenames
  const [newImages, setNewImages] = useState([]); // Array of File objects
  const [previewImages, setPreviewImages] = useState([]); // Combined previews
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

      if (initialData.parent_category && initialData.parent_category.length >= 3) {
        setSelectedCategories({
          l1: initialData.parent_category[0],
          l2: initialData.parent_category[1],
          l3: initialData.parent_category[2]
        });
      } else if (initialData.categoryId) {
        setSelectedCategories(prev => ({ ...prev, l3: initialData.categoryId }));
      }

      if (initialData.dynamicAttributes) {
        // Use deep copy to avoid mutating the original object reference
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

  const existingAttributes = useMemo(() => attributeData?.data?.data || [], [attributeData]);

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
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
    toast.info("Image removed from selection");

    if (index < existingImages.length) {
      setExistingImages(prev => prev.filter((_, i) => i !== index));
    } else {
      const newIdx = index - existingImages.length;
      setNewImages(prev => prev.filter((_, i) => i !== newIdx));
    }
  };

  const handleAddVariant = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setEditingVariant(null);
    setIsVariantModalOpen(true);
  };

  const handleEditVariant = (variant, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setEditingVariant(variant);
    setIsVariantModalOpen(true);
  };

  const handleDeleteVariant = async (id, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (confirm('Are you sure you want to delete this variant?')) {
      try {
        await deleteVariantMutation.mutateAsync(id);
        toast.success('Variant deleted successfully');
      } catch (err) {
        toast.error('Failed to delete variant');
      }
    }
  };


  const addAttributeRow = () => {
    setProductAttributes(prev => [...prev, { key: '', value: '' }]);
    toast.info("Added new attribute row");
  };

  const removeAttributeRow = (index) => {
    setProductAttributes(prev => prev.filter((_, i) => i !== index));
  };

  const handleAttributeChange = (index, field, value) => {
    setProductAttributes(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleCreateNewAttribute = () => {
    setIsAttributeModalOpen(true);
  };


  const validate = () => {
    const newErrors = {};
    if (!formData.product_name) newErrors.product_name = "Product name is required";
    if (!formData.product_url) newErrors.product_url = "Product URL is required";
    if (!formData.mrp_price) newErrors.mrp_price = "MRP is required";
    if (!formData.selling_price) newErrors.selling_price = "Selling price is required";
    if (!formData.stock) newErrors.stock = "Stock is required";
    if (!formData.sort_description) newErrors.sort_description = "Short description is required";
    if (!formData.description) newErrors.description = "Description is required";

    if (!selectedCategories.l3 && !initialData) newErrors.category = "Level 3 Category selection is required";
    if (existingImages.length === 0 && newImages.length === 0 && !initialData) newErrors.images = "At least one image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      const missingFields = Object.keys(errors).length;
      toast.error(`Please fix ${missingFields} validation errors before submitting`);
      return;
    }

    const submissionData = new FormData();

    Object.keys(formData).forEach(key => {
      submissionData.append(key, formData[key]);
    });

    if (selectedCategories.l3) {
      submissionData.append('categoryId', selectedCategories.l3);
      const parentCategoryArray = [selectedCategories.l1, selectedCategories.l2, selectedCategories.l3].filter(Boolean);
      submissionData.append('parent_category', JSON.stringify(parentCategoryArray));
    }

    const validAttributes = productAttributes.filter(a => a.key && a.value);
    if (validAttributes.length > 0) {
      submissionData.append('dynamicAttributes', JSON.stringify(validAttributes));
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
      <form onSubmit={handleSubmit} className="space-y-8 pb-20">

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6 border-b pb-2">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Product Name *</label>
              <input name="product_name" value={formData.product_name} onChange={handleChange} className={clsx("w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#d9a88a] outline-none", errors.product_name ? "border-red-500" : "border-gray-200")} placeholder="e.g. Modern Sofa" />
              {errors.product_name && <p className="text-red-500 text-xs mt-1">{errors.product_name}</p>}
            </div>
            <div className="col-span-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Product URL (Slug) *</label>
              <input name="product_url" value={formData.product_url} onChange={handleChange} className={clsx("w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#d9a88a] outline-none bg-gray-50", errors.product_url ? "border-red-500" : "border-gray-200")} placeholder="e.g. modern-sofa" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Short Description *</label>
              <textarea name="sort_description" value={formData.sort_description} onChange={handleChange} rows={2} className={clsx("w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#d9a88a] outline-none", errors.sort_description ? "border-red-500" : "border-gray-200")} placeholder="Brief summary..." />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Detailed Description*</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows={6} className={clsx("w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#d9a88a] outline-none font-mono text-sm", errors.description ? "border-red-500" : "border-gray-200")} placeholder="Full details..." />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6 border-b pb-2">Pricing & Inventory</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">MRP Price *</label>
              <input type="number" name="mrp_price" value={formData.mrp_price} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Selling Price *</label>
              <input type="number" name="selling_price" value={formData.selling_price} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Stock Quantity *</label>
              <input type="number" name="stock" value={formData.stock} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">SKU Code</label>
              <input type="text" name="skucode" value={formData.skucode} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Weight</label>
              <div className="flex">
                <input type="number" name="weight" value={formData.weight} onChange={handleChange} className="w-full px-4 py-2 border border-r-0 border-gray-200 rounded-l-lg outline-none" placeholder="0" />
                <select name="weight_type" value={formData.weight_type} onChange={handleChange} className="bg-gray-50 border border-gray-200 rounded-r-lg px-3 py-2 outline-none">
                  <option value="ml">ml</option>
                  <option value="g">g</option>
                  <option value="kg">kg</option>
                  <option value="l">l</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none">
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6 border-b pb-2">Organization</h3>

          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-3">Category Classification *</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <select value={selectedCategories.l1} onChange={(e) => handleCategoryChange('l1', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none">
                <option value="">Select Root</option>
                {l1Categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
              <select value={selectedCategories.l2} onChange={(e) => handleCategoryChange('l2', e.target.value)} disabled={!selectedCategories.l1} className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none disabled:bg-gray-50">
                <option value="">Select Sub</option>
                {l2Categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
              <select value={selectedCategories.l3} onChange={(e) => handleCategoryChange('l3', e.target.value)} disabled={!selectedCategories.l2} className={clsx("w-full px-4 py-2 border rounded-lg outline-none disabled:bg-gray-50", errors.category ? "border-red-500" : "border-gray-200")}>
                <option value="">Select Leaf</option>
                {l3Categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm font-semibold text-gray-700">Custom Attributes</label>
              <button type="button" onClick={addAttributeRow} className="text-[#d9a88a] hover:text-[#c99775] text-sm font-medium flex items-center">
                <Plus className="w-4 h-4 mr-1" /> Add Attribute
              </button>
            </div>

            <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
              {productAttributes.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-2">No custom attributes added.</p>
              )}

              {productAttributes.map((attr, index) => {
                const selectedAttrObj = existingAttributes.find(a => a.attributeName === attr.key);
                const availableValues = selectedAttrObj?.attributeValues || [];

                return (
                  <div key={index} className="flex gap-3 items-start">
                    <div className="flex-1">
                      <select
                        value={attr.key}
                        onChange={(e) => {
                          handleAttributeChange(index, 'key', e.target.value);
                          handleAttributeChange(index, 'value', '');
                        }}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none"
                      >
                        <option value="">Select Attribute</option>
                        {existingAttributes.map((a) => (
                          <option key={a._id} value={a.attributeName}>{a.attributeName}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex-1">
                      <select
                        value={attr.value}
                        onChange={(e) => handleAttributeChange(index, 'value', e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none disabled:bg-gray-50 disabled:text-gray-400"
                        disabled={!attr.key}
                      >
                        <option value="">{attr.key ? "Select Value" : "Select Attribute First"}</option>
                        {availableValues.map((val, vIdx) => (
                          <option key={vIdx} value={val}>{val}</option>
                        ))}
                      </select>
                    </div>
                    <button type="button" onClick={() => removeAttributeRow(index)} className="text-red-500 hover:text-red-700 p-2">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="mt-3 flex justify-end">
              <button type="button" onClick={handleCreateNewAttribute} className="text-xs text-gray-500 hover:text-black hover:underline flex items-center">
                <Plus className="w-3 h-3 mr-1" />
                Create New Attribute Key
              </button>
            </div>

          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6 border-b pb-2">Product Images *</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <label className="aspect-square border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
              <Upload className="w-6 h-6 text-gray-400 mb-2" />
              <span className="text-xs text-gray-500 font-medium">Add Images</span>
              <input type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
            {previewImages.map((src, idx) => (
              <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 group">
                <img src={src} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                <button type="button" onClick={() => removeImage(idx)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
          {errors.images && <p className="text-red-500 text-xs mt-2">{errors.images}</p>}
        </div>

        {/* 4. Variants Management (Only in Edit Mode) */}
        {initialData && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6 border-b pb-2">
              <h3 className="text-lg font-bold text-gray-900">Product Variants</h3>
              <Button
                type="button"
                onClick={(e) => handleAddVariant(e)}
                className="bg-[#e09a74] text-white hover:bg-[#d08963] text-sm py-1.5 px-4 font-bold rounded-lg flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Variant
              </Button>
            </div>

            {isLoadingVariants ? (
              <div className="py-8 text-center text-gray-500">Loading variants...</div>
            ) : variants.length === 0 ? (
              <div className="py-8 text-center text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                No variants found for this product. Use the button above to add the first one (e.g., Different Size/Color).
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Variant</th>
                      <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Attributes</th>
                      <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Price</th>
                      <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Stock</th>
                      <th className="px-4 py-3 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {variants.map(v => (
                      <tr key={v._id || v.id} className="hover:bg-orange-50/20 transition-colors">
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden shrink-0 border border-gray-200">
                              {v.product_image1 && (
                                <img
                                  src={v.product_image1.startsWith('http') ? v.product_image1 : `http://localhost:8000/api/public/uploads/variant/${v.product_image1}`}
                                  className="w-full h-full object-cover"
                                  alt=""
                                />
                              )}
                            </div>
                            <div>
                              <div className="text-sm font-bold text-gray-900">{v.product_name}</div>
                              <div className="text-[10px] text-gray-500 font-mono bg-gray-100 px-1 inline-block rounded">{v.skucode || 'NO-SKU'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex flex-wrap gap-1">
                            {v.size && <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-full">Size: {v.size}</span>}
                            {v.color && <span className="px-2 py-0.5 bg-purple-50 text-purple-700 text-[10px] font-bold rounded-full">Color: {v.color}</span>}
                            {v.brand && <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-bold rounded-full">{v.brand}</span>}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm font-bold text-gray-900">₹{v.selling_price?.toLocaleString()}</div>
                          <div className="text-[10px] text-gray-400 line-through">₹{v.mrp_price?.toLocaleString()}</div>
                        </td>
                        <td className="px-4 py-4">
                          <span className={clsx("text-sm font-bold", v.stock > 0 ? "text-green-600" : "text-red-500")}>
                            {v.stock} units
                          </span>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <div className="flex justify-end gap-3">
                            <button
                              type="button"
                              onClick={(e) => handleEditVariant(v, e)}
                              className="text-[#e09a74] hover:text-[#d08963] font-bold text-xs uppercase"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={(e) => handleDeleteVariant(v._id || v.id, e)}
                              className="text-red-500 hover:text-red-700 font-bold text-xs uppercase"
                            >
                              Delete
                            </button>
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
              <label className="block text-sm font-semibold text-gray-700 mb-2">Meta Keywords</label>
              <input name="meta_keywords" value={formData.meta_keywords} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Meta Description</label>
              <textarea name="meta_description" value={formData.meta_description} onChange={handleChange} rows={3} className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none" />
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3 border-t border-gray-100 pt-6">
          <Button
            variant="outline"
            type="button"
            className="cursor-pointer"
            onClick={() => onCancel ? onCancel() : window.history.back()}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting} className="bg-[#e09a74] text-white cursor-pointer hover:bg-[#d08963] min-w-[120px] py-2 px-4 hover:border-[#e09a74] border hover:text-[#e09a74] hover:bg-white">
            {isSubmitting ? 'Saving...' : initialData ? 'Save Changes' : 'Create Product'}
          </Button>
        </div>
      </form>

      <AddAttributeModal
        isOpen={isAttributeModalOpen}
        onClose={() => setIsAttributeModalOpen(false)}
      />

      <AddVariantModal
        isOpen={isVariantModalOpen}
        onClose={() => setIsVariantModalOpen(false)}
        productId={productId}
        parentProduct={initialData}
        editingVariant={editingVariant}
      />
    </>
  );
};

export default ProductForm;