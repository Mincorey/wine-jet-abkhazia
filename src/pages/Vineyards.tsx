import { motion } from "motion/react";

export function Vineyards() {
  return (
    <div className="pt-32 pb-24 min-h-screen bg-background">
      <div className="container mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="max-w-4xl mx-auto text-center mb-20"
        >
          <span className="text-primary text-xs uppercase tracking-[0.3em] mb-4 block">Терруар</span>
          <h1 className="text-5xl md:text-7xl font-serif mb-6 leading-[1.1] text-foreground">
            Наши <br /><i className="text-foreground/70">Виноградники</i>
          </h1>
          <p className="text-foreground/60 font-sans font-light max-w-lg mx-auto leading-relaxed text-sm md:text-base">
            Уникальное сочетание гор, моря и каменистой почвы, где рождаются вина с истинным абхазским характером.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-32">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="aspect-[4/5] overflow-hidden shadow-sm"
          >
            <img
              src="/images/vineyards1.jpg"
              alt="Утренние виноградники"
              className="w-full h-full object-cover scale-105 hover:scale-100 transition-transform duration-1000"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <h2 className="text-3xl md:text-4xl font-serif mb-6">Дыхание Моря и Гор</h2>
            <div className="space-y-6 text-foreground/70 font-sans font-light leading-relaxed text-base">
              <p>
                Наши виноградники расположены на живописных склонах, где прохладный горный воздух встречается с теплым дыханием Черного моря. Такой контраст температур обеспечивает идеальное созревание винограда, сохраняя его природную свежесть и кислотность.
              </p>
              <p>
                Особое внимание мы уделяем почвам — богатые минералами каменистые грунты заставляют корни лозы уходить глубоко в поисках влаги, что придает нашим винам неповторимую минеральную ноту.
              </p>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="order-last lg:order-first"
          >
            <h2 className="text-3xl md:text-4xl font-serif mb-6">Автохтонные Сорта</h2>
            <div className="space-y-6 text-foreground/70 font-sans font-light leading-relaxed text-base">
              <p>
                Мы гордимся тем, что возрождаем редкие автохтонные абхазские сорта винограда. На наших участках произрастают Качич, Амлаху и Апапуа — сорта, идеально приспособленные к местному климату.
              </p>
              <p>
                Сохранение биоразнообразия и экологичный подход — основа нашей работы на земле. Мы не используем агрессивные химические удобрения, доверяя силе самой природы.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="order-first lg:order-last aspect-[4/5] overflow-hidden shadow-sm"
          >
            <img
              src="/images/vineyards2.jpg"
              alt="Гроздья винограда"
              className="w-full h-full object-cover scale-105 hover:scale-100 transition-transform duration-1000"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
