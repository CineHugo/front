// src/pages/Admin/Scanner/index.tsx

import React, { useState, useEffect, ComponentType } from "react";
import BarcodeScanner from "react-zxing";
import type { Result } from "@zxing/library";
import api from "../../../services/api";

// --- Interfaces (sem alterações) ---
interface ScanResult {
  type: "success" | "error";
  message: string;
}
interface BarcodeScannerProps {
  paused: boolean;
  onResult: (result: Result) => void;
  onError: (error: Error) => void;
}

// --- Componente Principal ---
const TicketScannerPage: React.FC = () => {
  const [BarcodeScannerComponent, setBarcodeScannerComponent] =
    useState<ComponentType<BarcodeScannerProps> | null>(null);
  const [manualId, setManualId] = useState("");
  const [result, setResult] = useState<ScanResult | null>(null);
  const [isScannerPaused, setIsScannerPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    import("react-zxing")
      .then((module) => {
        setBarcodeScannerComponent(
          () => module.default as unknown as ComponentType<BarcodeScannerProps>
        );
      })
      .catch((err) =>
        console.error("Falha ao carregar o BarcodeScanner:", err)
      );
  }, []);

  const handleValidate = async (ticketIdentifier: string) => {
    if (!ticketIdentifier || isLoading) return;
    setIsLoading(true);
    setIsScannerPaused(true);
    setResult(null);
    try {
      // Nota: Garanta que você tem esta rota no seu back-end.
      // Se a sua rota for /ticket/:id/use, você precisará de adaptar esta chamada.
      const response = await api.patch("/tickets/validate-by-qr", {
        qrUuid: ticketIdentifier,
      });
      setResult({
        type: "success",
        message: response.data.message || "Ingresso validado com sucesso!",
      });
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Ocorreu um erro na validação.";
      setResult({ type: "error", message: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const resetScanner = () => {
    setResult(null);
    setManualId("");
    setIsScannerPaused(false);
  };

  return (
    // --- Container Principal com Fundo Escuro ---
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4 text-gray-200">
      <div className="w-full max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">
          Scanner de Ingressos
        </h1>

        {/* --- Viewport da Câmara --- */}
        <div className="bg-black rounded-lg overflow-hidden shadow-lg w-full aspect-square relative mb-4">
          {BarcodeScannerComponent ? (
            <BarcodeScannerComponent
              paused={isScannerPaused || isLoading}
              onResult={(result: Result) => {
                if (!isScannerPaused && !isLoading) {
                  handleValidate(result.getText());
                }
              }}
              onError={(error: Error) => {
                if (error.name !== "NotFoundException") {
                  console.error(error);
                }
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <p>A carregar scanner...</p>
            </div>
          )}
          {/* Overlay para feedback visual */}
          {(isScannerPaused || isLoading) && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <p className="text-white font-semibold">
                {isLoading ? "A validar..." : "Pausado"}
              </p>
            </div>
          )}
        </div>

        {/* --- Mensagem de Resultado --- */}
        {result ? (
          <div className="w-full p-4 mb-4 rounded-md text-center">
            <div
              className={`p-4 rounded-lg flex flex-col items-center gap-2 ${
                result.type === "success"
                  ? "bg-green-900/50 text-green-300"
                  : "bg-red-900/50 text-red-400"
              }`}
            >
              <strong className="text-lg">{result.message}</strong>
            </div>
            <button
              onClick={resetScanner}
              className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              Escanear Próximo
            </button>
          </div>
        ) : (
          /* --- Entrada Manual --- */
          <div className="w-full space-y-3">
            <p className="text-center text-sm text-gray-400">
              Aponte a câmera para o QR Code ou insira o código manualmente.
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={manualId}
                onChange={(e) => setManualId(e.target.value)}
                placeholder="Identificador do ingresso"
                className="block w-full px-4 py-2 text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                disabled={isLoading}
              />
              <button
                onClick={() => handleValidate(manualId)}
                disabled={isLoading}
                className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg focus:ring-4 focus:outline-none focus:ring-blue-800 disabled:bg-gray-500"
              >
                Validar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketScannerPage;
