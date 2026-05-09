import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft, Minus, Plus } from "lucide-react";
import { supabase, rowToWine, Wine } from "../supabase";

export function OrderWine() {
  const { id } = useParams<{ id: string }>();
  const [wine, setWine] = useState<Wine | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchWine = async () => {
      if (!id) return;
      try {
        const { data, error } = await supabase
          .from('wines')
          .select('*')
          .eq('id', id)
          .single();
        if (error) throw error;
        setWine(rowToWine(data));
      } catch (err: any) {
        console.error('Ошибка загрузки вина:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchWine();
  }, [id]);

  const increaseQuantity = () => setQuantity(q => q + 1);
  const decreaseQuantity = () => setQuantity(q => q > 1 ? q - 1 : 1);

  const unitPrice = wine ? parseInt(wine.price.replace(/\D/g, ''), 10) || 0 : 0;
  const totalPrice = unitPrice * quantity;

  if (loading) {
    return (
      <div className="pt-40 pb-24 min-h-screen container mx-auto px-6 flex justify-center">
        <div className="animate-pulse flex space-x-4">
          <div className="h-4 bg-black/10 rounded w-32"></div>
        </div>
      </div>
    );
  }

  if (!wine) {
    return (
      <div className="pt-40 pb-24 min-h-screen container mx-auto px-6 text-center">
        <h1 className="text-3xl font-serif mb-6">Вино не найдено</h1>
        <Link to="/wines" className="text-primary hover:underline uppercase text-xs tracking-widest inline-flex items-center space-x-2">
          <ArrowLeft size={14} />
          <span>К коллекции</span>
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pt-32 pb-24 min-h-screen container mx-auto px-6 md:px-12 max-w-5xl"
    >
      <Link to="/wines" className="text-foreground/60 hover:text-primary transition-colors uppercase text-xs tracking-widest inline-flex items-center space-x-2 mb-12">
        <ArrowLeft size={14} />
        <span>К коллекции</span>
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 item-start">
        <div className="bg-[#EADDCD] aspect-[3/4] flex items-center justify-center relative shadow-sm">
          <img src={wine.imageUrl} alt={wine.name} className="w-full h-full object-cover" />
        </div>

        <div className="flex flex-col">
          <span className="text-primary text-xs uppercase tracking-[0.2em] mb-4">{wine.type} &bull; {wine.year}</span>
          <h1 className="text-4xl md:text-5xl font-serif mb-6 text-foreground">{wine.name}</h1>
          <div className="text-foreground/80 font-sans font-light text-base leading-relaxed whitespace-pre-wrap mb-8">{wine.desc}</div>

          <div className="grid grid-cols-2 gap-4 border-y border-black/10 py-6 mb-8">
            <div>
              <span className="block text-xs uppercase tracking-widest text-foreground/50 mb-1">Сорта</span>
              <span className="font-serif text-lg">{wine.grapes}</span>
            </div>
            <div>
              <span className="block text-xs uppercase tracking-widest text-foreground/50 mb-1">Цена за бутылку</span>
              <span className="font-serif text-lg">{wine.price}</span>
            </div>
          </div>

          <div className="bg-secondary/20 p-8 border border-black/5 flex flex-col mt-auto">
            <h3 className="font-serif text-2xl mb-6">Оформление заказа</h3>
            <div className="flex items-center justify-between mb-8">
              <span className="text-sm uppercase tracking-widest text-foreground/60">Количество</span>
              <div className="flex items-center space-x-4 border border-black/20 px-4 py-2">
                <button onClick={decreaseQuantity} className="text-foreground/60 hover:text-foreground transition-colors p-1" disabled={quantity <= 1}>
                  <Minus size={16} />
                </button>
                <span className="font-serif text-xl w-8 text-center">{quantity}</span>
                <button onClick={increaseQuantity} className="text-foreground/60 hover:text-foreground transition-colors p-1">
                  <Plus size={16} />
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between mb-8 border-t border-black/10 pt-6">
              <span className="text-sm uppercase tracking-widest text-foreground">Итого</span>
              <span className="font-serif text-3xl font-medium text-primary">
                {unitPrice > 0 ? `${new Intl.NumberFormat('ru-RU').format(totalPrice)} ₽` : 'По запросу'}
              </span>
            </div>
            <button
              onClick={() => alert("Ваш заказ зафиксирован! Мы свяжемся с вами в ближайшее время.")}
              className="w-full bg-primary text-white py-4 uppercase text-sm tracking-widest hover:bg-primary/90 transition-colors"
            >
              Оформить заказ
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
