import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { supabase, rowToWine, Wine } from "../supabase";

export function Wines() {
  const [wines, setWines] = useState<Wine[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWines = async () => {
      try {
        const { data, error } = await supabase
          .from('wines')
          .select('*')
          .order('created_at', { ascending: true });
        if (error) throw error;
        setWines((data ?? []).map(rowToWine));
      } catch (err: any) {
        console.error('Ошибка загрузки вин:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchWines();
  }, []);

  return (
    <div className="pt-32 pb-24 px-6 md:px-12 container mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="max-w-4xl mx-auto text-center mb-24"
      >
        <span className="text-primary text-xs uppercase tracking-[0.3em] mb-4 block">Эксклюзив</span>
        <h1 className="text-5xl md:text-7xl font-serif mb-6 leading-[1.1] text-foreground">Коллекция <br/><i className="text-foreground/70">Вин</i></h1>
        <p className="text-foreground/60 font-sans font-light max-w-lg mx-auto leading-relaxed text-base">
          Каждая бутылка Wine Jet — это история, рассказанная языком природы.
          Лимитированный тираж, ручной сбор и бескомпромиссный подход к качеству.
        </p>
      </motion.div>

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-pulse flex space-x-4">
            <div className="h-4 bg-black/10 rounded w-1/4"></div>
          </div>
        </div>
      ) : wines.length === 0 ? (
        <div className="text-center text-foreground/50 py-12">Коллекция скоро обновится</div>
      ) : (
        <div className="space-y-32">
          {wines.map((wine, i) => (
            <motion.div
              key={wine.id}
              id={wine.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className={`grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center ${i % 2 !== 0 ? "lg:flex-row-reverse" : ""}`}
            >
              <div className={`col-span-1 lg:col-span-5 ${i % 2 !== 0 ? "lg:order-last" : ""}`}>
                <div className="bg-[#EADDCD] aspect-[3/4] flex items-center justify-center relative group overflow-hidden shadow-sm">
                  <img
                    src={wine.imageUrl}
                    alt={wine.name}
                    className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-700"></div>
                </div>
              </div>

              <div className="col-span-1 lg:col-span-7 lg:px-12 flex flex-col justify-center">
                <span className="text-primary text-xs uppercase tracking-[0.2em] mb-4">{wine.type} &bull; {wine.year}</span>
                <h2 className="text-4xl md:text-5xl font-serif mb-6 text-foreground">{wine.name}</h2>
                <div className="flex flex-col space-y-6 mb-8 text-foreground/80 font-sans font-light text-base leading-relaxed">
                  <p className="whitespace-pre-wrap">{wine.desc}</p>
                  <div className="grid grid-cols-2 gap-4 border-t border-black/10 pt-6">
                    <div>
                      <span className="block text-xs uppercase tracking-widest text-foreground/50 mb-1">Сорта</span>
                      <span className="font-serif text-lg">{wine.grapes}</span>
                    </div>
                    <div>
                      <span className="block text-xs uppercase tracking-widest text-foreground/50 mb-1">Цена за бутылку</span>
                      <span className="font-serif text-primary text-lg">{wine.price}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <Link to={`/order/${wine.id}`} className="inline-block border border-foreground/20 text-foreground px-8 py-4 uppercase text-sm tracking-widest hover:border-primary hover:bg-primary hover:text-white transition-colors">
                    Заказать онлайн
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
