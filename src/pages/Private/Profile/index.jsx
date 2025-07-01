import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import api from "../../../services/api";
import Cookies from "js-cookie";
import { Toaster, toast } from "react-hot-toast";
import {
  TicketIcon,
  EyeIcon,
  UserIcon,
  FilmIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";
import ProfileModal from "../../../components/ProfileModal";

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const userData = Cookies.get("user");
    if (!userData) {
      navigate("/login");
      return;
    }
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);

    async function fetchData() {
      try {
        const [ticketsRes, sessionsRes, moviesRes, roomsRes] =
          await Promise.all([
            api.get("/tickets"),
            api.get("/sessions"),
            api.get("/movies"),
            api.get("/rooms"),
          ]);

        const enrichedTickets = ticketsRes.data
          .map((ticket) => {
            const session = sessionsRes.data.find(
              (s) => s.id === ticket.sessionId
            );
            if (!session) return null;

            const movie = moviesRes.data.find((m) => m.id === session.movieId);
            const room = roomsRes.data.find((r) => r._id === session.roomId);

            return {
              ...ticket,
              movieTitle: movie ? movie.title : "Filme não encontrado",
              roomName: room ? room.name : "Sala não encontrada",
              sessionDate: new Date(session.startsAt).toLocaleString("pt-BR"),
            };
          })
          .filter(Boolean);

        setTickets(enrichedTickets);
      } catch (error) {
        console.error("Erro ao buscar dados do perfil:", error);
        toast.error("Não foi possível carregar seus ingressos.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("user");
    navigate("/");
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gray-900 flex justify-center items-center text-white">
        Carregando perfil...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Toaster position="top-right" />
      <ProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={user}
        onUpdate={setUser}
        currentUser={user}
      />

      <header className="bg-gray-800 shadow-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-20">
          <h1 className="text-2xl font-bold">Meu Perfil</h1>
          <Link
            to="/"
            className="flex items-center gap-2 text-gray-300 hover:text-white"
          >
            <HomeIcon className="h-6 w-6" /> Voltar para Home
          </Link>
        </div>
      </header>

      <main className="container mx-auto p-4 sm:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center">
                  <UserIcon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">
                    {user.firstName} {user.lastName}
                  </h2>
                  <p className="text-sm text-gray-400">{user.email}</p>
                </div>
              </div>
              <div className="space-y-3">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="w-full text-left bg-gray-700 hover:bg-gray-600 p-3 rounded-lg transition"
                >
                  Editar Perfil
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left bg-gray-700 hover:bg-gray-600 p-3 rounded-lg transition"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <TicketIcon className="h-8 w-8 text-red-500" /> Meus Ingressos
            </h2>
            <div className="space-y-4">
              {tickets.length > 0 ? (
                tickets.map((ticket) => (
                  // Envolvemos todo o card com o componente Link
                  // Ele irá para a rota que definimos para o utilizador comum
                  <Link to={`/meus-ingressos/${ticket._id}`} key={ticket._id}>
                    <div className="bg-gray-800 rounded-lg p-4 flex flex-col sm:flex-row justify-between items-center gap-4 hover:bg-gray-700/50 transition cursor-pointer">
                      <div className="flex-1">
                        <p className="font-bold text-lg flex items-center gap-2">
                          <FilmIcon className="h-5 w-5 text-red-400" />{" "}
                          {ticket.movieTitle}
                        </p>
                        <p className="text-gray-400 text-sm mt-1">
                          Sala: {ticket.roomName} | Horário:{" "}
                          {ticket.sessionDate}
                        </p>
                        <p
                          className={`text-sm mt-1 font-semibold ${
                            ticket.status === "active"
                              ? "text-green-400"
                              : "text-yellow-400"
                          }`}
                        >
                          Status:{" "}
                          {ticket.status.charAt(0).toUpperCase() +
                            ticket.status.slice(1)}
                        </p>
                      </div>
                      {/* O botão agora é apenas visual, pois o Link já trata da navegação */}
                      <div className="flex items-center gap-2 bg-red-600 text-white font-bold py-2 px-4 rounded-lg">
                        <EyeIcon className="h-5 w-5" /> Visualizar
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="bg-gray-800 rounded-lg p-8 text-center text-gray-400">
                  <p>Você ainda não possui nenhum ingresso.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Profile;
