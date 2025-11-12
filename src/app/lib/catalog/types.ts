// Общие контракты каталога (единые для всех ролей)

export type Role = "admin" | "manager" | "user";

export type Currency = "RUB" | "USD" | "KRW";

export type ProductStatus = "active" | "draft" | "archived";

export type getIconId =
  | "apple" | "banana" | "citrus" | "berries" | "grapes" | "tropical" | "stone" | "melon" | "pome" | "dried"
  | "leafy" | "root" | "crucifer" | "nightshade" | "allium" | "pod" | "stem" | "mushroom" | "herb" | "frozen-veg"
  | "milk" | "yogurt" | "cheese" | "butter" | "cream" | "kefir" | "cottage" | "dessert" | "lactosefree" | "plantmilk"
  | "bread" | "baguette" | "bun" | "cake" | "cookie" | "pie" | "croissant" | "flatbread" | "glutenfree" | "cracker"
  | "beef" | "pork" | "chicken" | "turkey" | "lamb" | "duck" | "minced" | "sausage" | "smoked" | "offal"
  | "salmon" | "tuna" | "whitefish" | "shellfish" | "shrimp" | "crab" | "caviar" | "smoked-fish" | "dried-fish" | "frozen-sea"
  | "water" | "juice" | "soda" | "tea" | "coffee" | "energy" | "isotonic" | "nabeer" | "kombucha" | "plantdrink"
  | "chips" | "nuts" | "driedfruit" | "chocolate" | "bar" | "popcorn" | "crackers" | "jerky" | "seeds" | "mix"
  | "rice" | "buckwheat" | "oats" | "pasta" | "flour" | "semolina" | "corn" | "quinoa" | "couscous" | "beans"
  | "frozen-fruit" | "frozen-veg2" | "icecream" | "pelmeni" | "pizza" | "berries2" | "dumplings" | "cutlets" | "mixes" | "ready";

export type Category = {
  id: string;
  name: string;
  slug: string;
  parentId?: string | null;
  iconId?: getIconId;
};

export type Product = {
  id: string;
  name: string;
  sku: string;
  barcode?: string;
  categoryId?: string | null;
  price: number;         // в базовой валюте (RUB по умолчанию)
  stock: number;
  status: ProductStatus;
  updatedAt: string;     // ISO YYYY-MM-DD
  iconId?: IconId;
};

export type ShopStats = {
  total: number;
  active: number;
  noCategory: number;
  noMedia: number; // всегда 0 в иконном режиме
};