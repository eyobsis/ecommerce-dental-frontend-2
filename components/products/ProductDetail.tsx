/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2, PlusCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { IProduct } from "@/types/product-response-dto";
import { apiClient } from "@/lib/api-client";

// Updated types to match new Prisma schema
interface ICompany {
  id: string;
  name: string;
  email: string;
  isApproved?: boolean;
  status?: string;
  // ... other fields if needed
}

interface ICompanyDiscount {
  id: string; // from Company_Discount.id
  productId: string;
  companyId: string;
  companyName: string; // we keep this for display
  discountPercentage: number;
  isActive?: boolean;
}

type NewDiscountState = {
  companyId: string;
  discountPercentage: number;
};

const ProductDetail = ({ product }: { product: IProduct }) => {
  const [formData, setFormData] = useState<IProduct>(product);
  const [companies, setCompanies] = useState<ICompany[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [newCompanyDiscount, setNewCompanyDiscount] =
    useState<NewDiscountState>({
      companyId: "",
      discountPercentage: 0,
    });

  // Sync formData when product prop changes
  useEffect(() => {
    setFormData(product);
  }, [product]);

  // Fetch all companies
  useEffect(() => {
    const getCompanies = async () => {
      setIsLoading(true);
      try {
        const res = await apiClient<{
          error: boolean;
          companies: ICompany[]; // adjust key if your API uses "clients"
          message: string;
        }>("/company");

        if (res.error) {
          console.log(res.message);
          setCompanies([]);
        } else {
          setCompanies(res.companies || []);
        }
      } catch (error) {
        console.error("Failed to fetch companies:", error);
        setCompanies([]);
      } finally {
        setIsLoading(false);
      }
    };
    getCompanies();
  }, []);

  const handleInputChange = <K extends keyof IProduct>(
    field: K,
    value: IProduct[K],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddCompanyDiscount = () => {
    const selectedCompany = companies.find(
      (c) => c.id === newCompanyDiscount.companyId,
    );

    if (!selectedCompany) {
      console.log("Selected company not found.");
      return;
    }

    const newDiscount: ICompanyDiscount = {
      id: "", // new → will be created on backend
      productId: formData.id,
      companyId: selectedCompany.id,
      companyName: selectedCompany.name,
      discountPercentage: newCompanyDiscount.discountPercentage,
    };

    handleInputChange("company_discount", [
      ...(formData.company_discount || []),
      newDiscount,
    ]);

    // Reset
    setNewCompanyDiscount({ companyId: "", discountPercentage: 0 });
  };

  const handleRemoveCompanyDiscount = (companyId: string) => {
    const updatedDiscounts = (formData.company_discount || []).filter(
      (d) => d.companyId !== companyId,
    );
    handleInputChange("company_discount", updatedDiscounts);
  };

  const handleSaveChanges = async () => {
    const currentDiscounts = formData.company_discount || [];
    const originalDiscounts = product.company_discount || [];

    const discountsToCreate = currentDiscounts
      .filter((d) => !d.id)
      .map((d) => ({
        companyId: d.companyId,
        discountPercentage: d.discountPercentage,
      }));

    const discountsToDelete = originalDiscounts
      .filter(
        (orig) =>
          !currentDiscounts.some((curr) => curr.id && curr.id === orig.id),
      )
      .map((d) => d.id)
      .filter(Boolean);

    const payload = {
      productId: formData.id,
      name: formData.prod_name,
      price: formData.price,
      hasBulkDiscount: formData.hasBulkDiscount,
      bulkDiscountThreshold: formData.hasBulkDiscount
        ? formData.bulkDiscountThreshold
        : null,
      bulkDiscountPercentage: formData.hasBulkDiscount
        ? formData.bulkDiscountPercentage
        : null,
      companyDiscountsToCreate: discountsToCreate,
      companyDiscountsToDelete: discountsToDelete,
    };

    console.log("Save payload:", payload);

    try {
      await apiClient(`/product/detail/${formData.id}`, {
        method: "PUT",
        body: payload,
      });

      alert("Changes saved successfully!");
      // Optionally refetch product here
    } catch (error: any) {
      console.error("Save failed:", error);
      alert("Failed to save changes: " + (error.message || "Unknown error"));
    }
  };
  // Companies not already assigned a discount for this product
  const availableCompanies = companies.filter(
    (c) => !(formData.company_discount || []).some((d) => d.companyId === c.id),
  );

  const isAddButtonDisabled =
    !newCompanyDiscount.companyId ||
    newCompanyDiscount.discountPercentage <= 0 ||
    newCompanyDiscount.discountPercentage > 100;

  return (
    <ScrollArea className="h-[95vh]">
      <Card>
        <CardHeader>
          <CardTitle>{formData.prod_name}</CardTitle>
          <CardDescription>
            Manage product details and discount configurations.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="prod_name">Product Name</Label>
                <Input
                  id="prod_name"
                  value={formData.prod_name}
                  onChange={(e) =>
                    handleInputChange("prod_name", e.target.value)
                  }
                />
              </div>
              <div>
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price.toString()}
                  onChange={(e) =>
                    handleInputChange("price", Number(e.target.value))
                  }
                />
              </div>
            </div>
          </div>

          {/* Bulk Discount */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Bulk Discount</h3>
              <Switch
                checked={formData.hasBulkDiscount}
                onCheckedChange={(checked) =>
                  handleInputChange("hasBulkDiscount", checked)
                }
              />
            </div>
            <Card
              className={
                !formData.hasBulkDiscount
                  ? "opacity-50 pointer-events-none"
                  : ""
              }
            >
              <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bulkThreshold">Minimum Quantity</Label>
                  <Input
                    id="bulkThreshold"
                    type="number"
                    placeholder="e.g., 10"
                    value={formData.bulkDiscountThreshold ?? ""}
                    onChange={(e) =>
                      handleInputChange(
                        "bulkDiscountThreshold",
                        Number(e.target.value) || null,
                      )
                    }
                    disabled={!formData.hasBulkDiscount}
                  />
                </div>
                <div>
                  <Label htmlFor="bulkPercentage">
                    Discount Percentage (%)
                  </Label>
                  <Input
                    id="bulkPercentage"
                    type="number"
                    placeholder="e.g., 5"
                    value={formData.bulkDiscountPercentage ?? ""}
                    onChange={(e) =>
                      handleInputChange(
                        "bulkDiscountPercentage",
                        Number(e.target.value) || null,
                      )
                    }
                    disabled={!formData.hasBulkDiscount}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Company-Specific Discounts */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              Company-Specific Discounts
            </h3>
            <Card>
              <CardContent className="pt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Company Name</TableHead>
                      <TableHead>Discount</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(formData.company_discount || []).length > 0 ? (
                      formData.company_discount.map((d) => (
                        <TableRow key={d.id || d.companyId}>
                          <TableCell className="font-medium">
                            {d.companyName}
                          </TableCell>
                          <TableCell>{d.discountPercentage}%</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                handleRemoveCompanyDiscount(d.companyId)
                              }
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={3}
                          className="text-center text-muted-foreground"
                        >
                          No company-specific discounts configured.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 items-end border-t pt-4">
                  <div>
                    <Label>Select Company</Label>
                    <Select
                      value={newCompanyDiscount.companyId}
                      onValueChange={(val) =>
                        setNewCompanyDiscount((prev) => ({
                          ...prev,
                          companyId: val,
                        }))
                      }
                      disabled={isLoading || availableCompanies.length === 0}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            isLoading
                              ? "Loading companies..."
                              : availableCompanies.length === 0
                                ? "No more companies available"
                                : "Choose a company"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {availableCompanies.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Discount Percentage (%)</Label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      placeholder="e.g., 15"
                      value={newCompanyDiscount.discountPercentage || ""}
                      onChange={(e) =>
                        setNewCompanyDiscount((prev) => ({
                          ...prev,
                          discountPercentage: Number(e.target.value) || 0,
                        }))
                      }
                    />
                  </div>

                  <Button
                    onClick={handleAddCompanyDiscount}
                    disabled={isAddButtonDisabled}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Discount
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>

        <CardFooter className="flex justify-end gap-2">
          <Button variant="outline">Cancel</Button>
          <Button onClick={handleSaveChanges}>Save Changes</Button>
        </CardFooter>
      </Card>
    </ScrollArea>
  );
};

export default ProductDetail;
