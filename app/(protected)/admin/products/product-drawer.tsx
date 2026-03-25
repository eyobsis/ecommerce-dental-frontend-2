"use client";

import {
  Drawer,
  Button,
  Form,
  Input,
  InputNumber,
  Space,
  Select,
  Divider,
  Card,
  Upload,
  message,
} from "antd";
import type { UploadFile } from "antd/es/upload/interface";
import { useProductsStore, Product } from "@/store/product.store";
import { useState, useEffect } from "react";

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
      title={product ? "Edit Product" : "Create New Product"}
      size={720}
      open={open}
      onClose={onClose}
      styles={{ body: { paddingBottom: 80 } }}
    >
      <Form layout="vertical" form={form} onFinish={handleSubmit}>
        {/* BASIC INFO */}
        <Card title="Basic Information">
          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="name"
              label="Product Name"
              rules={[{ required: true }]}
            >
              <Input placeholder="Enter product name" />
            </Form.Item>

            <Form.Item
              name="price"
              label="Base Price"
              rules={[{ required: true }]}
            >
              <InputNumber style={{ width: "100%" }} placeholder="0.00" />
            </Form.Item>
          </div>

          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item name="categoryId" label="Category">
            <Select
              placeholder="Select category"
              options={categories.map((c) => ({
                label: c.name,
                value: c.id,
              }))}
            />
          </Form.Item>
        </Card>

        <Divider />

        {/* FEATURES */}
        <Card title="Product Features">
          <Form.List name="features">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field) => (
                  <Space
                    key={field.key}
                    style={{ display: "flex", marginBottom: 8 }}
                  >
                    <Form.Item name={field.name} rules={[{ required: true }]}>
                      <Input placeholder="Feature description" />
                    </Form.Item>

                    <Button danger onClick={() => remove(field.name)}>
                      Remove
                    </Button>
                  </Space>
                ))}
                <Button type="dashed" onClick={() => add()} block>
                  + Add Feature
                </Button>
              </>
            )}
          </Form.List>
        </Card>

        <Divider />

        {/* IMAGES */}
        <Card title="Product Images">
          {product?.images?.length ? (
            <p className="mb-3 text-sm text-gray-500">
              Existing images: {product.images.length}. New uploads are added when you update this product.
            </p>
          ) : null}

          <Upload
            accept="image/*"
            listType="picture"
            multiple
            beforeUpload={() => false}
            fileList={imageFileList}
            onChange={({ fileList }) => setImageFileList(fileList)}
          >
            <Button type="dashed" block>
              + Add Image Files
            </Button>
          </Upload>
        </Card>

        <Divider />

        {/* VARIANTS */}
        <Card title="Product Variants">
          <Form.List name="variants">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field) => (
                  <Card
                    key={field.key}
                    size="small"
                    style={{ marginBottom: 16 }}
                  >
                    <div className="grid grid-cols-3 gap-4">
                      <Form.Item
                        name={[field.name, "name"]}
                        label="Variant Name"
                        rules={[{ required: true }]}
                      >
                        <Input />
                      </Form.Item>

                      <Form.Item
                        name={[field.name, "additionalPrice"]}
                        label="Additional Price"
                      >
                        <InputNumber style={{ width: "100%" }} />
                      </Form.Item>

                      <Form.Item name={[field.name, "stock"]} label="Stock">
                        <InputNumber style={{ width: "100%" }} />
                      </Form.Item>
                    </div>

                    <Button
                      danger
                      size="small"
                      onClick={() => remove(field.name)}
                    >
                      Remove Variant
                    </Button>
                  </Card>
                ))}

                <Button type="dashed" onClick={() => add()} block>
                  + Add Variant
                </Button>
              </>
            )}
          </Form.List>
        </Card>

        {/* Sticky Footer */}
        <div className="absolute bottom-0 left-0 w-full bg-white border-t p-4 flex justify-end gap-2">
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            {product ? "Update Product" : "Save Product"}
          </Button>
        </div>
      </Form>
    </Drawer>
  );
};
