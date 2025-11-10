import React, { useEffect, useState } from 'react';
import type { News } from '../../types';
import './NewsList.css';
import NewsCard from './NewsCard';
import { getPublishedNews } from '../../services/news';

const NewsList: React.FC = () => {
    const [news, setNews] = useState<News[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;
        setLoading(true);
        getPublishedNews()
            .then(data => { if (mounted) setNews(data); })
            .catch(e => {
                console.error(e);
                if (mounted) setError('No hay noticias para mostrar.');
            })
            .finally(() => { if (mounted) setLoading(false); });
        return () => { mounted = false; };
    }, []);

    if (loading) {
        return <div>Cargando noticias...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="news-list">
            <h2>Lista de Noticias</h2>
            {news.length === 0 ? (
                <p>No hay noticias disponibles.</p>
            ) : (
                <ul className="news-grid">
                    {news.map((item) => (
                        <li key={item.id} className="news-card">
                            <NewsCard noticia={item} />
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default NewsList;