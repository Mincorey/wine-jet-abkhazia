import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import { motion } from "motion/react";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useAuth } from "../context/AuthContext";
import { supabase, signInWithUsername, signOut, uploadImage, rowToWine, rowToNewsItem } from "../supabase";

export function AdminPanel() {
  const { session, isAdmin, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<"wines" | "news">("wines");
  const [items, setItems] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [uploadedImageBase64, setUploadedImageBase64] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
  const [newsDate, setNewsDate] = useState<Date | undefined>(undefined);
  const [formKey, setFormKey] = useState(0);

  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  useEffect(() => {
    setUploadedImageBase64(null);
    setNewsDate(undefined);
  }, [activeTab, editingItem]);

  const handleEditClick = (item: any) => {
    setEditingItem(item);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width, height = img.height;
        const MAX = 800;
        if (width > height) { if (width > MAX) { height = Math.round(height * MAX / width); width = MAX; } }
        else { if (height > MAX) { width = Math.round(width * MAX / height); height = MAX; } }
        canvas.width = width; canvas.height = height;
        canvas.getContext("2d")?.drawImage(img, 0, 0, width, height);
        setUploadedImageBase64(canvas.toDataURL("image/jpeg", 0.8));
        setIsUploading(false);
      };
      img.onerror = () => setIsUploading(false);
    };
    reader.onerror = () => setIsUploading(false);
  };

  const fetchItems = async () => {
    setLoadingData(true);
    try {
      if (activeTab === "wines") {
        const { data, error } = await supabase.from("wines").select("*").order("created_at", { ascending: true });
        if (error) throw error;
        setItems((data ?? []).map(rowToWine));
      } else {
        const { data, error } = await supabase.from("news").select("*").order("created_at", { ascending: false });
        if (error) throw error;
        setItems((data ?? []).map(rowToNewsItem));
      }
    } catch (err: any) { console.error(err.message); }
    finally { setLoadingData(false); }
  };

  useEffect(() => { if (isAdmin) fetchItems(); }, [activeTab, isAdmin]);

  if (loading) return <div className="flex justify-center items-center h-[60vh]">Загрузка...</div>;

  if (!session) {
    const handleLogin = async (e: FormEvent) => {
      e.preventDefault();
      setLoginError(""); setLoginLoading(true);
      const { error } = await signInWithUsername(loginUsername, loginPassword);
      setLoginLoading(false);
      if (error) setLoginError("Неверный логин или пароль");
    };
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] px-6 text-center">
        <h1 className="text-4xl font-serif mb-6 text-foreground">Панель управления</h1>
        <p className="text-foreground/60 mb-8 max-w-sm">Введите учётные данные для доступа к редактированию контента.</p>
        <form onSubmit={handleLogin} className="w-full max-w-xs space-y-4">
          <div className="space-y-2 text-left">
            <label className="text-[10px] uppercase tracking-widest text-foreground/60 font-semibold">Имя пользователя</label>
            <input type="text" value={loginUsername} onChange={e => setLoginUsername(e.target.value)} required autoComplete="username"
              className="w-full bg-white px-4 py-3 border border-black/10 outline-none text-sm font-serif" placeholder="wine_jet_apsny" />
          </div>
          <div className="space-y-2 text-left">
            <label className="text-[10px] uppercase tracking-widest text-foreground/60 font-semibold">Пароль</label>
            <input type="password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} required autoComplete="current-password"
              className="w-full bg-white px-4 py-3 border border-black/10 outline-none text-sm font-serif" />
          </div>
          {loginError && <p className="text-red-600 text-xs text-left">{loginError}</p>}
          <button type="submit" disabled={loginLoading}
            className={"w-full bg-primary text-white uppercase text-xs tracking-widest px-8 py-4 transition-colors " + (loginLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-primary/90")}>
            {loginLoading ? "Вход..." : "Войти"}
          </button>
        </form>
      </div>
    );
  }

  const handleCreateOrUpdate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    try {
      let imageUrl: string | null = null;
      if (uploadedImageBase64) {
        setIsUploading(true);
        imageUrl = await uploadImage(uploadedImageBase64, activeTab === "wines" ? "wines" : "news");
        setIsUploading(false);
      }
      if (activeTab === "wines") {
        const wineData = { name: String(data.name), type: String(data.type), year: String(data.year),
          grapes: String(data.grapes), description: String(data.desc), price: String(data.price),
          image_url: imageUrl ?? (editingItem ? editingItem.imageUrl : "/images/wine4.jpg") };
        const { error } = editingItem
          ? await supabase.from("wines").update(wineData).eq("id", editingItem.id)
          : await supabase.from("wines").insert(wineData);
        if (error) throw error;
      } else {
        const dateStr = newsDate
          ? format(newsDate, "LLLL yyyy", { locale: ru }).replace(/^./, c => c.toUpperCase())
          : (editingItem?.date ?? "");
        if (!dateStr) { alert("Выберите дату публикации"); return; }
        const newsData = { title: String(data.title), date: dateStr, preview: String(data.preview),
          content: String(data.content), image: imageUrl ?? (editingItem ? editingItem.image : "/images/news1.jpg") };
        const { error } = editingItem
          ? await supabase.from("news").update(newsData).eq("id", editingItem.id)
          : await supabase.from("news").insert(newsData);
        if (error) throw error;
      }
      await fetchItems();
      setEditingItem(null);
      setUploadedImageBase64(null);
      setNewsDate(undefined);
      if (!editingItem) setFormKey(k => k + 1);
    } catch (error: any) { alert("Ошибка: " + error.message); }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from(activeTab).delete().eq("id", id);
      if (error) throw error;
      setItems(prev => prev.filter(item => item.id !== id));
      setDeleteTarget(null);
    } catch (error: any) { console.error(error.message); }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen pt-32 pb-20 px-6 container mx-auto">

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-6" onClick={() => setDeleteTarget(null)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-[#FDFBF7] max-w-sm w-full p-8 shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-10 h-[1px] bg-red-700/40 mb-6" />
            <h3 className="font-serif text-2xl mb-2 text-foreground">Удалить запись?</h3>
            <p className="text-sm text-foreground/60 mb-2 font-sans leading-relaxed">
              «{deleteTarget.name || deleteTarget.title}»
            </p>
            <p className="text-xs text-foreground/40 font-sans mb-8">Это действие необратимо.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 border border-black/20 text-foreground text-xs uppercase tracking-widest py-4 hover:bg-black/5 transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={() => handleDelete(deleteTarget.id)}
                className="flex-1 bg-red-700 text-white text-xs uppercase tracking-widest py-4 hover:bg-red-800 transition-colors active:scale-95"
              >
                Удалить
              </button>
            </div>
          </motion.div>
        </div>
      )}
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-serif text-foreground mb-2">Административная панель</h1>
          <p className="text-sm font-sans tracking-widest uppercase text-foreground/50">Управление контентом</p>
        </div>
        <button onClick={() => signOut()} className="text-xs uppercase tracking-widest text-foreground hover:text-primary transition-colors border border-black/10 px-6 py-2">
          Выйти ({session.user.email?.replace("@wine-jet.admin", "")})
        </button>
      </div>

      <div className="flex space-x-8 mb-12 border-b border-black/10">
        <button onClick={() => { setActiveTab("wines"); setEditingItem(null); }}
          className={"pb-4 text-sm tracking-widest uppercase transition-colors " + (activeTab === "wines" ? "border-b border-primary text-primary" : "text-foreground/50 hover:text-foreground/80")}>
          Коллекция Вин
        </button>
        <button onClick={() => { setActiveTab("news"); setEditingItem(null); }}
          className={"pb-4 text-sm tracking-widest uppercase transition-colors " + (activeTab === "news" ? "border-b border-primary text-primary" : "text-foreground/50 hover:text-foreground/80")}>
          Новости
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-1 border border-black/5 p-8 bg-secondary/20">
          <h3 className="font-serif text-2xl mb-6">{editingItem ? "Редактировать" : "Добавить"} {activeTab === "wines" ? "вино" : "новость"}</h3>
          <form key={editingItem?.id ?? formKey} onSubmit={handleCreateOrUpdate} className="space-y-4">
            {activeTab === "wines" && (<>
              <div className="space-y-2"><label className="text-[10px] uppercase tracking-widest text-foreground/60 font-semibold">Название*</label>
                <input name="name" required defaultValue={editingItem?.name} className="w-full bg-white px-4 py-2 border border-black/10 outline-none text-sm font-serif" placeholder="Резерв Качич" /></div>
              <div className="space-y-2"><label className="text-[10px] uppercase tracking-widest text-foreground/60 font-semibold">Тип*</label>
                <input name="type" required defaultValue={editingItem?.type} className="w-full bg-white px-4 py-2 border border-black/10 outline-none text-sm font-serif" placeholder="Красное сухое" /></div>
              <div className="space-y-2"><label className="text-[10px] uppercase tracking-widest text-foreground/60 font-semibold">Год*</label>
                <input name="year" required defaultValue={editingItem?.year} className="w-full bg-white px-4 py-2 border border-black/10 outline-none text-sm font-serif" placeholder="2018" /></div>
              <div className="space-y-2"><label className="text-[10px] uppercase tracking-widest text-foreground/60 font-semibold">Сорта*</label>
                <input name="grapes" required defaultValue={editingItem?.grapes} className="w-full bg-white px-4 py-2 border border-black/10 outline-none text-sm font-serif" placeholder="Мальбек, Каберне" /></div>
              <div className="space-y-2"><label className="text-[10px] uppercase tracking-widest text-foreground/60 font-semibold">Цена*</label>
                <input name="price" required defaultValue={editingItem?.price} className="w-full bg-white px-4 py-2 border border-black/10 outline-none text-sm font-serif" placeholder="4 500 руб." /></div>
              <div className="space-y-2"><label className="text-[10px] uppercase tracking-widest text-foreground/60 font-semibold">Изображение</label>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full bg-white px-4 py-2 border border-black/10 outline-none text-sm font-sans" />
                {isUploading && <p className="text-xs text-primary">Загрузка...</p>}
                {(uploadedImageBase64 || editingItem?.imageUrl) && <img src={uploadedImageBase64 || editingItem?.imageUrl} alt="preview" className="w-20 h-24 object-cover mt-2" />}</div>
              <div className="space-y-2"><label className="text-[10px] uppercase tracking-widest text-foreground/60 font-semibold">Описание*</label>
                <textarea name="desc" required defaultValue={editingItem?.desc} rows={4} className="w-full bg-white px-4 py-2 border border-black/10 outline-none text-sm font-sans leading-relaxed text-foreground/80" /></div>
            </>)}
            {activeTab === "news" && (<>
              <div className="space-y-2"><label className="text-[10px] uppercase tracking-widest text-foreground/60 font-semibold">Заголовок*</label>
                <input name="title" required defaultValue={editingItem?.title} className="w-full bg-white px-4 py-2 border border-black/10 outline-none text-sm font-serif" /></div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-foreground/60 font-semibold">Дата*</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className={cn(
                        "w-full bg-white px-4 py-2 border border-black/10 outline-none text-sm font-serif text-left flex items-center justify-between hover:border-black/20 transition-colors",
                        !(newsDate || editingItem?.date) && "text-foreground/30"
                      )}
                    >
                      {newsDate
                        ? format(newsDate, "LLLL yyyy", { locale: ru }).replace(/^./, c => c.toUpperCase())
                        : (editingItem?.date || "Выберите дату")}
                      <CalendarIcon size={14} strokeWidth={1} className="text-foreground/40 ml-2 shrink-0" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 border border-black/5 rounded-none shadow-md font-sans z-50" align="start">
                    <Calendar
                      mode="single"
                      selected={newsDate}
                      onSelect={setNewsDate}
                      initialFocus
                      locale={ru}
                      className="bg-card text-foreground"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2"><label className="text-[10px] uppercase tracking-widest text-foreground/60 font-semibold">Изображение</label>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full bg-white px-4 py-2 border border-black/10 outline-none text-sm font-sans" />
                {isUploading && <p className="text-xs text-primary">Загрузка...</p>}
                {(uploadedImageBase64 || editingItem?.image) && <img src={uploadedImageBase64 || editingItem?.image} alt="preview" className="w-32 h-24 object-cover mt-2" />}</div>
              <div className="space-y-2"><label className="text-[10px] uppercase tracking-widest text-foreground/60 font-semibold">Превью*</label>
                <textarea name="preview" required defaultValue={editingItem?.preview} rows={3} className="w-full bg-white px-4 py-2 border border-black/10 outline-none text-sm font-sans text-foreground/80" /></div>
              <div className="space-y-2"><label className="text-[10px] uppercase tracking-widest text-foreground/60 font-semibold">Полный текст*</label>
                <textarea name="content" required defaultValue={editingItem?.content} rows={8} className="w-full bg-white px-4 py-2 border border-black/10 outline-none text-sm font-sans text-foreground/80 leading-relaxed" /></div>
            </>)}
            <div className="flex space-x-4 pt-4">
              <button type="submit" disabled={isUploading}
                className={"flex-1 bg-primary text-white text-xs uppercase tracking-widest py-3 transition-colors " + (isUploading ? "opacity-50 cursor-not-allowed" : "hover:bg-primary/90")}>
                {editingItem ? "Сохранить" : "Опубликовать"}
              </button>
              {editingItem && <button type="button" onClick={() => setEditingItem(null)}
                className="flex-1 border border-black/20 text-foreground text-xs uppercase tracking-widest py-3 hover:bg-black/5 transition-colors">Отмена</button>}
            </div>
            <p className="text-[9px] text-foreground/40 leading-relaxed pt-2 opacity-70">*Все поля обязательны</p>
          </form>
        </div>

        <div className="lg:col-span-2">
          {loadingData ? <div className="animate-pulse flex space-x-4"><div className="h-4 bg-black/10 rounded w-1/4"></div></div> : (
            <div className="space-y-4">
              {items.length === 0 && <p className="text-foreground/50 text-sm font-sans">Пока нет записей.</p>}
              {items.map(item => (
                <div key={item.id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 border border-black/5 bg-white hover:border-black/10 transition-colors gap-6">
                  <div className="flex items-center space-x-6">
                    <div className="w-20 h-24 bg-secondary shrink-0 overflow-hidden">
                      <img src={activeTab === "wines" ? item.imageUrl : item.image} alt="preview" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-serif text-xl mb-2">{activeTab === "wines" ? item.name : item.title}</h4>
                      <p className="text-xs text-foreground/50 font-sans tracking-widest uppercase">
                        {activeTab === "wines" ? `${item.type} · ${item.year} · ${item.price}` : item.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 shrink-0">
                    <button onClick={() => handleEditClick(item)} className="text-[10px] uppercase font-semibold text-foreground/60 tracking-widest hover:text-primary transition-colors">Редактировать</button>
                    <button onClick={() => setDeleteTarget(item)}
                      className="text-[10px] uppercase font-semibold tracking-widest text-red-700/60 hover:text-red-700 transition-colors">
                      Удалить
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
