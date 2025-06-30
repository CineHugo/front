import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router';
import api from '../../../../services/api';
import toast, { Toaster } from 'react-hot-toast';
import { ArrowLeftIcon, CalendarIcon } from '@heroicons/react/24/outline';

function AdminSessionNew() {
    const navigate = useNavigate();
    const location = useLocation();
    
    const preselectedMovieId = location.state?.movieId;

    const [movies, setMovies] = useState([]);
    const [rooms, setRooms] = useState([]); // Estado para as salas
    const [formData, setFormData] = useState({
        movieId: preselectedMovieId || '',
        roomId: '', // Será populado pelo select
        startsAt: '',
        durationMin: '',
        basePrice: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    // Efeito para buscar filmes e salas
    useEffect(() => {
        async function fetchData() {
            try {
                const [moviesRes, roomsRes] = await Promise.all([
                    api.get('/movies'),
                    api.get('/rooms')
                ]);
                setMovies(moviesRes.data);
                setRooms(roomsRes.data);
            } catch (error) {
                toast.error("Falha ao carregar dados de filmes ou salas.");
            }
        }
        fetchData();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (!formData.movieId || !formData.roomId || !formData.startsAt || !formData.durationMin || !formData.basePrice) {
            toast.error("Por favor, preencha todos os campos.");
            setIsLoading(false);
            return;
        }

        const payload = {
            ...formData,
            durationMin: Number(formData.durationMin),
            basePrice: Number(formData.basePrice),
            startsAt: new Date(formData.startsAt).toISOString(),
        };
        console.log(payload);

        try {
            await api.post('/sessions/create', payload);
            toast.success("Sessão cadastrada com sucesso!");
            setTimeout(() => navigate('/admin/movies'), 1500);
        } catch (error) {
            console.error("Erro ao criar sessão:", error);
            toast.error(error.response?.data?.message || "Erro ao criar a sessão.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
            <Toaster position="top-right" />
            <div className="max-w-2xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center space-x-3">
                        <CalendarIcon className="h-10 w-10 text-red-600 dark:text-red-500" />
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                            Cadastrar Nova Sessão
                        </h1>
                    </div>
                    <Link
                        to="/admin/movies"
                        className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                    >
                        <ArrowLeftIcon className="h-5 w-5" />
                        Voltar
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl space-y-6">
                    <div>
                        <label htmlFor="movieId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Filme</label>
                        <select
                            id="movieId"
                            name="movieId"
                            value={formData.movieId}
                            onChange={handleInputChange}
                            required
                            className="mt-1 block w-full bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 text-gray-900 dark:text-white"
                        >
                            <option value="" disabled>Selecione um filme</option>
                            {movies.map(movie => (
                                <option key={movie.id} value={movie.id}>
                                    {movie.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* CAMPO DE SALA ATUALIZADO */}
                    <div>
                        <label htmlFor="roomId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Sala de Exibição</label>
                        <select
                            id="roomId"
                            name="roomId"
                            value={formData.roomId}
                            onChange={handleInputChange}
                            required
                            className="mt-1 block w-full bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 text-gray-900 dark:text-white"
                        >
                            <option value="" disabled>Selecione uma sala</option>
                            {rooms.map(room => (
                                <option key={room.id} value={room.id}>
                                    {room.name} (Capacidade: {room.capacity})
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    {/* ... (resto do formulário permanece igual) ... */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="startsAt" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Início da Sessão</label>
                            <input
                                type="datetime-local"
                                name="startsAt"
                                id="startsAt"
                                value={formData.startsAt}
                                onChange={handleInputChange}
                                required
                                className="mt-1 block w-full bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 text-gray-900 dark:text-white"
                            />
                        </div>
                         <div>
                            <label htmlFor="durationMin" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Duração do Filme (minutos)</label>
                            <input
                                type="number"
                                name="durationMin"
                                id="durationMin"
                                value={formData.durationMin}
                                onChange={handleInputChange}
                                placeholder="Ex: 120"
                                required
                                className="mt-1 block w-full bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 text-gray-900 dark:text-white"
                            />
                        </div>
                    </div>

                     <div>
                        <label htmlFor="basePrice" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Preço Base do Ingresso (R$)</label>
                        <input
                            type="number"
                            step="0.01"
                            name="basePrice"
                            id="basePrice"
                            value={formData.basePrice}
                            onChange={handleInputChange}
                            placeholder="Ex: 35.50"
                            required
                            className="mt-1 block w-full bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 text-gray-900 dark:text-white"
                        />
                    </div>

                    <div className="pt-5">
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full md:w-auto flex justify-center py-3 px-8 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none disabled:bg-red-400"
                            >
                                {isLoading ? 'Salvando...' : 'Salvar Sessão'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AdminSessionNew;
