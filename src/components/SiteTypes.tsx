// src/components/SiteTypes.tsx
"use client";
import { serif } from "@/lib/fonts";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import NextImage from "next/image";
import { X, ArrowRight, CheckCircle } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";


const BG    = "#07100e";
const TEAL  = "#2dd4bf";
const WHITE = "#f4faf8";

/* ── SVG Wireframes ─────────────────────────────────────────────────────── */

function LandingVisual() {
  return (
    <svg viewBox="0 0 280 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
      <rect x="10" y="10" width="260" height="180" rx="8" stroke={WHITE} strokeOpacity="0.12" strokeWidth="1"/>
      <rect x="10" y="10" width="260" height="22" rx="8" fill={WHITE} fillOpacity="0.05"/>
      <circle cx="24" cy="21" r="3" fill={WHITE} fillOpacity="0.2"/>
      <circle cx="34" cy="21" r="3" fill={WHITE} fillOpacity="0.2"/>
      <circle cx="44" cy="21" r="3" fill={WHITE} fillOpacity="0.2"/>
      <rect x="60" y="15" width="140" height="12" rx="3" fill={WHITE} fillOpacity="0.06"/>
      <rect x="22" y="42" width="80" height="8" rx="2" fill={TEAL} fillOpacity="0.5"/>
      <rect x="22" y="54" width="140" height="14" rx="2" fill={WHITE} fillOpacity="0.18"/>
      <rect x="22" y="72" width="100" height="14" rx="2" fill={WHITE} fillOpacity="0.12"/>
      <rect x="22" y="92" width="60" height="18" rx="9" fill={TEAL} fillOpacity="0.7"/>
      <rect x="168" y="42" width="90" height="90" rx="6" fill={WHITE} fillOpacity="0.04" stroke={WHITE} strokeOpacity="0.08" strokeWidth="1"/>
      <line x1="168" y1="42" x2="258" y2="132" stroke={WHITE} strokeOpacity="0.06" strokeWidth="1"/>
      <line x1="258" y1="42" x2="168" y2="132" stroke={WHITE} strokeOpacity="0.06" strokeWidth="1"/>
      <rect x="22" y="146" width="60" height="32" rx="4" fill={WHITE} fillOpacity="0.04" stroke={WHITE} strokeOpacity="0.08" strokeWidth="1"/>
      <rect x="88" y="146" width="60" height="32" rx="4" fill={WHITE} fillOpacity="0.04" stroke={WHITE} strokeOpacity="0.08" strokeWidth="1"/>
      <rect x="154" y="146" width="60" height="32" rx="4" fill={WHITE} fillOpacity="0.04" stroke={WHITE} strokeOpacity="0.08" strokeWidth="1"/>
      <rect x="30" y="153" width="30" height="4" rx="2" fill={WHITE} fillOpacity="0.15"/>
      <rect x="96" y="153" width="30" height="4" rx="2" fill={WHITE} fillOpacity="0.15"/>
      <rect x="162" y="153" width="30" height="4" rx="2" fill={WHITE} fillOpacity="0.15"/>
    </svg>
  );
}

function CorporateVisual() {
  return (
    <svg viewBox="0 0 280 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
      <rect x="10" y="10" width="260" height="180" rx="8" stroke={WHITE} strokeOpacity="0.12" strokeWidth="1"/>
      <rect x="10" y="10" width="260" height="22" rx="8" fill={WHITE} fillOpacity="0.05"/>
      <circle cx="24" cy="21" r="3" fill={WHITE} fillOpacity="0.2"/>
      <circle cx="34" cy="21" r="3" fill={WHITE} fillOpacity="0.2"/>
      <circle cx="44" cy="21" r="3" fill={WHITE} fillOpacity="0.2"/>
      <rect x="10" y="32" width="260" height="20" fill={WHITE} fillOpacity="0.03"/>
      <rect x="20" y="37" width="36" height="6" rx="2" fill={TEAL} fillOpacity="0.4"/>
      <rect x="72" y="39" width="28" height="4" rx="2" fill={WHITE} fillOpacity="0.15"/>
      <rect x="110" y="39" width="28" height="4" rx="2" fill={WHITE} fillOpacity="0.15"/>
      <rect x="148" y="39" width="28" height="4" rx="2" fill={WHITE} fillOpacity="0.15"/>
      <rect x="230" y="37" width="32" height="8" rx="4" fill={TEAL} fillOpacity="0.5"/>
      <rect x="10" y="52" width="260" height="50" fill={WHITE} fillOpacity="0.03"/>
      <rect x="20" y="60" width="90" height="10" rx="3" fill={WHITE} fillOpacity="0.18"/>
      <rect x="20" y="74" width="130" height="6" rx="2" fill={WHITE} fillOpacity="0.09"/>
      <rect x="20" y="84" width="50" height="12" rx="6" fill={TEAL} fillOpacity="0.6"/>
      <rect x="20" y="114" width="70" height="64" rx="4" fill={WHITE} fillOpacity="0.03" stroke={WHITE} strokeOpacity="0.07" strokeWidth="1"/>
      <rect x="100" y="114" width="70" height="64" rx="4" fill={WHITE} fillOpacity="0.03" stroke={WHITE} strokeOpacity="0.07" strokeWidth="1"/>
      <rect x="180" y="114" width="70" height="64" rx="4" fill={WHITE} fillOpacity="0.03" stroke={WHITE} strokeOpacity="0.07" strokeWidth="1"/>
      <rect x="28" y="122" width="40" height="4" rx="2" fill={WHITE} fillOpacity="0.18"/>
      <rect x="108" y="122" width="40" height="4" rx="2" fill={WHITE} fillOpacity="0.18"/>
      <rect x="188" y="122" width="40" height="4" rx="2" fill={WHITE} fillOpacity="0.18"/>
      <rect x="28" y="164" width="36" height="6" rx="3" fill={TEAL} fillOpacity="0.3"/>
      <rect x="108" y="164" width="36" height="6" rx="3" fill={TEAL} fillOpacity="0.3"/>
      <rect x="188" y="164" width="36" height="6" rx="3" fill={TEAL} fillOpacity="0.3"/>
    </svg>
  );
}

