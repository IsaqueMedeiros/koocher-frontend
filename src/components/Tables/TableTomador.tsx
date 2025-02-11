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
    <div className="container mx-auto overflow-x-auto p-6">
    <h4 className="sticky top-0 z-10 mb-6 bg-[#b000ff] text-white p-10 text-center text-xl font-semibold shadow-lg rounded-lg">
      Lista de Tomadores
    </h4>
    <div className="max-h-[80vh] overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-lg">
      <table className="min-w-full border border-gray-300 shadow-lg rounded-lg overflow-hidden">
        <thead className="sticky top-0 z-10 bg-gray-200 text-gray-700">
          <tr>
            {[
              "CNPJ", "Razão Social", "CEP", "Rua", "Nº", "Comp.", "Cidade", "Bairro", "UF", "País"
            ].map((header) => (
              <th
                key={header}
                className="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wide text-gray-700 border border-gray-300 whitespace-nowrap"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {data.map((prestador, index) => (
            <tr key={index} className="hover:bg-gray-100 transition-all duration-200">
              {[
                prestador.cnpj, prestador.razaoSocial, prestador.cep, prestador.rua,
                prestador.numero, prestador.complemento, prestador.cidade, prestador.bairro,
                prestador.uf, prestador.paisOrigem
              ].map((item, idx) => (
                <td key={idx} className="px-6 py-4 text-center text-sm text-gray-700 border border-gray-300">
                  {item}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
  

  );
};

export default TableTomador;
