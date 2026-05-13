/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { Layout } from "./components/layout/Layout";
import { ScrollToTop } from "./components/ScrollToTop";
import { Home } from "./pages/Home";
import { Wines } from "./pages/Wines";
import { Tasting } from "./pages/Tasting";
import { Story } from "./pages/Story";
import { Vineyards } from "./pages/Vineyards";
import { News } from "./pages/News";
import { NewsArticle } from "./pages/NewsArticle";
import { AdminPanel } from "./pages/AdminPanel";
import { OrderWine } from "./pages/OrderWine";
import { Privacy } from "./pages/Privacy";
import { Terms } from "./pages/Terms";
import { AuthProvider } from "./context/AuthContext";

import { Contact } from "./pages/Contact";

const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="flex items-center justify-center min-h-[70vh] px-6">
    <div className="text-center">
      <h1 className="text-4xl md:text-6xl font-serif mb-6">{title}</h1>
      <p className="text-foreground/50 font-sans tracking-widest uppercase text-xs">Страница в разработке</p>
    </div>
  </div>
);

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="wines" element={<Wines />} />
            <Route path="order/:id" element={<OrderWine />} />
            <Route path="story" element={<Story />} />
            <Route path="vineyards" element={<Vineyards />} />
            <Route path="news" element={<News />} />
            <Route path="news/:id" element={<NewsArticle />} />
            <Route path="club" element={<PlaceholderPage title="Закрытый клуб" />} />
            <Route path="tasting" element={<Tasting />} />
            <Route path="contact" element={<Contact />} />
            <Route path="privacy" element={<Privacy />} />
            <Route path="terms" element={<Terms />} />
            <Route path="admin" element={<AdminPanel />} />
            <Route path="*" element={<PlaceholderPage title="Страница не найдена" />} />
          </Route>
        </Routes>
      </Router>
      <Analytics />
    </AuthProvider>
  );
}
