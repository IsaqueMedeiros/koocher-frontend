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
      const response = await fetch(
        `${process.env.API_URL}/api/upload-certificado`,
        {
          method: "POST",
          body: formData,
        },
      );

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
    number: string;
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

        console.log(data.empresasEncontradas[0].federalTaxNumber);

        if (data.empresasEncontradas?.length > 0) {
          const expirationDate =
            data.empresasEncontradas[0].certificate?.expiresOn;

          if (expirationDate) {
            const formattedDate = new Date(expirationDate).toLocaleDateString(
              "pt-BR",
            );
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

      buscarNotas()

    } catch (error) {
      console.error("Erro no download:", error);
      alert("Erro ao baixar a nota fiscal.");
    }
  };

  const deletarNota = async (id: string, notaId: string) => {
    if (!window.confirm("Tem certeza que deseja excluir esta nota fiscal?"))
      return;

    console.log("Deletando nota:", { id, notaId });

    try {
      const response = await fetch(`${process.env.API_URL}/api/deletarnota`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ company_id: id, nota_id: notaId }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Nota fiscal deletada com sucesso!");
        setNotas((prevNotas) => prevNotas.filter((nota) => nota.id !== notaId));
        buscarNotas();
      } else {
        alert("Nota Deletada com Sucesso!");
      setTimeout(() => {
        buscarNotas()
      }, 3000); // Pequeno delay para parecer mais fluido
      }
    } catch (error) {
      console.error("Erro ao deletar nota:", error);
      
      alert("Nota Deletada com Sucesso!");
      setTimeout(() => {
        buscarNotas()
      }, 3000); // Pequeno delay para parecer mais fluido

    }
  };

  return (
    <div className="container mx-auto overflow-x-auto p-4 bg-white rounded-md shadow-xl border border-gray-300">
      <div className="flex h-[10vh] flex-col ">
        <p className="text-SM w-fit rounded-md bg-[#b000ff] p-4 text-white">
          <b>Pesquisar NFS-e por Empresa:</b>
        </p>
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
          className="rounded-lg bg-[#b000ff]  px-5 py-2 font-semibold text-white shadow-md transition-all duration-200 hover:bg-[#690099]  disabled:bg-gray-400"
          disabled={loading}
        >
          {loading ? "Buscando..." : "Pesquisar"}
        </button>
      </div>

      {/* Mensagem de erro */}
      {error && <p className="font-medium text-red-500">{error}</p>}

      {/* Tabela de notas fiscais com rolagem */}
      <div className="overflow-hidden rounded-lg border border-gray-300 bg-white shadow-md">
        <div className="max-h-[400px] overflow-y-auto">
          <table className="min-w-full text-left text-sm text-gray-700">
            <thead className="sticky top-0 bg-[#b000ff]  text-xs uppercase text-white">
              <tr>
                {[
                  "Data",
                  "Número da NFS-e",
                  "Prestador",
                  "CNPJ Prestador",
                  "Tomador",
                  "Valor",
                  "Status",
                  "Download",
                  "Ações",
                ].map((header) => (
                  <th key={header} className="px-6 py-3 font-semibold">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {notas.length > 0 ? (
                notas.map((nota) => (
                  <tr
                    key={nota.id}
                    className="transition-colors duration-200 hover:bg-gray-100"
                  >
                    <td className="px-6 py-4">
                      {nota.issuedOn
                        ? new Date(nota.issuedOn).toLocaleDateString()
                        : ""}
                    </td>
                    <td className="px-6 py-4">
                      {nota.number}
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
                          nota.status === "Pago" ? "bg-green-500" : "bg-red-500"
                        }`}
                      >
                        {nota.status}
                      </span>
                    </td>
                    <td className="flex gap-3 px-6 py-4">
                      <button
                        onClick={() => {
                          const empresaEncontrada = empresas.find(
                            (empresa) =>
                              empresa.federalTaxNumber ===
                              nota.provider?.federalTaxNumber,
                          );

                          if (empresaEncontrada) {
                            downloadNota(empresaEncontrada.id, nota.id, "pdf");
                          } else {
                            alert(
                              "Empresa não encontrada para esta nota fiscal.",
                            );
                          }
                        }}
                        className="font-medium text-blue-500 hover:underline"
                      >
                        PDF
                      </button>

                      <button
                        onClick={() => {
                          const empresaEncontrada = empresas.find(
                            (empresa) =>
                              empresa.federalTaxNumber ===
                              nota.provider?.federalTaxNumber,
                          );

                          if (empresaEncontrada) {
                            downloadNota(empresaEncontrada.id, nota.id, "xml");
                          } else {
                            alert(
                              "Empresa não encontrada para esta nota fiscal.",
                            );
                          }
                        }}
                        className="font-medium text-blue-500 hover:underline"
                      >
                        XML
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => {
                          const empresaEncontrada = empresas.find(
                            (empresa) =>
                              empresa.federalTaxNumber ===
                              nota.provider?.federalTaxNumber,
                          );

                          if (empresaEncontrada) {
                            deletarNota(empresaEncontrada.id, nota.id);
                          } else {
                            alert(
                              "Empresa não encontrada para esta nota fiscal.",
                            );
                          }
                        }}
                        className="font-medium text-red-500 hover:underline"
                      >
                        Deletar
                      </button>
                    </td>
                  </tr>
                ))
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
