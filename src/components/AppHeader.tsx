import Link from "next/link";

type Role = "mentee" | "mentor" | "admin";

interface AppHeaderProps {
  role?: Role;
  userName?: string;
}

const navLinks: Record<Role, { label: string; href: string }[]> = {
  mentee: [
    { label: "Home", href: "/home" },
    { label: "Mentors", href: "/mentors" },
  ],
  mentor: [
    { label: "Home", href: "/home" },
    { label: "Mentors", href: "/mentors" },
    { label: "My Profile", href: "/mentor/profile" },
  ],
  admin: [
    { label: "Home", href: "/home" },
    { label: "Mentors", href: "/mentors" },
    { label: "Admin", href: "/admin" },
  ],
};

export default function AppHeader({ role, userName }: AppHeaderProps) {
  const links = role ? navLinks[role] : [];

  return (
    <header className="bg-white border-b border-neutral-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Wordmark */}
          <Link
            href={role ? "/home" : "/"}
            className="text-base font-bold text-neutral-900 tracking-tight hover:text-primary-600 transition-colors"
          >
            PISE Mentors
          </Link>

          {/* Role-based navigation */}
          <div className="flex items-center gap-1 flex-wrap justify-end">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm font-medium text-neutral-600 rounded-lg hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
              >
                {link.label}
              </Link>
            ))}

            {/* User name display — sign-out action wired in Milestone 3 */}
            {userName && (
              <span className="ml-3 text-sm text-neutral-500 hidden sm:inline">
                {userName}
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
