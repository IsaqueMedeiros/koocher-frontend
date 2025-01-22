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
        `${process.env.API_URL}/api/listarcodigos`,
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
    cnpjPrestador:string;
    idPrestador: string;
    razaoSocial: string;
    socio: string;
    regProfissional: string;
    cnpjTomador: string;
    razaoSocialTomador: string;
    ruaTomador: string;
    cidadeTomador: string;
    ufTomador: string;
    cepTomador: string;
    emailTomador: string;
    inscricaoMunicipalTomador: string;
    competencia: string;
    codServico: string;
    valor: string;
    cargaHoraria: string;
    localServicos: string;
    corpoNota: string;
    outrasInfo: string;
    retemISS: string;
    retemIR: string;
    retemPIS: string;
    retemCOFINS: string;
    retemINSS: string;
    retemCSLL: string;
    celularDestinatario: string;
    emailDestinatario: string;
    ccEmail: string;
    assunto: string;
  }

  const [formDataState, setFormDataState] = useState<FormDataState>({
    idPrestador: "",
    cnpjPrestador: "",
    razaoSocial: "",
    socio: "",
    regProfissional: "",
    cnpjTomador: "",
    razaoSocialTomador: "",
    ruaTomador: "",
    cidadeTomador: "",
    ufTomador: "",
    cepTomador: "",
    emailTomador: "",
    inscricaoMunicipalTomador: "",
    competencia: "",
    codServico: "",
    valor: "",
    cargaHoraria: "",
    localServicos: "",
    corpoNota: "",
    outrasInfo: "",
    retemISS: "",
    retemIR: "",
    retemPIS: "",
    retemCOFINS: "",
    retemINSS: "",
    retemCSLL: "",
    celularDestinatario: "",
    emailDestinatario: "",
    ccEmail: "",
    assunto:"",
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
  
    setFormDataState((prevState) => ({
      ...prevState,
      [name]: value, // ✅ Update the specific field in the state
    }));
  };
  

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
  
    // Criando o objeto notaData com os dados do formulário
    const dadosNota = { ...formDataState };
  
    try {
      const response = await fetch(`${process.env.API_URL}/api/cadastroNotas`,
        {
          method: "PUT", // Ou "PUT" se for atualização
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dadosNota), // Convertendo para JSON antes de enviar
        }
      );
  
      if (!response.ok) {
        throw new Error(`Erro ao enviar os dados: ${response.statusText}`);
      }
  
      const result = await response.json();
      console.log("Nota enviada com sucesso:", dadosNota);
  
      // Salvar CNPJ no localStorage se necessário
      if (formDataState.cnpjPrestador) {
        const cnpjSemBarras = formDataState.cnpjPrestador.replace(/[^\d]/g, "");
        localStorage.setItem("cnpj", cnpjSemBarras);
        console.log("CNPJ salvo no localStorage:", cnpjSemBarras);
      }
    } catch (error) {
      console.error("Erro ao enviar os dados:", error);
    }
  };
  

  const handleCnpjSelect = (selectedCnpj: string) => {
    const prestador = cnpjListData.find((p: any) => p.Cnpj === selectedCnpj);

    if (prestador) {
      setFormDataState((prevState) => ({
        ...prevState,
        IdCadastro: prestador.idCadastro || "",
        cnpjPrestador: prestador.Cnpj || "",
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
      const cnpj = formDataState.cnpjPrestador;

      const response = await fetch(`${process.env.API_URL}/api/listarprestadores`,
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
      title: "Prestador",
      fields: [
        {
          label: "ID",
          name: "idPrestador",
          placeholder: "ID",
        },
        {
          label: "Razão Social",
          name: "razaoSocial",
          placeholder: "Razão Social",
        },
        {
          label: "Sócio",
          name: "socio",
          placeholder: "Sócio",
        },
        {
          label: "Reg. Profissional",
          name: "regProfissional",
          placeholder: "Reg. Profissional",
        },
      ],
    },
    {
      title: "Tomador",
      fields: [
        {
          label: "CNPJ",
          name: "cnpjTomador",
          placeholder: "CNPJ",
        },
        {
          label: "Razão social",
          name: "razaoSocialTomador",
          placeholder: "Razão social",
        },
        {
          label: "Rua",
          name: "ruaTomador",
          placeholder: "Rua",
        },
        {
          label: "Número",
          name: "numeroTomador",
          placeholder: "Número",
        },
        {
          label: "Bairro",
          name: "bairroTomador",
          placeholder: "Bairro",
        },
        {
          label: "Cidade",
          name: "cidadeTomador",
          placeholder: "Cidade",
        },
        {
          label: "UF",
          name: "ufTomador",
          placeholder: "UF",
        },
        {
          label: "CEP",
          name: "cepTomador",
          placeholder: "CEP",
        },
        {
          label: "E-mail",
          name: "emailTomador",
          placeholder: "E-mail",
        },
        {
          label: "Inscrição municipal",
          name: "inscricaoMunicipalTomador",
          placeholder: "Inscrição municipal",
        },
      ],
    },
    {
      title: "Infos",
      fields: [
        {
          label: "Competência",
          name: "competencia",
          placeholder: "Competência",
        },
        {
          label: "Valor",
          name: "valor",
          placeholder: "Valor",
        },
        {
          label: "Carga Horária",
          name: "cargaHoraria",
          placeholder: "Carga Horária",
        },
        {
          label: "Local Serviços Prestados",
          name: "localServicos",
          placeholder: "Local Serviços Prestados",
          extra: "",
        },
        {
          label: "Corpo da Nota",
          name: "corpoNota",
          placeholder: "Corpo da Nota",
        },
        {
          label: "Outras Informações",
          name: "outrasInfo",
          placeholder: "Outras Informações",
        },
      ],
    },
    {
      title: "Fiscal",
      fields: [
        {
          label: " Retém ISS",
          name: "retemISS",
          placeholder: " Retém ISS",
        },
        {
          label: " Retém IR",
          name: "retemIR",
          placeholder: " Retém IR",
        },
        {
          label: "Retém PIS",
          name: "retemPIS",
          placeholder: "Retém PIS",
        },
        {
          label: "Retém COFINS",
          name: "retemCOFINS",
          placeholder: "Retém COFINS",
        },
        {
          label: "Retém INSS",
          name: "retemINSS",
          placeholder: "Retém INSS",
        },
        {
          label: "Retém CSLL",
          name: "retemCSLL",
          placeholder: "Retém CSLL",
        },
      ],
    },
    {
      title: "Envio",
      fields: [
        {
          label: "Celular Destinatário",
          name: "celularDestinatario",
          placeholder: "Celular Destinatário",
        },
        {
          label: "E-mail Destinatário",
          name: "emailDestinatario",
          placeholder: "E-mail Destinatário",
        },
        {
          label: "CC E-mail",
          name: "ccEmail",
          placeholder: "CC E-mail",
        },
        {
          label: "Assunto",
          name: "assunto",
          placeholder: "Assunto",
          extra: "",
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
                  name="cnpjPrestador"
                  value={formDataState.cnpjPrestador}
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
          {activeTab === 3 && ( // Check if the active tab is "Fiscal" (index 3)
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
          {activeTab === 4 && (
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