function EcommerceVisual() {
  return (
    <svg viewBox="0 0 280 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
      <rect x="10" y="10" width="260" height="180" rx="8" stroke={WHITE} strokeOpacity="0.12" strokeWidth="1"/>
      <rect x="10" y="10" width="260" height="22" rx="8" fill={WHITE} fillOpacity="0.05"/>
      <circle cx="24" cy="21" r="3" fill={WHITE} fillOpacity="0.2"/>
      <circle cx="34" cy="21" r="3" fill={WHITE} fillOpacity="0.2"/>
      <circle cx="44" cy="21" r="3" fill={WHITE} fillOpacity="0.2"/>
      <rect x="10" y="32" width="260" height="18" fill={WHITE} fillOpacity="0.03"/>
      <rect x="20" y="36" width="30" height="6" rx="2" fill={TEAL} fillOpacity="0.4"/>
      <rect x="80" y="35" width="110" height="8" rx="4" fill={WHITE} fillOpacity="0.06" stroke={WHITE} strokeOpacity="0.08" strokeWidth="1"/>
      <rect x="248" y="35" width="16" height="8" rx="2" fill={WHITE} fillOpacity="0.1"/>
      <rect x="10" y="50" width="55" height="140" fill={WHITE} fillOpacity="0.02" stroke={WHITE} strokeOpacity="0.06" strokeWidth="1"/>
      <rect x="16" y="58" width="30" height="4" rx="2" fill={WHITE} fillOpacity="0.2"/>
      <rect x="16" y="66" width="38" height="3" rx="1.5" fill={WHITE} fillOpacity="0.08"/>
      <rect x="16" y="73" width="32" height="3" rx="1.5" fill={WHITE} fillOpacity="0.08"/>
      <rect x="16" y="80" width="36" height="3" rx="1.5" fill={WHITE} fillOpacity="0.08"/>
      <rect x="16" y="94" width="30" height="4" rx="2" fill={WHITE} fillOpacity="0.2"/>
      <rect x="16" y="102" width="38" height="3" rx="1.5" fill={WHITE} fillOpacity="0.08"/>
      <rect x="16" y="109" width="28" height="3" rx="1.5" fill={WHITE} fillOpacity="0.08"/>
      {[0,1,2,3].map(i => {
        const col = i % 2;
        const row = Math.floor(i / 2);
        const x = 72 + col * 98;
        const y = 52 + row * 86;
        return (
          <g key={i}>
            <rect x={x} y={y} width="90" height="78" rx="4" fill={WHITE} fillOpacity="0.03" stroke={WHITE} strokeOpacity="0.07" strokeWidth="1"/>
            <rect x={x+4} y={y+4} width="82" height="44" rx="3" fill={WHITE} fillOpacity="0.04"/>
            <line x1={x+4} y1={y+4} x2={x+86} y2={y+48} stroke={WHITE} strokeOpacity="0.05" strokeWidth="0.8"/>
            <line x1={x+86} y1={y+4} x2={x+4} y2={y+48} stroke={WHITE} strokeOpacity="0.05" strokeWidth="0.8"/>
            <rect x={x+6} y={y+52} width="48" height="5" rx="2" fill={WHITE} fillOpacity="0.15"/>
            <rect x={x+62} y={y+61} width="24" height="8" rx="4" fill={TEAL} fillOpacity="0.7"/>
          </g>
        );
      })}
    </svg>
  );
}

