"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Upload, MessageSquare, Activity } from "lucide-react"

export function Header() {
  const pathname = usePathname()

  const navItems = [
    { href: "/", label: "Submission", icon: Upload },
    { href: "/query", label: "Query", icon: MessageSquare },
    { href: "/monitoring", label: "Monitoring", icon: Activity },
  ]

  return (
    <header className="border-b border-primary/20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">A</span>
            </div>
            <span className="font-bold text-xl text-primary">Agent Deploy</span>
          </div>

          <nav className="flex gap-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors
                    ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
    </header>
  )
}
