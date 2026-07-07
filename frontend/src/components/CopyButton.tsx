import { useState } from "react";
import { Check, Clipboard } from "lucide-react";

interface CopyButtonProps {
  text: string;
  label?: string;
  successLabel?: string;
  className?: string;
}

async function copyText(text: string) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch {
      // Fallback for embedded or permission-restricted browsers.
    }
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
}

export function CopyButton({
  text,
  label = "Copiar",
  successLabel = "Copiado",
  className = "",
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await copyText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2400);
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={[
        "inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-2 text-sm font-semibold text-cyan-100 transition hover:border-cyan-400/50 hover:bg-cyan-400 hover:text-slate-950",
        copied ? "border-emerald-400/40 bg-emerald-400 text-slate-950" : "",
        className,
      ].join(" ")}
    >
      {copied ? <Check className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />}
      {copied ? successLabel : label}
    </button>
  );
}
