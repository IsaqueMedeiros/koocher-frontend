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
  uf: string; // Adicionado campo UF
  municipio: string; // Adicionado campo Município
  codigoCidadeIBGE: string; // Adicionado campo Código Cidade IBGE
  codigoServicoFederal: string; // Adicionado campo Código Serviço Federal
  codigoServicoMunicipal: string; // Adicionado campo Código Serviço Municipal
  descricao: string; // Adicionado campo Descrição
  taxaISS: string; // Adicionado campo Taxa ISS
  taxaIR: string; // Adicionado campo Taxa IR
  taxaPIS: string; // Adicionado campo Taxa PIS
  taxaCOFINS: string; // Adicionado campo Taxa COFINS
  taxaCSLL: string; // Adicionado campo Taxa CSLL
  taxaINSS: string; // Adicionado campo Taxa INSS
  sections: Section[]; // Seções que contêm os campos
}

const TableCodServico = () => {
  const [data, setData] = useState<Prestador[]>([]);

  const fetchData = async () => {
    try {
      const response = await fetch(
        `https://7d90-187-111-23-250.ngrok-free.app/api/listarcodigos`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      const result = await response.json();
  
      if (result && result.CodigosServico) {
        const CodigosServico: Prestador[] = result.CodigosServico.map((prestador: any) => ({
          uf: prestador.uf || "",  // Verifique o nome correto do campo
          municipio: prestador.municipio || "",  // Verifique o nome correto do campo
          codigoCidadeIBGE: prestador.codigoCidadeIBGE || "",  // Código Cidade IBGE
          codigoServicoFederal: prestador.codigoServicoFederal || "",  // Código Serviço Federal
          codigoServicoMunicipal: prestador.codigoServicoMunicipal || "",  // Código Serviço Municipal
          descricao: prestador.descricao || "",  // Descrição
          taxaISS: prestador.taxaISS || "",  // Taxa ISS
          taxaIR: prestador.taxaIR || "",  // Taxa IR
          taxaPIS: prestador.taxaPIS || "",  // Taxa PIS
          taxaCOFINS: prestador.taxaCOFINS || "",  // Taxa COFINS
          taxaCSLL: prestador.taxaCSLL || "",  // Taxa CSLL
          taxaINSS: prestador.taxaINSS || "",  // Taxa INSS
          sections: [
            {
              title: "Dados Região",
              fields: [
                { label: "UF", name: "uf", placeholder: "UF" },
                { label: "Município", name: "municipio", placeholder: "Município" },
                { label: "Código Cidade IBGE", name: "codigoCidadeIBGE", placeholder: "Código Cidade IBGE" },
                { label: "Código Serviço Federal", name: "codigoServicoFederal", placeholder: "Código Serviço Federal" },
                { label: "Código Serviço Municipal", name: "codigoServicoMunicipal", placeholder: "Código Serviço Municipal" },
                { label: "Descrição", name: "descricao", placeholder: "Descrição" },
              ],
            },
            {
              title: "Taxas",
              fields: [
                { label: "Taxa ISS", name: "taxaISS", placeholder: "Taxa ISS" },
                { label: "Taxa IR", name: "taxaIR", placeholder: "Taxa IR" },
                { label: "Taxa PIS", name: "taxaPIS", placeholder: "Taxa PIS" },
                { label: "Taxa COFINS", name: "taxaCOFINS", placeholder: "Taxa COFINS" },
                { label: "Taxa CSLL", name: "taxaCSLL", placeholder: "Taxa CSLL" },
                { label: "Taxa INSS", name: "taxaINSS", placeholder: "Taxa INSS" },
              ],
            },
          ],
        }));
        setData(CodigosServico);
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
        Lista de Códigos de Serviço
      </h4>
      <div className="overflow-x-auto max-h-[80vh] border border-gray-300 rounded-lg bg-white shadow-md">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              {[
                'UF',
                'Município',
                'Código Cidade IBGE',
                'Código Serviço Federal',
                'Código Serviço Municipal',
                'Descrição',
                'Taxa ISS',
                'Taxa IR',
                'Taxa PIS',
                'Taxa COFINS',
                'Taxa CSLL',
                'Taxa INSS',
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
                <td className="px-3 py-2 text-xs text-gray-600 break-words">{prestador.uf}</td>
                <td className="px-3 py-2 text-xs text-gray-600 break-words">{prestador.municipio}</td>
                <td className="px-3 py-2 text-xs text-gray-600 break-words">{prestador.codigoCidadeIBGE}</td>
                <td className="px-3 py-2 text-xs text-gray-600 break-words">{prestador.codigoServicoFederal}</td>
                <td className="px-3 py-2 text-xs text-gray-600 break-words">{prestador.codigoServicoMunicipal}</td>
                <td className="px-3 py-2 text-xs text-gray-600 break-words">{prestador.descricao}</td>
                <td className="px-3 py-2 text-xs text-gray-600 break-words">{prestador.taxaISS}</td>
                <td className="px-3 py-2 text-xs text-gray-600 break-words">{prestador.taxaIR}</td>
                <td className="px-3 py-2 text-xs text-gray-600 break-words">{prestador.taxaPIS}</td>
                <td className="px-3 py-2 text-xs text-gray-600 break-words">{prestador.taxaCOFINS}</td>
                <td className="px-3 py-2 text-xs text-gray-600 break-words">{prestador.taxaCSLL}</td>
                <td className="px-3 py-2 text-xs text-gray-600 break-words">{prestador.taxaINSS}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableCodServico;

