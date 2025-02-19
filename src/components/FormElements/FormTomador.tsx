"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { useState, useEffect, useRef } from "react";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Link from "next/link";
import InputMask from "react-input-mask";
import { Dialog } from "@headlessui/react";
import { MagnifyingGlassIcon } from "@heroicons/react/16/solid";
import { maskCNPJ } from "../Mask/mask";

// export const metadata: Metadata = {
//   title: "Next.js Form Layout | TailAdmin - Next.js Dashboard Template",
//   description:
//     "This is Next.js Form Layout page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
// };

const FormTomador = () => {
  const [showModal, setShowModal] = useState(false); // Controla o modal de Quadro Societário
  const [activeTab, setActiveTab] = useState(0); // Controla a aba ativa

  const [formData, setFormData] = useState({
    cep: "",
    rua: "",
    numero: "",
    complemento: "",
    cidade: "",
    bairro: "",
    uf: "",
    cnpj: "",
    inscricaoMunicipal: "",
    razaoSocial: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === "cnpj") {
      formattedValue = maskCNPJ(value);
    } 

    setFormData((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));

    // Se o campo alterado for o CEP e tiver 8 dígitos, busca o endereço
    if (name === "cep" && value.replace(/\D/g, "").length === 8) {
      fetchAddress(value);
    }
  };

  const fetchAddress = async (cep: string) => {
    const cleanCep = cep.replace(/\D/g, "");

    try {
      const response = await fetch(
        `https://viacep.com.br/ws/${cleanCep}/json/`,
      );
      if (!response.ok) {
        throw new Error("Erro ao buscar o endereço");
      }
      const data = await response.json();
      setFormData((prev) => ({
        ...prev,
        rua: data.logradouro || "",
        bairro: data.bairro || "",
        cidade: data.localidade || "",
        uf: data.uf || "",
      }));
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    try {
      const response = await fetch(`${process.env.API_URL}/api/tomador`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Dados enviados com sucesso:", result);
        // Lógica após o envio bem-sucedido (ex. limpar formulário ou mostrar mensagem de sucesso)
      } else {
        console.error("Erro ao enviar os dados:", response.statusText);
        // Lógica em caso de erro
      }
    } catch (error) {
      console.error("Erro ao enviar os dados:", error);
    }
  };

  const [cnpjList, setCnpjList] = useState<string[]>([]); // Lista de CNPJs cadastrados
  const [showCnpjList, setShowCnpjList] = useState(false);

  // Referência da lista de CNPJs
  const cnpjListRef = useRef<HTMLUListElement | null>(null);

  // Função para fechar a lista quando clicar fora dela
  const handleClickOutside = (e: MouseEvent) => {
    if (
      cnpjListRef.current &&
      !cnpjListRef.current.contains(e.target as Node)
    ) {
      setShowCnpjList(false);
    }
  };

  useEffect(() => {
    // Adiciona o ouvinte de evento para detectar cliques fora da lista
    document.addEventListener("mousedown", handleClickOutside);

    // Limpeza do evento ao desmontar o componente
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


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
      // Aplica a máscara ao CNPJ retornado da API
      const cnpjFormatado = maskCNPJ(selectedTomador.Cnpj || "");

      setFormData((prevState) => ({
        ...prevState,
        cnpjTomador: cnpjFormatado, // Usa o CNPJ formatado
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

  const sections = [
    {
      title: "Dados",
      fields: [
        {
          label: "Razão Social",
          name: "razaoSocial",
          placeholder: "Razão Social",
        },
        {
          label: "Inscrição Municipal",
          name: "inscricaoMunicipal",
          placeholder: "Inscrição Municipal",
        },
      ],
    },
    {
      title: "Endereço",
      fields: [
        { label: "CEP", name: "cep", placeholder: "Insira seu CEP" },
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
                  id="cnpj"
                  name="cnpj"
                  placeholder="CNPJ"
                  value={formData.cnpj}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  maxLength={18}
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
                  <div className="animate-fadeIn absolute  mt-[5rem] z-50 w-64 max-w-md transform overflow-hidden rounded-2xl border border-gray-100/50 bg-white/90 p-0 shadow-2xl backdrop-blur-lg transition-all duration-300 ease-in-out hover:scale-[1.02] dark:border-gray-700/50 dark:bg-gray-800/95 md:w-72">
                    {/* Cabeçalho */}
                    <div className="dark:to-gray-750/90 flex items-center justify-between border-b border-gray-100/70 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 px-4 py-3 dark:border-gray-700/70 dark:from-gray-800/90">
                      <h3 className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-200">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="mr-2 h-4 w-4 animate-pulse text-blue-500 dark:text-blue-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                          />
                        </svg>
                        <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400">
                          <p className="text-[0.7rem]">TOMADORES CADASTRADOS</p>
                        </span>
                      </h3>
                      <button
                        className="transform rounded-full p-1 text-gray-400 transition-colors duration-200 hover:rotate-90 hover:bg-gray-200/70 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-600/70 dark:hover:text-gray-200"
                        onClick={() => setShowCnpjTomadorList(false)}
                        aria-label="Fechar lista"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>

                    {/* Conteúdo */}
                    <div className="bg-gradient-to-b from-transparent to-blue-50/30 p-3 dark:to-blue-900/10">
                      {cnpjTomadorList.length > 0 ? (
                        <ul className="custom-scrollbar max-h-64 space-y-2 overflow-y-auto pr-1">
                          {cnpjTomadorList.map((tomador, index) => (
                            <li
                              key={index}
                              className="transform transition-all duration-300 hover:-translate-y-1 hover:scale-[1.03]"
                              style={{
                                animationDelay: `${index * 50}ms`,
                                animation: "fadeInUp 0.5s ease-out forwards",
                                opacity: 0,
                              }}
                            >
                              <button
                                onClick={() =>
                                  handleTomadorSelect(tomador.Cnpj)
                                }
                                className="group flex w-full items-center rounded-lg border border-gray-100/80 bg-white/80 px-4 py-3 text-left text-sm text-gray-700 shadow-sm backdrop-blur-sm transition-all duration-300 ease-in-out hover:border-blue-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50/70 hover:shadow-md dark:border-gray-600/80 dark:bg-gray-700/90 dark:text-gray-200 dark:hover:border-blue-700 dark:hover:bg-gray-600/90"
                              >
                                <span className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 transition-colors duration-300 group-hover:bg-blue-100 dark:bg-gray-600 dark:group-hover:bg-gray-500">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4 text-blue-500 transition-transform duration-300 group-hover:scale-110 group-hover:text-blue-600 dark:text-blue-400 dark:group-hover:text-blue-300"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                  </svg>
                                </span>
                                <span className="truncate font-medium transition-colors duration-300 group-hover:text-blue-600 dark:group-hover:text-blue-300">
                                  {tomador.Cnpj}
                                </span>
                                <span className="ml-auto transform text-blue-500 opacity-0 transition-all duration-300 group-hover:opacity-100 dark:text-blue-400">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M9 5l7 7-7 7"
                                    />
                                  </svg>
                                </span>
                              </button>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-6 text-gray-500 dark:text-gray-400">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="mb-3 h-12 w-12 text-gray-300 dark:text-gray-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                            />
                          </svg>
                          <p className="text-sm">Nenhum CNPJ disponível</p>
                        </div>
                      )}
                    </div>

                    {/* Rodapé (opcional) */}
                    {cnpjTomadorList.length > 0 && (
                      <div className="dark:to-gray-750/80 border-t border-gray-100/70 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 px-4 py-2 text-center text-xs text-gray-500 dark:border-gray-700/70 dark:from-gray-800/80 dark:text-gray-400">
                        {cnpjTomadorList.length}{" "}
                        {cnpjTomadorList.length === 1
                          ? "CNPJ encontrado"
                          : "CNPJs encontrados"}
                      </div>
                    )}
                  </div>
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
                value={(formData as any)[field.name]}
                onChange={handleChange}
                placeholder={field.placeholder}
                className="w-full rounded-lg border-[1.5px] border-gray-300 px-4 py-2"
              />
            </div>
          ))}
        </form>

        {/* Botão para enviar dados da aba ativa */}
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            className="rounded-lg bg-[#b000ff] px-6 py-2 text-white hover:bg-[#690099]"
            onClick={handleSubmit}
          >
            Enviar Dados da Aba
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormTomador;
