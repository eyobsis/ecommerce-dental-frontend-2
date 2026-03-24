// app/products/products-columns.tsx

import { Product } from "@/store/product.store";
import { Button } from "antd";

export const getProductColumns = (
  onEdit: (product: Product) => void,
  onDelete: (product: Product) => void,
) => [
  { key: "name", header: "Name" },

  {
    key: "categoryId",
    header: "Category",
    render: (p: Product) => p.categoryName ?? "-",
  },

  {
    key: "price",
    header: "Price",
    render: (p: Product) => `${p.price} ETB`,
  },

  {
    key: "quantity",
    header: "Quantity",
    render: (p: Product) => p.quantity,
  },

  {
    key: "features",
    header: "Features",
    render: (p: Product) => (
      <ul className="list-disc pl-4">
        {p.features?.map((f, i) => (
          <li key={i}>{f}</li>
        ))}
      </ul>
    ),
  },

  {
    key: "actions",
    header: "Actions",
    render: (product: Product) => (
      <div className="flex gap-2">
        <Button size="small" onClick={() => onEdit(product)}>
          Edit
        </Button>
        <Button danger size="small" onClick={() => onDelete(product)}>
          Delete
        </Button>
      </div>
    ),
  },
];
