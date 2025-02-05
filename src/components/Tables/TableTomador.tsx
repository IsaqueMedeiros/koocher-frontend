"use client";

import React, { useEffect, useState } from "react";

interface Field {
  label: string;
  name: string;
  placeholder: string;
}

interface Section {
  title: string;
  fields: Field[];
}

interface Prestador {
  cnpj: string;
  razaoSocial: string;           
  inscricaoMunicipal: string;  // Adicionado campo Inscrição Municipal
  cep: string;                  // Adicionado campo CEP
  rua: string;                  // Adicionado campo Rua
  numero: string;               // Adicionado campo Número
  complemento: string;          // Adicionado campo Complemento
  cidade: string;               // Adicionado campo Cidade
  bairro: string;               // Adicionado campo Bairro
  uf: string;                   // Adicionado campo UF
  paisOrigem: string;   
  sections: Section[]; // Seções que contêm os campos

}
const TableTomador = () => {
  const [data, setData] = useState<Prestador[]>([]);

  const fetchData = async () => {
    try {
      const response = await fetch(
        `${process.env.API_URL}/api/listartomadores`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      const result = await response.json();
  
      if (result && result.Tomadores) {
        const Tomadores: Prestador[] = result.Tomadores.map((prestador: any) => ({
          cnpj: prestador.Cnpj,  // Corrigido para prestador.Cnpj
          razaoSocial: prestador.RazaoSocial, // Incluído campo Razão Social
          cep: prestador.Cep || "",  // Incluído campo CEP
          rua: prestador.Rua || "",  // Incluído campo Rua
          numero: prestador.Numero || "",  // Incluído campo Número
          complemento: prestador.Complemento || "",  // Incluído campo Complemento
          cidade: prestador.Cidade || "",  // Incluído campo Cidade
          bairro: prestador.Bairro || "",  // Incluído campo Bairro
          uf: prestador.Uf || "",  // Incluído campo UF
          paisOrigem: prestador.PaisOrigem || "",  // Incluído campo País de Origem
          sections: [
            {
              title: "Dados",
              fields: [
                { label: "Razão Social", name: "razaoSocial", placeholder: "Razão Social" },
                { label: "Inscrição Municipal", name: "inscricaoMunicipal", placeholder: "Inscrição Municipal" },
   
   
              ],
            },
            {
              title: "Endereço",
              fields: [
                { label: "CEP", name: "cep", placeholder: "Insira seu CEP" },
                { label: "Rua", name: "rua", placeholder: "Insira sua rua" },
                { label: "Número", name: "numero", placeholder: "Número da rua" },
                { label: "Complemento", name: "complemento", placeholder: "Complemento" },
                { label: "Cidade", name: "cidade", placeholder: "Cidade" },
                { label: "Bairro", name: "bairro", placeholder: "Bairro" },
                { label: "UF", name: "uf", placeholder: "UF" },
                { label: "País de Origem", name: "paisOrigem", placeholder: "País de Origem" },
              ],
            },
          ],
        }));
        setData(Tomadores);
      } else {
        console.error("Dados recebidos não têm o formato esperado:", result);
      }
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    }
  };
  
  
  

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="container mx-auto p-4 overflow-x-auto">
  <h4 className="text-lg font-bold mb-4 text-center bg-white sticky top-0 z-10 py-2 shadow-sm">
    Lista de Prestadores
  </h4>
  <div className="overflow-x-auto max-h-[80vh] border border-gray-300 rounded-lg bg-white shadow-md">
    <table className="min-w-full divide-y divide-gray-300">
      <thead className="bg-gray-50 sticky top-0 z-10">
        <tr>
          {[
            'CNPJ',
            'Razão Social',
            'CEP',
            'Rua',
            'Nº',
            'Comp.',
            'Cidade',
            'Bairro',
            'UF',
            'País',
          ].map((header) => (
            <th
              key={header}
              className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide"
            >
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {data.map((prestador, index) => (
          <tr key={index} className="hover:bg-gray-50">
            <td className="px-3 py-2 text-xs text-gray-600 break-words">{prestador.cnpj}</td>
            <td className="px-3 py-2 text-xs text-gray-600 break-words">{prestador.cep}</td>
            <td className="px-3 py-2 text-xs text-gray-600 break-words">{prestador.rua}</td>
            <td className="px-3 py-2 text-xs text-gray-600 break-words">{prestador.numero}</td>
            <td className="px-3 py-2 text-xs text-gray-600 break-words">{prestador.complemento}</td>
            <td className="px-3 py-2 text-xs text-gray-600 break-words">{prestador.cidade}</td>
            <td className="px-3 py-2 text-xs text-gray-600 break-words">{prestador.bairro}</td>
            <td className="px-3 py-2 text-xs text-gray-600 break-words">{prestador.uf}</td>
            <td className="px-3 py-2 text-xs text-gray-600 break-words">{prestador.paisOrigem}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

  );
};

export default TableTomador;
