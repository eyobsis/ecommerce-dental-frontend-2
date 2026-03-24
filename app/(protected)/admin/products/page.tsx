"use client";

import { useEffect, useState } from "react";
import { Button, Modal, message } from "antd";
import { useProductsStore, Product } from "@/store/product.store";
import { ProductsTable } from "./products-table";
import { getProductColumns } from "./products-columns";
import { ProductDrawer } from "./product-drawer";

const ProductsPage = () => {
  const products = useProductsStore((s) => s.products);
  const loading = useProductsStore((s) => s.loading);
  const lastError = useProductsStore((s) => s.lastError);
  const fetchProducts = useProductsStore((s) => s.fetchProducts);
  const fetchCategories = useProductsStore((s) => s.fetchCategories);
  const deleteProduct = useProductsStore((s) => s.deleteProduct);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, [fetchCategories, fetchProducts]);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(
    undefined,
  );

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setDrawerOpen(true);
  };

  const handleCreate = () => {
    setSelectedProduct(undefined);
    setDrawerOpen(true);
  };

  const handleDelete = (product: Product) => {
    Modal.confirm({
      title: "Delete product",
      content: `Are you sure you want to delete ${product.name}? This cannot be undone.`,
      okText: "Delete",
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await deleteProduct(product.id);
          message.success("Product deleted successfully");
        } catch (error) {
          message.error(
            error instanceof Error ? error.message : "Failed to delete product",
          );
        }
      },
    });
  };

  const columns = getProductColumns(handleEdit, handleDelete);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Products</h1>
        <Button type="primary" onClick={handleCreate}>
          + Add Product
        </Button>
      </div>

      {lastError && (
        <div className="mb-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {lastError}
        </div>
      )}

      <ProductsTable columns={columns} data={products} loading={loading} />

      <ProductDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        product={selectedProduct}
      />
    </div>
  );
};

export default ProductsPage;
