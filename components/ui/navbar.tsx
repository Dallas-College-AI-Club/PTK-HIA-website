import Link from "next/link"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/chatbot", label: "Chatbot" },
  { href: "/esl", label: "ESL & Classes" },
  { href: "/financial-aid", label: "Financial Aid" },
  { href: "/get-connected", label: "Get Connected" },
]

function NavBar() {
  return (
    <header data-slot="navbar" className="border-b bg-background">
      <nav
        aria-label="Main"
        className="mx-auto flex w-full max-w-5xl flex-wrap items-center gap-x-6 px-4"
      >
        <span className="font-heading text-lg font-semibold">LOGO</span>
        <div className="ml-auto flex items-center gap-6">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="py-3 text-sm font-medium hover:text-primary"
            >
              {label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  )
}

export { NavBar }
