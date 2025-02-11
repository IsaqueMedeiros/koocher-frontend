"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { useState } from "react";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Link from "next/link";
import InputMask from 'react-input-mask';
import { Dialog } from "@headlessui/react";



// export const metadata: Metadata = {
//   title: "Next.js Form Layout | TailAdmin - Next.js Dashboard Template",
//   description:
//     "This is Next.js Form Layout page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
// };


const FormCodServico = () => {
    const [showModal, setShowModal] = useState(false); // Controla o modal de Quadro Societário
    const [activeTab, setActiveTab] = useState(0); // Controla a aba ativa    

        const [formData, setFormData] = useState({

          uf: "",
          municipio:'',
          codigoCidadeIBGE: '',
          codigoServicoFederal: '',
          codigoServicoMunicipal: '',
          descricao: '',
          taxaISS: '',
          taxaIR: '',
          taxaPIS: '',
          taxaCOFINS: '',
          taxaCSLL: '',
          taxaINSS: '',
        });
      
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const { name, value } = e.target;
            setFormData((prev) => ({
              ...prev,
              [name]: value,
            }));
          };
        
        const handleSubmit = async (e?: React.FormEvent) => {
          if (e) e.preventDefault(); 
          try {
            const response = await fetch(`${process.env.API_URL}/api/codigoservico`, {
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


        const sections = [
          {
            title: "Dados Região",
            fields: [
                { label: "UF", name: "uf", placeholder: "UF" },
              { label: "Município", name: "municipio", placeholder: "Município" },
              { label: "Código Cidade IBGE", name: "codigoCidadeIBGE", placeholder: "Código Cidade IBGE" },
              { label: "Código Serviço Federal", name: "codigoServicoFederal", placeholder: "Código Serviço Federal" },
              { label: "Código Serviço Municipal", name: "codigoServicoMunicipal", placeholder: "Código Serviço Municipal" },
              { label: "Descrição", name: "descricao", placeholder: "Descrição" },
 
            ],
          },
          {
            title: "Taxas",
            fields: [
              { label: "Taxa ISS", name: "taxaISS", placeholder: "Insira seu Taxa ISS" },
              { label: "Taxa IR", name: "taxaIR", placeholder: "Insira sua Taxa IR" },
              { label: "Taxa PIS", name: "taxaPIS", placeholder: "Taxa PIS" },
              { label: "Taxa COFINS", name: "taxaCOFINS", placeholder: "Taxa COFINS" },
              { label: "Taxa CSLL", name: "taxaCSLL", placeholder: "Taxa CSLL" },
              { label: "Taxa INSS", name: "taxaINSS", placeholder: "Taxa INSS" },

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
            activeTab === index ? "border-b-2 border-[#b000ff] text-[#b000ff]" : "text-gray-500"
          }`}
        >
          {section.title}
        </button>
      ))}
    </div>
    <div style={{ minHeight: "400px" }}>
    <form className="grid grid-cols-2 sm:grid-cols-2 gap-4 w-full">
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
      className="bg-[#b000ff] text-white px-6 py-2 rounded-lg hover:bg-[#690099]"
      onClick={handleSubmit}
    >
      Enviar Dados da Aba
    </button>
      </div>
    </div>
  
  </div>
  
  );
};

export default FormCodServico;