function BusinessCardVisual() {
  return (
    <svg viewBox="0 0 280 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
      <rect x="10" y="10" width="260" height="180" rx="8" stroke={WHITE} strokeOpacity="0.12" strokeWidth="1"/>
      <rect x="10" y="10" width="260" height="22" rx="8" fill={WHITE} fillOpacity="0.05"/>
      <circle cx="24" cy="21" r="3" fill={WHITE} fillOpacity="0.2"/>
      <circle cx="34" cy="21" r="3" fill={WHITE} fillOpacity="0.2"/>
      <circle cx="44" cy="21" r="3" fill={WHITE} fillOpacity="0.2"/>
      <rect x="60" y="15" width="140" height="12" rx="3" fill={WHITE} fillOpacity="0.06"/>
      <rect x="22" y="40" width="32" height="8" rx="2" fill={TEAL} fillOpacity="0.45"/>
      <rect x="180" y="41" width="22" height="5" rx="2" fill={WHITE} fillOpacity="0.12"/>
      <rect x="210" y="41" width="22" height="5" rx="2" fill={WHITE} fillOpacity="0.12"/>
      <rect x="240" y="39" width="24" height="9" rx="4" fill={TEAL} fillOpacity="0.5"/>
      <circle cx="60" cy="100" r="30" stroke={WHITE} strokeOpacity="0.1" strokeWidth="1" fill={WHITE} fillOpacity="0.03"/>
      <circle cx="60" cy="92" r="12" fill={WHITE} fillOpacity="0.1"/>
      <rect x="35" y="110" width="50" height="6" rx="3" fill={WHITE} fillOpacity="0.18"/>
      <rect x="40" y="120" width="40" height="4" rx="2" fill={WHITE} fillOpacity="0.08"/>
      <rect x="110" y="70" width="130" height="10" rx="3" fill={WHITE} fillOpacity="0.18"/>
      <rect x="110" y="84" width="110" height="10" rx="3" fill={WHITE} fillOpacity="0.12"/>
      <rect x="110" y="100" width="140" height="4" rx="2" fill={WHITE} fillOpacity="0.07"/>
      <rect x="110" y="108" width="120" height="4" rx="2" fill={WHITE} fillOpacity="0.07"/>
      <rect x="110" y="125" width="70" height="16" rx="8" fill={TEAL} fillOpacity="0.65"/>
      <rect x="190" y="127" width="50" height="12" rx="6" fill={WHITE} fillOpacity="0.05" stroke={WHITE} strokeOpacity="0.1" strokeWidth="1"/>
      <line x1="22" y1="152" x2="258" y2="152" stroke={WHITE} strokeOpacity="0.06"/>
      <rect x="22" y="160" width="8" height="8" rx="2" fill={TEAL} fillOpacity="0.4"/>
      <rect x="34" y="162" width="50" height="4" rx="2" fill={WHITE} fillOpacity="0.1"/>
      <rect x="110" y="160" width="8" height="8" rx="2" fill={TEAL} fillOpacity="0.4"/>
      <rect x="122" y="162" width="50" height="4" rx="2" fill={WHITE} fillOpacity="0.1"/>
      <rect x="198" y="160" width="8" height="8" rx="2" fill={TEAL} fillOpacity="0.4"/>
      <rect x="210" y="162" width="48" height="4" rx="2" fill={WHITE} fillOpacity="0.1"/>
    </svg>
  );
}

function InfoVisual() {
  return (
    <svg viewBox="0 0 280 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
      <rect x="10" y="10" width="260" height="180" rx="8" stroke={WHITE} strokeOpacity="0.12" strokeWidth="1"/>
      <rect x="10" y="10" width="260" height="22" rx="8" fill={WHITE} fillOpacity="0.05"/>
      <circle cx="24" cy="21" r="3" fill={WHITE} fillOpacity="0.2"/>
      <circle cx="34" cy="21" r="3" fill={WHITE} fillOpacity="0.2"/>
      <circle cx="44" cy="21" r="3" fill={WHITE} fillOpacity="0.2"/>
      <rect x="10" y="32" width="260" height="16" fill={WHITE} fillOpacity="0.03"/>
      <rect x="20" y="36" width="24" height="5" rx="2" fill={TEAL} fillOpacity="0.5"/>
      <rect x="52" y="36" width="28" height="5" rx="2" fill={WHITE} fillOpacity="0.1"/>
      <rect x="88" y="36" width="24" height="5" rx="2" fill={WHITE} fillOpacity="0.1"/>
      <rect x="120" y="36" width="32" height="5" rx="2" fill={WHITE} fillOpacity="0.1"/>
      <rect x="10" y="48" width="160" height="80" rx="0" fill={WHITE} fillOpacity="0.03" stroke={WHITE} strokeOpacity="0.06" strokeWidth="1"/>
      <rect x="16" y="54" width="60" height="4" rx="2" fill={TEAL} fillOpacity="0.4"/>
      <rect x="16" y="62" width="130" height="7" rx="2" fill={WHITE} fillOpacity="0.2"/>
      <rect x="16" y="73" width="110" height="7" rx="2" fill={WHITE} fillOpacity="0.13"/>
      <rect x="16" y="84" width="140" height="3.5" rx="1.5" fill={WHITE} fillOpacity="0.07"/>
      <rect x="16" y="91" width="120" height="3.5" rx="1.5" fill={WHITE} fillOpacity="0.07"/>
      <rect x="16" y="98" width="90" height="3.5" rx="1.5" fill={WHITE} fillOpacity="0.07"/>
      <rect x="16" y="112" width="40" height="8" rx="4" fill={TEAL} fillOpacity="0.4"/>
      <rect x="176" y="48" width="94" height="80" rx="0" fill={WHITE} fillOpacity="0.02" stroke={WHITE} strokeOpacity="0.06" strokeWidth="1"/>
      <rect x="182" y="54" width="50" height="4" rx="2" fill={WHITE} fillOpacity="0.15"/>
      <rect x="182" y="64" width="78" height="3" rx="1.5" fill={WHITE} fillOpacity="0.07"/>
      <rect x="182" y="71" width="64" height="3" rx="1.5" fill={WHITE} fillOpacity="0.07"/>
      <rect x="182" y="78" width="70" height="3" rx="1.5" fill={WHITE} fillOpacity="0.07"/>
      <rect x="182" y="88" width="50" height="4" rx="2" fill={WHITE} fillOpacity="0.15"/>
      <rect x="182" y="98" width="78" height="3" rx="1.5" fill={WHITE} fillOpacity="0.07"/>
      <rect x="182" y="105" width="60" height="3" rx="1.5" fill={WHITE} fillOpacity="0.07"/>
      {[0,1,2].map(i => (
        <g key={i}>
          <rect x="10" y={138 + i * 18} width="260" height="14" rx="3" fill={WHITE} fillOpacity="0.02" stroke={WHITE} strokeOpacity="0.05" strokeWidth="1"/>
          <rect x="16" y={142 + i * 18} width="36" height="4" rx="2" fill={TEAL} fillOpacity="0.25"/>
          <rect x="60" y={142 + i * 18} width="110" height="4" rx="2" fill={WHITE} fillOpacity="0.12"/>
        </g>
      ))}
    </svg>
  );
}

