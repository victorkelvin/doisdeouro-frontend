import { Github, Linkedin, MessageSquare } from "lucide-react"

function Footer({
  developerName = "Desenvolvedor",
  githubUrl = "https://github.com/username",
  linkedinUrl = "https://linkedin.com/in/username",
  whatsappUrl = "https://wa.me/5500000000000",
  sticker = false,
}) {
  return (
    <footer
      className={`border-t-2 bg-gray-300 py-2 px-2 ${
        sticker ? "fixed bottom-0 left-0 w-full z-50" : ""
      }`}
    >
      <div
        className="mx-auto flex flex-row gap-2 text-xs text-black sm:items-center sm:justify-between"
      >
        <div className="w-full sm:w-auto sm:flex-1">
          <p className="text-left">
            © {new Date().getFullYear()} Academia Dois de Ouro.<br />
            Desenvolvido por <span className="font-medium">{developerName}</span>
          </p>
        </div>
        <div className="flex items-center justify-center gap-3 mt-1 sm:mt-0 sm:justify-end sm:w-auto">
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Github className="h-4 w-4" />
          </a>
          <a
            href={linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Linkedin className="h-4 w-4" />
          </a>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <MessageSquare className="h-4 w-4" />
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer

