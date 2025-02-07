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
        const uniquePrestadores = new Set(notas.map((n) => n.cnpjPrestador))
          .size;
        setTotalPrestadores(uniquePrestadores);

        const uniqueTomadores = new Set(notas.map((n) => n.socio)).size;
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

  // Funções para realizar o envio do certificado digital para o backend

  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");


const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  if (event.target.files && event.target.files.length > 0) {
    setFile(event.target.files[0]);
  }
};

const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  setPassword(event.target.value);
};


const handleUpload = async () => {
  if (!file || !password) {
    alert("Por favor, selecione um arquivo e digite a senha.");
    return;
  }

  if (empresas.length === 0) {
    alert("Nenhuma empresa encontrada para associar o CNPJ.");
    return;
  }

  const cnpj = empresas[0]?.federalTaxNumber;
  if (!cnpj) {
    alert("CNPJ não encontrado.");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("password", password);
  formData.append("cnpj", cnpj);

  setLoading(true);
  try {
    const response = await fetch(`${process.env.API_URL}/api/upload-certificado`, {
      method: "POST",
      body: formData,
    });

    const result = await response.json();
    if (response.ok) {
      alert("Certificado enviado com sucesso!");
    } else {
      alert(result.error || "Erro ao enviar certificado.");
    }
  } catch (err) {
    alert("Falha ao enviar certificado.");
  } finally {
    setLoading(false);
  }
};


  // Notas Fiscais nfe.io
  interface NotaFiscal {
    id: string;
    issuedOn?: string;
    provider?: {
      name?: string;
      federalTaxNumber?: string;
    };
    borrower?: {
      name?: string;
    };
    amountNet?: number;
    status: string;
    pdfUrl: string;
    xmlUrl: string;
    companyId: string;
  }

  interface Empresa {
    id: string;
    name: string;
    federalTaxNumber: string;
    certificate?: {
      expiresOn?: string;
    };
  }

  const [nomeEmpresa, setNomeEmpresa] = useState<string>("");
  const [notas, setNotas] = useState<NotaFiscal[]>([]);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  

  const [certExpiration, setCertExpiration] = useState("");
const [isCertExpired, setIsCertExpired] = useState(false);

const buscarNotas = async () => {
  setLoading(true);
  setError("");
  setNotas([]);
  setEmpresas([]);

  try {
    const response = await fetch(`${process.env.API_URL}/api/buscarpornome`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nome_empresa: nomeEmpresa }),
    });

    const data = await response.json();

    if (response.ok) {
      setNotas(data.notas);
      setEmpresas(data.empresasEncontradas || []);

      console.log(data.empresasEncontradas[0].federalTaxNumber)

      if (data.empresasEncontradas?.length > 0) {
        const expirationDate = data.empresasEncontradas[0].certificate?.expiresOn;

        if (expirationDate) {
          const formattedDate = new Date(expirationDate).toLocaleDateString("pt-BR");
          setCertExpiration(formattedDate);

          // Verifica se a data já expirou
          const today = new Date();
          const certDate = new Date(expirationDate);
          setIsCertExpired(certDate < today);
        }
      }
    } else {
      setError(data.error || "Erro ao buscar notas fiscais");
    }
  } catch (err) {
    setError("Falha ao buscar notas fiscais");
  } finally {
    setLoading(false);
  }
};


  const downloadNota = async (
    id: string,
    notaId: string,
    tipo: "pdf" | "xml",
  ) => {
    try {
      const response = await fetch(
        `${process.env.API_URL}/api/nota/download/${id}/${notaId}/${tipo}`,
        {
          method: "POST",
        },
      );

      if (!response.ok) {
        throw new Error(
          `Erro ao baixar a nota fiscal. Status: ${response.status}`,
        );
      }

      const contentType = response.headers.get("Content-Type");
      if (
        !contentType ||
        (tipo === "pdf" && !contentType.includes("pdf")) ||
        (tipo === "xml" && !contentType.includes("xml"))
      ) {
        throw new Error(
          `O arquivo baixado não é do tipo esperado. Content-Type: ${contentType}`,
        );
      }

      const blob = await response.blob();
      if (blob.size === 0) {
        throw new Error("O arquivo baixado está vazio.");
      }

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `nota-${notaId}.${tipo}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);

      console.log("Status da resposta:", response.status);
      console.log(
        "Cabeçalhos da resposta:",
        Array.from(response.headers.entries()),
      );
    } catch (error) {
      console.error("Erro no download:", error);
      alert("Erro ao baixar a nota fiscal.");
    }
  };

const deletarNota = async (id: string, notaId: string) => {
  if (!window.confirm("Tem certeza que deseja excluir esta nota fiscal?")) return;

  console.log("Deletando nota:", { id, notaId });

  try {
    const response = await fetch(`${process.env.API_URL}/api/deletarnota`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({ company_id: id, nota_id: notaId }),
    });

    const data = await response.json();
    if (response.ok) {
      alert("Nota fiscal deletada com sucesso!");
      setNotas((prevNotas) => prevNotas.filter((nota) => nota.id !== notaId));
    } else {
      alert(data.error || "Erro ao deletar nota fiscal.");
    }
  } catch (error) {
    console.error("Erro ao deletar nota:", error);
    alert("Erro ao deletar nota fiscal.");
  }
};



  return (
    <div className="container mx-auto overflow-x-auto p-4">

<div className="my-6 rounded-lg border border-gray-300 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-800">
  {/* Título */}
  <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">
    Gerenciamento de Certificado Digital
  </h2>

  {/* Data de Expiração do Certificado */}
  <div className="mb-4 flex flex-col gap-2">
    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
      Data de Expiração do Certificado Digital:
    </label>
    <div
      className={`flex items-center justify-between rounded-md px-4 py-2 text-sm font-semibold shadow ${
        isCertExpired ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300" : "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
      }`}
    >
      <span>{certExpiration ? certExpiration : "Nenhuma data encontrada"}</span>
      {isCertExpired ? (
        <span className="ml-2 flex items-center">
          <svg className="h-5 w-5 text-red-600 dark:text-red-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M4.293 4.293a1 1 0 011.414 0L12 10.586l6.293-6.293a1 1 0 111.414 1.414L13.414 12l6.293 6.293a1 1 0 01-1.414 1.414L12 13.414l-6.293 6.293a1 1 0 01-1.414-1.414L10.586 12 4.293 5.707a1 1 0 010-1.414z" />
          </svg>
          <span className="ml-1">Certificado Expirado</span>
        </span>
      ) : (
        <span className="ml-2 flex items-center">
          <svg className="h-5 w-5 text-green-600 dark:text-green-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="ml-1">Certificado Válido</span>
        </span>
      )}
    </div>
  </div>

  {/* Upload de Certificado */}
   {/* Upload de Certificado */}
   <div className="mb-4">
      <label htmlFor="fileUpload" className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Upload de Certificado Digital:
      </label>
      <div className="mt-1 flex w-full items-center justify-center rounded-lg border border-dashed border-gray-400 bg-gray-50 p-4 text-gray-600 shadow-sm hover:border-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300">
        <input
          type="file"
          id="fileUpload"
          className="hidden"
          onChange={handleFileChange}
        />
        <label
          htmlFor="fileUpload"
          className="cursor-pointer rounded-md bg-blue-600 px-5 py-2 text-white transition hover:bg-blue-700"
        >
          Selecionar Arquivo
        </label>
      </div>
    </div>

    {/* Senha do Certificado */}
    <div className="mb-4">
      <label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Senha do Certificado Digital:
      </label>
      <input
        type="password"
        id="password"
        placeholder="Digite a senha do certificado"
        className="mt-1 w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
        value={password}
        onChange={handlePasswordChange}
      />
    </div>

    {/* Botão de Envio */}
    <button
      type="button"
      onClick={handleUpload}
      disabled={loading}
      className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-blue-800 px-5 py-3 text-white shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg dark:from-blue-500 dark:to-blue-700"
    >
      {loading ? "Enviando..." : "Enviar Arquivo"}
    </button>
  </div>



      <div className="justify-items-around flex h-[15vh] flex-col items-center">
        <div className="mt-4 flex w-full gap-4">
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
              <span className="text-3xl font-bold text-gray-800">
                {totalNotas}
              </span>
              <span className="font-medium text-blue-500">Notas fiscais</span>
              <div></div>
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
              <span className="text-3xl font-bold text-gray-800">
                {totalPrestadores}
              </span>
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
              <span className="text-3xl font-bold text-gray-800">
                {totalTomadores}
              </span>
              <span className="font-medium text-blue-500">Ativos</span>
            </div>
          </div>
        </div>
      </div>

      {/* Input para digitar o nome da empresa */}
      <div className="mb-4 flex items-center gap-4">
        <input
          type="text"
          placeholder="Digite o nome da empresa"
          value={nomeEmpresa}
          onChange={(e) => setNomeEmpresa(e.target.value)}
          className="w-full rounded-lg border p-3 shadow-sm outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={buscarNotas}
          className="rounded-lg bg-blue-600 px-5 py-2 font-semibold text-white shadow-md transition-all duration-200 hover:bg-blue-700 disabled:bg-gray-400"
          disabled={loading}
        >
          {loading ? "Buscando..." : "Pesquisar"}
        </button>
      </div>

      {/* Mensagem de erro */}
      {error && <p className="font-medium text-red-500">{error}</p>}

      {/* Tabela de notas fiscais com rolagem */}
      <div className="overflow-hidden rounded-lg border bg-white shadow-lg">
        <div className="max-h-[400px] overflow-y-auto">
          <table className="min-w-full text-left text-sm text-gray-700">
            <thead className="sticky top-0 bg-gray-200 text-xs uppercase text-gray-600">
              <tr>
                {[
                  "Data",
                  "Prestador",
                  "CNPJ Prestador",
                  "Tomador",
                  "Valor",
                  "Status",
                  "Download",
                ].map((header) => (
                  <th key={header} className="px-6 py-3 font-semibold">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {notas.length > 0 ? (
                notas.map((nota) => {
                  return (
                    <tr
                      key={nota.id}
                      className="transition-all hover:bg-gray-100"
                    >
                      <td className="px-6 py-4">
                        {nota.issuedOn
                          ? new Date(nota.issuedOn).toLocaleDateString()
                          : ""}
                      </td>
                      <td className="px-6 py-4">
                        {nota.provider ? nota.provider.name : ""}
                      </td>
                      <td className="px-6 py-4">
                        {nota.provider ? nota.provider.federalTaxNumber : ""}
                      </td>
                      <td className="px-6 py-4">
                        {nota.borrower ? nota.borrower.name : ""}
                      </td>
                      <td className="px-6 py-4 font-semibold text-green-600">
                        {nota.amountNet}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium text-white ${
                            nota.status === "Pago"
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        >
                          {nota.status}
                        </span>
                      </td>

                      <td className="flex gap-3 px-6 py-4">
  <button
    onClick={() => {
      const empresaEncontrada = empresas.find(
        (empresa) => empresa.federalTaxNumber === nota.provider?.federalTaxNumber
      );

      if (empresaEncontrada) {
        downloadNota(empresaEncontrada.id, nota.id, "pdf");
      } else {
        alert("Empresa não encontrada para esta nota fiscal.");
      }
    }}
    className="font-medium text-blue-500 hover:underline"
  >
    PDF
  </button>

  <button
    onClick={() => {
      const empresaEncontrada = empresas.find(
        (empresa) => empresa.federalTaxNumber === nota.provider?.federalTaxNumber
      );

      if (empresaEncontrada) {
        downloadNota(empresaEncontrada.id, nota.id, "xml");
      } else {
        alert("Empresa não encontrada para esta nota fiscal.");
      }
    }}
    className="font-medium text-blue-500 hover:underline"
  >
    XML
  </button>

  <button
    onClick={() => {
      const empresaEncontrada = empresas.find(
        (empresa) => empresa.federalTaxNumber === nota.provider?.federalTaxNumber
      );

      if (empresaEncontrada) {
        deletarNota(empresaEncontrada.id, nota.id);
      } else {
        alert("Empresa não encontrada para esta nota fiscal.");
      }
    }}
    className="font-medium text-red-500 hover:underline"
  >
    Deletar
  </button>
</td>

                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-4 text-center font-medium text-gray-500"
                  >
                    Nenhuma nota encontrada
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TableNotas;
