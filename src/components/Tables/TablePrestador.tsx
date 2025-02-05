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
  razaoSocial: string; // Adicionado campo Razão Social
  idCadastro: string; // Adicionado campo Id Cadastro
  telefone: string; // Adicionado campo Telefone
  emailEmpresa: string; // Adicionado campo Email Empresa
  dataAbertura: string; // Adicionado campo Data Abertura
  agencia: string; // Adicionado campo Agência
  banco: string; // Adicionado campo Banco
  conta: string; // Adicionado campo Conta
  cep: string; // Adicionado campo CEP
  rua: string; // Adicionado campo Rua
  numero: string; // Adicionado campo Número
  complemento: string; // Adicionado campo Complemento
  cidade: string; // Adicionado campo Cidade
  bairro: string; // Adicionado campo Bairro
  uf: string; // Adicionado campo UF
  paisOrigem: string; // Adicionado campo País de Origem
  senhaCertificadoDigital: string; // Adicionado campo Senha Certificado Digital
  usuarioPrefeitura: string; // Adicionado campo Usuário Prefeitura
  senhaPrefeitura: string; // Adicionado campo Senha Prefeitura
  usuarioDEISS: string; // Adicionado campo Usuário DEISS
  senhaDEISS: string; // Adicionado campo Senha DEISS
  regimeTrib: string; // Adicionado campo Regime Tributário
  naturezaJuridica: string; // Adicionado campo Natureza Jurídica
  inscricaoMunicipal: string; // Adicionado campo Inscrição Municipal
  codServico: string; // Adicionado campo Cód. Serviço
  sections: Section[]; // Seções que contêm os campos
}
const TablePrestador = () => {
  const [data, setData] = useState<Prestador[]>([]);

  const fetchData = async () => {
    try {
      const response = await fetch(
        `${process.env.API_URL}/api/listarprestadores`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const result = await response.json();

      if (result && result.prestadores) {
        const prestadores: Prestador[] = result.prestadores.map(
          (prestador: any) => ({
            cnpj: prestador.Cnpj, // Corrigido para prestador.Cnpj
            razaoSocial: prestador.RazaoSocial, // Incluído campo Razão Social
            idCadastro: prestador.IdCadastro?.toString() || "", // Incluído campo IdCadastro
            telefone: prestador.Telefone || "", // Incluído campo Telefone
            emailEmpresa: prestador.EmailEmpresa || "", // Incluído campo Email Empresa
            dataAbertura: prestador.DataAbertura || "", // Incluído campo Data Abertura
            agencia: prestador.Agencia || "", // Incluído campo Agência
            banco: prestador.Banco || "", // Incluído campo Banco
            conta: prestador.Conta || "", // Incluído campo Conta
            cep: prestador.Cep || "", // Incluído campo CEP
            rua: prestador.Rua || "", // Incluído campo Rua
            numero: prestador.Numero || "", // Incluído campo Número
            complemento: prestador.Complemento || "", // Incluído campo Complemento
            cidade: prestador.Cidade || "", // Incluído campo Cidade
            bairro: prestador.Bairro || "", // Incluído campo Bairro
            uf: prestador.Uf || "", // Incluído campo UF
            paisOrigem: prestador.PaisOrigem || "", // Incluído campo País de Origem
            senhaCertificadoDigital: prestador.SenhaCertificadoDigital || "", // Incluído campo Senha Certificado Digital
            usuarioPrefeitura: prestador.UsuarioPrefeitura || "", // Incluído campo Usuário Prefeitura
            senhaPrefeitura: prestador.SenhaPrefeitura || "", // Incluído campo Senha Prefeitura
            usuarioDEISS: prestador.UsuarioDEISS || "", // Incluído campo Usuário DEISS
            senhaDEISS: prestador.SenhaDEISS || "", // Incluído campo Senha DEISS
            regimeTrib: prestador.RegimeTrib || "", // Incluído campo Regime Tributário
            naturezaJuridica: prestador.NaturezaJuridica || "", // Incluído campo Natureza Jurídica
            inscricaoMunicipal: prestador.InscricaoMunicipal || "", // Incluído campo Inscrição Municipal
            codServico: prestador.CodServico || "", // Incluído campo Cód. Serviço
            sections: [
              {
                title: "Empresa",
                fields: [
                  {
                    label: "Razão Social",
                    name: "razaoSocial",
                    placeholder: prestador.RazaoSocial,
                  },
                  {
                    label: "Id de Cadastro",
                    name: "idCadastro",
                    placeholder: prestador.IdCadastro?.toString() || "",
                  },
                  {
                    label: "Email da Empresa",
                    name: "emailEmpresa",
                    placeholder: prestador.EmailEmpresa,
                  },
                  {
                    label: "Data de Abertura",
                    name: "dataAbertura",
                    placeholder: prestador.DataAbertura || "",
                  },
                  {
                    label: "Agência",
                    name: "agencia",
                    placeholder: prestador.Agencia || "",
                  },
                  {
                    label: "Banco",
                    name: "banco",
                    placeholder: prestador.Banco || "",
                  },
                  {
                    label: "Conta",
                    name: "conta",
                    placeholder: prestador.Conta || "",
                  },
                ],
              },
              {
                title: "Endereço",
                fields: [
                  {
                    label: "CEP",
                    name: "cep",
                    placeholder: prestador.Cep || "",
                  },
                  {
                    label: "Rua",
                    name: "rua",
                    placeholder: prestador.Rua || "",
                  },
                  {
                    label: "Número",
                    name: "numero",
                    placeholder: prestador.Numero || "",
                  },
                  {
                    label: "Complemento",
                    name: "complemento",
                    placeholder: prestador.Complemento || "",
                  },
                  {
                    label: "Cidade",
                    name: "cidade",
                    placeholder: prestador.Cidade || "",
                  },
                  {
                    label: "Bairro",
                    name: "bairro",
                    placeholder: prestador.Bairro || "",
                  },
                  { label: "UF", name: "uf", placeholder: prestador.Uf || "" },
                  {
                    label: "País de Origem",
                    name: "paisOrigem",
                    placeholder: prestador.PaisOrigem || "",
                  },
                ],
              },
              {
                title: "Acessos",
                fields: [
                  {
                    label: "Senha Certificado Digital",
                    name: "senhaCertificadoDigital",
                    placeholder: prestador.SenhaCertificadoDigital || "",
                  },
                  {
                    label: "Usuário Prefeitura",
                    name: "usuarioPrefeitura",
                    placeholder: prestador.UsuarioPrefeitura || "",
                  },
                  {
                    label: "Senha Prefeitura",
                    name: "senhaPrefeitura",
                    placeholder: prestador.SenhaPrefeitura || "",
                  },
                  {
                    label: "Usuário DEISS",
                    name: "usuarioDEISS",
                    placeholder: prestador.UsuarioDEISS || "",
                  },
                  {
                    label: "Senha DEISS",
                    name: "senhaDEISS",
                    placeholder: prestador.SenhaDEISS || "",
                  },
                ],
              },
              {
                title: "Fiscal",
                fields: [
                  {
                    label: "Regime Tributário",
                    name: "regimeTrib",
                    placeholder: prestador.RegimeTrib || "",
                  },
                  {
                    label: "Natureza Jurídica",
                    name: "naturezaJuridica",
                    placeholder: prestador.NaturezaJuridica || "",
                  },
                  {
                    label: "Inscrição Municipal",
                    name: "inscricaoMunicipal",
                    placeholder: prestador.InscricaoMunicipal || "",
                  },
                  {
                    label: "Cód. Serviço",
                    name: "codServico",
                    placeholder: prestador.CodServico || "",
                  },
                ],
              },
            ],
          }),
        );
        setData(prestadores);
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
      <h4 className="sticky top-0 z-10 mb-4 bg-white py-2 text-center text-lg font-bold shadow-sm">
        Lista de Prestadores
      </h4>
      <div className="max-h-[80vh] overflow-x-auto rounded-lg border border-gray-300 bg-white shadow-md">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="sticky top-0 z-10 bg-gray-50">
            <tr>
              {[
                "CNPJ",
                "ID",
                "Razão Social",
                "Telefone",
                "Email",
                "Abertura",
                "Agência",
                "Banco",
                "Conta",
                "CEP",
                "Rua",
                "Nº",
                "Comp.",
                "Cidade",
                "Bairro",
                "UF",
                "País",
                "Senha Cert.",
                "Usuário Pref.",
                "Senha Pref.",
                "Usuário DEISS",
                "Senha DEISS",
                "Regime",
                "Natureza",
                "Inscrição Mun.",
                "Cód. Serv.",
              ].map((header) => (
                <th
                  key={header}
                  className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-700"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {data.map((prestador, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="break-words px-3 py-2 text-xs text-gray-600">
                  {prestador.cnpj}
                </td>
                <td className="break-words px-3 py-2 text-xs text-gray-600">
                  {prestador.idCadastro}
                </td>
                <td className="break-words px-3 py-2 text-xs text-gray-600">
                  {prestador.razaoSocial}
                </td>
                <td className="break-words px-3 py-2 text-xs text-gray-600">
                  {prestador.telefone}
                </td>
                <td className="break-words px-3 py-2 text-xs text-gray-600">
                  {prestador.emailEmpresa}
                </td>
                <td className="break-words px-3 py-2 text-xs text-gray-600">
                  {prestador.dataAbertura}
                </td>
                <td className="break-words px-3 py-2 text-xs text-gray-600">
                  {prestador.agencia}
                </td>
                <td className="break-words px-3 py-2 text-xs text-gray-600">
                  {prestador.banco}
                </td>
                <td className="break-words px-3 py-2 text-xs text-gray-600">
                  {prestador.conta}
                </td>
                <td className="break-words px-3 py-2 text-xs text-gray-600">
                  {prestador.cep}
                </td>
                <td className="break-words px-3 py-2 text-xs text-gray-600">
                  {prestador.rua}
                </td>
                <td className="break-words px-3 py-2 text-xs text-gray-600">
                  {prestador.numero}
                </td>
                <td className="break-words px-3 py-2 text-xs text-gray-600">
                  {prestador.complemento}
                </td>
                <td className="break-words px-3 py-2 text-xs text-gray-600">
                  {prestador.cidade}
                </td>
                <td className="break-words px-3 py-2 text-xs text-gray-600">
                  {prestador.bairro}
                </td>
                <td className="break-words px-3 py-2 text-xs text-gray-600">
                  {prestador.uf}
                </td>
                <td className="break-words px-3 py-2 text-xs text-gray-600">
                  {prestador.paisOrigem}
                </td>
                <td className="break-words px-3 py-2 text-xs text-gray-600">
                  {prestador.senhaCertificadoDigital}
                </td>
                <td className="break-words px-3 py-2 text-xs text-gray-600">
                  {prestador.usuarioPrefeitura}
                </td>
                <td className="break-words px-3 py-2 text-xs text-gray-600">
                  {prestador.senhaPrefeitura}
                </td>
                <td className="break-words px-3 py-2 text-xs text-gray-600">
                  {prestador.usuarioDEISS}
                </td>
                <td className="break-words px-3 py-2 text-xs text-gray-600">
                  {prestador.senhaDEISS}
                </td>
                <td className="break-words px-3 py-2 text-xs text-gray-600">
                  {prestador.regimeTrib}
                </td>
                <td className="break-words px-3 py-2 text-xs text-gray-600">
                  {prestador.naturezaJuridica}
                </td>
                <td className="break-words px-3 py-2 text-xs text-gray-600">
                  {prestador.inscricaoMunicipal}
                </td>
                <td className="break-words px-3 py-2 text-xs text-gray-600">
                  {prestador.codServico}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TablePrestador;
