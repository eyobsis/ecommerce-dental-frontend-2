"use client";

import React, { useState } from "react";
import { Stack } from "@mui/material";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { PackagePlus, LayoutGrid, DollarSign, Tag } from "lucide-react";
import { showError, showSuccess } from "@/app/utils/message";
import { useCategories } from "@/hooks/use-category";
import { Category } from "@/generated/prisma/client";
import { useCreateProduct } from "@/hooks/use-product";
import { ApiError } from "@/lib/api-error";
import { ProductCreateDto } from "@/types/product-response-dto";

const AddProduct: React.FC = () => {
  const [formData, setFormData] = useState({
    category: "",
    productName: "",
    price: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const { data } = useCategories();
  const categories = data?.categories ?? [];

  const { mutate: createProduct } = useCreateProduct(
    (response) => {
      // Ensure your backend returns { message: string }
      if (response?.message) {
        showSuccess(response.message);
      } else {
        showSuccess("Product created successfully!");
      }
      setLoading(false);
      setFormData({ category: "", productName: "", price: "" });
    },
    (error) => {
      if (error instanceof ApiError) {
        showError(error.message);
      } else if (error instanceof Error) {
        showError(error.message);
      } else {
        showError("Unexpected error occurred");
      }
      setLoading(false);
    }
  );

  const handleSubmit = () => {
    const { category, productName, price } = formData;

    if (!category || !productName || !price) {
      showError("Please fill out all fields");
      return;
    }

    setLoading(true);

    const payload: ProductCreateDto = {
      categoryId: category,
      prod_name: productName,
      isApproved: true,
      price: Number(price),
    };

    createProduct({ data: payload });
  };

  return (
    <div className="flex justify-center items-start p-8 bg-slate-50 min-h-screen">
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={6}
        className="w-full max-w-5xl"
      >
        {/* Main Form Section */}
        <Card className="flex-1 shadow-sm border-slate-200">
          <CardHeader className="space-y-1">
            <div className="flex items-center gap-2">
              <PackagePlus className="w-5 h-5 text-primary" />
              <CardTitle className="text-2xl">Add New Product</CardTitle>
            </div>
            <CardDescription>
              Enter the details below to add a new product to your inventory.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RenderInputInfo
              formData={formData}
              onChange={handleChange}
              onSubmit={handleSubmit}
              loading={loading}
              categoryData={categories}
            />
          </CardContent>
        </Card>

        {/* Sidebar */}
        <Card className="w-full md:w-[350px] h-fit bg-primary/5 border-none shadow-none">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <LayoutGrid className="w-4 h-4" />
              Quick Tips
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-4">
            <p>
              Ensure that the Product Name matches the billing invoice for
              consistency.
            </p>
            <div className="p-3 bg-white rounded-md border border-slate-100">
              <p className="font-semibold text-slate-900 mb-1">
                Current Selection:
              </p>
              <p>Category: {formData.category || "---"}</p>
              <p>Name: {formData.productName || "---"}</p>
              <p>Price: {formData.price ? `$${formData.price}` : "---"}</p>
            </div>
          </CardContent>
        </Card>
      </Stack>
    </div>
  );
};

// --- Sub-component ---
type RenderInputInfoProps = {
  formData: { category: string; productName: string; price: string };
  onChange: (field: string, value: string) => void;
  onSubmit: () => void;
  loading: boolean;
  categoryData: Category[];
};

const RenderInputInfo: React.FC<RenderInputInfoProps> = ({
  formData,
  onChange,
  onSubmit,
  loading,
  categoryData,
}) => (
  <div className="space-y-6">
    {/* Category Select */}
    <div className="space-y-2">
      <Label className="flex items-center gap-2">
        <Tag className="w-4 h-4" /> Category
      </Label>
      <Select
        onValueChange={(val) => onChange("category", val)}
        value={formData.category}
      >
        <SelectTrigger className="w-full bg-white">
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent>
          {categoryData.map((item) => (
            <SelectItem key={item.id} value={item.id}>
              {item.category_name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>

    {/* Product Name */}
    <div className="space-y-2">
      <Label htmlFor="productName">Product Name</Label>
      <Input
        id="productName"
        placeholder="e.g. Zirconia Multi-Layer"
        className="bg-white"
        value={formData.productName}
        onChange={(e) => onChange("productName", e.target.value)}
      />
    </div>

    {/* Price */}
    <div className="space-y-2">
      <Label htmlFor="price" className="flex items-center gap-2">
        <DollarSign className="w-4 h-4" /> Price
      </Label>
      <Input
        id="price"
        type="number"
        placeholder="0.00"
        className="bg-white"
        value={formData.price}
        onChange={(e) => onChange("price", e.target.value)}
      />
    </div>

    <Button
      className="w-full mt-4 py-6 text-md font-semibold transition-all hover:scale-[1.01]"
      onClick={onSubmit}
      disabled={loading}
    >
      {loading ? "Registering..." : "Register Product"}
    </Button>
  </div>
);

export default AddProduct;