function PortfolioVisual() {
  return (
    <svg viewBox="0 0 280 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
      <rect x="10" y="10" width="260" height="180" rx="8" stroke={WHITE} strokeOpacity="0.12" strokeWidth="1"/>
      <rect x="10" y="10" width="260" height="22" rx="8" fill={WHITE} fillOpacity="0.05"/>
      <circle cx="24" cy="21" r="3" fill={WHITE} fillOpacity="0.2"/>
      <circle cx="34" cy="21" r="3" fill={WHITE} fillOpacity="0.2"/>
      <circle cx="44" cy="21" r="3" fill={WHITE} fillOpacity="0.2"/>
      <rect x="18" y="36" width="74" height="60" rx="4" fill={WHITE} fillOpacity="0.04" stroke={WHITE} strokeOpacity="0.07" strokeWidth="1"/>
      <line x1="18" y1="36" x2="92" y2="96" stroke={WHITE} strokeOpacity="0.04" strokeWidth="0.8"/>
      <line x1="92" y1="36" x2="18" y2="96" stroke={WHITE} strokeOpacity="0.04" strokeWidth="0.8"/>
      <rect x="18" y="100" width="74" height="40" rx="4" fill={WHITE} fillOpacity="0.03" stroke={WHITE} strokeOpacity="0.07" strokeWidth="1"/>
      <line x1="18" y1="100" x2="92" y2="140" stroke={WHITE} strokeOpacity="0.04" strokeWidth="0.8"/>
      <line x1="92" y1="100" x2="18" y2="140" stroke={WHITE} strokeOpacity="0.04" strokeWidth="0.8"/>
      <rect x="100" y="36" width="74" height="40" rx="4" fill={WHITE} fillOpacity="0.04" stroke={TEAL} strokeOpacity="0.2" strokeWidth="1"/>
      <line x1="100" y1="36" x2="174" y2="76" stroke={TEAL} strokeOpacity="0.08" strokeWidth="0.8"/>
      <line x1="174" y1="36" x2="100" y2="76" stroke={TEAL} strokeOpacity="0.08" strokeWidth="0.8"/>
      <rect x="100" y="80" width="74" height="60" rx="4" fill={WHITE} fillOpacity="0.03" stroke={WHITE} strokeOpacity="0.07" strokeWidth="1"/>
      <line x1="100" y1="80" x2="174" y2="140" stroke={WHITE} strokeOpacity="0.04" strokeWidth="0.8"/>
      <line x1="174" y1="80" x2="100" y2="140" stroke={WHITE} strokeOpacity="0.04" strokeWidth="0.8"/>
      <rect x="182" y="36" width="74" height="50" rx="4" fill={WHITE} fillOpacity="0.04" stroke={WHITE} strokeOpacity="0.07" strokeWidth="1"/>
      <line x1="182" y1="36" x2="256" y2="86" stroke={WHITE} strokeOpacity="0.04" strokeWidth="0.8"/>
      <line x1="256" y1="36" x2="182" y2="86" stroke={WHITE} strokeOpacity="0.04" strokeWidth="0.8"/>
      <rect x="182" y="90" width="74" height="50" rx="4" fill={WHITE} fillOpacity="0.03" stroke={WHITE} strokeOpacity="0.07" strokeWidth="1"/>
      <line x1="182" y1="90" x2="256" y2="140" stroke={WHITE} strokeOpacity="0.04" strokeWidth="0.8"/>
      <line x1="256" y1="90" x2="182" y2="140" stroke={WHITE} strokeOpacity="0.04" strokeWidth="0.8"/>
      <rect x="18" y="152" width="38" height="8" rx="4" fill={TEAL} fillOpacity="0.2" stroke={TEAL} strokeOpacity="0.3" strokeWidth="0.8"/>
      <rect x="62" y="152" width="38" height="8" rx="4" fill={WHITE} fillOpacity="0.04" stroke={WHITE} strokeOpacity="0.08" strokeWidth="0.8"/>
      <rect x="106" y="152" width="38" height="8" rx="4" fill={WHITE} fillOpacity="0.04" stroke={WHITE} strokeOpacity="0.08" strokeWidth="0.8"/>
      <rect x="22" y="154.5" width="28" height="3" rx="1.5" fill={TEAL} fillOpacity="0.6"/>
      <rect x="66" y="154.5" width="28" height="3" rx="1.5" fill={WHITE} fillOpacity="0.2"/>
      <rect x="110" y="154.5" width="28" height="3" rx="1.5" fill={WHITE} fillOpacity="0.2"/>
      <rect x="196" y="150" width="72" height="14" rx="7" fill={TEAL} fillOpacity="0.6"/>
      <rect x="208" y="154" width="48" height="4" rx="2" fill={BG} fillOpacity="0.4"/>
    </svg>
  );
}

/* ── Data ───────────────────────────────────────────────────────────────── */
type ColData = {
  fig: string;
  title: string;
  desc: string;
  tags: string[];
  price: string;
  priceEn: string;
  timeline: string;
  useFor: string[];
  steps: string[];
  image: string;
};

