import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import TablePrestador from "@/components/Tables/TablePrestador";


import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
  title: "Next.js Tables | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Tables page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const TablesPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Prestadores Cadastrados" />

      <div className="flex flex-col gap-10 h-auto bg-[#F2F2F2] ">
        <TablePrestador />
      </div>
    </DefaultLayout>
  );
};

export default TablesPage;
