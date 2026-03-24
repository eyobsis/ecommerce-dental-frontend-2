import {
  pgTable,
  index,
  uuid,
  text,
  timestamp,
  unique,
  boolean,
  foreignKey,
  serial,
  varchar,
  numeric,
  integer,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm/relations";

export const userStatus = pgEnum("user_status", [
  "active",
  "inactive",
  "pending",
  "blocked",
]);
export const userType = pgEnum("user_type", [
  "owner",
  "admin",
  "accountant",
  "client",
  "super_admin",
]);

export const verification = pgTable(
  "verification",
  {
    id: uuid().primaryKey().notNull(),
    identifier: text().notNull(),
    value: text().notNull(),
    expiresAt: timestamp("expires_at", { mode: "string" }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("verification_identifier_idx").using(
      "btree",
      table.identifier.asc().nullsLast().op("text_ops"),
    ),
  ],
);

export const user = pgTable(
  "user",
  {
    id: text().primaryKey().notNull(),
    name: text(),
    email: text().notNull(),
    emailVerified: boolean("email_verified").default(false).notNull(),
    image: text(),
    role: text(),
    accountType: text("account_type"),
    employeeStatus: text("employee_status"),
    phone_number: text("phone_number"),
    userStatus: userStatus("user_status").default("active"),
    usreType: userType("usre_type").default("client"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [unique("user_email_unique").on(table.email)],
);

export const account = pgTable(
  "account",
  {
    id: text().primaryKey().notNull(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id").notNull(),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at", {
      mode: "string",
    }),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at", {
      mode: "string",
    }),
    scope: text(),
    password: text(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index("account_userId_idx").using(
      "btree",
      table.userId.asc().nullsLast().op("text_ops"),
    ),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [user.id],
      name: "account_user_id_user_id_fk",
    }).onDelete("cascade"),
  ],
);

export const carts = pgTable("carts", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  userId: uuid("user_id").notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
});

export const cartItems = pgTable(
  "cart_items",
  {
    id: serial().primaryKey().notNull(),
    cartId: uuid("cart_id"),
    productId: uuid("product_id"),
    variantId: uuid("variant_id"),
    name: varchar({ length: 255 }).notNull(),
    basePrice: numeric("base_price", { precision: 10, scale: 2 }).notNull(),
    image: text(),
    quantity: integer().default(1).notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.cartId],
      foreignColumns: [carts.id],
      name: "cart_items_cart_id_carts_id_fk",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.productId],
      foreignColumns: [products.id],
      name: "cart_items_product_id_products_id_fk",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.variantId],
      foreignColumns: [productVariants.id],
      name: "cart_items_variant_id_product_variants_id_fk",
    }).onDelete("set null"),
  ],
);

export const products = pgTable(
  "products",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    name: varchar({ length: 255 }).notNull(),
    price: numeric({ precision: 10, scale: 2 }).notNull(),
    description: text(),
    categoryId: uuid("category_id"),
  },
  (table) => [
    foreignKey({
      columns: [table.categoryId],
      foreignColumns: [categories.id],
      name: "products_category_id_categories_id_fk",
    }).onDelete("cascade"),
  ],
);

export const productVariants = pgTable(
  "product_variants",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    productId: uuid("product_id"),
    name: varchar({ length: 255 }).notNull(),
    additionalPrice: numeric("additional_price", {
      precision: 10,
      scale: 2,
    }).default("0"),
    stock: integer().default(0),
  },
  (table) => [
    foreignKey({
      columns: [table.productId],
      foreignColumns: [products.id],
      name: "product_variants_product_id_products_id_fk",
    }).onDelete("cascade"),
  ],
);

export const orders = pgTable("orders", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  userId: uuid("user_id").notNull(),
  status: varchar({ length: 50 }).default("pending"),
  totalAmount: numeric("total_amount", { precision: 10, scale: 2 }).notNull(),
  paymentImage: text("payment_image").notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
});

