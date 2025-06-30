import { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import toast, { Toaster } from 'react-hot-toast';
import { ArrowLeftIcon, TicketIcon, FilmIcon, ClockIcon, MapPinIcon } from '@heroicons/react/24/outline';
import Cookies from 'js-cookie';
import api from '../../../services/api';

const Seat = ({ seat, status, isSelected, onSelect }) => {
    const baseClasses = "w-8 h-8 md:w-10 md:h-10 rounded-t-lg flex items-center justify-center font-bold text-xs cursor-pointer transition-colors";
    
    let statusClasses = "bg-gray-600 hover:bg-red-500 text-white"; 
    if (status === 'occupied') {
        statusClasses = "bg-gray-400 dark:bg-gray-700 cursor-not-allowed text-gray-800 dark:text-gray-500";
    }
    if (isSelected) {
        statusClasses = "bg-red-600 text-white ring-2 ring-offset-2 ring-offset-gray-900 ring-red-500";
    }

    const handleClick = () => {
        if (status !== 'occupied') {
            onSelect(seat.label);
        }
    };

    return <div className={`${baseClasses} ${statusClasses}`} onClick={handleClick}>{seat.label}</div>;
};


function SeatMap() {
    const { sessionId } = useParams();
    const navigate = useNavigate();

    const [session, setSession] = useState(null);
    const [room, setRoom] = useState(null);
    const [movie, setMovie] = useState(null);
    const [occupiedSeats, setOccupiedSeats] = useState([]);
    const [selectedSeat, setSelectedSeat] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = Cookies.get('token');
        if (!token) {
            toast.error("Você precisa estar logado para selecionar um assento.");
            navigate('/login');
            return;
        }

        async function fetchData() {
            try {
                const [sessionRes, ticketsRes] = await Promise.all([
                    api.get(`/sessions/session/${sessionId}`),
                    api.get(`/tickets?sessionId=${sessionId}`)
                ]);

                const sessionData = sessionRes.data;
                console.log(sessionData); 
                const ticketsData = ticketsRes.data;
                
                const [roomRes, movieRes] = await Promise.all([
                    api.get(`/rooms/room/${sessionData.roomId}`),
                    api.get(`/movies/movie/${sessionData.movieId}`)
                ]);

                setSession(sessionData);
                setRoom(roomRes.data);
                setMovie(movieRes.data);
                setOccupiedSeats(ticketsData.map(ticket => ticket.seatLabel));

            } catch (error) {
                console.error("Erro ao carregar dados do mapa de assentos:", error);
                toast.error("Não foi possível carregar os detalhes da sessão.");
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [sessionId, navigate]);

    const seatRows = useMemo(() => {
        if (!room) return [];
        const rows = {};
        room.seatMap.forEach(seat => {
            if (!rows[seat.row]) {
                rows[seat.row] = [];
            }
            rows[seat.row].push(seat);
        });
        return Object.values(rows);
    }, [room]);
    
    const handleProceedToPurchase = () => {
        if (!selectedSeat) {
            toast.error("Por favor, selecione um assento.");
            return;
        }
        toast.success(`Assento ${selectedSeat} selecionado! Próximo passo: checkout.`);
    };

    if (loading) return <div className="min-h-screen bg-gray-900 flex justify-center items-center text-white">Carregando mapa da sala...</div>;
    if (!session || !room || !movie) return <div className="min-h-screen bg-gray-900 flex justify-center items-center text-white">Dados da sessão não encontrados.</div>;

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <Toaster position="top-right" />
            <header className="bg-gray-800 p-4 shadow-lg">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="flex-1">
                        <h1 className="text-xl md:text-2xl font-bold truncate">{movie.title}</h1>
                        <p className="text-sm text-gray-400 flex items-center gap-2">
                            <MapPinIcon className="h-4 w-4"/>{room.name} | <ClockIcon className="h-4 w-4"/>{new Date(session.startsAt).toLocaleString('pt-BR')}
                        </p>
                    </div>
                    <Link to={`/movie/${movie.id}`} className="flex items-center gap-2 text-gray-300 hover:text-white">
                        <ArrowLeftIcon className="h-5 w-5" /> Voltar
                    </Link>
                </div>
            </header>

            <main className="container mx-auto p-4 md:p-8">
                <div className="flex flex-col items-center">
                    {/* Tela do Cinema */}
                    <div className="w-full max-w-2xl h-4 bg-white mb-2 rounded-t-full opacity-50"></div>
                    <div className="w-full max-w-3xl h-2 bg-white mb-12 rounded-t-full shadow-lg shadow-white/20"></div>
                    
                    {/* Mapa de Assentos */}
                    <div className="space-y-2 mb-8">
                        {seatRows.map((row, rowIndex) => (
                            <div key={rowIndex} className="flex items-center justify-center gap-2">
                                <div className="w-8 text-center font-bold text-gray-400">{row[0].row}</div>
                                {row.map(seat => (
                                    <Seat 
                                        key={seat.label}
                                        seat={seat}
                                        status={occupiedSeats.includes(seat.label) ? 'occupied' : 'available'}
                                        isSelected={selectedSeat === seat.label}
                                        onSelect={setSelectedSeat}
                                    />
                                ))}
                                <div className="w-8 text-center font-bold text-gray-400">{row[0].row}</div>
                            </div>
                        ))}
                    </div>

                    {/* Legenda e Botão de Compra */}
                    <div className="w-full max-w-3xl bg-gray-800/50 backdrop-blur-sm p-4 rounded-lg flex flex-col md:flex-row justify-between items-center gap-4 sticky bottom-4 border border-gray-700">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2"><div className="w-5 h-5 rounded-t-lg bg-gray-600"></div><span>Disponível</span></div>
                            <div className="flex items-center gap-2"><div className="w-5 h-5 rounded-t-lg bg-red-600"></div><span>Selecionado</span></div>
                            <div className="flex items-center gap-2"><div className="w-5 h-5 rounded-t-lg bg-gray-700"></div><span>Ocupado</span></div>
                        </div>
                        <button 
                            onClick={handleProceedToPurchase}
                            disabled={!selectedSeat}
                            className="w-full md:w-auto flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg transition disabled:bg-gray-500 disabled:cursor-not-allowed"
                        >
                            <TicketIcon className="h-5 w-5" />
                            Prosseguir com a Compra
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default SeatMap;
