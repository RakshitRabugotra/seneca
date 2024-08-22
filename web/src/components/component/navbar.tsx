import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between">
      <Link href="#" className="flex items-center gap-2" prefetch={false}>
        <h1 className="text-3xl font-heading font-extrabold">Seneca</h1>
      </Link>
      <div className="flex items-center gap-4"></div>
    </nav>
  );
}
