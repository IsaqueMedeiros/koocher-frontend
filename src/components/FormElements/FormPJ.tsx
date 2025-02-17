"use client";

import { useState, useRef, useEffect } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/16/solid";
import { Buffer } from "buffer";
import { CloudArrowUpIcon, LockClosedIcon } from "@heroicons/react/24/solid";


const FormPJ = () => {
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

  // Codigo para upload certificado didigtal par ao storage:

  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null);
  const [downloadURL, setDownloadURL] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleUpload = async (formDataState: FormDataState) => {
    if (!selectedFile) {
      alert("Por favor, selecione um arquivo primeiro.");
      return;
    }

    if (!password) {
      alert("Por favor, insira a senha do certificado digital.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("password", password);

    const codServicoJson = JSON.stringify(formDataState.codServico);
    // Mapeando os dados do formulário para o objeto companyData
    const companyData = {
      federalTaxNumber: formDataState.Cnpj || "33986596000108", // Use o CNPJ fornecido
      name: formDataState.razaoSocial || "Isaque", // Use a razão social fornecida
      tradeName: formDataState.razaoSocial || "Boutique", // Supondo que você tenha um campo para nome fantasia
      municipalTaxNumber: formDataState.inscricaoMunicipal || "12345", // Use a inscrição municipal fornecida
      taxRegime: formDataState.regimeTrib || "SimplesNacional", // Use o regime tributário fornecido
      specialTaxRegime: "Nenhum", // Mantém como fictício ou faça um mapeamento
      address: {
        country: formDataState.paisOrigem || "BRA", // Use o país de origem
        postalCode: formDataState.cep || "12345678", // Use o CEP fornecido
        street: formDataState.rua || "Desembargador Amílcar", // Use a rua fornecida
        number: formDataState.numero || "123", // Use o número fornecido
        additionalInformation: formDataState.complemento || "Sala 1", // Use o complemento fornecido
        district: formDataState.bairro || "Bairro Exemplo", // Use o bairro fornecido
        city: {
          code: formDataState.codIBGE || "3550308", // Use o código IBGE ou um valor fictício
          name: formDataState.cidade || "São Paulo", // Use a cidade fornecida
        },
        state: formDataState.uf || "SP", // Use o estado fornecido
      },
      email: formDataState.emailEmpresa || "email@empresa.com", // Use o email fornecido
      openningDate: formDataState.dataAbertura || "2025-01-28T15:00:08.326Z", // Use a data de abertura fornecida
      legalNature: formDataState.naturezaJuridica || "EmpresaPublica", // Use a natureza jurídica fornecida
      economicActivities: [
        {
          type: "Main",
          code: "0",
        },
      ],
      companyRegistryNumber: formDataState.Cnpj || "33986596000108", // Use o CNPJ fornecido
      regionalTaxNumber: "0", // Mantém como fictício
      rpsSerialNumber: codServicoJson || "ABC", // Use o código do serviço ou um valor fictício
      rpsNumber: "1", // Mantém como fictício
      issRate: "5", // Mantém como fictício
      environment: "Development", // Mantém como fictício
      fiscalStatus: "CityNotSupported", // Mantém como fictício
      federalTaxDetermination: "NotInformed", // Mantém como fictício
      municipalTaxDetermination: "NotInformed", // Mantém como fictício
      loginName: formDataState.usuarioPrefeitura || "login", // Use o nome de usuário da prefeitura fornecido
      loginPassword: formDataState.senhaPrefeitura || "024", // Use a senha da prefeitura fornecida
      authIssueValue: "500", // Mantém como fictício
      certificate: {
        thumbprint: "string", // Mantém como fictício
        modifiedOn: "2025-01-28T15:00:08.326Z", // Mantém como fictício
        expiresOn: "2025-01-28T15:00:08.326Z", // Mantém como fictício
        status: "Overdue", // Mantém como fictício
      },
    };

    // Convertendo o objeto companyData para string JSON
    formData.append("companyData", JSON.stringify(companyData));

    // Pegando o CNPJ do localStorage se necessário
    const cnpj = localStorage.getItem("cnpj");

    try {
      const response = await fetch(
        `${process.env.API_URL}/api/salvarcertificados?cnpj=${encodeURIComponent(cnpj || formDataState.Cnpj)}`,
        {
          method: "POST",
          body: formData,
        },
      );

      if (response.ok) {
        alert("Upload concluído com sucesso!");
      } else {
        const errorText = await response.text();
        alert(`Erro no upload: ${errorText}`);
      }
    } catch (error) {
      console.error("Erro no upload:", error);
      alert("Erro no upload. Por favor, tente novamente.");
    }
  };

  // API LIST CEP COMPLETO

  const fetchAddress = async (cep: string) => {
    const cleanCep = cep.replace(/\D/g, ""); // Remove qualquer caractere não numérico

    try {
      const response = await fetch(
        `https://viacep.com.br/ws/${cleanCep}/json/`,
      );
      if (!response.ok) {
        throw new Error("Erro ao buscar o endereço");
      }
      const data = await response.json();

      // Preenche os campos de endereço com os dados retornados da API
      setFormDataState((prev: FormDataState) => ({
        ...prev,
        rua: data.logradouro || "",
        bairro: data.bairro || "",
        cidade: data.localidade || "",
        uf: data.uf || "",
      }));
    } catch (error) {
      console.error("Erro ao buscar o endereço:", error);
    }
  };

  interface CodigoServico {
    codigoCidadeIBGE: string;
    codigoServicoFederal: string;
    codigoServicoMunicipal: string;
    descricao: string;
    municipio: string;
    uf: string;
  }

  const handleServicoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormDataState((prevState) => ({ ...prevState, [name]: value }));
  };

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
    quadroSocietario: QuadroSocietario[];
    codServico: (string | CodigoServico)[];
    codIBGE: string;
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
    quadroSocietario: [],
    codServico: [],
    codIBGE: "",
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Verifica se o campo alterado é o CNPJ
    if (name === "Cnpj") {
      console.log("Valor do CNPJ antes de salvar:", value); // Debug
      localStorage.setItem("cnpj", value);
      console.log("CNPJ salvo no localStorage");
    }

    setFormDataState((prevState) => {
      // Se o campo for parte de 'quadroSocietario', atualiza o último sócio
      if (
        prevState.quadroSocietario.some((socio) => socio.hasOwnProperty(name))
      ) {
        const newSocios = [...prevState.quadroSocietario];

        if (newSocios.length > 0) {
          newSocios[newSocios.length - 1] = {
            ...newSocios[newSocios.length - 1],
            [name]: value,
          };
        }

        return { ...prevState, quadroSocietario: newSocios };
      }

      // Se o campo for um campo normal, apenas atualiza o estado normalmente
      return { ...prevState, [name]: value };
    });
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    // Add a new partner before submitting data
    setFormDataState((prevState) => {
      const newSocios = [...prevState.quadroSocietario];
      if (
        newSocios.length === 0 ||
        newSocios[newSocios.length - 1].nome !== ""
      ) {
        newSocios.push({
          nome: "",
          registroProfissional: "",
          agencia: "",
          conta: "",
          banco: "",
          pix: "",
          cpf: "",
        });
      }
      return {
        ...prevState,
        quadroSocietario: newSocios,
      };
    });

    try {
      // Convert codServico to JSON
      const codServicoJson = JSON.stringify(formDataState.codServico);

      const updatedFormData = {
        ...formDataState,
        quadroSocietario: JSON.stringify(formDataState.quadroSocietario),
        codServico: codServicoJson, // Here we use the JSON string instead of the array
      };

      const response = await fetch(
        `${process.env.API_URL}/api/cadastroprestador`,
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

        // Logic after successful submission (e.g., clear form or show success message)
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
        "agencia",
        "conta",
        "banco",
        "pix",
        "cpf"
      ];
  
      let quadroSocietario: QuadroSocietario[] = [];
  
      if (prestador.QuadroSocietario) {
        try {
          // Verifica se é uma string e faz o parsing para JSON
          const parsedQuadroSocietario =
            typeof prestador.QuadroSocietario === "string"
              ? JSON.parse(prestador.QuadroSocietario)
              : prestador.QuadroSocietario;
  
          if (Array.isArray(parsedQuadroSocietario)) {
            quadroSocietario = parsedQuadroSocietario.filter((socio) =>
              expectedKeys.every((key) => socio[key] && socio[key] !== "N/A")
            );
          } else if (typeof parsedQuadroSocietario === "object") {
            quadroSocietario = [parsedQuadroSocietario].filter((socio) =>
              expectedKeys.every((key) => socio[key] && socio[key] !== "N/A")
            );
          }
        } catch (error) {
          console.error("Erro ao processar QuadroSocietario:", error);
        }
      }
  
      console.log("Quadro Societário processado:", quadroSocietario); // Debug para verificar se os dados estão corretos
  
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
        quadroSocietario, // Atualiza corretamente o quadro societário
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

  const expectedKeys = [
    "nome",
    "registroProfissional",
    "agencia",
    "conta",
    "banco",
    "pix",
    "cpf"
  ];

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
          label: "Id de Cadastro",
          name: "IdCadastro",
          placeholder: "Id de Cadastro",
        },
        // { label: "Médicos", name: "medicos", placeholder: "Médicos" },
        {
          label: "Email da Empresa",
          name: "emailEmpresa",
          placeholder: "Email da Empresa",
        },
        {
          label: "Data de Abertura",
          name: "dataAbertura",
          placeholder: "Data de Abertura",
        },
        { label: "Agencia", name: "agencia", placeholder: "Agencia" },
        { label: "Banco", name: "banco", placeholder: "Banco" },
        { label: "Conta", name: "conta", placeholder: "Conta" },
      ],
    },
    {
      title: "Endereço",
      fields: [
        {
          label: "CEP",
          name: "cep",
          placeholder: "Insira seu CEP",
          onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
            const cep = e.target.value;
            setFormDataState((prev: FormDataState) => ({
              ...prev,
              cep, // Atualiza o estado com o novo CEP
            }));
            // Chama a função fetchAddress quando o CEP for preenchido
            if (cep.length === 8) {
              // Verifica se o CEP está completo (8 dígitos)
              fetchAddress(cep);
            }
          },
        },
        { label: "Rua", name: "rua", placeholder: "Insira sua rua" },
        { label: "Número", name: "numero", placeholder: "Número da rua" },
        {
          label: "Complemento",
          name: "complemento",
          placeholder: "Complemento",
        },
        { label: "Cidade", name: "cidade", placeholder: "Cidade" },
        {
          label: "Código da cidade IBGE",
          name: "codIBGE",
          placeholder: "Código da cidade IBGE",
        },
        { label: "Bairro", name: "bairro", placeholder: "Bairro" },
        { label: "UF", name: "uf", placeholder: "UF" },
        {
          label: "País de Origem",
          name: "paisOrigem",
          placeholder: "País de Origem",
        },
      ],
    },
    {
      title: "Acessos",
      fields: [
        {
          label: "Usuario Prefeitura",
          name: "usuarioPrefeitura",
          placeholder: "Usuario Prefeitura",
        },
        {
          label: "Senha Prefeitura",
          name: "senhaPrefeitura",
          placeholder: "Senha Prefeitura",
        },
        {
          label: "Usuario DEISS",
          name: "usuarioDEISS",
          placeholder: "Usuario DEISS",
        },
        {
          label: "Senha DEISS",
          name: "senhaDEISS",
          placeholder: "Senha DEISS",
        },
      ],
    },
    {
      title: "Fiscal",
      fields: [
        // { label: "Regime Tributário", name: "regimeTrib", placeholder: "Regime Tributário" }, LISTA SUSPSENSA COM CODIGOS DE SERVIÇOS DE ACORDO COM A CIDADE E A UF
        {
          label: "Regime Tributário",
          name: "regimeTrib",
          placeholder: "Regime Tributário",
        },
        {
          label: "Natureza Juridica",
          name: "naturezaJuridica",
          placeholder: "Natureza Juridica",
        },
        {
          label: "Inscricao Municipal",
          name: "inscricaoMunicipal",
          placeholder: "Inscricao Municipal",
        },
      ],
    },
    {
      title: "Quadro Societário",
      fields: [],
      extra: (
        <div className="flex h-[50vh] w-[98%] flex-row items-center justify-around dark:bg-transparent">
          <div className="flex w-[95%] flex-col">
            <div className="mb-6 flex w-full flex-row items-center justify-between">
              <h1 className="text-md mb-4 text-black">Sócios Cadastrados</h1>

              <button
                type="button"
                className=" rounded-lg border-2 border-black	 bg-[#b000ff] px-16  text-white hover:bg-[#690099] focus:outline-none focus:ring-2 focus:ring-cyan-700 focus:ring-offset-2"
                onClick={() => setShowModal(true)}
              >
                Adicionar Sócio
              </button>
            </div>

            <div className="h-[40vh] w-full overflow-auto rounded-md border border-black shadow-2xl dark:border-strokedark dark:bg-boxdark">
              {formDataState.quadroSocietario.length > 0 ? (
                <div className="w-full overflow-x-auto">
                  <table className="w-full min-w-[600px] table-auto">
                    <thead>
                      <tr>
                        {Object.keys(formDataState.quadroSocietario[0]).map(
                          (key, index) => (
                            <th
                              key={index}
                              className="border bg-gray-100 px-4 py-2 text-left"
                            >
                              {key}
                            </th>
                          ),
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {formDataState.quadroSocietario
                        .filter((socio) =>
                          expectedKeys.every(
                            (key) => socio[key] && socio[key] !== "N/A",
                          ),
                        )
                        .map((socio, rowIndex) => (
                          <tr key={rowIndex}>
                            {Object.values(socio).map((value, index) => (
                              <td key={index} className="border px-4 py-2">
                                {value || "N/A"}
                              </td>
                            ))}
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="p-4 text-center">Nenhum sócio cadastrado.</p>
              )}
            </div>
          </div>
        </div>
      ),
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
                ? "border-b-2 border-[#b000ff] text-[#b000ff]"
                : "text-gray-500"
            }`}
          >
            {section.title}
          </button>
        ))}
      </div>
      <div style={{ minHeight: "600px" }}>
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
                  className="absolute right-0 mr-[2%] rounded-[1rem] bg-[#b000ff] px-4 py-1 text-white hover:bg-[#690099] focus:outline-none"
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

          {sections[activeTab].extra && (
            <div className="col-span-2 flex w-full flex-row items-center justify-center">
              {sections[activeTab].extra}
            </div>
          )}
        </form>

        {/* Campo upload File */}
        <div
      className={`mt-8 flex flex-col space-y-10 rounded-2xl bg-white p-1 ${activeTab === 3 ? "" : "hidden"}`}
    >
      {/* Upload de Certificado Digital */}
      <div className="flex flex-col space-y-8">
        <label
          htmlFor="fileUpload"
          className="flex w-fit cursor-pointer items-center gap-2 rounded-lg bg-purple-600 px-8 py-2 text-sm font-medium text-white transition hover:bg-purple-700"
        >
          <CloudArrowUpIcon className="h-5 w-5" />
          <span>Upload Certificado Digital</span>
        </label>
        <input
          type="file"
          id="fileUpload"
          onChange={handleFileChange}
          className="block w-full cursor-pointer rounded-lg border border-gray-300 bg-gray-50 px-4 py-1 text-sm text-gray-900 shadow-sm transition file:mr-4 file:rounded-lg file:border-0 file:bg-purple-100 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-purple-700 hover:file:bg-purple-200 focus:ring-2 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:focus:ring-purple-400"
        />
      </div>

      {/* Senha do Certificado Digital */}
      <div className="flex flex-col space-y-8">
        <label
          htmlFor="password"
          className="flex w-fit items-center gap-2 rounded-lg bg-purple-600 px-8 py-2 text-sm font-medium text-white transition hover:bg-purple-700"
        >
          <LockClosedIcon className="h-5 w-5" />
          <span>Senha Certificado Digital</span>
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={handlePasswordChange}
          placeholder="Digite a senha do certificado"
          className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-1 text-sm text-gray-900 shadow-sm focus:ring-2 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:focus:ring-purple-400"
        />
      </div>

          <button
            type="button"
            onClick={() => handleUpload(formDataState)} // Chama a função corretamente
            className="w-full rounded-lg bg-[#b000ff] px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-[#690099] focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-[#690099] dark:focus:ring-blue-800"
          >
            Enviar Arquivo
          </button>
        </div>

        {/* Exibir progresso do upload */}
        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="mt-4 h-2.5 w-full rounded-full bg-gray-200">
            <div
              className="h-2.5 rounded-full bg-[#b000ff]"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        )}

        {uploadError && (
          <div className="mt-4 text-sm text-red-600">
            Erro no upload: {uploadError}
          </div>
        )}

        {downloadURL && (
          <div className="mt-4 text-sm text-green-600">
            Upload concluído!{" "}
            <a
              href={downloadURL}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-green-800"
            >
              Acesse o arquivo aqui.
            </a>
          </div>
        )}

        {/* Campo para Procura dos códigos de serviços */}
        {activeTab === 3 && (
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

        {/* Botão para enviar dados da aba ativa */}
        <div className="mt-22 flex justify-end">
          {activeTab === 4 && (
            <button
              type="button"
              className="rounded-lg bg-[#b000ff] px-6 py-2 text-white hover:bg-[#690099]"
              onClick={handleSubmit}
            >
              Enviar Dados da Aba
            </button>
          )}
        </div>
      </div>

      {/* Modal de Quadro Societário */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-[#F2F2F2] bg-opacity-70 backdrop-blur-sm">
          <div className="w-[90%] max-w-lg transform rounded-3xl bg-white p-8 shadow-2xl transition-all hover:scale-105">
            <h2 className="mb-6 text-center text-2xl font-semibold text-gray-800">
              Adicionar Sócio
            </h2>
            <form>
              {[
                { label: "Nome", name: "nome", placeholder: "Digite o nome" },
                {
                  label: "Registro Profissional",
                  name: "registroProfissional",
                  placeholder: "Digite o registro profissional",
                },
                {
                  label: "Agência",
                  name: "agencia",
                  placeholder: "Digite sua agência",
                },
                {
                  label: "Conta",
                  name: "conta",
                  placeholder: "Digite o conta",
                },
                {
                  label: "Banco",
                  name: "banco",
                  placeholder: "Digite o banco",
                },
                {
                  label: "PIX",
                  name: "pix",
                  placeholder: "Digite a chave pix",
                },
                { label: "CPF", name: "cpf", placeholder: "Digite o CPF" },
              ].map((field, index) => (
                <div key={index} className="mb-6">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    {field.label}
                  </label>
                  <input
                    name={field.name}
                    value={
                      formDataState.quadroSocietario.length > 0
                        ? formDataState.quadroSocietario[
                            formDataState.quadroSocietario.length - 1
                          ][field.name as keyof QuadroSocietario] || ""
                        : (formDataState as Record<string, any>)[field.name] || ""
                    }
                    
                    placeholder={field.placeholder}
                    onChange={handleChange}
                    className="w-full rounded-lg border-2 border-gray-300 px-5 py-3 text-gray-800 shadow-sm transition-all ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              ))}

              <div className="mt-8 flex justify-between">
                <button
                  type="button"
                  className="w-1/3 transform rounded-lg bg-red-500 px-6 py-3 font-medium text-white shadow-lg transition-all hover:scale-105 hover:bg-red-600"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="w-1/3 transform rounded-lg bg-green-500 px-6 py-3 font-medium text-white shadow-lg transition-all hover:scale-105 hover:bg-green-600"
                  onClick={() => {
                    setShowModal(false);
                    handleSubmit();
                  }}
                >
                  Cadastrar Sócio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormPJ;
