"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { useState, useEffect, useRef } from "react";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Link from "next/link";
import InputMask from 'react-input-mask';
import { Dialog } from "@headlessui/react";
import { MagnifyingGlassIcon } from "@heroicons/react/16/solid";



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
          inscricaoMunicipal: '',
          razaoSocial:''
        });
      
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const { name, value } = e.target;
            setFormData((prev) => ({
              ...prev,
              [name]: value,
            }));

             // Se o campo alterado for o CEP e tiver 8 dígitos, busca o endereço
            if (name === "cep" && value.replace(/\D/g, "").length === 8) {
              fetchAddress(value);
            }

          };

          const fetchAddress = async (cep: string) => {
            const cleanCep = cep.replace(/\D/g, '');
            
            try {
                const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
                if (!response.ok) {
                    throw new Error('Erro ao buscar o endereço');
                }
                const data = await response.json();
                setFormData((prev) => ({
                    ...prev,
                    rua: data.logradouro || '',
                    bairro: data.bairro || '',
                    cidade: data.localidade || '',
                    uf: data.uf || '',
                }));
            } catch (error) {
                console.error(error);
            }
        };
        
        
          
        
        const handleSubmit = async (e?: React.FormEvent) => {
          if (e) e.preventDefault(); 
          
          try {
            const response = await fetch(`${process.env.API_URL}/api/tomador`,{ 
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(formData),
            });
      
            if (response.ok) {
              const result = await response.json();
              console.log('Dados enviados com sucesso:', result);
              // Lógica após o envio bem-sucedido (ex. limpar formulário ou mostrar mensagem de sucesso)
            } else {
              console.error('Erro ao enviar os dados:', response.statusText);
              // Lógica em caso de erro
            }
          } catch (error) {
            console.error('Erro ao enviar os dados:', error);
          }
        };

        
          const [cnpjList, setCnpjList] = useState<string[]>([]); // Lista de CNPJs cadastrados
          const [showCnpjList, setShowCnpjList] = useState(false);
        
          // Referência da lista de CNPJs
          const cnpjListRef = useRef<HTMLUListElement | null>(null);
        
          // Função para fechar a lista quando clicar fora dela
          const handleClickOutside = (e: MouseEvent) => {
            if (cnpjListRef.current && !cnpjListRef.current.contains(e.target as Node)) {
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
          
          const fetchCNPJData = async (cnpj: string) => {
            try {
              const response = await fetch(`/api/cnpj/${cnpj}`);
              if (!response.ok) {
                throw new Error("CNPJ não encontrado");
              }
              const data = await response.json();
          
              // Exibe a lista de CNPJs retornada
              setCnpjList(data.cnpjList || []);
              setShowCnpjList(true); // Mostra a lista de CNPJs
            } catch (error) {
              console.error("Erro ao buscar CNPJ:", error);
              setCnpjList([]); // Limpa a lista de CNPJs em caso de erro
              setShowCnpjList(true); // Garante que a lista seja mostrada
            }
          };
          
          const handleSelectCNPJ = async (selectedCnpj: string) => {
            try {
              const response = await fetch(`${process.env.API_URL}/api/cnpj/${selectedCnpj}`,);
              if (!response.ok) {
                throw new Error("Erro ao buscar dados do CNPJ");
              }
              const data = await response.json();
          
              // Preenche os campos com os dados do CNPJ selecionado
              setFormData((prev) => ({
                ...prev,
                cnpj: selectedCnpj,
                nome: data.nome || "",
                endereco: data.endereco || "",
                telefone: data.telefone || "",
                email: data.email || "",
                // Outros campos necessários
              }));
          
              // Fecha a lista após seleção e garante que a lista seja escondida
              setShowCnpjList(false);
          
              // Aqui você pode adicionar qualquer lógica adicional para manipular a UI ou dados
          
            } catch (error) {
              console.error("Erro ao buscar dados do CNPJ selecionado:", error);
            }
          };


        const sections = [
          {
            title: "Dados",
            fields: [
              { label: "Razão Social", name: "razaoSocial", placeholder: "Razão Social" },
              { label: "Inscrição Municipal", name: "inscricaoMunicipal", placeholder: "Inscrição Municipal" },
 
 
            ],
          },
          {
            title: "Endereço",
            fields: [
              { label: "CEP", name: "cep", placeholder: "Insira seu CEP" },
              { label: "Rua", name: "rua", placeholder: "Insira sua rua" },
              { label: "Número", name: "numero", placeholder: "Número da rua" },
              { label: "Complemento", name: "complemento", placeholder: "Complemento" },
              { label: "Cidade", name: "cidade", placeholder: "Cidade" },
              { label: "Bairro", name: "bairro", placeholder: "Bairro" },
              { label: "UF", name: "uf", placeholder: "UF" },
              { label: "País de Origem", name: "paisOrigem", placeholder: "País de Origem" },
            ],
          },
        ];

  return (
    <div className="p-6 bg-transparent">
    <div className="flex border-b mb-6">
      {sections.map((section, index) => (
        <button
          key={index}
          onClick={() => setActiveTab(index)}
          className={`p-4 w-full text-center ${
            activeTab === index ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500"
          }`}
        >
          {section.title}
        </button>
      ))}
    </div>
    <div style={{ minHeight: "400px" }}>
    <form className="grid grid-cols-2 sm:grid-cols-2 gap-4 w-full">
  {/* Campo CNPJ como o primeiro */}
  {activeTab === 0 && (
    <div className="mb-4 flex flex-col">
      <label
        htmlFor="cnpj"
        className="mb-2 text-sm font-medium text-gray-700"
      >
        CNPJ
      </label>
      <div className="relative flex items-center w-full">
        <input
          type="text"
          id="cnpj"
          name="cnpj"
          placeholder="CNPJ"
          value={formData.cnpj}
          onChange={handleChange}
          className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="button"
          onClick={() => fetchCNPJData(formData.cnpj)}
          className="absolute right-0 rounded-[1rem] mr-[2%] bg-blue-600 px-4 py-1 text-white hover:bg-blue-700 focus:outline-none"
        >
          <MagnifyingGlassIcon className="h-5 w-5" />
        </button>
      </div>
      {showCnpjList && (
        <ul className="absolute z-10 ml-[46%] mt-[-5rem] w-[40%] rounded-md border border-gray-300 bg-white shadow-lg">
          {cnpjList.length > 0 ? (
            cnpjList.map((cnpj, index) => (
              <li
                key={index}
                className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                onClick={() => handleSelectCNPJ(cnpj)}
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
      <label className="block mb-2 text-sm font-medium text-black">{field.label}</label>
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
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
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
