import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import { supabase, rowToNewsItem, NewsItem } from "../supabase";

export function NewsArticle() {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) return;
      try {
        const { data, error } = await supabase
          .from('news')
          .select('*')
          .eq('id', id)
          .single();
        if (error) throw error;
        setArticle(rowToNewsItem(data));
      } catch (err: any) {
        console.error('Ошибка загрузки статьи:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

  if (loading) {
    return (
      <div className="pt-40 pb-24 min-h-screen container mx-auto px-6 flex justify-center">
        <div className="animate-pulse flex space-x-4">
          <div className="h-4 bg-black/10 rounded w-32"></div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="pt-40 pb-24 min-h-screen container mx-auto px-6 text-center">
        <h1 className="text-3xl font-serif mb-6">Новость не найдена</h1>
        <Link to="/news" className="text-primary hover:underline uppercase text-xs tracking-widest inline-flex items-center space-x-2">
          <ArrowLeft size={14} />
          <span>Ко всем новостям</span>
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pt-32 pb-24 min-h-screen container mx-auto px-6 md:px-12 max-w-4xl"
    >
      <Link to="/news" className="text-foreground/60 hover:text-primary transition-colors uppercase text-xs tracking-widest inline-flex items-center space-x-2 mb-12">
        <ArrowLeft size={14} />
        <span>К новостям</span>
      </Link>

      <span className="text-primary text-xs uppercase tracking-widest mb-4 block">{article.date}</span>
      <h1 className="text-4xl md:text-5xl font-serif text-foreground mb-12">{article.title}</h1>

      <div className="aspect-[21/9] mb-12 overflow-hidden bg-muted">
        <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
      </div>

      <div className="prose prose-lg prose-neutral max-w-none text-foreground/80 font-sans leading-relaxed">
        {article.content.split('\n').map((paragraph, idx) => {
          const parts = paragraph.split(/(https?:\/\/[^\s]+)/g);
          return (
            <p key={idx} className="mb-6">
              {parts.map((part, i) =>
                /(https?:\/\/[^\s]+)/.test(part) ? (
                  <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline underline-offset-4">
                    {part}
                  </a>
                ) : (
                  <span key={i}>{part}</span>
                )
              )}
            </p>
          );
        })}
      </div>
    </motion.div>
  );
}