const ROWS: Record<"ru"|"en", ColData[][]> = {
  ru: [
    [
      {
        fig: "01 · LANDING", title: "Лендинг",
        desc: "Один экран — одна цель. Конвертируем трафик в заявки: сторителлинг, A/B-тесты и интеграция с рекламными кабинетами.",
        tags: ["Конверсия", "A/B", "Реклама"],
        price: "от 150 000 ₽", priceEn: "from $1 700", timeline: "1–2 нед",
        useFor: ["Прелонч и релиз продукта", "Рекламные кампании", "Сбор лидов"],
        steps: ["Сторителлинг", "Анимации секций", "Формы и интеграции", "Запуск и оптимизация"],
        image: "/site_lend.png",
      },
      {
        fig: "02 · CORPORATE", title: "Корпоративный сайт",
        desc: "Полноценный голос компании: услуги, команда, кейсы и блог под одной CMS. Редакторы правят без программиста.",
        tags: ["Б2Б", "CMS", "i18n"],
        price: "от 420 000 ₽", priceEn: "from $4 700", timeline: "3–6 нед",
        useFor: ["Б2Б-компании и холдинги", "Мультиязычные сайты", "Контент-маркетинг и PR"],
        steps: ["Информационная архитектура", "Дизайн-система", "Интеграция CMS/поиска", "Релиз и SEO-тюнинг"],
        image: "/site_corp.png",
      },
      {
        fig: "03 · ECOMMERCE", title: "Интернет-магазин",
        desc: "Магазин, который продаёт: умный каталог, быстрый чекаут, оплаты и склад. Страницы грузятся за ≤1 с.",
        tags: ["D2C", "Оплаты", "CRM"],
        price: "от 720 000 ₽", priceEn: "from $8 000", timeline: "4–8 нед",
        useFor: ["D2C-бренды", "Каталоги с вариациями и фильтрами", "Промо и система скидок"],
        steps: ["Схема каталога и склада", "UX корзины и чекаута", "Интеграции и оплаты", "Запуск и A/B-тесты"],
        image: "/site_shop.png",
      },
    ],
    [
      {
        fig: "04 · CARD", title: "Сайт-визитка",
        desc: "Быстрый старт за 1–2 нед. Понятная структура, форма заявки и аналитика — всё чтобы начать получать клиентов.",
        tags: ["Быстрый старт", "Эксперт"],
        price: "от 80 000 ₽", priceEn: "from $900", timeline: "1–2 нед",
        useFor: ["Быстро «выйти в онлайн»", "Презентация услуг и компетенций", "Контакты и форма заявки"],
        steps: ["Бриф и структура", "Дизайн ключевых экранов", "Верстка и интеграция", "Запуск и аналитика"],
        image: "/site_visio.png",
      },
      {
        fig: "05 · MEDIA", title: "Инфо-портал",
        desc: "Контент работает на вас: SEO-структура, удобный редактор, подписки и рекомендации. Индексируется с первого дня.",
        tags: ["Контент", "CMS", "SEO"],
        price: "от 280 000 ₽", priceEn: "from $3 100", timeline: "2–4 нед",
        useFor: ["Медиа и блоги", "Документации и гайдовые порталы", "Контент-маркетинг"],
        steps: ["Контент-модель", "Редактор и медиатека", "Поиск и рекомендации", "SEO и аналитика"],
        image: "/site_info.png",
      },
      {
        fig: "06 · PORTFOLIO", title: "Портфолио",
        desc: "Продаёт без слов: детальные кейсы, галерея работ и отзывы. Первое впечатление о вас — формируем вместе.",
        tags: ["Агентство", "Кейсы"],
        price: "от 120 000 ₽", priceEn: "from $1 300", timeline: "1–3 нед",
        useFor: ["Эксперты и персональный бренд", "Студии и агентства", "Творческие портфолио"],
        steps: ["Карточки кейсов", "Детальные страницы", "Импорт и интеграции", "Оптимизация скорости"],
        image: "/site_port.png",
      },
    ],
  ],
  en: [
    [
      {
        fig: "01 · LANDING", title: "Landing page",
        desc: "One page, one goal. We turn traffic into leads: storytelling, A/B tests and ad platform integrations.",
        tags: ["Conversion", "A/B", "Ads"],
        price: "от 150 000 ₽", priceEn: "from $1 700", timeline: "1–2 wks",
        useFor: ["Pre-launch and product release", "Ad campaigns", "Lead generation"],
        steps: ["Storytelling", "Section animations", "Forms & integrations", "Launch & optimization"],
        image: "/site_lend.png",
      },
      {
        fig: "02 · CORPORATE", title: "Corporate website",
        desc: "Your company's full voice: services, team, cases and blog under one CMS. Editors update without a developer.",
        tags: ["B2B", "CMS", "i18n"],
        price: "от 420 000 ₽", priceEn: "from $4 700", timeline: "3–6 wks",
        useFor: ["B2B companies and holdings", "Multilingual websites", "Content marketing and PR"],
        steps: ["Information architecture", "Design system", "CMS/search integration", "Release & SEO tuning"],
        image: "/site_corp.png",
      },
      {
        fig: "03 · ECOMMERCE", title: "Online store",
        desc: "A store that sells: smart catalog, fast checkout, payments and warehouse sync. Pages load in ≤1 s.",
        tags: ["D2C", "Payments", "CRM"],
        price: "от 720 000 ₽", priceEn: "from $8 000", timeline: "4–8 wks",
        useFor: ["D2C brands", "Catalogs with variants and filters", "Promos and discount systems"],
        steps: ["Catalog & inventory schema", "Cart & checkout UX", "Integrations & payments", "Launch & A/B tests"],
        image: "/site_shop.png",
      },
    ],
    [
      {
        fig: "04 · CARD", title: "Business card",
        desc: "Online in 1–2 weeks. Clear structure, inquiry form and analytics — everything to start getting clients.",
        tags: ["Quick start", "Expert"],
        price: "от 80 000 ₽", priceEn: "from $900", timeline: "1–2 wks",
        useFor: ["Get online quickly", "Present services and expertise", "Contacts and inquiry form"],
        steps: ["Brief & structure", "Key screen design", "Layout & integration", "Launch & analytics"],
        image: "/site_visio.png",
      },
      {
        fig: "05 · MEDIA", title: "Info portal",
        desc: "Content that works for you: SEO structure, easy editor, subscriptions and recommendations. Indexed from day one.",
        tags: ["Content", "CMS", "SEO"],
        price: "от 280 000 ₽", priceEn: "from $3 100", timeline: "2–4 wks",
        useFor: ["Media and blogs", "Documentation and guide portals", "Content marketing"],
        steps: ["Content model", "Editor & media library", "Search & recommendations", "SEO & analytics"],
        image: "/site_info.png",
      },
      {
        fig: "06 · PORTFOLIO", title: "Portfolio",
        desc: "Sells without words: detailed cases, work gallery and testimonials. Your first impression — crafted together.",
        tags: ["Agency", "Cases"],
        price: "от 120 000 ₽", priceEn: "from $1 300", timeline: "1–3 wks",
        useFor: ["Experts and personal brand", "Studios and agencies", "Creative portfolios"],
        steps: ["Case cards", "Detail pages", "Import & integrations", "Speed optimization"],
        image: "/site_port.png",
      },
    ],
  ],
};

