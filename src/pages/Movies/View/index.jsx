import { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router';
import api from '../../../services/api';
import toast, { Toaster } from 'react-hot-toast';
import { ArrowLeftIcon, CalendarDaysIcon, ClockIcon, FilmIcon, TagIcon } from '@heroicons/react/24/outline';

const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    let cleanedPath = imagePath.startsWith('undefined/') ? imagePath.substring(10) : imagePath;
    const baseUrl = api.defaults.baseURL.endsWith('/') ? api.defaults.baseURL : `${api.defaults.baseURL}/`;
    return `${baseUrl}${cleanedPath}`;
};
function AdminMovieView() {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const { movieId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!movieId) {
      toast.error("ID do filme não fornecido.");
      setLoading(false);
      return;
    }

    async function fetchMovie() {
      try {
        setLoading(true);
        const { data } = await api.get(`/movies/movie/${movieId}`);
        setMovie(data);
      } catch (error) {
        toast.error('Falha ao carregar os detalhes do filme.');
        console.error("Erro ao buscar filme:", error);
        setTimeout(() => navigate('/admin/movies'), 2000);
      } finally {
        setLoading(false);
      }
    }

    fetchMovie();
  }, [movieId, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <p className="text-white">Carregando detalhes do filme...</p>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 text-white">
        <Toaster position="top-right" />
        <h2 className="text-2xl mb-4">Filme não encontrado.</h2>
        <Link to="/admin/movies" className="text-red-500 hover:underline">Voltar para a lista</Link>
      </div>
    );
  }

  const bannerSrc = getImageUrl(movie.bannerImageUrl);
  const posterSrc = getImageUrl(movie.mainImageUrl);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <Toaster position="top-right" />
      
      {/* Banner */}
      <div className="relative h-64 md:h-96 w-full">
        <img src={bannerSrc} alt={`Banner de ${movie.title}`} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent"></div>
        <div className="absolute top-4 left-4">
          <Link
            to="/admin/movies"
            className="flex items-center gap-2 bg-black/50 hover:bg-black/70 text-white font-bold py-2 px-4 rounded-full transition duration-300 backdrop-blur-sm"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            Voltar para a Lista
          </Link>
        </div>
      </div>

      <div className="container mx-auto p-4 md:p-8 -mt-24 md:-mt-32 relative">
        <div className="md:flex md:space-x-8">
          {/* Pôster */}
          <div className="w-full md:w-1/3 flex-shrink-0">
            <img src={posterSrc} alt={`Pôster de ${movie.title}`} className="rounded-xl shadow-2xl w-full" />
          </div>

          {/* Detalhes */}
          <div className="w-full md:w-2/3 mt-6 md:mt-0 text-white">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2">{movie.title}</h1>
            
            <div className="flex flex-wrap items-center gap-4 mb-6 text-gray-300">
                <div className="flex items-center gap-2">
                    <TagIcon className="h-5 w-5" />
                    <span>{movie.genre || 'Gênero não informado'}</span>
                </div>
                <div className="flex items-center gap-2">
                    <CalendarDaysIcon className="h-5 w-5" />
                    <span>{movie.releaseDate ? new Date(movie.releaseDate).toLocaleDateString('pt-BR') : 'Data não informada'}</span>
                </div>
            </div>

            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold mb-2 text-red-500">Sinopse</h2>
                    <p className="text-gray-300 leading-relaxed">{movie.synopsis || 'Sinopse não disponível.'}</p>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminMovieView;