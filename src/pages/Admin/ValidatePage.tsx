// import React, { useState, useEffect } from "react";
// import { useSearchParams, useNavigate } from "react-router";
// import api from "../../services/api";

// interface ValidationResult {
//   type: "success" | "error";
//   message: string;
// }

// const AdminValidatePage = () => {
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();

//   const [manualId, setManualId] = useState("");
//   const [isLoading, setIsLoading] = useState(true);
//   const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);

//     const checkAdminAuth = () => {
//     const user = JSON.parse(localStorage.getItem("user") || "{}");
//     return user && user.isAdmin;
//   };

//   const handleValidation = async (ticketId: string) => {
//     if (!ticketId) return;

//     setIsLoading(true);
//     setValidationResult(null);

//     try {
//       const response = await api.patch(`/tickets/validate/${ticketId}`);
//       setValidationResult({ type: "success", message: response.data.message });
//     } catch (error) {
//       const errorMessage = error.response?.data?.message || "Ocorreu um erro.";
//       setValidationResult({ type: "error", message: errorMessage });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     const isAdmin = checkAdminAuth(); // Implementar esse função
//     if (!isAdmin) {
//       navigate("/login"); // Redireciona se não for admin
//       return;
//     }

//     const ticketIdFromUrl = searchParams.get("ticketId");
//     if (ticketIdFromUrl) {
//       setManualId(ticketIdFromUrl);
//       handleValidation(ticketIdFromUrl);
//     }
//   }, []);

//   const handleManualSubmit = (e) => {
//     e.preventDefault();
//     handleValidation(manualId);
//   };

//   return (
//     <div className="admin-validation-container">
//       <h1>Validação de Ingresso</h1>

//       <form onSubmit={handleManualSubmit}>
//         <label htmlFor="ticketId">Registrar por Identificador (Reg. Id.)</label>
//         <input
//           type="text"
//           id="ticketId"
//           value={manualId}
//           onChange={(e) => setManualId(e.target.value)}
//           placeholder="Digite ou escaneie o ID do ingresso"
//           disabled={isLoading}
//         />
//         <button type="submit" disabled={isLoading}>
//           {isLoading ? 'Validando...' : 'Validar Ingresso'}
//         </button>
//       </form>

//       {validationResult && (
//         <div className={`result-message ${validationResult.type}`}>
//           <p>{validationResult.message}</p>
//         </div>
//       )}
//     </div>
//   );
// };

// src/services/api.mock.js

// Esta função FINGE ser a chamada para o seu backend.
export const mockValidateTicketAPI = (ticketId) => {
  console.log(`(FRONTEND MOCK) Chamando API para validar o ticket: ${ticketId}`);

  return new Promise((resolve, reject) => {
    // Simula o atraso da rede
    setTimeout(() => {
      if (ticketId === 'id-correto-123') {
        resolve({
          data: { message: 'Ingresso validado com sucesso!' }
        });
      } else if (ticketId === 'id-usado-456') {
        reject({
          response: {
            data: { message: 'Este ingresso já foi utilizado.' }
          }
        });
      } else {
        reject({
          response: {
            data: { message: 'Ingresso não encontrado.' }
          }
        });
      }
    }, 1500); // 1.5 segundos de delay
  });
};