const ROW_VISUALS = [
  [LandingVisual, CorporateVisual, EcommerceVisual],
  [BusinessCardVisual, InfoVisual, PortfolioVisual],
];

/* ── Modal (Linear Tech Specs style) ───────────────────────────────────── */
function SiteModal({ item, onClose, isEn, isMobile }: { item: ColData | null; onClose: () => void; isEn: boolean; isMobile: boolean }) {
  const [mounted, setMounted] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!item) return;
    const el = document.documentElement;
    const prev = el.style.overflow;
    el.style.overflow = "hidden";
    setTimeout(() => panelRef.current?.focus({ preventScroll: true }), 0);
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => {
      el.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [item, onClose]);

  const figToKind = useCallback((fig: string): string => {
    if (fig.includes("LANDING"))   return "landing";
    if (fig.includes("CORPORATE")) return "corporate";
    if (fig.includes("ECOMMERCE")) return "ecommerce";
    if (fig.includes("CARD"))      return "business";
    if (fig.includes("INFO"))      return "content";
    if (fig.includes("PORTFOLIO")) return "portfolio";
    return "landing";
  }, []);

  if (!mounted) return null;

  const jumpClose = (hash: string) => {
    const kind = item ? figToKind(item.fig) : undefined;
    onClose();
    setTimeout(() => {
      if (kind) {
        if (hash === "calculator") {
          window.dispatchEvent(new CustomEvent("calc-prefill", { detail: { kind } }));
        } else if (hash === "contact") {
          window.dispatchEvent(new CustomEvent("contact-kind-prefill", { detail: { kind } }));
        }
      }
      document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
    }, 300);
  };

  /* fig "01 · LANDING" → "1.1" style version number */
  const figNum = item ? item.fig.split("·")[0].trim().replace(/^0/, "") + ".0" : "";

  return createPortal(
    <AnimatePresence>
      {item && (
        <>
          {/* backdrop */}
          <motion.div
            key="bd"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            style={{ position: "fixed", inset: 0, zIndex: 998, background: "rgba(4,10,9,0.7)", backdropFilter: "blur(6px)" }}
          />

          {/* panel */}
          <motion.div
            key="panel"
            ref={panelRef}
            tabIndex={-1}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            role="dialog" aria-modal="true"
            style={{
              position: "fixed", top: 0, right: 0, bottom: 0, zIndex: 999,
              width: "min(560px, 100vw)",
              background: "#101f1c",
              borderLeft: "1px solid rgba(255,255,255,0.07)",
              display: "flex", flexDirection: "column",
              overflowY: "hidden",
            }}
          >
            {/* sticky top bar */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "0 24px",
              height: 52,
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              flexShrink: 0,
              background: "#101f1c",
            }}>
              <span style={{
                fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase",
                color: "rgba(244,250,248,0.35)", fontWeight: 500,
              }}>
                {isEn ? "Tech Specs" : "Характеристики"}
              </span>
              <button
                onClick={onClose}
                style={{
                  width: 32, height: 32, borderRadius: "50%", border: "none",
                  background: "rgba(255,255,255,0.08)", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "rgba(244,250,248,0.6)",
                }}
              >
                <X size={15}/>
              </button>
            </div>

            {/* scrollable content */}
            <div style={{ overflowY: "auto", flex: 1 }}>
              <div style={{ padding: isMobile ? "24px 20px 40px" : "32px 32px 48px" }}>

                {/* version + title */}
                <div style={{ marginBottom: 32 }}>
                  <div style={{ fontSize: 13, color: "rgba(244,250,248,0.3)", marginBottom: 10 }}>{figNum}</div>
                  <h2
                    className={serif.className}
                    style={{ margin: 0, fontSize: "clamp(2rem, 4vw, 2.8rem)", fontWeight: 400, color: WHITE, letterSpacing: "-0.03em", lineHeight: 1.1 }}
                  >
                    {item.title}
                  </h2>
                </div>

                {/* Overview */}
                <div style={{ marginBottom: 32 }}>
                  <h3 style={{ margin: "0 0 12px", fontSize: 18, fontWeight: 600, color: WHITE }}>
                    {isEn ? "Overview" : "Обзор"}
                  </h3>
                  <p style={{ margin: 0, fontSize: 14, lineHeight: 1.8, color: "rgba(244,250,248,0.55)" }}>
                    {item.desc}
                  </p>
                </div>


                {/* Use cases section */}
                <div style={{ marginBottom: 36 }}>
                  <div style={{
                    fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase",
                    color: "rgba(244,250,248,0.3)", marginBottom: 16, fontWeight: 500,
                  }}>
                    {isEn ? "Use cases" : "Сценарии применения"}
                  </div>
                  <h3 style={{ margin: "0 0 12px", fontSize: 18, fontWeight: 600, color: WHITE }}>
                    {isEn ? "Suitable for" : "Подходит для"}
                  </h3>
                  <p style={{ margin: "0 0 16px", fontSize: 14, lineHeight: 1.8, color: "rgba(244,250,248,0.45)" }}>
                    {isEn
                      ? "This format works best for the following business goals:"
                      : "Этот формат лучше всего работает для следующих бизнес-задач:"}
                  </p>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr>
                        <th style={{ textAlign: "left", fontSize: 12, color: "rgba(244,250,248,0.35)", fontWeight: 500, padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                          {isEn ? "Scenario" : "Сценарий"}
                        </th>
                        <th style={{ textAlign: "left", fontSize: 12, color: "rgba(244,250,248,0.35)", fontWeight: 500, padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                          {isEn ? "Description" : "Описание"}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {item.useFor.map((u, i) => (
                        <tr key={i}>
                          <td style={{ padding: "10px 12px 10px 0", fontSize: 13, color: "rgba(244,250,248,0.7)", borderBottom: "1px solid rgba(255,255,255,0.04)", verticalAlign: "top", display: "flex", alignItems: "center", gap: 8 }}>
                            <CheckCircle size={13} style={{ color: TEAL, flexShrink: 0, marginTop: 1 }}/> {u}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Work stages */}
                <div style={{ marginBottom: 36 }}>
                  <div style={{
                    fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase",
                    color: "rgba(244,250,248,0.3)", marginBottom: 16, fontWeight: 500,
                  }}>
                    {isEn ? "Process" : "Процесс"}
                  </div>
                  <h3 style={{ margin: "0 0 16px", fontSize: 18, fontWeight: 600, color: WHITE }}>
                    {isEn ? "Work stages" : "Этапы работы"}
                  </h3>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr>
                        <th style={{ textAlign: "left", fontSize: 12, color: "rgba(244,250,248,0.35)", fontWeight: 500, padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.06)", width: 40 }}>#</th>
                        <th style={{ textAlign: "left", fontSize: 12, color: "rgba(244,250,248,0.35)", fontWeight: 500, padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                          {isEn ? "Stage" : "Этап"}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {item.steps.map((s, i) => (
                        <tr key={i}>
                          <td style={{ padding: "10px 0", fontSize: 11, fontFamily: "monospace", color: TEAL, borderBottom: "1px solid rgba(255,255,255,0.04)", verticalAlign: "top" }}>
                            {String(i + 1).padStart(2, "0")}
                          </td>
                          <td style={{ padding: "10px 0 10px 12px", fontSize: 13, color: "rgba(244,250,248,0.6)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                            {s}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Budget */}
                <div style={{ marginBottom: 40 }}>
                  <div style={{
                    fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase",
                    color: "rgba(244,250,248,0.3)", marginBottom: 16, fontWeight: 500,
                  }}>
                    {isEn ? "Budget" : "Бюджет"}
                  </div>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <tbody>
                      <tr>
                        <td style={{ padding: "10px 0", fontSize: 13, color: "rgba(244,250,248,0.4)", borderBottom: "1px solid rgba(255,255,255,0.04)", width: "40%" }}>
                          {isEn ? "Price" : "Стоимость"}
                        </td>
                        <td style={{ padding: "10px 0", fontSize: 14, fontWeight: 600, color: TEAL, borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                          {item.price} <span style={{ fontSize: 12, fontWeight: 400, color: "rgba(244,250,248,0.3)", marginLeft: 6 }}>{item.priceEn}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style={{ padding: "10px 0", fontSize: 13, color: "rgba(244,250,248,0.4)" }}>
                          {isEn ? "Timeline" : "Срок"}
                        </td>
                        <td style={{ padding: "10px 0", fontSize: 14, fontWeight: 600, color: WHITE }}>
                          {item.timeline}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* CTAs */}
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <button
                    onClick={() => jumpClose("contact")}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                      borderRadius: 10, padding: "14px 20px", border: "none", cursor: "pointer",
                      background: TEAL, color: BG, fontSize: 14, fontWeight: 600,
                    }}
                  >
                    {isEn ? "Discuss the project" : "Обсудить проект"}
                    <ArrowRight size={15}/>
                  </button>
                  <button
                    onClick={() => jumpClose("calculator")}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "center",
                      borderRadius: 10, padding: "14px 20px", cursor: "pointer",
                      background: "rgba(255,255,255,0.04)", fontSize: 14, fontWeight: 500,
                      border: "1px solid rgba(255,255,255,0.1)", color: "rgba(244,250,248,0.55)",
                    }}
                  >
                    {isEn ? "Calculate cost" : "Рассчитать стоимость"}
                  </button>
                </div>

              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}

/* ── Component ──────────────────────────────────────────────────────────── */
export default function SiteTypes() {
  const { locale } = useI18n();
  const isEn = locale === "en";
  const rows = ROWS[isEn ? "en" : "ru"];
  const label = isEn ? "Site types" : "Типы сайтов";
  const titleLines = isEn ? ["Choose a format", "for your needs"] : ["Выберите формат", "под вашу задачу"];
  const moreLabel = isEn ? "Learn more →" : "Подробнее →";

  const [hovered, setHovered] = useState<string | null>(null);
  const [modal, setModal] = useState<ColData | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <section id="types" style={{ background: BG, padding: isMobile ? "120px 0 60px" : "160px 0 80px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: isMobile ? "0 20px" : "0 40px" }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginBottom: 64 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <motion.div
              style={{ height: 2, background: TEAL }}
              initial={{ width: 0 }}
              whileInView={{ width: 20 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            />
            <span style={{ fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", fontWeight: 500, color: TEAL }}>
              {label}
            </span>
          </div>
          {/* Первый блок страницы /sites, поэтому здесь h1: прежний h1 жил
              в SiteIntro, который со страницы убран. */}
          <h1
            className={serif.className}
            style={{ margin: 0, fontWeight: 400, lineHeight: 0.92, letterSpacing: "-0.04em" }}
          >
            <span style={{ display: "block", fontSize: "clamp(2.4rem, 6vw, 6rem)", color: TEAL }}>
              {titleLines[0]}
            </span>
            <span style={{ display: "block", fontSize: "clamp(2.4rem, 6vw, 6rem)", color: WHITE }}>
              {titleLines[1]}
            </span>
          </h1>
        </motion.div>

        {/* Two rows */}
        {rows.map((row, rowIdx) => {
          const visuals = ROW_VISUALS[rowIdx];
          const isLastRow = rowIdx === rows.length - 1;
          return (
            <motion.div
              key={rowIdx}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.05 + rowIdx * 0.1 }}
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
                gap: isMobile ? 48 : 0,
                marginBottom: isLastRow ? 0 : (isMobile ? 48 : 64),
                paddingBottom: isLastRow ? 0 : (isMobile ? 48 : 64),
                borderBottom: isLastRow ? "none" : "1px solid rgba(255,255,255,0.06)",
              }}
            >
              {row.map((col, i) => {
                const Visual = visuals[i];
                const isLast = i === row.length - 1;
                const key = `${rowIdx}-${i}`;
                const isHovered = hovered === key;
                const anyHovered = hovered !== null;
                const sectionId = col.fig.includes("LANDING") ? "landing" : col.fig.includes("CORPORATE") ? "corporate" : col.fig.includes("ECOMMERCE") ? "ecommerce" : undefined;
                return (
                  <div
                    key={col.fig}
                    id={sectionId}
                    onMouseEnter={() => setHovered(key)}
                    onMouseLeave={() => setHovered(null)}
                    onClick={() => setModal(col)}
                    style={{
                      borderRight: (isMobile || isLast) ? "none" : "1px solid rgba(255,255,255,0.08)",
                      paddingLeft: (isMobile || i === 0) ? 0 : 44,
                      paddingRight: (isMobile || isLast) ? 0 : 44,
                      display: "flex",
                      flexDirection: "column",
                      cursor: "pointer",
                      transition: "opacity 0.3s ease",
                      opacity: anyHovered ? (isHovered ? 1 : 0.4) : 1,
                    }}
                  >
                    {/* FIG label */}
                    <div style={{ fontSize: 10, letterSpacing: "0.2em", color: TEAL, fontWeight: 500, marginBottom: 28, fontFamily: "monospace" }}>
                      {col.fig}
                    </div>

                    {/* Visual */}
                    <div style={{
                      marginBottom: 28,
                      height: 160,
                      background: "rgba(255,255,255,0.02)",
                      border: `1px solid ${isHovered ? TEAL + "40" : "rgba(255,255,255,0.07)"}`,
                      borderRadius: 8,
                      overflow: "hidden",
                      padding: 4,
                      transition: "border-color 0.3s ease",
                    }}>
                      <Visual />
                    </div>

                    {/* Title */}
                    <h3 style={{
                      margin: "0 0 10px",
                      fontSize: "clamp(1.05rem, 1.6vw, 1.35rem)",
                      fontWeight: 600,
                      color: isHovered ? TEAL : WHITE,
                      letterSpacing: "-0.02em",
                      transition: "color 0.3s ease",
                    }}>
                      {col.title}
                    </h3>

                    {/* Description */}
                    <p style={{ margin: "0 0 18px", fontSize: 14, lineHeight: 1.65, color: "rgba(244,250,248,0.45)", flex: 1 }}>
                      {col.desc}
                    </p>

                    {/* Tags */}
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {col.tags.map(tag => (
                        <span key={tag} style={{
                          fontSize: 10, padding: "3px 10px", borderRadius: 99,
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          color: "rgba(244,250,248,0.45)",
                          letterSpacing: "0.05em",
                        }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </motion.div>
          );
        })}


      </div>

      <SiteModal item={modal} onClose={() => setModal(null)} isEn={isEn} isMobile={isMobile} />
    </section>
  );
}
