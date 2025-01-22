"use client";

import React, { useEffect, useState } from "react";

interface Invoice {
  idPrestador: string;
  cnpjPrestador: string;
  razaoSocial: string;
  socio: string;
  regProfissional: string;
  // Add other relevant fields from your backend response
}

const TableNotas = () => {
  const [data, setData] = useState<Invoice[]>([]);

  const fetchData = async () => {
    try {
      const response = await fetch(
        `${process.env.API_URL}/api/listarNotas`, // Updated endpoint
        {
          method: "POST", // Use GET method since we're listing data
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();

      if (result && result.notas) { // Ensure the response contains the 'notas' field
        const notas: Invoice[] = result.notas.map((nota: any) => ({
          idPrestador: nota.dadosNota?.idPrestador || "", // Accessing dadosNota
          cnpjPrestador: nota.dadosNota?.cnpjPrestador || "",
          razaoSocial: nota.dadosNota?.razaoSocial || "",
          socio: nota.dadosNota?.socio || "",
          regProfissional: nota.dadosNota?.regProfissional || "",
          // Map any additional fields here if necessary
        }));
        setData(notas);
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
        Lista de Notas Fiscais
      </h4>
      <div className="overflow-x-auto max-h-[80vh] border border-gray-300 rounded-lg bg-white shadow-md">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              {[
                'ID Prestador',
                'CNPJ Prestador',
                'Razão Social',
                'Sócio',
                'Reg. Profissional',
                // Add other column headers here based on your data structure
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
            {data.map((nota, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-3 py-2 text-xs text-gray-600 break-words">{nota.idPrestador}</td>
                <td className="px-3 py-2 text-xs text-gray-600 break-words">{nota.cnpjPrestador}</td>
                <td className="px-3 py-2 text-xs text-gray-600 break-words">{nota.razaoSocial}</td>
                <td className="px-3 py-2 text-xs text-gray-600 break-words">{nota.socio}</td>
                <td className="px-3 py-2 text-xs text-gray-600 break-words">{nota.regProfissional}</td>
                {/* Render other fields here */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableNotas;
