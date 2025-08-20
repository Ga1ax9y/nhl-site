import { useEffect, useState } from "react";
import type { INews } from "../types/news";
import { fetchNews } from "../services/nhlApi";

export default function Home() {
  document.title = 'NHL | Home'
  const [news, setNews] = useState<INews[]>([])
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState(false);

  useEffect(()=>{
    const loadNews = async () => {
      try{
        setLoading(true)
        const data: INews[] = await fetchNews()
        console.log(data)
        setNews(data)
      }
      catch(err){
        setError('Ошибка загрузки новостей')
        console.error(err)
      }
      finally{
        setLoading(false)
      }

    }

    loadNews()
  }, [])

  if (loading) return (
      <section className="news container">
        <div className="news__loader loader">
          <p>Loading...</p>
        </div>
      </section>
  )

  if (error) return <div className="error-message container">{error}</div>
  
  const newsCount: number = 4
  const visibleNews = expanded ? news : news.slice(0, newsCount);
  const hasMore = news.length > newsCount;
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    };
    return new Date(dateString).toLocaleDateString('en-EN', options);
  };

  return (
    <section className="news container">
      <h1 className="news__title">Latest transfers</h1>

      <div className="news__list">
        {visibleNews.map((item) => (
          <article className="news__item" key={item.guid}>
            <div className="news__item-header">
              <h2 className="news__item-title">
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item.title}
                </a>
              </h2>
              <time className="news__item-date">{formatDate(item.pubDate)}</time>
            </div>
            <p className="news__item-snippet">{item.contentSnippet}</p>
            <div className="news__item-divider"></div>
          </article>
        ))}
      </div>

      {hasMore && (
        <div className="news__controls">
          {!expanded ? (
            <button
              className="news__toggle button"
              onClick={() => setExpanded(true)}
            >
              Show more ({news.length - 3})
            </button>
          ) : (
            <button
              className="news__toggle button"
              onClick={() => setExpanded(false)}
            >
              Show less
            </button>
          )}
        </div>
      )}
    </section>
  );
}
