import { motion } from "motion/react";
import { useState } from "react";
import { ArrowRight, ChevronDown, CalendarIcon, Plus, Minus } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const TASTING_TYPES = [
  {
    id: "intro",
    name: "Знакомство с Калдахуарой",
    desc: "Дегустация 3-х базовых вин (белое, розовое, красное) и экскурсия по виноградникам с рассказом о терруаре.",
    price: "3 000 ₽",
  },
  {
    id: "evolution",
    name: "Эволюция вкуса",
    desc: "Дегустация 5-ти уникальных вин в сопровождении фермерских сыров и локальных мясных деликатесов. Спуск в исторический погреб.",
    price: "6 000 ₽",
  },
  {
    id: "reserve",
    name: "Гранд Резерв",
    desc: "Эксклюзивная слепая дегустация 7-ми премиальных винтажей с владельцем винодельни. Гастрономический ужин при свечах.",
    price: "15 000 ₽",
  },
];

export function Tasting() {
  const [selectedType, setSelectedType] = useState(TASTING_TYPES[0].id);
  const [date, setDate] = useState<Date>();
  const [phone, setPhone] = useState("");
  const [guests, setGuests] = useState(1);

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

  const increaseGuests = (e: React.MouseEvent) => {
    e.preventDefault();
    setGuests(prev => prev + 1);
  };

  const decreaseGuests = (e: React.MouseEvent) => {
    e.preventDefault();
    setGuests(prev => prev > 1 ? prev - 1 : 1);
  };

  return (
    <div className="pt-32 pb-24 px-6 md:px-12 container mx-auto bg-background min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="max-w-4xl mx-auto text-center mb-20"
      >
        <span className="text-primary text-xs uppercase tracking-[0.3em] mb-4 block">Визит</span>
        <h1 className="text-5xl md:text-7xl font-serif mb-6 leading-[1.1] text-foreground">Забронировать <br/><i className="text-foreground/70">Дегустацию</i></h1>
        <p className="text-foreground/60 font-sans font-light max-w-lg mx-auto leading-relaxed text-sm md:text-base">
          Окунитесь в атмосферу виноделия Калдахуары. Мы приглашаем вас на индивидуальные дегустации, где каждый бокал раскрывает характер нашей земли.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start max-w-6xl mx-auto">
        {/* Left: Info & Image */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="col-span-1 lg:col-span-6 space-y-12"
        >
          <div className="aspect-[4/5] overflow-hidden relative shadow-md hidden sm:block">
            <img
              src="/images/tasting.jpg"
              alt="Дегустация вина"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/10"></div>
          </div>
          <div>
            <h3 className="font-serif text-3xl mb-8 text-foreground">Программы дегустаций</h3>
            <div className="space-y-6">
              {TASTING_TYPES.map(type => (
                <div
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`p-6 border cursor-pointer transition-all duration-300 ${
                    selectedType === type.id
                      ? 'border-primary bg-primary/5 shadow-sm'
                      : 'border-black/5 hover:border-black/20 bg-card'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-serif text-xl text-foreground">{type.name}</h4>
                    <span className="text-primary text-[12px] md:text-sm leading-none uppercase tracking-widest font-semibold mt-1 shrink-0 ml-4">{type.price}</span>
                  </div>
                  <p className="text-foreground/60 text-sm font-light font-sans leading-relaxed">{type.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right: Form */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="col-span-1 lg:col-span-6 bg-card p-8 md:p-12 shadow-sm border border-black/5 lg:sticky lg:top-32"
        >
          <div className="mb-10 text-center flex flex-col items-center">
            <h3 className="font-serif text-3xl text-foreground mb-4">Ваши данные</h3>
            <div className="w-12 h-[1px] bg-foreground/20"></div>
          </div>
          
          <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); alert("Ваша заявка успешно отправлена. Наш менеджер свяжется с вами."); }}>
            <div className="space-y-2">
              <label className="text-[11px] md:text-xs uppercase tracking-widest text-foreground/50 font-semibold px-2">Имя и Фамилия</label>
              <input
                type="text"
                required
                className="w-full border-b border-black/10 bg-transparent py-3 px-2 outline-none focus:border-primary transition-colors text-foreground font-serif text-lg placeholder:text-foreground/20"
                placeholder="Константин Лебедев"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] md:text-xs uppercase tracking-widest text-foreground/50 font-semibold px-2">Телефон</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={handlePhoneChange}
                className="w-full border-b border-black/10 bg-transparent py-3 px-2 outline-none focus:border-primary transition-colors text-foreground font-serif text-lg placeholder:text-foreground/20"
                placeholder="+7 (___) ___-__-__"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2 relative flex flex-col">
                <label className="text-[11px] md:text-xs uppercase tracking-widest text-foreground/50 font-semibold px-2">Дата</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className={cn(
                        "w-full border-b border-black/10 bg-transparent py-3 px-2 outline-none focus:border-primary transition-colors text-foreground font-serif text-lg text-left inline-flex items-center justify-between",
                        !date && "text-foreground/40"
                      )}
                    >
                      {date ? format(date, "dd MMMM yyyy", { locale: ru }) : <span>Выберите дату</span>}
                      <CalendarIcon size={16} strokeWidth={1} className="text-foreground/40" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 border border-black/5 rounded-none shadow-sm font-sans" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                      locale={ru}
                      className="bg-card text-foreground"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] md:text-xs uppercase tracking-widest text-foreground/50 font-semibold px-2">Время</label>
                <div className="relative">
                  <select required defaultValue="" className="w-full border-b border-black/10 bg-transparent py-3 px-2 outline-none focus:border-primary transition-colors text-foreground font-serif text-lg appearance-none cursor-pointer rounded-none">
                    <option value="" disabled>Выберите...</option>
                    <option value="12:00">12:00</option>
                    <option value="14:00">14:00</option>
                    <option value="16:00">16:00</option>
                    <option value="18:00">18:00</option>
                  </select>
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-foreground/40">
                    <ChevronDown size={16} strokeWidth={1} />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] md:text-xs uppercase tracking-widest text-foreground/50 font-semibold px-2">Количество гостей</label>
              <div className="flex items-center space-x-4 border-b border-black/10 py-2 px-2">
                <button onClick={decreaseGuests} className="text-foreground/60 hover:text-foreground transition-colors p-1" disabled={guests <= 1}>
                  <Minus size={20} />
                </button>
                <span className="font-serif text-xl w-12 text-center text-foreground">{guests}</span>
                <button onClick={increaseGuests} className="text-foreground/60 hover:text-foreground transition-colors p-1">
                  <Plus size={20} />
                </button>
              </div>
            </div>

            <p className="text-xs text-foreground/70 font-light font-sans leading-relaxed pt-6 px-2">
              Нажимая кнопку «Забронировать», вы соглашаетесь с нашей политикой конфиденциальности. Выбранная программа: <strong className="text-foreground font-medium">{TASTING_TYPES.find(t => t.id === selectedType)?.name}</strong>. Наш менеджер свяжется с вами для подтверждения бронирования.
            </p>

            <button
              type="submit"
              className="w-full border border-foreground/20 bg-foreground text-background px-8 py-5 uppercase text-xs font-semibold tracking-widest hover:bg-primary hover:border-primary hover:text-white transition-all flex justify-between items-center group mt-4"
            >
              <span>Забронировать</span>
              <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
