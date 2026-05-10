import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { supabase, rowToWine, type Wine } from "../supabase";

export function Home() {
  const [featuredWines, setFeaturedWines] = useState<Wine[]>([]);

  useEffect(() => {
    supabase
      .from("wines")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(3)
      .then(({ data }) => {
        if (data) setFeaturedWines(data.map(rowToWine));
      });
  }, []);

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/40 z-10"></div>
          <img 
            src="/images/hero.jpg" 
            alt="Vineyards in mist" 
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif mb-8 leading-[1.1] text-white">
              Бескомпромиссное <br/>искусство сухих вин
            </h1>
            <p className="text-white/90 font-sans font-light max-w-lg mx-auto mb-12 text-sm md:text-base leading-relaxed">
              Наследие виноделия Калдахуары. Традиции, воплощенные в элегантности современности.
            </p>
            <Link 
              to="/tasting" 
              className="group inline-flex items-center space-x-4 px-8 py-4 uppercase text-xs tracking-widest transition-all duration-300 bg-primary text-white hover:bg-primary/90 rounded-none"
            >
              <span>Забронировать дегустацию</span>
              <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform duration-300" strokeWidth={1} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Philopsophy Section */}
      <section className="py-32 px-6 md:px-12 container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1 }}
          >
            <span className="text-primary text-xs uppercase tracking-[0.2em] mb-4 block">Наследие</span>
            <h2 className="text-4xl md:text-5xl font-serif mb-8 text-foreground">Возрождение<br/>древней лозы</h2>
            <div className="space-y-6 text-foreground/70 font-sans font-light leading-relaxed text-base">
              <p>
                В сердце Абхазии мы возвращаем к жизни автохтонные сорта Качич и Цоликоури. Наша философия — это уважение к земле и минимальное вмешательство, позволяющее вину говорить голосом своего терруара. Каждый бокал — это история, выдержанная в тишине прохладных погребов.
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1 }}
            className="relative"
          >
            <div className="aspect-[4/5] overflow-hidden">
              <img 
                src="/images/cellars.jpg" 
                alt="Винные погреба" 
                className="w-full h-full object-cover scale-105 hover:scale-100 transition-transform duration-1000"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Terroir Section */}
      <section className="py-32 px-6 md:px-12 container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1 }}
            className="order-last lg:order-first aspect-[4/5] overflow-hidden"
          >
            <img 
              src="/images/terroir.jpg" 
              alt="Терруар" 
              className="w-full h-full object-cover scale-105 hover:scale-100 transition-transform duration-1000"
            />
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1 }}
            className="order-first lg:order-last"
          >
            <span className="text-primary text-xs uppercase tracking-[0.2em] mb-4 block">Терруар</span>
            <h2 className="text-4xl md:text-5xl font-serif mb-8 text-foreground">Земля<br/>Калдахуары</h2>
            <div className="space-y-6 text-foreground/70 font-sans font-light leading-relaxed text-base">
              <p>
                Уникальный микроклимат, где горные ветры встречаются с морским бризом, создает идеальные условия для созревания винограда с выраженной кислотностью и сложным ароматическим профилем. Каменистые почвы заставляют лозу уходить глубоко в поисках воды, обогащая ягоды минеральностью.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Highlighted Collection */}
      <section className="bg-secondary/40 py-32 px-6 md:px-12 border-y border-black/5">
        <div className="container mx-auto">
          <div className="text-center mb-20 flex flex-col items-center">
             <span className="text-primary text-xs uppercase tracking-[0.2em] mb-4 block">
              Коллекция
            </span>
            <h2 className="text-4xl md:text-5xl font-serif mb-6 text-foreground">Симфония вкуса</h2>
            <div className="w-16 h-[1px] bg-foreground/20"></div>
          </div>

          {featuredWines.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[0, 1, 2].map(i => (
                <div key={i} className="flex flex-col">
                  <div className="bg-[#EADDCD] aspect-[3/4] animate-pulse mb-8" />
                  <div className="h-4 bg-black/10 rounded animate-pulse mx-auto w-2/3 mb-3" />
                  <div className="h-3 bg-black/5 rounded animate-pulse mx-auto w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredWines.map((wine, i) => (
                <motion.div
                  key={wine.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: i * 0.2 }}
                  className="group cursor-pointer flex flex-col"
                >
                  <div className="bg-[#EADDCD] aspect-[3/4] relative overflow-hidden mb-8 shadow-sm">
                    <img
                      src={wine.imageUrl}
                      alt={wine.name}
                      className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-1000"
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-700" />
                  </div>
                  <div className="text-center">
                    <span className="text-primary text-[10px] uppercase tracking-widest mb-2 block">{wine.type} · {wine.year}</span>
                    <h3 className="font-serif text-2xl mb-3 text-foreground group-hover:text-primary transition-colors">
                      {wine.name}
                    </h3>
                    <p className="text-sm font-sans text-foreground/60 mb-5 leading-relaxed max-w-[260px] mx-auto line-clamp-2">
                      {wine.desc}
                    </p>
                    <Link
                      to={`/wines#${wine.id}`}
                      className="text-primary text-xs uppercase tracking-widest hover:underline transition-all inline-flex items-center space-x-2"
                    >
                      <span>Подробнее</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
