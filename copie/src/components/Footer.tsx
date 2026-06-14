import { Link } from "@tanstack/react-router";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="relative mt-16 border-t border-[var(--border)] bg-[var(--cream)]">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 md:grid-cols-4">
        <div>
          <Logo />
          <p className="mt-3 max-w-xs text-sm text-[var(--muted-foreground)]">
            La plateforme d'entraide entre élèves. Pas d'argent, juste des minutes et de la curiosité.
          </p>
        </div>
        <div>
          <h5 className="font-display text-sm font-bold uppercase tracking-wide">Explorer</h5>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link to="/" className="hover:text-[var(--orange-warm)]">Accueil</Link></li>
            <li><Link to="/connexions" className="hover:text-[var(--orange-warm)]">Connexions</Link></li>
            <li><Link to="/sessions" className="hover:text-[var(--orange-warm)]">Sessions</Link></li>
            <li><Link to="/credits" className="hover:text-[var(--orange-warm)]">Crédits</Link></li>
          </ul>
        </div>
        <div>
          <h5 className="font-display text-sm font-bold uppercase tracking-wide">Communauté</h5>
          <ul className="mt-3 space-y-2 text-sm">
            <li><a className="hover:text-[var(--orange-warm)]" href="#">Code de bonne entente</a></li>
            <li><a className="hover:text-[var(--orange-warm)]" href="#">FAQ</a></li>
            <li><a className="hover:text-[var(--orange-warm)]" href="#">Aide</a></li>
          </ul>
        </div>
        <div>
          <h5 className="font-display text-sm font-bold uppercase tracking-wide">Légal</h5>
          <ul className="mt-3 space-y-2 text-sm">
            <li><a className="hover:text-[var(--orange-warm)]" href="#">Mentions légales</a></li>
            <li><a className="hover:text-[var(--orange-warm)]" href="#">Confidentialité</a></li>
            <li><a className="hover:text-[var(--orange-warm)]" href="#">Cookies</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-[var(--border)]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 py-4 text-xs text-[var(--muted-foreground)] sm:flex-row">
          <p>© {new Date().getFullYear()} SkillBridge — fait par et pour les élèves.</p>
          <p>1 crédit = 1 minute de cours.</p>
        </div>
      </div>
    </footer>
  );
}
