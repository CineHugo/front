// src/pages/Admin/Ticket/index.tsx

import React, { useState, useEffect, ComponentType } from "react";
import { useParams, Link } from "react-router";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import QRCode from "react-qr-code";
import api from "../../../services/api"; // Verifique se o caminho está correto

interface Ticket {
  _id: string;
  sessionId: string;
  userId: string;
  seatLabel: string;
  occupantName: string;
  occupantCpf: string;
  occupantEmail: string;
  qrUuid: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

interface Session {
  _id: string;
  movieId: string;
  roomId: string;
  startsAt: string;
  endsAt: string;
  durationMin: number;
  basePrice: number;
  roomDetails: {
    _id: string;
    name: string;
    seatMap: Array<{
      label: string;
      row: string;
      col: number;
    }>;
    capacity: number;
  };
  ticketsInfo: {
    soldCount: number;
    availableCount: number;
    soldSeats: string[];
  };
}

interface Movie {
  id: string;
  title: string;
  synopsis: string;
  releaseDate: string;
  mainImageUrl: string;
  bannerImageUrl: string;
}

const TicketDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTicketData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        
        // 1. Buscar dados do ticket
        const ticketResponse = await api.get(`/tickets/ticket/${id}`);
        const ticketData = ticketResponse.data;
        setTicket(ticketData);

        // 2. Buscar dados da sessão usando sessionId
        const sessionResponse = await api.get(`/sessions/session/${ticketData.sessionId}`);
        const sessionData = sessionResponse.data;
        setSession(sessionData);

        // 3. Buscar dados do filme usando movieId da sessão
        const movieResponse = await api.get(`/movies/movie/${sessionData.movieId}`);
        const movieData = movieResponse.data;
        setMovie(movieData);

      } catch (err) {
        setError("Erro ao carregar o ingresso.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTicketData();
  }, [id]);

  if (loading)
    return <div className="text-white text-center p-10">A carregar...</div>;
  if (error)
    return <div className="text-red-500 text-center p-10">{error}</div>;
  if (!ticket || !session || !movie)
    return (
      <div className="text-white text-center p-10">
        Ingresso não encontrado.
      </div>
    );

  return (
    // 2. Ajuste o container principal para alinhar os itens
    <div className="min-h-screen bg-gray-900 flex flex-col items-center p-4 sm:p-8">
      <div className="w-full max-w-sm">
        {/* 3. Adicione o cabeçalho com o botão Voltar */}
        <header className="mb-6">
          <Link
            to="/profile"
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors text-lg"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            Voltar
          </Link>
        </header>

        {/* O Cartão do Ingresso */}
        <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 rounded-lg shadow-xl w-full font-sans">
          {/* Cabeçalho do Ingresso */}
          <div className="bg-red-600 text-white p-4 rounded-t-lg text-center">
            <h1 className="text-2xl font-bold">CINEMA ABSOLUTE</h1>
            <p className="text-sm">Ingresso de Acesso</p>
          </div>

          {/* Detalhes do Ingresso */}
          <div className="p-6 space-y-4">
            <div className="text-center">
              <h2 className="text-xl font-bold text-red-500 uppercase tracking-wider">
                {movie.title}
              </h2>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Espectador
              </p>
              <p className="font-semibold text-lg">{ticket.occupantName}</p>
            </div>
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Sala</p>
                <p className="font-semibold text-lg">
                  {session.roomDetails.name}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Sessão
                </p>
                <p className="font-semibold text-lg">
                  {new Date(session.startsAt).toLocaleTimeString(
                    "pt-BR",
                    { hour: "2-digit", minute: "2-digit" }
                  )}
                </p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Assento</p>
              <p className="font-semibold text-lg">{ticket.seatLabel}</p>
            </div>
          </div>

          {/* Linha Pontilhada e QR Code */}
          <div className="border-t-2 border-dashed border-gray-300 dark:border-gray-600 my-2"></div>

          <div className="p-6 flex flex-col items-center gap-4">
            <div
              style={{
                background: "white",
                padding: "16px",
                borderRadius: "8px",
              }}
            >
              <QRCode value={ticket.qrUuid || ""} size={180} />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                Identificador Único
              </p>
              <code className="text-center block text-sm">{ticket.qrUuid}</code>
            </div>
          </div>

          {/* Rodapé do Ingresso */}
          <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-b-lg text-center">
            <p className="text-xs text-gray-600 dark:text-gray-300">
              Apresente este código na entrada da sala.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetailPage;
