import { useState } from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { ArrowLeft, Instagram, Send, Mail } from "lucide-react";

export function Contact() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value.replace(/\D/g, "");
    let formatted = "";

    if (!input) {
      if (e.target.value === "+") {
        setPhone("+7 ");
        return;
      }
      setPhone("");
      return;
    }

    if (input[0] === "8" || input[0] === "7") {
      input = input.slice(1);
    }

    formatted = "+7";
    
    if (input.length > 0) {
      formatted += ` (${input.substring(0, 3)}`;
    }
    if (input.length >= 3) {
      formatted += `) ${input.substring(3, 6)}`;
    }
    if (input.length >= 6) {
      formatted += `-${input.substring(6, 8)}`;
    }
    if (input.length >= 8) {
      formatted += `-${input.substring(8, 10)}`;
    }
    
    setPhone(formatted);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Кнопка Отправить пока работает как заглушка. Ваше сообщение было бы успешно отправлено!");
    setName("");
    setPhone("");
    setMessage("");
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pt-32 pb-24 min-h-screen container mx-auto px-6 md:px-12 max-w-4xl"
    >
      <Link to="/" className="text-foreground/60 hover:text-primary transition-colors uppercase text-xs tracking-widest inline-flex items-center space-x-2 mb-12">
        <ArrowLeft size={14} />
        <span>На главную</span>
      </Link>
      
      <h1 className="text-4xl md:text-5xl font-serif text-foreground mb-12">
        Контакты
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
        <div>
          <h2 className="text-2xl font-serif text-foreground mb-6">Свяжитесь с нами</h2>
          <p className="text-foreground/70 font-sans leading-relaxed mb-8">
            Если у вас возникли вопросы о наших винах, виноградниках или вы хотите забронировать дегустацию, заполните форму. Мы ответим вам в ближайшее время.
          </p>
        </div>

        <div>
          <form onSubmit={handleSubmit} className="space-y-6 bg-secondary/10 p-8 border border-black/5">
            <div>
              <label htmlFor="name" className="block text-xs uppercase tracking-widest text-foreground/50 mb-2">Имя</label>
              <input 
                type="text" 
                id="name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-transparent border-b border-black/20 pb-2 text-foreground focus:outline-none focus:border-primary transition-colors"
                required
                placeholder="Иван Иванов"
              />
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-xs uppercase tracking-widest text-foreground/50 mb-2">Номер телефона</label>
              <input 
                type="tel" 
                id="phone" 
                value={phone}
                onChange={handlePhoneChange}
                className="w-full bg-transparent border-b border-black/20 pb-2 text-foreground focus:outline-none focus:border-primary transition-colors"
                required
                placeholder="+7 (___) ___-__-__"
              />
            </div>
            
            <div>
              <label htmlFor="message" className="block text-xs uppercase tracking-widest text-foreground/50 mb-2">Сообщение</label>
              <textarea 
                id="message" 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="w-full bg-transparent border-b border-black/20 pb-2 text-foreground focus:outline-none focus:border-primary transition-colors resize-none"
                required
                placeholder="Ваше сообщение..."
              ></textarea>
            </div>
            
            <button 
              type="submit" 
              className="w-full bg-foreground text-background py-4 uppercase text-xs tracking-widest hover:bg-primary transition-colors mt-4"
            >
              Отправить
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-black/10 pt-16">
        <h3 className="text-xl font-serif text-foreground mb-8 text-center">Наши социальные сети и мессенджеры</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
          <a 
            href="https://www.instagram.com/wine_jet_abkhazia/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex flex-col items-center p-6 bg-secondary/5 border border-black/5 hover:border-primary transition-all group"
          >
            <div className="w-16 h-16 mb-4 flex items-center justify-center bg-foreground text-background rounded-full group-hover:bg-primary transition-colors">
              <Instagram size={28} strokeWidth={1.5} />
            </div>
            <span className="font-serif text-xl mb-2 group-hover:text-primary transition-colors">Instagram</span>
            <span className="text-sm text-foreground/60 text-center">Следите за нашими новостями и визуальной эстетикой винодельни</span>
          </a>
          
          <a 
            href="https://t.me/wine_jet_abkhazia" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex flex-col items-center p-6 bg-secondary/5 border border-black/5 hover:border-primary transition-all group"
          >
            <div className="w-16 h-16 mb-4 flex items-center justify-center bg-foreground text-background rounded-full group-hover:bg-primary transition-colors">
              <Send size={28} strokeWidth={1.5} />
            </div>
            <span className="font-serif text-xl mb-2 group-hover:text-primary transition-colors">Telegram</span>
            <span className="text-sm text-foreground/60 text-center">Наш канал с актуальной информацией и анонсами мероприятий</span>
          </a>

          <a 
            href="https://wa.me/79407770524" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex flex-col items-center p-6 bg-secondary/5 border border-black/5 hover:border-primary transition-all group"
          >
            <div className="w-16 h-16 mb-4 flex items-center justify-center bg-foreground text-background rounded-full group-hover:bg-primary transition-colors">
              <Mail size={28} strokeWidth={1.5} />
            </div>
            <span className="font-serif text-xl mb-2 group-hover:text-primary transition-colors">WhatsApp</span>
            <span className="text-sm text-foreground/60 text-center">Быстрая связь по вопросам дегустаций и заказа вин</span>
          </a>
        </div>
      </div>
    </motion.div>
  );
}
