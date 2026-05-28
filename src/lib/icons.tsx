import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  BookOpen,
  Bot,
  Check,
  Eye,
  FileText,
  Lock,
  MessageCircle,
  Pencil,
  Plus,
  Sparkles,
  Target,
  Users,
  Zap,
} from "lucide-react";

export const featureIcons = {
  rag: Target,
  local: Lock,
  widget: Zap,
  personality: Bot,
  orgs: Users,
  queue: BarChart3,
} as const satisfies Record<string, LucideIcon>;

export const orgActionIcons = {
  knowledge: BookOpen,
  attendant: Bot,
  widget: MessageCircle,
  preview: Eye,
} as const satisfies Record<string, LucideIcon>;

export { BookOpen, Bot, Check, Eye, FileText, MessageCircle, Pencil, Plus, Sparkles };
