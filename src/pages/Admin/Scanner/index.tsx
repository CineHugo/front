// src/pages/Admin/Scanner/index.tsx

import React, { useState, useEffect, ComponentType } from 'react'; // Adicione ComponentType aqui
import type { Result } from '@zxing/library';
import api from '../../../services/api';

interface ScanResult {
  type: 'success' | 'error';
  message: string;
}

interface BarcodeScannerProps {
  paused: boolean;
  onResult: (result: Result) => void;
  onError: (error: Error) => void;
}

const TicketScannerPage: React.FC = () => {
  const [BarcodeScannerComponent, setBarcodeScannerComponent] = useState<ComponentType<BarcodeScannerProps> | null>(null);
  
  const [manualId, setManualId] = useState('');
  const [result, setResult] = useState<ScanResult | null>(null);
  const [isScannerPaused, setIsScannerPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    import('react-zxing')
      .then(module => {
        // AQUI ESTÁ A CORREÇÃO FINAL COM A ASSERÇÃO DE TIPO
        setBarcodeScannerComponent(() => module.default as unknown as ComponentType<BarcodeScannerProps>);
      })
      .catch(err => console.error("Falha ao carregar o BarcodeScanner dinamicamente:", err));
  }, []);

  const handleValidate = async (ticketIdentifier: string) => {
    if (!ticketIdentifier || isLoading) return;

    setIsLoading(true);
    setIsScannerPaused(true);
    setResult(null);

    try {
      const response = await api.patch('/api/tickets/validate-by-qr', { qrUuid: ticketIdentifier });
      setResult({ type: 'success', message: response.data.message || 'Ingresso validado!' });
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Ocorreu um erro na validação.';
      setResult({ type: 'error', message: errorMessage });
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        setResult(null);
        setIsScannerPaused(false);
      }, 5000);
    }
  };

  return (
    <div className="scanner-page">
      <h1>Scanner de Ingressos</h1>
      
      <div style={{ width: '400px', margin: '20px auto' }}>
        {BarcodeScannerComponent ? (
          <BarcodeScannerComponent
            paused={isScannerPaused}
            onResult={(result: Result) => {
              if (!isScannerPaused) {
                handleValidate(result.getText());
              }
            }}
            onError={(error: Error) => {
              if (error.name !== 'NotFoundException') {
                  console.error(error);
              }
            }}
          />
        ) : (
          <p>A carregar scanner...</p>
        )}
      </div>
      
      {isScannerPaused && !isLoading && <p>Câmara em pausa. Reativando em breve...</p>}
      {isLoading && <p>A validar...</p>}

      <div className="manual-entry">
        <h3>Entrada Manual</h3>
        <input 
          type="text" 
          value={manualId}
          onChange={(e) => setManualId(e.target.value)}
          placeholder="Insira o identificador"
          disabled={isLoading}
        />
        <button onClick={() => handleValidate(manualId)} disabled={isLoading}>
          {isLoading ? 'A validar...' : 'Validar Código'}
        </button>
      </div>

      {result && (
        <div 
          className="result-message" 
          style={{ 
            color: result.type === 'success' ? 'green' : 'red',
            marginTop: '20px',
            padding: '10px',
            border: `2px solid ${result.type === 'success' ? 'green' : 'red'}`
          }}
        >
          <strong>{result.message}</strong>
        </div>
      )}
    </div>
  );
};

export default TicketScannerPage;