"use client";

import {
  Drawer,
  Button,
  Form,
  Input,
  InputNumber,
  Select,
  Upload,
  message,
} from "antd";
import type { UploadFile } from "antd/es/upload/interface";
import { useProductsStore, Product } from "@/store/product.store";
import { useState, useEffect } from "react";
import { 
  Package, 
  Tag, 
  Layers, 
  Image as ImageIcon, 
  Plus, 
  Trash2, 
  UploadCloud,
  ListChecks
} from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  product?: Product;
}

interface FormValues {
  name: string;
  price: number;
  description?: string;
  categoryId?: string;
  features?: string[];
  variants?: Array<{
    name: string;
    additionalPrice?: number;
    stock?: number;
  }>;
}

export const ProductDrawer = ({ open, onClose, product }: Props) => {
  const [form] = Form.useForm();
  const { categories, addProduct, updateProduct } = useProductsStore();
  const [loading, setLoading] = useState(false);
  const [imageFileList, setImageFileList] = useState<UploadFile[]>([]);

  // Prefill form when editing
  useEffect(() => {
    if (product) {
      form.setFieldsValue({
        ...product,
      });
      setImageFileList([]);
    } else {
      form.resetFields();
      setImageFileList([]);
    }
  }, [product, form]);

  const handleSubmit = async (values: FormValues) => {
    setLoading(true);

    const variants = (values.variants || []).filter(
      (variant) => variant.name?.trim().length > 0,
    );

    const quantity = variants.reduce(
      (sum, variant) => sum + Number(variant.stock || 0),
      0,
    );

    const featureValues = (values.features || [])
      .map((feature) => feature.trim())
      .filter((feature) => feature.length > 0);

    const imageFiles = imageFileList
      .map((file) => file.originFileObj)
      .filter((file): file is File => file instanceof File);

    const payload = {
      name: values.name.trim(),
      price: Number(values.price),
      description: values.description,
      categoryId: values.categoryId,
      features: featureValues,
      images: product?.images || [],
      imageFiles,
      variants: variants.map((variant) => ({
        id: "",
        name: variant.name.trim(),
        additionalPrice: Number(variant.additionalPrice || 0),
        stock: Number(variant.stock || 0),
      })),
      quantity,
      categoryName:
        categories.find((c) => c.id === values.categoryId)?.name ?? "",
    };

    try {
      if (product) {
        await updateProduct(product.id, payload);
        message.success("Product updated successfully");
      } else {
        await addProduct(payload);
        message.success("Product created successfully");
      }

      form.resetFields();
      onClose();
    } catch (error) {
      message.error(
        error instanceof Error ? error.message : "Failed to save product",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer
      title={
        <div className="flex items-center gap-2 text-slate-900">
          <div className="h-8 w-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center">
            <Package className="h-4 w-4 text-indigo-600" />
          </div>
          <span className="text-lg font-semibold tracking-tight">
            {product ? "Edit Product" : "New Product"}
          </span>
        </div>
      }
      size="large"
      open={open}
      onClose={onClose}
      closeIcon={
        <div className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13 1L1 13M1 1L13 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      }
      styles={{
        header: { borderBottom: '1px solid #f1f5f9', padding: '16px 24px' },
        body: { padding: 0, backgroundColor: '#f8fafc' },
      }}
    >
      <Form 
        layout="vertical" 
        form={form} 
        onFinish={handleSubmit}
        className="flex flex-col h-full"
        requiredMark={false}
      >
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* BASIC INFO SECTION */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="border-b border-slate-100 bg-slate-50/50 px-5 py-3">
              <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                <Tag className="w-4 h-4 text-slate-400" />
                Basic Details
              </h3>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <Form.Item
                  name="name"
                  label={<span className="text-sm font-medium text-slate-700">Product Name</span>}
                  rules={[{ required: true, message: 'Name is required' }]}
                  className="mb-0"
                >
                  <Input size="large" placeholder="e.g. Premium Wireless Headphones" className="rounded-lg" />
                </Form.Item>

                <Form.Item
                  name="price"
                  label={<span className="text-sm font-medium text-slate-700">Base Price (ETB)</span>}
                  rules={[{ required: true, message: 'Price is required' }]}
                  className="mb-0"
                >
                  <InputNumber 
                    size="large" 
                    style={{ width: "100%" }} 
                    placeholder="0.00"
                    className="rounded-lg"
                  />
                </Form.Item>
              </div>

              <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <Form.Item 
                  name="categoryId" 
                  label={<span className="text-sm font-medium text-slate-700">Category</span>}
                  className="mb-0"
                >
                  <Select
                    size="large"
                    placeholder="Select a category"
                    className="[&_.ant-select-selector]:rounded-lg"
                    options={categories.map((c) => ({
                      label: c.name,
                      value: c.id,
                    }))}
                  />
                </Form.Item>
              </div>

              <Form.Item 
                name="description" 
                label={<span className="text-sm font-medium text-slate-700">Description</span>}
                className="mb-0 mt-5"
              >
                <Input.TextArea 
                  rows={4} 
                  placeholder="Describe your product..." 
                  className="rounded-lg resize-none"
                />
              </Form.Item>
            </div>
          </div>

          {/* FEATURES SECTION */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="border-b border-slate-100 bg-slate-50/50 px-5 py-3 flex justify-between items-center">
              <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                <ListChecks className="w-4 h-4 text-slate-400" />
                Key Features
              </h3>
            </div>
            <div className="p-5">
              <Form.List name="features">
                {(fields, { add, remove }) => (
                  <div className="space-y-3">
                    {fields.map((field, index) => (
                      <div key={field.key} className="flex items-start gap-2 group">
                        <div className="bg-slate-50 border border-slate-200 h-10 w-10 rounded-lg flex items-center justify-center text-xs font-semibold text-slate-400 shrink-0">
                          {index + 1}
                        </div>
                        <Form.Item 
                          {...field}
                          rules={[{ required: true, message: 'Feature cannot be empty' }]}
                          className="mb-0 flex-1"
                        >
                          <Input size="large" placeholder="e.g. Active Noise Cancellation" className="rounded-lg" />
                        </Form.Item>
                        <button 
                          type="button"
                          onClick={() => remove(field.name)}
                          className="h-10 w-10 rounded-lg flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => add()}
                      className="w-full flex items-center justify-center gap-2 h-10 border border-dashed border-slate-300 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-400 transition-colors mt-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add Feature
                    </button>
                  </div>
                )}
              </Form.List>
            </div>
          </div>

          {/* VARIANTS SECTION */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="border-b border-slate-100 bg-slate-50/50 px-5 py-3">
              <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                <Layers className="w-4 h-4 text-slate-400" />
                Product Variants
              </h3>
            </div>
            <div className="p-5">
              <Form.List name="variants">
                {(fields, { add, remove }) => (
                  <div className="space-y-4">
                    {fields.map((field, index) => (
                      <div 
                        key={field.key} 
                        className="relative bg-slate-50/50 border border-slate-200 rounded-xl p-4 pt-5 group"
                      >
                        <button 
                          type="button"
                          onClick={() => remove(field.name)}
                          className="absolute top-3 right-3 h-8 w-8 rounded-md flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-white hover:shadow-sm transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        
                        <div className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                          Variant {index + 1}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <Form.Item
                            name={[field.name, "name"]}
                            label={<span className="text-xs font-medium text-slate-600">Variant Name</span>}
                            rules={[{ required: true, message: 'Required' }]}
                            className="mb-0"
                          >
                            <Input placeholder="e.g. Large / Blue" className="rounded-md" />
                          </Form.Item>

                          <Form.Item
                            name={[field.name, "additionalPrice"]}
                            label={<span className="text-xs font-medium text-slate-600">Extra Price (+ETB)</span>}
                            className="mb-0"
                          >
                            <InputNumber style={{ width: "100%" }} placeholder="0.00" className="rounded-md" />
                          </Form.Item>

                          <Form.Item 
                            name={[field.name, "stock"]} 
                            label={<span className="text-xs font-medium text-slate-600">Stock Qty</span>}
                            className="mb-0"
                          >
                            <InputNumber style={{ width: "100%" }} placeholder="0" className="rounded-md" />
                          </Form.Item>
                        </div>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => add()}
                      className="w-full flex items-center justify-center gap-2 h-12 border border-dashed border-indigo-200 bg-indigo-50/50 rounded-xl text-sm font-medium text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Add Variant
                    </button>
                  </div>
                )}
              </Form.List>
            </div>
          </div>

          {/* IMAGES SECTION */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="border-b border-slate-100 bg-slate-50/50 px-5 py-3">
              <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-slate-400" />
                Media & Images
              </h3>
            </div>
            <div className="p-5">
              {product?.images?.length ? (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-700 flex gap-2">
                  <ImageIcon className="w-4 h-4 shrink-0 mt-0.5" />
                  <p>
                    This product currently has <strong>{product.images.length}</strong> saved image(s). 
                    Uploading new files will be added to the gallery upon saving.
                  </p>
                </div>
              ) : null}

              <Upload
                accept="image/*"
                listType="picture"
                multiple
                beforeUpload={() => false}
                fileList={imageFileList}
                onChange={({ fileList }) => setImageFileList(fileList)}
                className="w-full"
              >
                <div className="w-full flex flex-col items-center justify-center gap-2 px-6 py-8 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 hover:bg-slate-100/50 hover:border-slate-400 transition-all cursor-pointer">
                  <div className="h-10 w-10 bg-white border border-slate-200 shadow-sm rounded-full flex items-center justify-center text-slate-500 mb-1">
                    <UploadCloud className="h-5 w-5" />
                  </div>
                  <div className="text-sm font-medium text-slate-700">Click or drag images to upload</div>
                  <div className="text-xs text-slate-400">PNG, JPG, GIF up to 5MB</div>
                </div>
              </Upload>
            </div>
          </div>

        </div>

        {/* Sticky Footer */}
        <div className="shrink-0 bg-white border-t border-slate-200 p-4 px-6 flex justify-end gap-3 shadow-[0_-4px_6px_-1px_rgb(0,0,0,0.05)] z-10">
          <Button 
            size="large" 
            onClick={onClose} 
            className="rounded-lg font-medium text-slate-600 hover:text-slate-900 border-slate-200"
          >
            Cancel
          </Button>
          <Button 
            type="primary" 
            size="large" 
            htmlType="submit" 
            loading={loading}
            className="rounded-lg font-medium bg-indigo-600 hover:bg-indigo-700 shadow-sm border-0 px-6"
          >
            {product ? "Save Changes" : "Create Product"}
          </Button>
        </div>
      </Form>
    </Drawer>
  );
};