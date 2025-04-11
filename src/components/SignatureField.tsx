import React, { useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { Box, Typography, Button } from '@mui/material';

interface SignatureFieldProps {
  label: string;
  value: string | null; // URL da imagem da assinatura ou null
  onChange: (value: string | null) => void;
  required?: boolean;
}

const SignatureField: React.FC<SignatureFieldProps> = ({ label, value, onChange, required }) => {
  const sigCanvas = useRef<SignatureCanvas>(null);
  const [signature, setSignature] = useState<string | null>(value);

  const clearSignature = () => {
    sigCanvas.current?.clear();
    setSignature(null);
    onChange(null);
  };

  const saveSignature = () => {
    if (sigCanvas.current) {
      const dataUrl = sigCanvas.current.toDataURL('image/png');
      setSignature(dataUrl);
      onChange(dataUrl);
    }
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="body1">
        {label}
        {required && <span style={{ color: 'red' }}>*</span>}
      </Typography>
      <SignatureCanvas
        ref={sigCanvas}
        canvasProps={{ width: 500, height: 200, className: 'sigCanvas' }}
        onEnd={saveSignature} // Salva automaticamente ao finalizar o desenho
      />
      <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
        <Button variant="outlined" onClick={clearSignature}>
          Limpar
        </Button>
        <Button variant="contained" onClick={saveSignature}>
          Salvar Assinatura
        </Button>
      </Box>
      {signature && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2">Assinatura Atual:</Typography>
          <img src={signature} alt="Assinatura" style={{ border: '1px solid #ccc', maxWidth: '100%' }} />
        </Box>
      )}
    </Box>
  );
};

export default SignatureField;