import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import api from "../../../services/api";
import toast, { Toaster } from "react-hot-toast";
import {
  TicketIcon,
  ArrowLeftIcon,
  FilmIcon,
  ClockIcon,
  MapPinIcon,
  UserIcon,
  EnvelopeIcon,
  CreditCardIcon,
} from "@heroicons/react/24/outline";

function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { sessionId, selectedSeats } = location.state || {};

  const [sessionDetails, setSessionDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [buyers, setBuyers] = useState([]);

  useEffect(() => {
    if (!sessionId || !selectedSeats || selectedSeats.length === 0) {
      toast.error("Nenhuma sessão ou assento selecionado.");
      navigate("/");
      return;
    }

    // Inicializa as informações dos compradores para cada assento
    setBuyers(
      selectedSeats.map((seat) => ({
        seatLabel: seat,
        occupantName: "",
        occupantEmail: "",
        occupantCpf: "",
      }))
    );

    // Busca detalhes da sessão para o resumo
    const fetchSessionDetails = async () => {
      try {
        const { data } = await api.get(`/sessions/session/${sessionId}`);
        const [movieRes, roomRes] = await Promise.all([
          api.get(`/movies/movie/${data.movieId}`),
          api.get(`/rooms/room/${data.roomId}`),
        ]);
        setSessionDetails({
          ...data,
          movieTitle: movieRes.data.title,
          roomName: roomRes.data.name,
        });
      } catch (error) {
        console.error("Erro ao buscar detalhes da sessão:", error);
        toast.error("Não foi possível carregar os detalhes da sessão.");
      } finally {
        setLoading(false);
      }
    };

    fetchSessionDetails();
  }, [sessionId, selectedSeats, navigate]);

  const handleBuyerInfoChange = (index, field, value) => {
    const updatedBuyers = [...buyers];
    updatedBuyers[index][field] = value;
    setBuyers(updatedBuyers);
  };

  const validateForm = () => {
    for (const buyer of buyers) {
      if (
        !buyer.occupantName.trim() ||
        !buyer.occupantEmail.trim() ||
        !buyer.occupantCpf.trim()
      ) {
        toast.error(
          `Por favor, preencha todos os campos para o assento ${buyer.seatLabel}.`
        );
        return false;
      }
      if (!/\S+@\S+\.\S+/.test(buyer.occupantEmail)) {
        toast.error(`Email inválido para o assento ${buyer.seatLabel}.`);
        return false;
      }
      if (!/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(buyer.occupantCpf)) {
        toast.error(
          `CPF inválido para o assento ${buyer.seatLabel}. Use o formato XXX.XXX.XXX-XX.`
        );
        return false;
      }
    }
    return true;
  };

  const handleReserveTickets = async () => {
    if (!validateForm()) return;

    setLoading(true);
    // O corpo da requisição está alinhado com o que o controller espera
    const payload = {
      sessionId,
      tickets: buyers,
    };

    try {
      // ROTA CORRIGIDA para /tickets/reserve, conforme seu arquivo de rotas
      await api.post("/tickets/reserve", payload);
      toast.success("Reserva realizada com sucesso!");
      // Redireciona para a página de perfil para ver os ingressos
      setTimeout(() => navigate("/profile"), 2000);
    } catch (error) {
      console.error("Erro na reserva de ingressos:", error);
      const errorMessage =
        error.response?.data?.message || "Falha ao realizar a reserva.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !sessionDetails) {
    return (
      <div className="min-h-screen bg-gray-900 flex justify-center items-center text-white">
        Carregando informações...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 lg:p-8">
      <Toaster position="top-right" />
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
            <TicketIcon className="h-10 w-10 text-red-500" />
            Finalizar Compra
          </h1>
          <Link
            to={`/select-seat/${sessionId}`}
            className="flex items-center gap-2 text-gray-300 hover:text-white"
          >
            <ArrowLeftIcon className="h-5 w-5" /> Voltar
          </Link>
        </header>

        {/* Resumo do Pedido */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg mb-8">
          <h2 className="text-2xl font-bold mb-4 text-red-500">
            Resumo do seu Pedido
          </h2>
          <div className="space-y-3">
            <p className="flex items-center gap-2">
              <FilmIcon className="h-5 w-5" /> <strong>Filme:</strong>{" "}
              {sessionDetails.movieTitle}
            </p>
            <p className="flex items-center gap-2">
              <MapPinIcon className="h-5 w-5" /> <strong>Sala:</strong>{" "}
              {sessionDetails.roomName}
            </p>
            <p className="flex items-center gap-2">
              <ClockIcon className="h-5 w-5" /> <strong>Horário:</strong>{" "}
              {new Date(sessionDetails.startsAt).toLocaleString("pt-BR")}
            </p>
            <p className="flex items-center gap-2">
              <TicketIcon className="h-5 w-5" /> <strong>Assentos:</strong>{" "}
              {selectedSeats.join(", ")}
            </p>
            <p className="text-xl font-bold mt-4">
              Total: R${" "}
              {(sessionDetails.basePrice * selectedSeats.length).toFixed(2)}
            </p>
          </div>
        </div>

        {/* Formulário de Dados dos Compradores */}
        <div className="space-y-6">
          {buyers.map((buyer, index) => (
            <div
              key={buyer.seatLabel}
              className="bg-gray-800 p-6 rounded-xl shadow-lg"
            >
              <h3 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2">
                Dados para o Assento:{" "}
                <span className="text-red-500">{buyer.seatLabel}</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor={`name-${index}`}
                    className="text-sm font-medium text-gray-300 mb-1 flex items-center gap-1"
                  >
                    <UserIcon className="h-4 w-4" />
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    id={`name-${index}`}
                    value={buyer.occupantName}
                    onChange={(e) =>
                      handleBuyerInfoChange(
                        index,
                        "occupantName",
                        e.target.value
                      )
                    }
                    className="w-full bg-gray-700 border-gray-600 rounded-md text-white p-2.5"
                  />
                </div>
                <div>
                  <label
                    htmlFor={`email-${index}`}
                    className="text-sm font-medium text-gray-300 mb-1 flex items-center gap-1"
                  >
                    <EnvelopeIcon className="h-4 w-4" />
                    E-mail
                  </label>
                  <input
                    type="email"
                    id={`email-${index}`}
                    value={buyer.occupantEmail}
                    onChange={(e) =>
                      handleBuyerInfoChange(
                        index,
                        "occupantEmail",
                        e.target.value
                      )
                    }
                    className="w-full bg-gray-700 border-gray-600 rounded-md text-white p-2.5"
                  />
                </div>
                <div>
                  <label
                    htmlFor={`cpf-${index}`}
                    className="text-sm font-medium text-gray-300 mb-1 flex items-center gap-1"
                  >
                    <CreditCardIcon className="h-4 w-4" />
                    CPF (formato: XXX.XXX.XXX-XX)
                  </label>
                  <input
                    type="text"
                    id={`cpf-${index}`}
                    value={buyer.occupantCpf}
                    onChange={(e) =>
                      handleBuyerInfoChange(
                        index,
                        "occupantCpf",
                        e.target.value
                      )
                    }
                    className="w-full bg-gray-700 border-gray-600 rounded-md text-white p-2.5"
                    placeholder="123.456.789-00"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Botão de Confirmação */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleReserveTickets}
            disabled={loading}
            className="w-full md:w-auto flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg transition disabled:bg-gray-500 disabled:cursor-not-allowed"
          >
            <TicketIcon className="h-6 w-6" />
            {loading ? "Processando..." : "Confirmar Reserva"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
