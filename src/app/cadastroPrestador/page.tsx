"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { useState } from "react";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Link from "next/link";
import InputMask from 'react-input-mask';



// export const metadata: Metadata = {
//   title: "Next.js Form Layout | TailAdmin - Next.js Dashboard Template",
//   description:
//     "This is Next.js Form Layout page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
// };


const CadastroPrestador = () => {


        const [formData, setFormData] = useState<FormData>({

        cep: '',
        rua: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        uf: '',
        idCadastro: '',
        });
      
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const { name, value } = e.target;
          setFormData((prev) => ({
            ...prev,
            [name]: value,
          }));
        };
      
        const handleSubmit = async (e: React.FormEvent) => {
          e.preventDefault();
      
          try {
            const response = await fetch('https://be26-187-111-23-250.ngrok-free.app/api/cadastroprestador', {
              method: 'POST',
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

    interface FormData {
        cep: string;
        rua: string;
        numero: string;
        complemento: string;
        bairro: string;
        cidade: string;
        uf: string;
        idCadastro: string;
      }
    

  return (
    <DefaultLayout>
      <Breadcrumb pageName="CadastroPrestador" />

      <div className="grid grid-cols-1 gap-9 sm:grid-cols-1">
        <div className="flex flex-col gap-9">
          {/* <!-- Contact Form --> */}
          <div className="rounded-md border border-stroke shadow-default dark:border-strokedark dark:bg-boxdark w-[100%]">
            <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Cadastro Prestador
              </h3>
            </div>
            <form  onSubmit={handleSubmit}>
              <div className="p-6.5">
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <label className="mb-3 text-sm font-medium text-black dark:text-white">
                      CEP
                    </label>
                    <input
                    value={formData.cep}
                    onChange={handleChange}
                    name="cep"
                    required
                      placeholder="Insira seu CEP"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>

                  <div className="w-full xl:w-1/2">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Rua
                    </label>
                    <input
                    value={formData.rua}
                    onChange={handleChange}
                    required
                      name="rua"
                      placeholder="Insira sua rua"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>
                </div>

                <div className="mb-4.5">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Número <span className="text-meta-1">*</span>
                  </label>
                  <input
                  value={formData.numero}
                  onChange={handleChange}
                  required
                    name="numero"
                    placeholder="Número da rua"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

                <div className="mb-4.5">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Complemento
                  </label>
                  <input
                  value={formData.complemento}
                  onChange={handleChange}
                  required
                    name="complemento"
                    placeholder="Complemento"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

                <div className="mb-4.5">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Cidade
                  </label>
                  <input
                  value={formData.cidade}
                  onChange={handleChange}
                  required
                    name="cidade"
                    placeholder="Cidade"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

                <div className="mb-4.5">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Bairro
                  </label>
                  <input
                  value={formData.bairro}
                  onChange={handleChange}
                  required
                    name="bairro"
                    placeholder="Bairro"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

                <div className="mb-4.5">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    UF
                  </label>
                  
                  <input
                  value={formData.uf}
                  onChange={handleChange}
                  required
                    name="uf"
                    placeholder="UF"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

                <div className="mb-4.5">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Id de Cadstro
                  </label>
                  <input
                  value={formData.idCadastro}
                  onChange={handleChange}
                  required
                    name="idCadastro"
                    placeholder="Id de Cadstro"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

                <button className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90">
                  Cadastrar Prestador
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default CadastroPrestador;
