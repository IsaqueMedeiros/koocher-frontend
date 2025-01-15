"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { useState } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import FormPJ from "@/components/FormElements/FormPJ";
import FormTomador from "@/components/FormElements/FormTomador";
import FormCodServico from "@/components/FormElements/FormCodServico";

const CadastroPrestador = () => {
  const [activeForm, setActiveForm] = useState<"prestador" | "tomador" | "codigo" | null>("prestador");

  const handlePanelChange = (panel: "prestador" | "tomador" | "codigo") => {
    setActiveForm((prev) => (prev === panel ? null : panel));
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Cadastros" />

      <div className="grid w-full grid-cols-1 gap-9 sm:grid-cols-1">
        <div className="flex-cols-2 flex w-full gap-9">
          {/* Form Section */}
          <div className="h-[20rem] w-[25%] rounded-md border border-stroke shadow-2xl dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
              <h1 className="font-medium text-black dark:text-white">
                Lista de Cadastros
              </h1>
            </div>

            <div className="mt-[2.5rem] flex w-full flex-col items-center">
              {/* Botão para abrir painel de Prestador */}
              <div className="flex w-min flex-row items-center justify-center p-4 ml-8">
                <button
                  onClick={() => handlePanelChange("prestador")}
                  className={`flex h-[2rem] w-[18rem] flex-row items-center justify-start border-l-2 ${
                    activeForm === "prestador" ? "border-cyan-600" : "border-gray-300"
                  }`}
                >
                  <p className="text-md ml-[5%] text-black dark:text-white">Cadastrar Prestador</p>
                </button>
              </div>

              {/* Botão para abrir painel de Tomador */}
              <div className="flex w-min flex-row items-center justify-center p-4 ml-8">
                <button
                  onClick={() => handlePanelChange("tomador")}
                  className={`flex h-[2rem] w-[18rem] flex-row items-center justify-start border-l-2 ${
                    activeForm === "tomador" ? "border-cyan-600" : "border-gray-300"
                  }`}
                >
                  <p className="text-md ml-[5%] text-black dark:text-white">Cadastrar Tomador</p>
                </button>
              </div>

              {/* Botão para abrir painel de Codigo */}
              <div className="flex w-min flex-row items-center justify-center p-4 ml-8">
                <button
                  onClick={() => handlePanelChange("codigo")}
                  className={`flex h-[2rem] w-[18rem] flex-row items-center justify-start border-l-2 ${
                    activeForm === "codigo" ? "border-cyan-600" : "border-gray-300"
                  }`}
                >
                  <p className="text-md ml-[5%] text-black dark:text-white">Código de Serviço</p>
                </button>
              </div>
            </div>
          </div>

          {/* Painéis Laterais */}
          <div className="relative flex-1 rounded-md border border-stroke shadow-2xl dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
              <h1 className="font-medium text-black dark:text-white">Formulário</h1>
            </div>

            <div className="p-6">
              {activeForm === "prestador" && <FormPJ />}
              {activeForm === "tomador" && <FormTomador />}
              {activeForm === "codigo" && <FormCodServico />}
              {!activeForm && (
                <p className="text-gray-500 dark:text-white">Selecione uma opção para visualizar o formulário.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default CadastroPrestador;
