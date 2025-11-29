import React, { useEffect, useState } from 'react';
import { ProfileData } from '../types';

interface TerminalOutputProps {
  data: ProfileData;
}

export const TerminalOutput: React.FC<TerminalOutputProps> = ({ data }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return <div className="animate-pulse text-green-700">DECRYPTING PACKETS...</div>;

  return (
    <div className="space-y-6 animate-crt-flicker">
      <div className="border-l-4 border-hacker-green pl-4">
        <h2 className="text-xl font-bold mb-2 text-white bg-hacker-green inline-block px-1 text-black">DADOS PESSOAIS</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-lg">
          <p><span className="text-gray-400">NOME:</span> {data.nome}</p>
          <p><span className="text-gray-400">CPF:</span> {data.cpf}</p>
          <p><span className="text-gray-400">NASCIMENTO:</span> {data.nascimento}</p>
          <p><span className="text-gray-400">SEXO:</span> {data.sexo}</p>
          <p><span className="text-gray-400">IDADE:</span> {data.idade}</p>
          <div className="col-span-1 md:col-span-2 mt-2 border-t border-hacker-dim pt-2">
            <p><span className="text-gray-400">NOME DA MÃE:</span> {data.nome_mae}</p>
            <p><span className="text-gray-400">NOME DO PAI:</span> {data.nome_pai}</p>
          </div>
        </div>
      </div>

      <div className="border-l-4 border-red-600 pl-4">
        <h2 className="text-xl font-bold mb-2 text-white bg-red-600 inline-block px-1 text-black">FINANCEIRO</h2>
        <div className="space-y-1 text-lg">
            <p className="flex items-center gap-2">
                <span className="text-gray-400">POSSUI DÍVIDAS NO SERASA:</span> 
                {data.divida_serasa ? <span className="text-red-500 font-bold blinking">SIM (ALERTA)</span> : <span className="text-hacker-green">NÃO</span>}
            </p>
            <p><span className="text-gray-400">RENDA:</span> R$ {data.renda}</p>
            <p><span className="text-gray-400">PODER AQUISITIVO:</span> {data.poder_aquisitivo}</p>
            <p><span className="text-gray-400">FAIXA:</span> {data.faixa_poder_aquisitivo}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="border border-hacker-dim p-4 relative">
             <div className="absolute -top-3 left-2 bg-black px-2 text-gray-400 text-sm">CONTATO</div>
             <div className="mb-4">
                <p className="text-gray-500 text-sm mb-1">TELEFONES:</p>
                {data.telefones.map((tel, i) => (
                    <p key={i} className="font-mono tracking-wider">{tel}</p>
                ))}
             </div>
             <div>
                <p className="text-gray-500 text-sm mb-1">EMAILS:</p>
                {data.emails.map((email, i) => (
                    <p key={i} className="font-mono">{email}</p>
                ))}
             </div>
        </div>

        <div className="border border-hacker-dim p-4 relative">
            <div className="absolute -top-3 left-2 bg-black px-2 text-gray-400 text-sm">LOCALIZAÇÃO</div>
            <div className="space-y-1">
                <p><span className="text-gray-500 w-24 inline-block">LOGRADOURO:</span> {data.endereco.logradouro}</p>
                <p><span className="text-gray-500 w-24 inline-block">NUMERO:</span> {data.endereco.numero}</p>
                <p><span className="text-gray-500 w-24 inline-block">BAIRRO:</span> {data.endereco.bairro}</p>
                <p><span className="text-gray-500 w-24 inline-block">CIDADE:</span> {data.endereco.cidade}</p>
                <p><span className="text-gray-500 w-24 inline-block">UF:</span> {data.endereco.uf}</p>
                <p><span className="text-gray-500 w-24 inline-block">CEP:</span> {data.endereco.cep}</p>
            </div>
        </div>
      </div>
    </div>
  );
};
