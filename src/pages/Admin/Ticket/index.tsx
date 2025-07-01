// src/pages/Admin/Ticket/index.tsx

import React, { useState, useEffect, ComponentType } from "react";
import { useParams } from "react-router";
import QRCode from "react-qr-code";
import api from "../../../services/api"; // Verifique se o caminho está correto

// A interface PopulatedTicket está ótima como está.
interface PopulatedTicket {
  _id: string;
  qrUuid: string;
  occupantName: string;
  status: string;
  user: {
    firstName: string;
    lastName: string;
  };
  session: {
    startsAt: string;
    movie: {
      title: string;
    };
    room: {
      name: string;
    };
  };
}

const TicketDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [ticket, setTicket] = useState<PopulatedTicket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTicket = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const response = await api.get(`/tickets/ticket/${id}`);
        setTicket(response.data);
      } catch (err) {
        setError("Erro ao carregar o ingresso.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [id]);

  if (loading)
    return <div className="text-white text-center p-10">A carregar...</div>;
  if (error)
    return <div className="text-red-500 text-center p-10">{error}</div>;
  if (!ticket)
    return (
      <div className="text-white text-center p-10">
        Ingresso não encontrado.
      </div>
    );

  return (
    // Container principal para centralizar o ingresso na tela
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      {/* O Cartão do Ingresso */}
      <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 rounded-lg shadow-xl w-full max-w-sm font-sans">
        {/* Cabeçalho do Ingresso */}
        <div className="bg-red-600 text-white p-4 rounded-t-lg text-center">
          <h1 className="text-2xl font-bold">CINEMA ABSOLUTE</h1>
          <p className="text-sm">Ingresso de Acesso</p>
        </div>

        {/* Detalhes do Ingresso */}
        <div className="p-6 space-y-4">
          <div className="text-center">
            <h2 className="text-xl font-bold text-red-500 uppercase tracking-wider">
              {ticket.session?.movie?.title || "Filme não disponível"}
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
                {ticket.session?.room?.name || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Sessão</p>
              <p className="font-semibold text-lg">
                {ticket.session?.startsAt
                  ? new Date(ticket.session.startsAt).toLocaleTimeString(
                      "pt-BR",
                      { hour: "2-digit", minute: "2-digit" }
                    )
                  : "N/A"}
              </p>
            </div>
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
  );
};

export default TicketDetailPage;
