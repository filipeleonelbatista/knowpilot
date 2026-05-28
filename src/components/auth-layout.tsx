"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";

export function AuthLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mesh-bg flex min-h-screen">
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden p-12 lg:flex">
        <Logo size="lg" href="/" />
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl font-bold leading-tight">
            IA que responde com{" "}
            <span className="gradient-text">a sua verdade</span>
          </h2>
          <p className="mt-4 max-w-md text-lg text-muted-foreground">
            {subtitle}
          </p>
        </motion.div>
        <p className="text-sm text-muted-foreground">
          Self-hosted · Ollama · RAG
        </p>
        <div
          className="pointer-events-none absolute -bottom-20 -right-20 h-80 w-80 rounded-full opacity-30 blur-3xl"
          style={{ background: "var(--glow)" }}
        />
      </div>
      <div className="flex w-full flex-col lg:w-1/2">
        <div className="flex justify-end p-4 lg:hidden">
          <ThemeToggle />
        </div>
        <div className="flex flex-1 flex-col justify-center px-6 py-12 sm:px-12">
          <div className="mb-8 flex items-center justify-between lg:hidden">
            <Logo size="md" href="/" />
            <ThemeToggle />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto w-full max-w-md"
          >
            <h1 className="text-2xl font-bold">{title}</h1>
            <div className="mt-8">{children}</div>
            <p className="mt-6 text-center text-sm text-muted-foreground">
              <Link href="/" className="hover:text-foreground transition">
                ← Voltar ao site
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
