import { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router';
import toast, { Toaster } from 'react-hot-toast';
import { ArrowLeftIcon, CalendarDaysIcon, TagIcon, PencilSquareIcon, TrashIcon, CalendarIcon } from '@heroicons/react/24/outline';
import api from '../../../../services/api';

const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    let cleanedPath = imagePath.startsWith('undefined/') ? imagePath.substring(10) : imagePath;
    const baseUrl = api.defaults.baseURL.endsWith('/') ? api.defaults.baseURL : `${api.defaults.baseURL}/`;
    return `${baseUrl}${cleanedPath}`;
};

function AdminMovieView() {
  const [movie, setMovie] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { movieId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!movieId) {
      toast.error("ID do filme não fornecido.");
      setLoading(false);
      return;
    }

    async function fetchData() {
      try {
        setLoading(true);
        // Busca filme, sessões e salas em paralelo
        const [movieRes, sessionsRes, roomsRes] = await Promise.all([
            api.get(`/movies/movie/${movieId}`),
            api.get('/sessions'),
            api.get('/rooms')
        ]);

        const movieData = movieRes.data;
        const allSessions = sessionsRes.data;
        const allRooms = roomsRes.data;

        // Filtra as sessões para este filme
        const movieSessions = allSessions.filter(s => s.movieId === movieData.id);

        // Mapeia as sessões para incluir o nome da sala
        const sessionsWithRoomNames = movieSessions.map(session => {
            const room = allRooms.find(r => r._id === session.roomId);
            return {
                ...session,
                roomName: room ? room.name : 'Sala desconhecida',
                roomCapacity: room ? room.capacity : 0,
            };
        });

        setMovie(movieData);
        setSessions(sessionsWithRoomNames);

      } catch (error) {
        toast.error('Falha ao carregar os detalhes do filme ou sessões.');
        console.error("Erro ao buscar dados:", error);
        setTimeout(() => navigate('/admin/movies'), 2000);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [movieId, navigate]);

  const handleEditSession = (sessionId) => {
    navigate(`/admin/sessions/edit/${sessionId}`);
  };
  
  const handleDeleteSession = async (sessionId) => {
      if (window.confirm("Tem certeza que deseja excluir esta sessão?")) {
          try {
              await api.delete(`/sessions/delete/${sessionId}`);
              toast.success("Sessão excluída com sucesso!");
              setSessions(prev => prev.filter(s => s.id !== sessionId));
          } catch (error) {
              toast.error("Falha ao excluir a sessão.");
          }
      }
  };

  if (loading) return <div className="flex justify-center items-center min-h-screen bg-gray-900"><p className="text-white">Carregando...</p></div>;
  if (!movie) return <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white"><Toaster /><p>Filme não encontrado.</p></div>;

  const bannerSrc = getImageUrl(movie.bannerImageUrl);
  const posterSrc = getImageUrl(movie.mainImageUrl);

  return (
    <div className="min-h-screen bg-gray-900 text-white pb-16">
      <Toaster position="top-right" />
      
      <div className="relative h-64 md:h-96 w-full">
        <img src={bannerSrc} alt={`Banner de ${movie.title}`} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent"></div>
        <div className="absolute top-4 left-4 z-10">
          <Link to="/admin/movies" className="flex items-center gap-2 bg-black/50 hover:bg-black/70 font-bold py-2 px-4 rounded-full transition duration-300 backdrop-blur-sm">
            <ArrowLeftIcon className="h-5 w-5" /> Voltar
          </Link>
        </div>
      </div>

      <div className="container mx-auto p-4 md:p-8 -mt-24 md:-mt-32 relative">
        <div className="md:flex md:space-x-8">
          <div className="w-full md:w-1/3 flex-shrink-0">
            <img src={posterSrc} alt={`Pôster de ${movie.title}`} className="rounded-xl shadow-2xl w-full" />
          </div>
          <div className="w-full md:w-2/3 mt-6 md:mt-0">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2">{movie.title}</h1>
            <div className="flex flex-wrap items-center gap-4 mb-6 text-gray-300">
                <div className="flex items-center gap-2"><TagIcon className="h-5 w-5" /><span>{movie.genre || 'N/A'}</span></div>
                <div className="flex items-center gap-2"><CalendarDaysIcon className="h-5 w-5" /><span>{new Date(movie.releaseDate).toLocaleDateString('pt-BR')}</span></div>
            </div>
            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold mb-2 text-red-500">Sinopse</h2>
                    <p className="text-gray-300 leading-relaxed">{movie.synopsis || 'N/A'}</p>
                </div>
            </div>
          </div>
        </div>

        {/* Seção de Sessões */}
        <div className="mt-12">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3"><CalendarIcon className="h-8 w-8 text-red-500"/>Sessões Agendadas</h2>
            <div className="bg-gray-800 shadow-xl rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-700">
                        <thead className="bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Sala</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Início</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Preço Base</th>
                                <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {sessions.length > 0 ? sessions.map(session => (
                                <tr key={session.id} className="hover:bg-gray-700/50">
                                    <td className="px-6 py-4 whitespace-nowrap">{session.roomName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{new Date(session.startsAt).toLocaleString('pt-BR')}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">R$ {session.basePrice.toFixed(2)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <div className="flex items-center justify-center space-x-4">
                                            <button onClick={() => handleEditSession(session.id)} className="text-indigo-400 hover:text-indigo-300" title="Editar Sessão"><PencilSquareIcon className="h-5 w-5"/></button>
                                            <button onClick={() => handleDeleteSession(session.id)} className="text-red-500 hover:text-red-400" title="Excluir Sessão"><TrashIcon className="h-5 w-5"/></button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan="4" className="text-center py-10">Nenhuma sessão agendada para este filme.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

export default AdminMovieView;
