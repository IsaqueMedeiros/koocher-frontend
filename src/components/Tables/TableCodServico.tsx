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
        `${process.env.API_URL}/api/listarcodigos`,
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
    <div className="container mx-auto overflow-x-auto p-6">
  <h4 className="sticky top-0 z-10 mb-6 bg-[#b000ff] text-white p-10 text-center text-xl font-semibold shadow-lg rounded-lg">
    Lista de Códigos de Serviços
  </h4>
  <div className="max-h-[80vh] overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-lg">
    <table className="min-w-full border border-gray-300 shadow-lg rounded-lg overflow-hidden">
      <thead className="sticky top-0 z-10 bg-gray-200 text-gray-700">
        <tr>
          {[
            "UF", "Município", "Código Cidade IBGE", "Código Serviço Federal", "Código Serviço Municipal", "Descrição", 
            "Taxa ISS", "Taxa IR", "Taxa PIS", "Taxa COFINS", "Taxa CSLL", "Taxa INSS"
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
              prestador.uf, prestador.municipio, prestador.codigoCidadeIBGE, prestador.codigoServicoFederal, prestador.codigoServicoMunicipal, 
              prestador.descricao, prestador.taxaISS, prestador.taxaIR, prestador.taxaPIS, prestador.taxaCOFINS, 
              prestador.taxaCSLL, prestador.taxaINSS
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

export default TableCodServico;

