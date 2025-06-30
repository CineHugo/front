// src/pages/TicketDetail/index.tsx

import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import QRCode from "react-qr-code";
import api from "../../../services/api";

// Crie uma interface para os dados que vêm da sua API
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
  const { id } = useParams<{ id: string }>(); // Pega o ID da URL, ex: /ingressos/ID_VEM_AQUI
  const [ticket, setTicket] = useState<PopulatedTicket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTicket = async () => {
      if (!id) return;
      try {
        setLoading(true);
        // Chama o endpoint que acabámos de testar e corrigir!
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

  if (loading) return <div>A carregar...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (!ticket) return <div>Ingresso não encontrado.</div>;

  return (
    <div className="ticket-card">
      <h1>Ingresso de Cinema</h1>
      <h2>{ticket.session.movie.title}</h2>
      <p>
        <strong>Espectador:</strong> {ticket.occupantName}
      </p>
      <p>
        <strong>Sessão:</strong>{" "}
        {new Date(ticket.session.startsAt).toLocaleString("pt-BR")}
      </p>
      <p>
        <strong>Sala:</strong> {ticket.session.room.name}
      </p>

      <div className="qr-section">
        {/* O valor do QR Code deve ser algo único. O qrUuid é perfeito para isso. */}
        <div
          style={{
            background: "white",
            padding: "16px",
            display: "inline-block",
          }}
        >
          <QRCode value={ticket.qrUuid} size={200} />
        </div>
        <p>
          <strong>Identificador:</strong> <code>{ticket.qrUuid}</code>
        </p>
      </div>
      <p>Apresente este código na entrada do cinema.</p>
    </div>
  );
};

export default TicketDetailPage;
