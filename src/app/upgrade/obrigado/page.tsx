import Link from "next/link";

export default function ObrigadoPage() {
  return (
    <main className="mx-auto max-w-lg px-6 py-20 text-center">
      <h1 className="text-2xl font-bold">Obrigado pelo interesse!</h1>
      <p className="mt-4 text-zinc-600">
        Recebemos seus dados e entraremos em contato em breve.
      </p>
      <Link href="/" className="mt-6 inline-block text-blue-600 hover:underline">
        Voltar ao início
      </Link>
    </main>
  );
}
