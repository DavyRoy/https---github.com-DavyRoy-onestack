"use client";

import * as Lucide from "lucide-react";
import type { ComponentType } from "react";

/**
 * Наши iconId -> имя компонента из lucide-react.
 * Значения — СТРОКИ. Если нужной иконки нет в текущей версии Lucide,
 * ниже при резолве будет фолбэк на Box.
 */
const ICON_NAME: Record<string, string> = {
  // Фрукты / овощи
  apple: "Apple",
  banana: "Banana",
  citrus: "Citrus",
  berries: "Cherry",
  grapes: "Grape",
  grape: "Grape",
  tropical: "Shrub",
  stone: "Cherry",
  melon: "Citrus",
  pome: "Apple",
  dried: "CandyCane",

  leafy: "Leaf",
  root: "Carrot",
  crucifer: "Salad",
  nightshade: "Soup",
  allium: "Soup",
  pod: "Salad",
  stem: "Leaf",
  mushroom: "Soup",
  herb: "Leaf",
  "frozen-veg": "IceCream",

  // Молочка
  milk: "Milk",
  yogurt: "Milk",
  cheese: "Cheese",
  butter: "Milk",
  cream: "Milk",
  kefir: "Milk",
  cottage: "Cheese",
  dessert: "Cookie",
  lactosefree: "Milk",
  plantmilk: "Milk",

  // Выпечка / сладкое
  bread: "Sandwich",
  baguette: "Sandwich",
  bun: "Sandwich",
  cake: "Cookie",
  cookie: "Cookie",
  pie: "Cookie",
  croissant: "Croissant",
  flatbread: "Sandwich",
  glutenfree: "Sandwich",
  cracker: "Cookie",

  // Мясо/птица
  beef: "Beef",
  pork: "PiggyBank",
  chicken: "Drumstick",
  turkey: "Drumstick",
  lamb: "Beef",
  duck: "Drumstick",
  minced: "Utensils",
  sausage: "Utensils",
  smoked: "Utensils",
  offal: "Utensils",

  // Рыба/море
  salmon: "Fish",
  tuna: "Fish",
  whitefish: "Fish",
  shellfish: "Fish",
  shrimp: "Fish",
  crab: "Fish",
  caviar: "Fish",
  "smoked-fish": "Fish",
  "dried-fish": "Fish",
  "frozen-sea": "IceCream",

  // Напитки
  water: "CupSoda",
  juice: "CupSoda",
  soda: "CupSoda",
  tea: "CupSoda",
  coffee: "Coffee",
  energy: "CupSoda",
  isotonic: "CupSoda",
  nabeer: "CupSoda",
  kombucha: "CupSoda",
  plantdrink: "CupSoda",

  // Снеки
  chips: "Cookie",
  nuts: "Cookie",
  driedfruit: "Cookie",
  chocolate: "Cookie",
  bar: "Cookie",
  popcorn: "Cookie",
  crackers: "Cookie",
  jerky: "Cookie",
  seeds: "Cookie",
  mix: "Cookie",

  // Крупы/макароны
  rice: "Wheat",
  buckwheat: "Wheat",
  oats: "Wheat",
  pasta: "Wheat",
  flour: "Wheat",
  semolina: "Wheat",
  corn: "Wheat",
  quinoa: "Wheat",
  couscous: "Wheat",
  beans: "Wheat",

  // Заморозка / готовое
  "frozen-fruit": "IceCream",
  "frozen-veg2": "IceCream",
  icecream: "IceCream",
  pelmeni: "Pizza",
  pizza: "Pizza",
  berries2: "IceCream",
  dumplings: "Pizza",
  cutlets: "Pizza",
  mixes: "IceCream",
  ready: "Pizza",

  // Общие
  utensils: "Utensils",
  box: "Box",
  folder: "Folder",
};

/** Иконка по умолчанию (если ничего не подошло) */
export const DefaultIcon = Lucide.Box;

/**
 * Возвращает компонент-иконку Lucide по нашему iconId.
 * Если не нашли — вернёт null (можно делать `getIconById(id) ?? Folder`).
 */
export function getIconById(id?: string | null): ComponentType<any> | null {
  if (!id) return null;
  const name = ICON_NAME[id];
  const Comp = (Lucide as any)?.[name];
  return (Comp as ComponentType<any>) ?? null;
}

/**
 * Удобный компонент для прямого рендера:
 * <CatalogIcon id="apple" size={18} className="..." />
 */
export function CatalogIcon({
  id,
  size = 18,
  className,
}: {
  id?: string | null;
  size?: number;
  className?: string;
}) {
  const Comp = getIconById(id) ?? DefaultIcon;
  return <Comp width={size} height={size} className={className} />;
}