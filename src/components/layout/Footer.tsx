import { Link } from "react-router-dom";
import { Instagram, Send, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#1C1A18] text-[#f5f2ed] border-t border-black/5 pt-24 pb-12">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-16">
          <div className="col-span-1 md:col-span-2">
            <Link
              to="/"
              className="text-3xl font-serif tracking-widest uppercase text-primary inline-block mb-6"
              style={{ letterSpacing: "0.2em" }}
            >
              Wine Jet Абхазия
            </Link>
            <p className="text-[#f5f2ed]/60 text-sm font-light max-w-sm font-sans">
              Бутиковая абхазская винодельня. <br />
              Создаем вина для тех, кто ценит эстетику, историю и непревзойденное качество.
            </p>
          </div>
          
          <div>
            <h4 className="text-xs uppercase tracking-widest text-[#f5f2ed] font-semibold mb-6">Навигация</h4>
            <ul className="space-y-4">
              <li>
                <Link to="/" className="text-sm text-[#f5f2ed]/60 hover:text-primary transition-colors">Главная</Link>
              </li>
              <li>
                <Link to="/story" className="text-sm text-[#f5f2ed]/60 hover:text-primary transition-colors">История</Link>
              </li>
              <li>
                <Link to="/wines" className="text-sm text-[#f5f2ed]/60 hover:text-primary transition-colors">Коллекция</Link>
              </li>
              <li>
                <Link to="/vineyards" className="text-sm text-[#f5f2ed]/60 hover:text-primary transition-colors">Виноградники</Link>
              </li>
              <li>
                <Link to="/tasting" className="text-sm text-[#f5f2ed]/60 hover:text-primary transition-colors">Дегустация</Link>
              </li>
              <li>
                <Link to="/news" className="text-sm text-[#f5f2ed]/60 hover:text-primary transition-colors">Новости</Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-[#f5f2ed]/60 hover:text-primary transition-colors">Контакты</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-widest text-[#f5f2ed] font-semibold mb-6">Связь</h4>
            <ul className="space-y-4">
              <li className="text-sm text-[#f5f2ed]/60 font-sans">Республика Абхазия</li>
              <li className="pt-4 flex items-center space-x-4">
                <a href="https://www.instagram.com/wine_jet_abkhazia/" target="_blank" rel="noopener noreferrer" className="text-[#f5f2ed]/60 hover:text-primary transition-colors"><Instagram size={18} strokeWidth={1.5} /></a>
                <a href="https://t.me/wine_jet_abkhazia" target="_blank" rel="noopener noreferrer" className="text-[#f5f2ed]/60 hover:text-primary transition-colors"><Send size={18} strokeWidth={1.5} /></a>
                <a href="https://wa.me/79407770524" target="_blank" rel="noopener noreferrer" className="text-[#f5f2ed]/60 hover:text-primary transition-colors"><Mail size={18} strokeWidth={1.5} /></a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between text-sm font-sans text-[#f5f2ed]/40">
          <p>&copy; {new Date().getFullYear()} Wine Jet Абхазия. Все права защищены.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="hover:text-[#f5f2ed]/70 transition-colors">Политика конфиденциальности</Link>
            <Link to="/terms" className="hover:text-[#f5f2ed]/70 transition-colors">Условия использования</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