export const orderItems = pgTable(
  "order_items",
  {
    id: serial().primaryKey().notNull(),
    orderId: uuid("order_id"),
    productId: uuid("product_id"),
    variantId: uuid("variant_id"),
    name: varchar({ length: 255 }).notNull(),
    basePrice: numeric("base_price", { precision: 10, scale: 2 }).notNull(),
    image: text().notNull(),
    quantity: integer().default(1).notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.orderId],
      foreignColumns: [orders.id],
      name: "order_items_order_id_orders_id_fk",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.productId],
      foreignColumns: [products.id],
      name: "order_items_product_id_products_id_fk",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.variantId],
      foreignColumns: [productVariants.id],
      name: "order_items_variant_id_product_variants_id_fk",
    }).onDelete("set null"),
  ],
);

export const productFeatures = pgTable(
  "product_features",
  {
    id: serial().primaryKey().notNull(),
    productId: uuid("product_id"),
    feature: varchar({ length: 255 }).notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.productId],
      foreignColumns: [products.id],
      name: "product_features_product_id_products_id_fk",
    }).onDelete("cascade"),
  ],
);

export const productImages = pgTable(
  "product_images",
  {
    id: serial().primaryKey().notNull(),
    productId: uuid("product_id"),
    url: text().notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.productId],
      foreignColumns: [products.id],
      name: "product_images_product_id_products_id_fk",
    }).onDelete("cascade"),
  ],
);

export const categories = pgTable("categories", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  name: varchar({ length: 255 }).notNull(),
});

export const session = pgTable(
  "session",
  {
    id: text().primaryKey().notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text().notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id").notNull(),
  },
  (table) => [
    index("session_userId_idx").using(
      "btree",
      table.userId.asc().nullsLast().op("text_ops"),
    ),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [user.id],
      name: "session_user_id_user_id_fk",
    }).onDelete("cascade"),
    unique("session_token_unique").on(table.token),
  ],
);

export const tgUsers = pgTable(
  "tg_users",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    name: varchar({ length: 255 }).notNull(),
    username: varchar(),
    telegramId: varchar("telegram_id"),
    phoneNumber: varchar("phone_number"),
    type: text(),
    userId: text("user_id"),
    isAdminEligible: boolean("is_admin_eligible").default(false),
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [user.id],
      name: "tg_users_user_id_user_id_fk",
    }).onDelete("cascade"),
  ],
);

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const userRelations = relations(user, ({ many }) => ({
  accounts: many(account),
  sessions: many(session),
  tgUsers: many(tgUsers),
}));

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  cart: one(carts, {
    fields: [cartItems.cartId],
    references: [carts.id],
  }),
  product: one(products, {
    fields: [cartItems.productId],
    references: [products.id],
  }),
  productVariant: one(productVariants, {
    fields: [cartItems.variantId],
    references: [productVariants.id],
  }),
}));

export const cartsRelations = relations(carts, ({ many }) => ({
  cartItems: many(cartItems),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  cartItems: many(cartItems),
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  productVariants: many(productVariants),
  orderItems: many(orderItems),
  productFeatures: many(productFeatures),
  productImages: many(productImages),
}));

export const productVariantsRelations = relations(
  productVariants,
  ({ one, many }) => ({
    cartItems: many(cartItems),
    product: one(products, {
      fields: [productVariants.productId],
      references: [products.id],
    }),
    orderItems: many(orderItems),
  }),
);

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
  productVariant: one(productVariants, {
    fields: [orderItems.variantId],
    references: [productVariants.id],
  }),
}));

export const ordersRelations = relations(orders, ({ many }) => ({
  orderItems: many(orderItems),
}));

export const productFeaturesRelations = relations(
  productFeatures,
  ({ one }) => ({
    product: one(products, {
      fields: [productFeatures.productId],
      references: [products.id],
    }),
  }),
);

export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, {
    fields: [productImages.productId],
    references: [products.id],
  }),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const tgUsersRelations = relations(tgUsers, ({ one }) => ({
  user: one(user, {
    fields: [tgUsers.userId],
    references: [user.id],
  }),
}));
