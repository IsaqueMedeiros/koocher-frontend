"use client";

import { useState, useRef, useEffect } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/16/solid";
import { Buffer } from "buffer";
// import CodigoServico from "@/pages/api/CodigoServico";

const FormNotas = () => {
  const [showModal, setShowModal] = useState(false); // Controla o modal de Quadro Societário
  const [activeTab, setActiveTab] = useState(0); // Controla a aba ativa
  //States para funções CNPJ
  const [cnpjList, setCnpjList] = useState<string[]>([]); // Lista de CNPJs cadastrados
  const [showCnpjList, setShowCnpjList] = useState(false);
  const cnpjListRef = useRef<HTMLUListElement | null>(null);
  //States para funções codigo de serviço
  const [servicoList, setServicoList] = useState<CodigoServico[]>([]);
  const [showServicoList, setShowServicoList] = useState(false);
  const servicoListRef = useRef<HTMLUListElement | null>(null);
  const [codigoServico, setCodigoServico] = useState<string>("");

  {
    /*----> Codigos para lista de serviço  <---- */
  }

  interface CodigoServico {
    chaveUnica: string;
    descricao: string;
  }

  const handleServicoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormDataState((prevState) => ({ ...prevState, [name]: value }));
  };
  const handleServicoSearchClick = async () => {
    // Fetch the data when the search button is clicked
    try {
      const response = await fetch(
        "https://7d90-187-111-23-250.ngrok-free.app/api/listarcodigos",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        },
      );

      if (!response.ok) {
        throw new Error("Erro ao buscar os dados");
      }

      const result = await response.json();
      setServicoList(result.CodigosServico); // Update the servicoList state
      setShowServicoList(true); // Show the list once the data is fetched
    } catch (error) {
      console.error("Erro ao carregar os dados", error);
    }
  };

  const handleServicoSelect = (service: string | CodigoServico) => {
    const code =
      typeof service === "string"
        ? service
        : `${service.chaveUnica} - ${service.descricao}`;
    setFormDataState((prevState) => ({
      ...prevState,
      codServico: code,
    }));
  };

  useEffect(() => {
    console.log("Service list visibility changed:", showServicoList);
  }, [showServicoList]);

  {
    /*----> Codigos para lista de serviço (FIM) <---- */
  }



  interface FormDataState {
    cep: string;
    rua: string;
    numero: string;
    complemento: string;
    cidade: string;
    bairro: string;
    uf: string;
    IdCadastro: string;
    medicos: string;
    Cnpj: string;
    razaoSocial: string;
    emailEmpresa: string;
    paisOrigem: string;
    dataAbertura: string;
    regimeTrib: string;
    naturezaJuridica: string;
    inscricaoMunicipal: string;
    agencia: string;
    banco: string;
    conta: string;
    certificadoDigital: string;
    usuarioPrefeitura: string;
    senhaPrefeitura: string;
    usuarioDEISS: string;
    senhaDEISS: string;
    status: string;
    senhaCertificadoDigital: string;
    codServico: string;
  }

  const [formDataState, setFormDataState] = useState<FormDataState>({
    cep: "",
    rua: "",
    numero: "",
    complemento: "",
    cidade: "",
    bairro: "",
    uf: "",
    IdCadastro: "",
    medicos: "",
    Cnpj: "",
    razaoSocial: "",
    emailEmpresa: "",
    paisOrigem: "",
    dataAbertura: "",
    regimeTrib: "",
    naturezaJuridica: "",
    inscricaoMunicipal: "",
    agencia: "",
    banco: "",
    conta: "",
    certificadoDigital: "",
    usuarioPrefeitura: "",
    senhaPrefeitura: "",
    usuarioDEISS: "",
    senhaDEISS: "",
    status: "",
    senhaCertificadoDigital: "",
    codServico: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormDataState((prevState) => {


      return {
        ...prevState,
      };
    });
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    // Adiciona um novo sócio antes de enviar os dados
    setFormDataState((prevState) => {

      return {
        ...prevState,
        codServico: codigoServico,
      };
    });

    // Envia os dados ao backend
    try {
      const updatedFormData = {
        ...formDataState,
      };

      const response = await fetch(
        `https://7d90-187-111-23-250.ngrok-free.app/api/cadastroprestador`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedFormData),
        },
      );

      if (response.ok) {
        const result = await response.json();
        console.log("Dados enviados com sucesso:", result);

        if (formDataState.Cnpj) {
          const cnpjSemBarras = formDataState.Cnpj.replace(/[^\d]/g, "");
          localStorage.setItem("cnpj", cnpjSemBarras);
          console.log("CNPJ salvo no localStorage:", cnpjSemBarras);
        }

        // Lógica após o envio bem-sucedido (ex. limpar formulário ou mostrar mensagem de sucesso)
      } else {
        console.error("Erro ao enviar os dados:", response.statusText);
      }
    } catch (error) {
      console.error("Erro ao enviar os dados:", error);
    }
  };

  const handleCnpjSelect = (selectedCnpj: string) => {
    const prestador = cnpjListData.find((p: any) => p.Cnpj === selectedCnpj);

    if (prestador) {
      const expectedKeys = [
        "nome",
        "registroProfissional",
        "email",
        "telefone",
        "cpf",
      ];

      setFormDataState((prevState) => ({
        ...prevState,
        IdCadastro: prestador.idCadastro || "",
        Cnpj: prestador.Cnpj || "",
        razaoSocial: prestador.RazaoSocial || "",
        emailEmpresa: prestador.EmailEmpresa || "",
        paisOrigem: prestador.PaisOrigem || "",
        dataAbertura: prestador.DataAbertura || "",
        regimeTrib: prestador.RegimeTributario || "",
        naturezaJuridica: prestador.NaturezaJuridica || "",
        inscricaoMunicipal: prestador.InscricaoMunicipal || "",
        agencia: prestador.Agencia || "",
        banco: prestador.Banco || "",
        conta: prestador.Conta || "",
      }));
    }

    setShowCnpjList(false);
  };

  // Certifique-se de que você tem um estado para armazenar os dados completos dos prestadores
  const [cnpjListData, setCnpjListData] = useState<any[]>([]);

  // E modifique handleSearchClick para armazenar todos os dados dos prestadores
  const handleSearchClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Previne a ação padrão de um botão

    try {
      const cnpj = formDataState.Cnpj;

      const response = await fetch(
        "https://7d90-187-111-23-250.ngrok-free.app/api/listarprestadores",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ cnpj }),
        },
      );

      if (!response.ok) {
        throw new Error("Erro ao buscar os dados do prestador");
      }

      const data = await response.json();
      const prestadores = data.prestadores || [];

      // Armazena todos os dados dos prestadores
      setCnpjListData(prestadores);

      // Atualiza apenas a lista de CNPJs para mostrar na UI
      setCnpjList(prestadores.map((prestador: any) => prestador.Cnpj));

      setShowCnpjList(true);
    } catch (error) {
      console.error("Erro ao buscar dados do prestador:", error);
    }
  };

  const sections = [
    {
      title: "Empresa",
      fields: [
        {
          label: "Razão Social",
          name: "razaoSocial",
          placeholder: "Razão Social",
        },
        {
          label: "Insc. Estadual",
          name: "inscricaoestadual",
          placeholder: "Insc. Estadual",
        },
        {
          label: "Nome Fantasia",
          name: "emailEmpresa",
          placeholder: "Nome Fantasia",
        },
        {
          label: "Natureza da Nota",
          name: "naturezaNota",
          placeholder: "Natureza da Nota",
        },
        {
          label: "data de emissão do RPS",
          name: "dataEmisaoRPS",
          placeholder: "data de emissão do RPS",
        },
        {
          label: "Data de competência",
          name: "dataCompetencia",
          placeholder: "Data de competência",
        },
        {
          label: "Data de emissão da NFS-e",
          name: "dataEmissaoNF",
          placeholder: "Data de emissão da NFS-e",
        },
      ],
    },
    {
      title: "Tomador",
      fields: [
        {
          label: "CNPJ cliente",
          name: "razaoSocial",
          placeholder: "CNPJ cliente",
        },
        {
          label: "Razão social cliente",
          name: "inscricaoestadual",
          placeholder: "Razão social cliente",
        },
        {
          label: "Rua do Tomador",
          name: "emailEmpresa",
          placeholder: "Rua do Tomador",
        },
        {
          label: "Número do Tomador",
          name: "naturezaNota",
          placeholder: "Número do Tomador",
        },
        {
          label: "Bairro do Tomador",
          name: "dataEmisaoRPS",
          placeholder: "Bairro do Tomador",
        },
        {
          label: "Cidade do Tomador",
          name: "dataCompetencia",
          placeholder: "Cidade do Tomador",
        },
        {
          label: "UF do Tomador",
          name: "dataEmissaoNF",
          placeholder: "UF do Tomador",
        },
        {
          label: "CEP do Tomador",
          name: "dataEmissaoNF",
          placeholder: "CEP do Tomador",
        },
        {
          label: "E-MAIL do Tomador",
          name: "dataEmissaoNF",
          placeholder: "E-MAIL do Tomador",
        },
      ],
    },
    {
      title: "Fiscal",
      fields: [
        {
          label: "Valor desconto",
          name: "valorDesconto",
          placeholder: "Valor desconto",
        },
        {
          label: "Total da Nota",
          name: "totalNota",
          placeholder: "Total da Nota",
        },
        {
          label: "Total Liquido",
          name: "TotalLiquido",
          placeholder: "Total Liquido",
        },
        {
          label: "Observações Complementares",
          name: "obsComplmenetares",
          placeholder: "Observações Complementares",
          extra: "",
        },
      ],
    },
    {
      title: "Dados de tributos",
      fields: [
        {
          label: "Alíquota ISS %",
          name: "aliquataISS",
          placeholder: "Alíquota ISS",
        },
        {
          label: "Alíquota IR %",
          name: "aliquotaIR",
          placeholder: "Alíquota IR",
        },
        {
          label: "Valor IR",
          name: "valorIR",
          placeholder: "Valor IR",
        },
        {
          label: "Valor Deduções",
          name: "obsComplmenetares",
          placeholder: "Valor Deduções",
        },
        {
          label: "Alíquota CSLL %",
          name: "obsComplmenetares",
          placeholder: "Alíquota CSLL",
        },
        {
          label: "Base Cálculo ISS",
          name: "obsComplmenetares",
          placeholder: "Base Cálculo ISS",
        },
        {
          label: "Alíquota PIS %",
          name: "aliquotaPIS",
          placeholder: "Alíquota PIS",
        },
        {
          label: "Valor PIS",
          name: "valorPIS",
          placeholder: "Valor PIS",
        },
        {
          label: "Valor ISS",
          name: "valorISS",
          placeholder: "Valor ISS",
        },
        {
          label: "Alíquota COFINS %",
          name: "aliquotaCOFINS",
          placeholder: "Alíquota COFINS",
        },
        {
          label: "Valor COFINS",
          name: "valorCOFINS",
          placeholder: "Valor COFINS",
        },
        {
          label: "Alíquota INSS %",
          name: "aliquotaINSS",
          placeholder: "Alíquota INSS %",
        },
        {
          label: "Valor INSS",
          name: "valorINSS",
          placeholder: "Valor INSS",
          //Verificar se é retido
        },
      ],
    },
  ];

  return (
    <div className="bg-transparent p-6">
      <div className="mb-6 flex border-b">
        {sections.map((section, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`w-full p-4 text-center ${
              activeTab === index
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-500"
            }`}
          >
            {section.title}
          </button>
        ))}
      </div>
      <div style={{ minHeight: "400px" }}>
        <form className="grid w-full grid-cols-2 gap-4 sm:grid-cols-2">
          {/* Campo CNPJ */}
          {activeTab === 0 && (
            <div className="mb-4 flex flex-col">
              <label
                htmlFor="cnpj"
                className="mb-2 text-sm font-medium text-gray-700"
              >
                CNPJ
              </label>
              <div className="relative flex w-full items-center">
                <input
                  type="text"
                  name="Cnpj"
                  value={formDataState.Cnpj}
                  onChange={handleChange}
                  placeholder="CNPJ da empresa"
                  className="w-full rounded border p-2"
                />
                <button
                  type="button"
                  onClick={handleSearchClick}
                  className="absolute right-0 mr-[2%] rounded-[1rem] bg-blue-600 px-4 py-1 text-white hover:bg-blue-700 focus:outline-none"
                >
                  <MagnifyingGlassIcon className="h-5 w-5" />
                </button>
              </div>
              {showCnpjList && (
                <ul
                  ref={cnpjListRef}
                  className="absolute z-10 ml-[46%] mt-[-5rem] w-[40%] rounded-md border border-gray-300 bg-white shadow-lg"
                >
                  {cnpjList.length > 0 ? (
                    cnpjList.map((cnpj, index) => (
                      <li
                        key={index}
                        className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                        onClick={() => handleCnpjSelect(cnpj)}
                      >
                        {cnpj}
                      </li>
                    ))
                  ) : (
                    <li className="px-4 py-2 text-gray-500">
                      Nenhum CNPJ encontrado
                    </li>
                  )}
                </ul>
              )}
            </div>
          )}

          {/* Campo Código Serviço */}
          {activeTab === 1 && ( // Check if the active tab is "Fiscal" (index 3)
            <div className="mb-4 flex flex-col">
              <label
                htmlFor="codServico"
                className="mb-2 text-sm font-medium text-gray-700"
              >
                Código Serviço
              </label>
              <div className="relative flex w-full items-center">
                <input
                  type="text"
                  name="codServico"
                  value={formDataState.codServico}
                  onChange={handleServicoChange}
                  placeholder="Digite o Código do Serviço"
                  className="w-full rounded border p-2"
                />
                <button
                  type="button"
                  onClick={handleServicoSearchClick}
                  className="absolute right-0 mr-[2%] rounded-[1rem] bg-blue-600 px-4 py-1 text-white hover:bg-blue-700 focus:outline-none"
                >
                  <MagnifyingGlassIcon className="h-5 w-5" />
                </button>
              </div>
              {showServicoList && (
                <ul
                  ref={servicoListRef}
                  className="absolute z-10 ml-[46%] mt-[-5rem] w-[40%] rounded-md border border-gray-300 bg-white shadow-lg"
                >
                  {servicoList.length > 0 ? (
                    servicoList.map((codServico, index) => (
                      <li
                        key={index}
                        className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                        onClick={() => handleServicoSelect(codServico)}
                      >
                        {codServico.chaveUnica} - {codServico.descricao}
                      </li>
                    ))
                  ) : (
                    <li className="px-4 py-2 text-gray-500">
                      Nenhum Código de Serviço encontrado
                    </li>
                  )}
                </ul>
              )}
            </div>
          )}

          {/* Outros campos */}
          {sections[activeTab].fields.map((field, index) => (
            <div key={index}>
              <label className="mb-2 block text-sm font-medium text-black">
                {field.label}
              </label>
              <input
                name={field.name}
                value={(formDataState as any)[field.name] || ""}
                onChange={handleChange}
                placeholder={field.placeholder}
                className="w-full rounded-lg border-[1.5px] border-gray-300 px-4 py-2"
              />
            </div>
          ))}
        </form>

        {/* Botão para enviar dados da aba ativa */}
        <div className="mt-4 flex justify-end">
          {activeTab !== sections.length - 0 && (
            <button
              type="button"
              className="rounded-lg bg-blue-500 px-6 py-2 text-white hover:bg-blue-600"
              onClick={handleSubmit}
            >
              Enviar Dados da Aba
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormNotas;
