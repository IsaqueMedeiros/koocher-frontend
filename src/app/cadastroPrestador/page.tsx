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

  interface SidebarButtonProps {
    label: string;
    active: boolean;
    onClick: () => void;
  }
  
  function SidebarButton({ label, active, onClick }: SidebarButtonProps) {
    return (
      <button
        onClick={onClick}
        className={`w-full flex items-center px-4 py-3 rounded-md transition-all duration-300 border-l-4 text-left
          ${active ? "border-[#690099] bg-[#b000ff] dark:bg-[#b000ff] text-white dark:text-white" : "border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"}`}
      >
       <b>{label}</b> 
      </button>
    );
  }
  

  return (
    <DefaultLayout>
    <Breadcrumb pageName="Cadastros" />

    <div className="w-full grid grid-cols-1 gap-9 sm:grid-cols-1 p-6">
      <div className="flex w-full gap-9 flex-col md:flex-row">
        {/* Sidebar */}
        <div className="w-full h-[30vh] md:w-1/4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-300 dark:border-gray-700 p-6">
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white border-b pb-4">Lista de Cadastros</h1>
          
          <div className="mt-6 flex flex-col gap-4">
            <SidebarButton
              label="Cadastrar Prestador"
              active={activeForm === "prestador"}
              onClick={() => handlePanelChange("prestador")}
            />
            <SidebarButton
              label="Cadastrar Tomador"
              active={activeForm === "tomador"}
              onClick={() => handlePanelChange("tomador")}
            />
            <SidebarButton
              label="Código de Serviço"
              active={activeForm === "codigo"}
              onClick={() => handlePanelChange("codigo")}
            />
          </div>
        </div>

        {/* Formulário */}
        <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-300 dark:border-gray-700 p-6">
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white border-b pb-4">Formulário</h1>

          <div className="mt-6">
            {activeForm === "prestador" && <FormPJ />}
            {activeForm === "tomador" && <FormTomador />}
            {activeForm === "codigo" && <FormCodServico />}
            {!activeForm && (
              <p className="text-gray-500 dark:text-gray-300">Selecione uma opção para visualizar o formulário.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  </DefaultLayout>
  );
};

export default CadastroPrestador;
