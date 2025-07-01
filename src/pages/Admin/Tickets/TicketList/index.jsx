// src/pages/Admin/Tickets/TicketList/index.jsx

import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../../../services/api";
import toast, { Toaster } from "react-hot-toast";
import { ArrowLeftIcon, TicketIcon } from "@heroicons/react/24/outline";

const StatusBadge = ({ status }) => {
  const statusClasses = {
    active:
      "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300",
    used: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300",
    cancelled: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300",
    expired:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300",
  };
  return (
    <span
      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
        statusClasses[status] || "bg-gray-100 text-gray-800"
      }`}
    >
      {status}
    </span>
  );
};

function AdminTicketList() {
  const { movieId } = useParams();
  const [tickets, setTickets] = useState([]);
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [movieRes, sessionsRes, ticketsRes, usersRes] = await Promise.all(
          [
            api.get(`/movies/movie/${movieId}`),
            api.get("/sessions"),
            api.get("/tickets"),
            api.get("/users"),
          ]
        );

        setMovie(movieRes.data);
        const movieSessionIds = sessionsRes.data
          .filter((s) => s.movieId === movieId)
          .map((s) => s.id);
        const movieTickets = ticketsRes.data.filter((t) =>
          movieSessionIds.includes(t.sessionId)
        );

        const enrichedTickets = movieTickets.map((ticket) => {
          const user = usersRes.data.find((u) => u.id === ticket.userId);
          return {
            ...ticket,
            userName: user
              ? `${user.firstName} ${user.lastName}`
              : "Usuário não encontrado",
          };
        });

        setTickets(enrichedTickets);
      } catch (error) {
        toast.error("Falha ao carregar ingressos.", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [movieId]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
      <Toaster position="top-right" />
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <TicketIcon className="h-10 w-10 text-red-600 dark:text-red-500" />
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                Ingressos Vendidos
              </h1>
              <p className="text-gray-500">{movie?.title}</p>
            </div>
          </div>
          <Link
            to="/admin/tickets"
            className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition"
          >
            <ArrowLeftIcon className="h-5 w-5" /> Voltar
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Usuário
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Assento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Data da Compra
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {loading ? (
                  <tr>
                    <td colSpan="4" className="text-center py-10 text-gray-500">
                      Carregando ingressos...
                    </td>
                  </tr>
                ) : tickets.length > 0 ? (
                  tickets.map((ticket) => (
                    <tr key={ticket._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {ticket.userName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {ticket.seatLabel}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <StatusBadge status={ticket.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {new Date(ticket.createdAt).toLocaleDateString("pt-BR")}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-10 text-gray-500">
                      Nenhum ingresso vendido para este filme.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminTicketList;
