import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import FormNotas from "@/components/FormElements/FormNotas";

export const metadata: Metadata = {
  title:
    "KOOCHER",
  description: "Sistema de Emissão de NFE-e Koocher",
};

export default function Home() {
  return (
    <>
      <DefaultLayout>
        <FormNotas />
      </DefaultLayout>
    </>
  );
}
