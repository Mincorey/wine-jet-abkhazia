import { motion } from "motion/react";

export function Story() {
  return (
    <div className="pt-32 pb-24 min-h-screen bg-background">
      <div className="container mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="max-w-4xl mx-auto text-center mb-20"
        >
          <span className="text-primary text-xs uppercase tracking-[0.3em] mb-4 block">О нас</span>
          <h1 className="text-5xl md:text-7xl font-serif mb-6 leading-[1.1] text-foreground">
            История <br /><i className="text-foreground/70">Винодельни</i>
          </h1>
          <p className="text-foreground/60 font-sans font-light max-w-lg mx-auto leading-relaxed text-sm md:text-base">
            Возрождение забытых традиций и страсть к виноделию, передающаяся из поколения в поколение.
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
              src="/images/story1.jpg"
              alt="Основатель винодельни"
              className="w-full h-full object-cover scale-105 hover:scale-100 transition-transform duration-1000"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <h2 className="text-3xl md:text-4xl font-serif mb-6">Истоки Калдахуары</h2>
            <div className="space-y-6 text-foreground/70 font-sans font-light leading-relaxed text-base">
              <p>
                Наша история началась более века назад, когда первые лозы были высажены на склонах Калдахуары. Долгие годы эти земли питали виноградники, из которых производили вино только для семейного стола.
              </p>
              <p>
                Сегодня Wine Jet Абхазия — это современный проект, который отдает дань уважения своим корням. Мы бережно восстановили старые погреба и привнесли современные технологии, чтобы каждый мог прикоснуться к нашему наследию.
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
            <h2 className="text-3xl md:text-4xl font-serif mb-6">Философия Создания</h2>
            <div className="space-y-6 text-foreground/70 font-sans font-light leading-relaxed text-base">
              <p>
                Мы верим, что вино создается на винограднике, а не в погребе. Наша главная задача — сохранить уникальный характер каждого года урожая и передать его в бокале.
              </p>
              <p>
                Ручной сбор, строгая селекция ягод и использование классических методов винификации позволяют нам создавать вина с глубоким смыслом и неповторимым звучанием.
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
              src="/images/story2.jpg"
              alt="Процесс виноделия"
              className="w-full h-full object-cover scale-105 hover:scale-100 transition-transform duration-1000"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
