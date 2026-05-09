import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase, rowToNewsItem, NewsItem } from "../supabase";

const ITEMS_PER_PAGE = 12;

export function News() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);

  const fetchNews = useCallback(async (isLoadMore = false) => {
    if (isLoadMore && (!hasMore || loadingMore)) return;

    try {
      if (isLoadMore) setLoadingMore(true);
      else setLoading(true);

      const currentOffset = isLoadMore ? offset : 0;
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false })
        .range(currentOffset, currentOffset + ITEMS_PER_PAGE - 1);

      if (error) throw error;

      const fetched = (data ?? []).map(rowToNewsItem);
      if (fetched.length < ITEMS_PER_PAGE) setHasMore(false);
      else setHasMore(true);

      if (isLoadMore) {
        setNews(prev => [...prev, ...fetched]);
        setOffset(currentOffset + fetched.length);
      } else {
        setNews(fetched);
        setOffset(fetched.length);
      }
    } catch (err: any) {
      console.error('Ошибка загрузки новостей:', err.message);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [hasMore, loadingMore, offset]);

  useEffect(() => { fetchNews(); }, []);

  const lastNewsElementRef = useCallback((node: HTMLDivElement | null) => {
    if (loading || loadingMore) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) fetchNews(true);
    });
    if (node) observer.current.observe(node);
  }, [loading, loadingMore, hasMore]);

  return (
    <div className="pt-32 pb-24 min-h-screen bg-background">
      <div className="container mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="max-w-4xl mx-auto text-center mb-20"
        >
          <span className="text-primary text-xs uppercase tracking-[0.3em] mb-4 block">Журнал</span>
          <h1 className="text-5xl md:text-7xl font-serif mb-6 leading-[1.1] text-foreground">
            Новости <br /><i className="text-foreground/70">Винодельни</i>
          </h1>
          <p className="text-foreground/60 font-sans font-light max-w-lg mx-auto leading-relaxed text-sm md:text-base">
            Узнайте больше о жизни нашей винодельни, новых релизах и последних событиях из первых рук.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-pulse flex space-x-4">
              <div className="h-4 bg-black/10 rounded w-1/4"></div>
            </div>
          </div>
        ) : news.length === 0 ? (
          <div className="text-center text-foreground/50 py-12">Новости скоро появятся</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {news.map((item, index) => {
              const isLastElement = news.length === index + 1;
              return (
                <motion.div
                  key={item.id}
                  ref={isLastElement ? lastNewsElementRef : null}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: (index % 3) * 0.2 }}
                  className="group cursor-pointer flex flex-col"
                >
                  <div className="overflow-hidden aspect-[4/3] mb-6 shadow-sm border border-black/5 bg-muted">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-1000" />
                  </div>
                  <div className="flex flex-col flex-grow">
                    <span className="text-primary text-xs uppercase tracking-widest mb-3 block">{item.date}</span>
                    <h3 className="font-serif text-2xl mb-4 text-foreground group-hover:text-primary transition-colors">{item.title}</h3>
                    <p className="text-base font-sans text-foreground/60 leading-relaxed mb-6 flex-grow">{item.preview}</p>
                    <div className="mt-auto pt-6">
                      <Link to={`/news/${item.id}`} className="text-primary text-xs uppercase tracking-widest hover:underline transition-all inline-flex items-center space-x-2">
                        <span>Читать далее</span>
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {loadingMore && (
          <div className="flex justify-center items-center py-12 mt-8">
            <div className="animate-pulse flex space-x-4">
              <div className="h-4 bg-black/10 rounded w-16"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
