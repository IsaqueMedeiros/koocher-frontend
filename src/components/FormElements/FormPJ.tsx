"use client";

import { useState, useRef, useEffect } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/16/solid";

const FormPJ = () => {
  const [showModal, setShowModal] = useState(false); // Controla o modal de Quadro Societário
  const [activeTab, setActiveTab] = useState(0); // Controla a aba ativa
  const [cnpjList, setCnpjList] = useState<string[]>([]); // Lista de CNPJs cadastrados
  const [showCnpjList, setShowCnpjList] = useState(false);
  const cnpjListRef = useRef<HTMLUListElement | null>(null);

  interface QuadroSocietario {
    nome: string;
    registroProfissional: string;
    email: string;
    telefone: string;
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
    senhaCertificadoDigital: string;
    quadroSocietario: QuadroSocietario;
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
    quadroSocietario: {
      nome: "",
      registroProfissional: "",
      email: "",
      telefone: "",
      cpf: "",
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (
      ["nome", "registroProfissional", "email", "telefone", "cpf"].includes(
        name,
      )
    ) {
      setFormDataState((prevState) => ({
        ...prevState,
        quadroSocietario: {
          ...prevState.quadroSocietario,
          [name]: value,
        },
      }));
    } else {
      setFormDataState((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

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

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    try {
      // Atualizando o formDataState com quadroSocietario como string JSON
      const updatedFormData = {
        ...formDataState, // Usando formDataState (não FormData)
        quadroSocietario: JSON.stringify(formDataState.quadroSocietario),
      };

      const response = await fetch(
        `https://3b91-187-111-23-250.ngrok-free.app/api/cadastroprestador`,
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

        // Salvar o CNPJ no localStorage, assumindo que ele está em formDataState
        if (formDataState.Cnpj) {
          const cnpjSemBarras = formDataState.Cnpj.replace(/[^\d]/g, "");
          localStorage.setItem("cnpj", cnpjSemBarras);

          console.log("CNPJ salvo no localStorage:", cnpjSemBarras);
        }

        // Lógica após o envio bem-sucedido (ex. limpar formulário ou mostrar mensagem de sucesso)
      } else {
        console.error("Erro ao enviar os dados:", response.statusText);
        // Lógica em caso de erro
      }
    } catch (error) {
      console.error("Erro ao enviar os dados:", error);
    }
  };

  const handleCnpjSelect = (selectedCnpj: string) => {
    const prestador = cnpjListData.find((p: any) => p.Cnpj === selectedCnpj);
  
    if (prestador) {
      const expectedKeys = ['nome', 'registroProfissional', 'email', 'telefone', 'cpf']; // Ajuste conforme necessário
  
      let quadroSocietario = {
        nome: "",
        registroProfissional: "",
        email: "",
        telefone: "",
        cpf: "",
      } as QuadroSocietario;
  
      if (prestador.QuadroSocietario) {
        try {
          // Verifique se o campo é uma string e faça o parse
          const parsedQuadroSocietario =
            typeof prestador.QuadroSocietario === "string"
              ? JSON.parse(prestador.QuadroSocietario)
              : prestador.QuadroSocietario;
  
          if (Array.isArray(parsedQuadroSocietario) && parsedQuadroSocietario.length > 0) {
            quadroSocietario = { ...parsedQuadroSocietario[0] };
          } else if (typeof parsedQuadroSocietario === "object") {
            quadroSocietario = { ...parsedQuadroSocietario };
          }
  
          // Filtramos apenas as chaves desejadas
          quadroSocietario = Object.fromEntries(
            Object.entries(quadroSocietario).filter(([key]) => expectedKeys.includes(key))
          ) as QuadroSocietario;
        } catch (error) {
          console.error("Erro ao processar QuadroSocietario:", error);
        }
      }
  
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
        quadroSocietario: quadroSocietario,
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
        "https://3b91-187-111-23-250.ngrok-free.app/api/listarprestadores",
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
        //  { label: "Certificado Digital", name: "certificadoDigital", placeholder: "Certificado Digital" }, ARQUIVO .PFX ?? .P12
        {
          label: "Senha Certificado Digital",
          name: "senhaCertificadoDigital",
          placeholder: "Senha Certificado Digital",
        },
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
        {
          label: "Cod. Serviço",
          name: "codServico",
          placeholder: "Cod. Serviço",
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
                className=" rounded-lg border-2 border-black	 bg-cyan-700 px-16  text-white hover:bg-cyan-800 focus:outline-none focus:ring-2 focus:ring-cyan-700 focus:ring-offset-2"
                onClick={() => setShowModal(true)}
              >
                Adicionar Sócio
              </button>
            </div>

            <div className="h-[40vh] w-full rounded-md border border-black shadow-2xl dark:border-strokedark dark:bg-boxdark">
              {Object.keys(formDataState.quadroSocietario || {}).length > 0 ? (
                <table className="w-full table-auto">
                  <thead>
                    <tr>
                      {Object.keys(formDataState.quadroSocietario).map(
                        (key, index) => (
                          <th key={index} className="border px-4 py-2">
                            {key}
                          </th>
                        ),
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      {Object.values(formDataState.quadroSocietario).map(
                        (value, index) => (
                          <td key={index} className="border px-4 py-2">
                            {value || "N/A"}
                          </td>
                        ),
                      )}
                    </tr>
                  </tbody>
                </table>
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
          {/* Campo CNPJ como o primeiro */}
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

        {/* Botão para enviar dados da aba ativa */}
        <div className="mt-4 flex justify-end">
          {activeTab !== sections.length - 1 && (
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

      {/* Modal de Quadro Societário */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black">
          <div className="w-[90%] max-w-lg rounded-lg bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-lg font-bold">Adicionar Sócio</h2>
            <form>
              {[
                { label: "Nome", name: "nome", placeholder: "Nome" },
                {
                  label: "Registro Profissional",
                  name: "registroProfissional",
                  placeholder: "Registro Profissional",
                },
                { label: "E-mail", name: "email", placeholder: "E-mail" },
                {
                  label: "Telefone",
                  name: "telefone",
                  placeholder: "Telefone",
                },
                { label: "CPF", name: "cpf", placeholder: "CPF" },
              ].map((field, index) => (
                <div key={index} className="mb-4">
                  <label className="mb-2 block text-sm font-medium text-black">
                    {field.label}
                  </label>
                  <input
                    name={field.name}
                    value={formDataState.quadroSocietario[field.name]} // Vincula o valor ao quadroSocietario
                    placeholder={field.placeholder}
                    onChange={handleChange} // Atualiza o estado ao digitar
                    className="w-full rounded-lg border-[1.5px] border-gray-300 px-4 py-2"
                  />
                </div>
              ))}
              <div className="flex justify-end">
                <button
                  type="button"
                  className="mr-2 rounded-lg bg-red-500 px-4 py-2 text-white"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="rounded-lg bg-green-500 px-4 py-2 text-white"
                  onClick={() => {
                    setShowModal(false);
                    handleSubmit(); // Envia os dados ao salvar no modal
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
