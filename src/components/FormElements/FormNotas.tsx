"use client";

import { useState, useRef, useEffect } from "react";
import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/16/solid";
import TableNotas from "../Tables/TableNotas";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

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

  //Listagem CNPJ Tomador
  const [cnpjTomadorList, setCnpjTomadorList] = useState<Tomador[]>([]);
  const [showCnpjTomadorList, setShowCnpjTomadorList] = useState(false);
  const cnpjTomadorListRef = useRef<HTMLUListElement | null>(null);

  type Tomador = {
    Cnpj: string;
    RazaoSocial: string;
    InscricaoMunicipal: string;
    Cep: string;
    Rua: string;
    Numero: string;
    Complemento: string | null;
    Bairro: string;
    Cidade: string;
    Uf: string;
    paisOrigem: string | null;
  };

  const handleTomadorSearchClick = async (
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${process.env.API_URL}/api/listartomadores`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          //body: JSON.stringify({ cnpj }),
        },
      );

      if (!response.ok) {
        throw new Error("Erro ao buscar os dados do tomador");
      }

      const data = await response.json();
      const tomadores = data.Tomadores || [];

      // Store the full tomador objects instead of just CNPJs
      setCnpjTomadorList(tomadores);
      setShowCnpjTomadorList(true);
    } catch (error) {
      console.error("Erro ao buscar dados do tomador:", error);
    }
  };

  const handleTomadorSelect = (selectedCnpj: string) => {
    const selectedTomador = cnpjTomadorList.find(
      (tomador: Tomador) => tomador.Cnpj === selectedCnpj,
    );

    if (selectedTomador) {
      setFormDataState((prevState) => ({
        ...prevState,
        cnpjTomador: selectedTomador.Cnpj, // Correcting by passing the CNPJ as string
        razaoSocialTomador: selectedTomador.RazaoSocial,
        inscricaoMunicipalTomador: selectedTomador.InscricaoMunicipal,
        cepTomador: selectedTomador.Cep,
        ruaTomador: selectedTomador.Rua,
        numeroTomador: selectedTomador.Numero,
        complementoTomador: selectedTomador.Complemento || "",
        bairroTomador: selectedTomador.Bairro,
        cidadeTomador: selectedTomador.Cidade,
        ufTomador: selectedTomador.Uf,
      }));
    }
    setShowCnpjTomadorList(false);
  };

  {
    /*----> Codigos para lista de serviço  <---- */
  }
  interface CodigoServico {
    codigoCidadeIBGE: string;
    codigoServicoFederal: string;
    codigoServicoMunicipal: string;
    descricao: string;
    municipio: string;
    uf: string;
  }

  const handleServicoSearchClick = async () => {
    try {
      const response = await fetch(`${process.env.API_URL}/api/listarcodigos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Erro ao buscar os dados");
      }

      const result = await response.json();
      setServicoList(result.CodigosServico);
      setShowServicoList(true);
    } catch (error) {
      console.error("Erro ao carregar os dados", error);
    }
  };

  const handleServicoSelect = (service: CodigoServico) => {
    let currentServices = formDataState.codServico;
    const serviceKey = service.codigoServicoMunicipal;

    if (
      currentServices.some(
        (existing) =>
          typeof existing !== "string" &&
          existing.codigoServicoMunicipal === serviceKey,
      )
    ) {
      currentServices = currentServices.filter(
        (existing) =>
          typeof existing !== "string" &&
          existing.codigoServicoMunicipal !== serviceKey,
      );
    } else {
      currentServices = [...currentServices, service];
    }

    setFormDataState((prevState) => ({
      ...prevState,
      codServico: currentServices,
    }));
  };

  // Codigos para lista de serviço FIM
  {
    /*----> Codigos para lista de serviço (FIM) <---- */
  }

  interface FormDataState {
    cnpjPrestador: string;
    idPrestador: string;
    razaoSocial: string;
    socio: string;
    regProfissional: string;
    cnpjTomador: string;
    razaoSocialTomador: string;
    ruaTomador: string;
    numeroTomador: string;
    complementoTomador: string;
    bairroTomador: string;
    cidadeTomador: string;
    ufTomador: string;
    cepTomador: string;
    emailTomador: string;
    inscricaoMunicipalTomador: string;
    competencia: string;
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
    codCidade: string;
    codMunicipio: string;
    codServico: (string | CodigoServico)[];
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
    numeroTomador: "",
    complementoTomador: "",
    bairroTomador: "",
    cidadeTomador: "",
    ufTomador: "",
    cepTomador: "",
    emailTomador: "",
    inscricaoMunicipalTomador: "",
    competencia: "",
    codServico: [],
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
    assunto: "",
    codCidade: "",
    codMunicipio: "",
  });

  // Função para formatar o CNPJ
  const formatCNPJ = (cnpj: string): string => {
    // Remove todos os caracteres não numéricos
    const cleanCnpj = cnpj.replace(/\D/g, "");

    // Aplica a máscara
    return cleanCnpj.replace(
      /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
      "$1.$2.$3/$4-$5",
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormDataState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormDataState((prevState) => ({
      ...prevState,
      [name]: formatCNPJ(value),
    }));
  };

  // ----> BUSCAR NOTA ATRAVÉS DO NOME NO NFE.IO

  interface Empresa {
    id: string;
    name: string;
    federalTaxNumber: string;
    certificate?: {
      expiresOn?: string;
    };
  }

  const [nomeEmpresa, setNomeEmpresa] = useState<string>("");
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const [certExpiration, setCertExpiration] = useState("");
  const [isCertExpired, setIsCertExpired] = useState(false);

  useEffect(() => {
    if (formDataState.razaoSocial.trim() !== "") {
      buscarNotas(formDataState.razaoSocial);
    }
  }, [formDataState.razaoSocial]);

  const buscarNotas = async (razaoSocial: string) => {
    setLoading(true);
    setError("");
    setEmpresas([]);

    try {
      const response = await fetch(`${process.env.API_URL}/api/buscarpornome`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nome_empresa: razaoSocial }),
      });

      const data = await response.json();

      if (response.ok) {
        setEmpresas(data.empresasEncontradas || []);

        if (data.empresasEncontradas?.length > 0) {
          const empresa = data.empresasEncontradas[0];
          const expirationDate = empresa?.certificate?.expiresOn;
          const certStatus = empresa?.certificate?.status;

          if (expirationDate) {
            const formattedDate = new Date(expirationDate).toLocaleDateString(
              "pt-BR",
            );
            setCertExpiration(formattedDate);

            // Verifica se a data já expirou
            const today = new Date();
            const certDate = new Date(expirationDate);
            const isExpired = certDate < today;

            // Verifica o status do certificado
            const isStatusExpired = certStatus === "Expired";

            // Define se o certificado está expirado com base na data ou no status
            setIsCertExpired(isExpired || isStatusExpired);
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

  // -----> ENDPOINT PARA EMITIR NOTA FISCAL UTILIZANDO A API DO NFE.IO <----
const handleSubmit = async (e?: React.FormEvent) => {
  if (e) e.preventDefault();

  // Separando os dados do código de serviço de forma clara
  const codigosServicoFormatados = formDataState.codServico.map((service) => {
    if (typeof service !== "string") {
      return {
        codigoMunicipal: service.codigoServicoMunicipal,
        codigoFederal: service.codigoServicoFederal,
        codigoIBGE: service.codigoCidadeIBGE,
      };
    }
    return service;
  });

  // Criando o objeto de dados da nota fiscal com os dados formatados
  const dadosNota = {
  ...formDataState,
  codServico: codigosServicoFormatados, // Array formatado de códigos de serviço
  descricao: editableDescription, // Descrição gerada
  valor: formDataState.valor, // Valor do serviço
  retemISS: formDataState.retemISS, // Percentual de ISS Retido
  retemIR: formDataState.retemIR, // Percentual de IR Retido
  retemPIS: formDataState.retemPIS, // Percentual de PIS Retido
  retemCOFINS: formDataState.retemCOFINS, // Percentual de COFINS Retido
  retemINSS: formDataState.retemINSS, // Percentual de INSS Retido
  retemCSLL: formDataState.retemCSLL, // Percentual de CSLL Retido
};


  try {
    const response = await fetch(`${process.env.API_URL}/api/cadastroNotas`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dadosNota), // Enviando os dados no formato correto
    });

    if (!response.ok) {
      throw new Error(`Erro ao enviar os dados: ${response.statusText}`);
    }

    console.log("Nota enviada com sucesso:", dadosNota);

    if (formDataState.cnpjPrestador) {
      const cnpjSemBarras = formDataState.cnpjPrestador.replace(/[^\d]/g, "");
      localStorage.setItem("cnpj", cnpjSemBarras);
      console.log("CNPJ salvo no localStorage:", cnpjSemBarras);
    }
  } catch (error) {
    console.error("Erro ao enviar os dados:", error);
  }
};
// -----> ENDPOINT PARA EMITIR NOTA FISCAL UTILIZANDO A API DO NFE.IO (FIM) <----


  // Estado para armazenar os sócios disponíveis e os selecionados
  interface QuadroSocietario {
    nome: string;
    registroProfissional: string;
    agencia: string;
    conta: string;
    banco: string;
    pix: string;
    cpf: string;
    [key: string]: string; // Adiciona a indexação, permitindo qualquer chave string
  }

  const [selectedSocios, setSelectedSocios] = useState<QuadroSocietario[]>([]);
  const [sociosDisponiveis, setSociosDisponiveis] = useState<
    QuadroSocietario[]
  >([]);
  const [sociosFound, setSociosFound] = useState(false);

  // Manipula a seleção de sócios
  const handleSocioSelection = (socio: QuadroSocietario) => {
    setSelectedSocios((prevSelected) => {
      // Verifica se o sócio já está selecionado
      if (prevSelected.some((s) => s.cpf === socio.cpf)) {
        return prevSelected.filter((s) => s.cpf !== socio.cpf); // Remove se já estiver
      } else {
        return [...prevSelected, socio]; // Adiciona se não estiver
      }
    });
  };

  // Função para selecionar um prestador pelo CNPJ e carregar sócios
  const handleCnpjSelect = (selectedCnpj: string) => {
    const prestador = cnpjListData.find((p: any) => p.Cnpj === selectedCnpj);

    if (prestador) {
      setFormDataState((prevState) => ({
        ...prevState,
        idPrestador: prestador.idCadastro || "",
        cnpjPrestador: prestador.Cnpj || "",
        razaoSocial: prestador.RazaoSocial || "",
        regProfissional: prestador.EmailEmpresa || "",
      }));

      let socios: QuadroSocietario[] = [];

      if (prestador.QuadroSocietario) {
        try {
          // Converte para array, se for uma string JSON
          socios =
            typeof prestador.QuadroSocietario === "string"
              ? JSON.parse(prestador.QuadroSocietario)
              : prestador.QuadroSocietario;

          if (!Array.isArray(socios)) {
            console.error(
              "Erro: QuadroSocietario não é um array válido:",
              socios,
            );
            socios = []; // Garante que não quebre a interface
          }
        } catch (error) {
          console.error("Erro ao converter QuadroSocietario:", error);
          socios = []; // Evita erro caso o JSON esteja corrompido
        }
      }

      setSociosDisponiveis(socios);
      setSociosFound(socios.length > 0); // Atualiza corretamente o estado
    }

    setShowCnpjList(false);
  };
  const [editableSocios, setEditableSocios] = useState(sociosDisponiveis);
  const [formattedDescription, setFormattedDescription] = useState("");

  // Atualiza o estado quando os sócios disponíveis mudam
  useEffect(() => {
    setEditableSocios(sociosDisponiveis);
  }, [sociosDisponiveis]);

  const handleEditChange = (index: number, field: string, value: string) => {
    const updatedSocios = [...editableSocios];
    updatedSocios[index] = { ...updatedSocios[index], [field]: value };
    setEditableSocios(updatedSocios);
  };

  const [editableDescription, setEditableDescription] = useState("");

  const formatDescription = () => {
    const formatted = editableSocios
      .map((socio) => {
        return `Dr. ${socio.nome} CRM ${socio.registroProfissional}
  
  Dados bancários:
  Agência: ${socio.agencia}
  Conta: ${socio.conta}
  Chave Pix: ${socio.pix}`;
      })
      .join("\n\n"); // Junta os sócios com um espaço entre eles
  
    setEditableDescription(formatted); // Define o valor inicial, mas permite edição
  };
  

  // Certifique-se de que você tem um estado para armazenar os dados completos dos prestadores
  const [cnpjListData, setCnpjListData] = useState<any[]>([]);

  // E modifique handleSearchClick para armazenar todos os dados dos prestadores
  const handleSearchClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Previne a ação padrão de um botão

    try {
      const cnpj = formDataState.cnpjPrestador;

      const response = await fetch(
        `${process.env.API_URL}/api/listarprestadores`,
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
      console.log(data);
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
        // {
        //   label: "Reg. Profissional",
        //   name: "regProfissional",
        //   placeholder: "Reg. Profissional",
        // },
      ],
    },
    {
      title: "Tomador",
      fields: [
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
          label: "Complemento",
          name: "complementoTomador",
          placeholder: "Complemento",
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
          label: "Código Do Munícipio",
          name: "codMunicipio",
          placeholder: "Código da cidade IBGE",
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
        // {
        //   label: "Carga Horária",
        //   name: "cargaHoraria",
        //   placeholder: "Carga Horária",
        // },
        // {
        //   label: "Local Serviços Prestados",
        //   name: "localServicos",
        //   placeholder: "Local Serviços Prestados",
        //   extra: "",
        // },
        // {
        //   label: "Corpo da Nota",
        //   name: "corpoNota",
        //   placeholder: "Corpo da Nota",
        // },
        // {
        //   label: "Outras Informações",
        //   name: "outrasInfo",
        //   placeholder: "Outras Informações",
        // },
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
    // {
    //   title: "Envio",
    //   fields: [
    //     {
    //       label: "Celular Destinatário",
    //       name: "celularDestinatario",
    //       placeholder: "Celular Destinatário",
    //     },
    //     {
    //       label: "E-mail Destinatário",
    //       name: "emailDestinatario",
    //       placeholder: "E-mail Destinatário",
    //     },
    //     {
    //       label: "CC E-mail",
    //       name: "ccEmail",
    //       placeholder: "CC E-mail",
    //     },
    //     {
    //       label: "Assunto",
    //       name: "assunto",
    //       placeholder: "Assunto",
    //       extra: "",
    //     },
    //   ],
    // },
  ];

  // ENVIO CERTIFICADO DIGITAL BACKEND

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

  return (
    <div className="rounded-xl p-6">
      {/* ---->CERTIFICADO DIGITAL<---- */}
      <TableNotas />
      <div className="mt-18 rounded-lg border border-gray-300 bg-white p-6 shadow-xl dark:border-gray-700 dark:bg-gray-800">
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
              !certExpiration
                ? "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400" // Cor padrão
                : isCertExpired
                  ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300" // Expirado
                  : "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" // Válido
            }`}
          >
            <span>
              {certExpiration ? certExpiration : "Nenhuma data encontrada"}
            </span>
            {certExpiration ? (
              isCertExpired ? (
                <span className="ml-2 flex items-center">
                  <svg
                    className="h-5 w-5 text-red-600 dark:text-red-300"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M4.293 4.293a1 1 0 011.414 0L12 10.586l6.293-6.293a1 1 0 111.414 1.414L13.414 12l6.293 6.293a1 1 0 01-1.414 1.414L12 13.414l-6.293 6.293a1 1 0 01-1.414-1.414z"
                    />
                  </svg>
                  <span className="ml-1">Certificado Expirado</span>
                </span>
              ) : (
                <span className="ml-2 flex items-center">
                  <svg
                    className="h-5 w-5 text-green-600 dark:text-green-300"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="ml-1">Certificado Válido</span>
                </span>
              )
            ) : null}
          </div>
        </div>

        {/* Renderizar campos de upload e senha apenas se o certificado estiver vencido */}
        {isCertExpired && (
          <>
            {/* Upload de Certificado */}
            <div className="mb-4">
              <label
                htmlFor="fileUpload"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
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
                  className="cursor-pointer rounded-md bg-[#b000ff] px-5 py-2 text-white transition hover:bg-[#690099]"
                >
                  Selecionar Arquivo
                </label>
              </div>
            </div>

            {/* Senha do Certificado */}
            <div className="mb-4">
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
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
          </>
        )}
      </div>
      {/* ----> CERTIFICADO DIGITA FIM <---- */}

      {/* FORMULARIO INICIO */}
      <div className="mt-18 flex h-[85vh] flex-col rounded-md border border-gray-300 bg-white p-6 shadow-xl">
        <div className="flex h-[10vh] flex-col ">
          <p className="text-SM w-fit rounded-md bg-[#b000ff] p-4 text-white">
            <b>Formulário Emitir NFS-e:</b>
          </p>
        </div>

        <div className="mb-18 flex border-b">
          {sections.map((section, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`w-full p-4 text-center ${
                activeTab === index
                  ? "border-b-2 border-[#b000ff] text-[#b000ff]"
                  : "text-black"
              }`}
            >
              {section.title}
            </button>
          ))}
        </div>
        <div style={{ minHeight: "400px" }}>
          <form className=" grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Campo CNPJ Prestador */}
            {activeTab === 0 && (
              <div className="relative">
                <label
                  htmlFor="cnpj"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  CNPJ
                </label>
                <div className="flex items-center">
                  <input
                    type="text"
                    name="cnpjPrestador"
                    value={formDataState.cnpjPrestador}
                    onChange={handleChange}
                    placeholder="CNPJ da empresa"
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                    maxLength={18} // Comprimento máximo do CNPJ formatado
                    onBlur={handleBlur}
                  />
                  <button
                    type="button"
                    onClick={handleSearchClick}
                    className="ml-2 rounded-full bg-[#b000ff] p-2 text-white transition hover:bg-[#690099] focus:outline-none"
                  >
                    <MagnifyingGlassIcon className="h-5 w-5" />
                  </button>
                </div>
                {showCnpjList && (
                  <ul
                    ref={cnpjListRef}
                    className="absolute z-10 mt-1 w-full rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-800"
                  >
                    {cnpjList.length > 0 ? (
                      cnpjList.map((cnpj, index) => (
                        <li
                          key={index}
                          onClick={() => handleCnpjSelect(cnpj)}
                          className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                        >
                          {cnpj}
                        </li>
                      ))
                    ) : (
                      <li className="px-4 py-2 text-sm text-gray-500">
                        Nenhum CNPJ encontrado
                      </li>
                    )}
                  </ul>
                )}
              </div>
            )}

            {/* Campo CNPJ Tomador */}
            {activeTab === 1 && (
              <div className="relative">
                <label
                  htmlFor="cnpjTomador"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  CNPJ Tomador
                </label>
                <div className="flex items-center">
                  <input
                    type="text"
                    name="cnpjTomador"
                    value={formDataState.cnpjTomador}
                    onChange={handleChange}
                    placeholder="CNPJ do Tomador"
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                    maxLength={18} // Comprimento máximo do CNPJ formatado
                  />
                  <button
                    type="button"
                    onClick={handleTomadorSearchClick}
                    className="ml-2 rounded-full bg-[#b000ff] p-2 text-white transition hover:bg-[#690099] focus:outline-none"
                  >
                    <MagnifyingGlassIcon className="h-5 w-5" />
                  </button>
                </div>
                {showCnpjTomadorList && (
                  <ul
                    ref={cnpjTomadorListRef}
                    className="absolute z-10 mt-1 w-full rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-800"
                  >
                    {cnpjTomadorList.length > 0 ? (
                      cnpjTomadorList.map((tomador, index) => (
                        <li
                          key={index}
                          onClick={() => handleTomadorSelect(tomador.Cnpj)}
                          className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                        >
                          {tomador.Cnpj}
                        </li>
                      ))
                    ) : (
                      <li className="px-4 py-2 text-sm text-gray-500">
                        Nenhum CNPJ encontrado
                      </li>
                    )}
                  </ul>
                )}
              </div>
            )}

            {/* Outros campos */}
            {sections[activeTab].fields.map((field, index) => (
              <div key={index} className="mb-4">
                <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                  {field.label}
                </label>

                {field.name.startsWith("retem") ? (
                  <div className="flex items-center space-x-2">
                    {typeof (formDataState as any)[field.name] === "boolean" ? (
                      // Checkbox
                      <>
                        <input
                          type="checkbox"
                          name={field.name}
                          checked={(formDataState as any)[field.name] || false}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            setFormDataState((prevState) => ({
                              ...prevState,
                              [field.name]: checked ? "" : false, // Troca para input se marcado
                            }));
                          }}
                          className="form-checkbox h-5 w-5 text-blue-600 transition focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                          {field.label}
                        </span>
                      </>
                    ) : (
                      // Input de texto + Botão para voltar ao checkbox
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          name={field.name}
                          value={(formDataState as any)[field.name] || ""}
                          onChange={handleChange}
                          placeholder="Insira a %"
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                        />
                        {/* Botão para voltar ao checkbox */}
                        <button
                          type="button"
                          onClick={() => {
                            setFormDataState((prevState) => ({
                              ...prevState,
                              [field.name]: false, // Volta para checkbox
                            }));
                          }}
                          className="rounded bg-transparent p-2 text-gray-700 dark:text-white"
                        >
                          <div className="flex w-[12rem] cursor-pointer flex-row items-center justify-center gap-2 rounded-md bg-gray-200 px-3 py-1 text-gray-700 transition hover:bg-purple-600 hover:text-white">
                            <ArrowPathIcon className="h-4 w-4" />
                            <p className="text-sm font-medium">Não Retém</p>
                          </div>
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <input
                    name={field.name}
                    value={(formDataState as any)[field.name] || ""}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                  />
                )}
              </div>
            ))}
          </form>

          {/* QUADRO DE SÓCIOS */}
          {activeTab === 0 && (
            <div className="mt-24 rounded-2xl border border-[#b000ff] bg-white p-6 shadow-2xl">
              {editableSocios.length > 0 ? (
                <>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          {[
                            "Nome",
                            "CRM",
                            "Agência",
                            "Conta",
                            "PIX",
                            "Selecionar",
                          ].map((header, i) => (
                            <th
                              key={i}
                              className="border-b border-[#b000ff] px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                            >
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {editableSocios.map((socio, index) => (
                          <tr
                            key={index}
                            className="transition-colors duration-150 ease-in-out hover:bg-gray-100"
                          >
                            {[
                              "nome",
                              "registroProfissional",
                              "agencia",
                              "conta",
                              "pix",
                            ].map((field) => (
                              <td
                                key={field}
                                className="whitespace-nowrap border-b px-6 py-4"
                              >
                                <input
                                  type="text"
                                  value={socio[field] || ""}
                                  onChange={(e) =>
                                    handleEditChange(
                                      index,
                                      field,
                                      e.target.value,
                                    )
                                  }
                                  className="w-full rounded-lg border border-gray-300 p-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#b000ff]"
                                />
                              </td>
                            ))}
                            <td className="whitespace-nowrap border-b px-6 py-4 text-center">
                              <input
                                type="checkbox"
                                checked={selectedSocios.some(
                                  (s) => s.cpf === socio.cpf,
                                )}
                                onChange={() => handleSocioSelection(socio)}
                                className="form-checkbox h-5 w-5 text-[#b000ff] transition duration-150 ease-in-out"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <button
                    onClick={formatDescription}
                    className="mt-6 rounded-lg bg-[#b000ff] px-6 py-3 text-white shadow-lg transition duration-200 ease-in-out hover:bg-[#9f00e1] focus:outline-none focus:ring-2 focus:ring-[#b000ff]"
                  >
                    Gerar Descrição NFE-e
                  </button>

                  {formattedDescription && (
                    <textarea
                    className="mt-6 w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#b000ff]"
                    rows={6}
                    value={editableDescription}
                    onChange={(e) => setEditableDescription(e.target.value)} // Permite edição
                  />        
                  )}
                </>
              ) : (
                <p className="text-center text-gray-600">
                  Nenhum sócio encontrado.
                </p>
              )}
            </div>
          )}
          {/* QUADRO DE SÓCIOS FIM */}

          {/* Campo para Procura dos códigos de serviços */}
          {activeTab === 2 && (
            <div className="mt-14 flex flex-col rounded-lg border border-gray-300 bg-white p-4 shadow-md">
              {/* Botão para buscar códigos */}
              <button
                type="button"
                onClick={handleServicoSearchClick}
                className="flex items-center justify-between rounded-lg bg-purple-600 p-3 font-semibold text-[#F2F2F2] shadow-sm transition-all hover:bg-purple-700"
              >
                <span>Códigos de Serviço</span>
                <MagnifyingGlassIcon className="h-5 w-5" />
              </button>

              {/* Lista de serviços */}
              {showServicoList && (
                <ul
                  ref={servicoListRef}
                  className="z-20 mt-4 max-h-[50vh] overflow-auto rounded-lg border border-gray-300 bg-white shadow-lg"
                >
                  {servicoList.length > 0 ? (
                    servicoList.map((codServico, index) => (
                      <li key={index} className="cursor-pointer px-4 py-2">
                        <label className="flex flex-row items-center justify-between rounded-lg bg-white p-3 text-xs">
                          <div className="grid w-full grid-cols-5 divide-x divide-gray-200 text-center">
                            <div className="flex flex-col items-center px-2 py-1">
                              <span className="text-[11px] font-semibold text-gray-700">
                                Cód. Municipal
                              </span>
                              <span className="text-[10px] text-gray-600">
                                {codServico.codigoServicoMunicipal}
                              </span>
                            </div>
                            <div className="flex flex-col items-center px-2 py-1">
                              <span className="text-[11px] font-semibold text-gray-700">
                                Serviço
                              </span>
                              <span className="w-full truncate text-[10px] text-gray-600">
                                {codServico.descricao}
                              </span>
                            </div>
                            <div className="flex flex-col items-center px-2 py-1">
                              <span className="text-[11px] font-semibold text-gray-700">
                                Município
                              </span>
                              <span className="text-[10px] text-gray-600">
                                {codServico.municipio} - {codServico.uf}
                              </span>
                            </div>
                            <div className="flex flex-col items-center px-2 py-1">
                              <span className="text-[11px] font-semibold text-gray-700">
                                Cód. IBGE
                              </span>
                              <span className="text-[10px] text-gray-600">
                                {codServico.codigoCidadeIBGE}
                              </span>
                            </div>
                            <div className="flex flex-col items-center px-2 py-1">
                              <span className="text-[11px] font-semibold text-gray-700">
                                Cód. Federal
                              </span>
                              <span className="text-[10px] text-gray-600">
                                {codServico.codigoServicoFederal}
                              </span>
                            </div>
                          </div>
                          <input
                            type="checkbox"
                            checked={formDataState.codServico.some(
                              (service) =>
                                typeof service !== "string" &&
                                service.codigoServicoMunicipal ===
                                  codServico.codigoServicoMunicipal,
                            )}
                            onChange={() => handleServicoSelect(codServico)}
                            className="ml-3 h-4 w-4 rounded border-gray-300 text-yellow-500 focus:ring-yellow-500"
                          />
                        </label>
                      </li>
                    ))
                  ) : (
                    <li className="px-4 py-2 text-center text-gray-500">
                      Nenhum Código de Serviço encontrado
                    </li>
                  )}
                </ul>
              )}
            </div>
          )}
        </div>

        {/* Botão para enviar dados da aba ativa */}
        <div className="mr-24 flex justify-end">
          {activeTab === 3 && (
            <button
              type="button"
              className="rounded-lg bg-[#b000ff] px-6 py-2 text-white hover:bg-[#690099]"
              onClick={handleSubmit}
            >
              Emitir NFS-e
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormNotas;
