"use client";

import React, { useEffect, useState } from "react";

interface Invoice {
  idPrestador: string;
  cnpjPrestador: string;
  razaoSocial: string;
  socio: string;
  regProfissional: string;
}

const TableNotas = () => {
  const [data, setData] = useState<Invoice[]>([]);
  const [totalNotas, setTotalNotas] = useState(0);
  const [totalPrestadores, setTotalPrestadores] = useState(0);
  const [totalTomadores, setTotalTomadores] = useState(0);

  const fetchData = async () => {
    try {
      const response = await fetch(`${process.env.API_URL}/api/listarNotas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (result && result.notas) {
        // Extract the data from the response
        const notas: Invoice[] = result.notas.map((nota: any) => ({
          idPrestador: nota.dadosNota?.idPrestador || "",
          cnpjPrestador: nota.dadosNota?.cnpjPrestador || "",
          razaoSocial: nota.dadosNota?.razaoSocial || "",
          socio: nota.dadosNota?.socio || "",
          regProfissional: nota.dadosNota?.regProfissional || "",
        }));
        setData(notas);

        // Set counts based on the data
        setTotalNotas(notas.length);

        // Counting unique prestadores and tomadores
        const uniquePrestadores = new Set(notas.map(n => n.cnpjPrestador)).size;
        setTotalPrestadores(uniquePrestadores);

        const uniqueTomadores = new Set(notas.map(n => n.socio)).size;
        setTotalTomadores(uniqueTomadores);
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
    <div className="container mx-auto overflow-x-auto p-4">
      <div className="justify-items-around mb-8 flex h-[30vh] flex-col items-center">
        <div className="mt-4 flex gap-4 w-full">
          {/* Card 1 - Total Notas */}
          <div className="flex w-[50%] flex-col justify-between rounded-lg border border-gray-300 bg-white p-4 text-gray-700 shadow-md">
            <div className="flex justify-between">
              <h4 className="text-sm font-medium">Total</h4>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7 7h10M7 11h10M7 15h10M4 4h16v16H4z"
                />
              </svg>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-3xl font-bold text-gray-800">{totalNotas}</span>
              <span className="font-medium text-blue-500">Notas fiscais</span>
            </div>
          </div>

          {/* Card 2 - Prestadores */}
          <div className="flex w-[50%] flex-col justify-between rounded-lg border border-gray-300 bg-white p-4 text-gray-700 shadow-md">
            <div className="flex justify-between">
              <h4 className="text-sm font-medium">Prestadores</h4>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 20h5v-2a4 4 0 00-3-3.87M9 20h6m-6-6h6m-9 3a4 4 0 003-3.87V4m6 0v6m6 0h.01"
                />
              </svg>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-3xl font-bold text-gray-800">{totalPrestadores}</span>
              <span className="font-medium text-blue-500">Ativos</span>
            </div>
          </div>

          {/* Card 3 - Tomadores */}
          <div className="flex w-[50%] flex-col justify-between rounded-lg border border-gray-300 bg-white p-4 text-gray-700 shadow-md">
            <div className="flex justify-between">
              <h4 className="text-sm font-medium">Tomadores</h4>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 20h5v-2a4 4 0 00-3-3.87M9 20h6m-6-6h6m-9 3a4 4 0 003-3.87V4m6 0v6m6 0h.01"
                />
              </svg>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-3xl font-bold text-gray-800">{totalTomadores}</span>
              <span className="font-medium text-blue-500">Ativos</span>
            </div>
          </div>
        </div>

        <div className="mb-4 mt-4 flex h-[15vh] w-full items-center justify-between rounded-lg border-2 border-gray-300 bg-white px-4 shadow-md">
          <div className="flex items-center gap-2">
            <span className="text-lg text-blue-500">
              <i className="fas fa-file-alt"></i>
            </span>
            <h4 className="text-lg font-bold text-gray-700">NOTAS FISCAIS:</h4>
            <span className="font-semibold text-blue-500">{totalNotas}</span>
          </div>
        </div>
      </div>

      <div className="max-h-[80vh] overflow-x-auto rounded-lg border border-gray-300 bg-white shadow-md">
        <table className="min-w-full text-left text-sm text-gray-700">
          <thead className="sticky top-0 z-10 bg-gray-200 text-xs uppercase text-gray-600">
            <tr>
              {[
                "Data",
                "Prestador",
                "Médico",
                "CNPJ Prestador",
                "Tomador",
                "Valor",
                "Status",
              ].map((header) => (
                <th key={header} className="whitespace-nowrap border-r border-gray-300 px-6 py-3 font-semibold tracking-wide last:border-none">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((nota, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className="whitespace-nowrap border-r border-gray-200 px-6 py-4">{nota.idPrestador}</td>
                <td className="whitespace-nowrap border-r border-gray-200 px-6 py-4">{nota.cnpjPrestador}</td>
                <td className="whitespace-nowrap border-r border-gray-200 px-6 py-4">{nota.razaoSocial}</td>
                <td className="whitespace-nowrap border-r border-gray-200 px-6 py-4">{nota.socio}</td>
                <td className="whitespace-nowrap border-r border-gray-200 px-6 py-4">{nota.idPrestador}</td>
                <td className="whitespace-nowrap border-r border-gray-200 px-6 py-4">{nota.cnpjPrestador}</td>
                <td className="whitespace-nowrap border-r border-gray-200 px-6 py-4">{nota.razaoSocial}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableNotas;
