import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Logo } from '@/components/ui/Logo';

export default function Landing() {
  return (
    <div className="landing-page min-h-screen">
      <main>
        <section className="landing-hero">
          <img
            className="landing-hero__image"
            src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=2400&q=85"
            alt=""
            aria-hidden="true"
          />
          <div className="landing-hero__veil" aria-hidden="true" />

          <header className="landing-header">
            <Link to="/" className="landing-brand" aria-label="GlassSaaS home">
              <Logo size={34} />
              <span>GlassSaaS</span>
            </Link>
            <ThemeToggle />
          </header>

          <div className="landing-hero__content">
            <p className="landing-eyebrow">PROJECT WORK, IN FOCUS</p>
            <h1>GlassSaaS</h1>
            <p className="landing-intro">
              A clearer view of what is moving, what is due, and what needs your attention.
            </p>
            <div className="landing-actions">
              <Link to="/register">
                <Button size="md">Create your account</Button>
              </Link>
              <Link to="/login" className="landing-login-link">
                Log in <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </div>
          <p className="landing-hero__index" aria-hidden="true">01 / PROJECT OVERVIEW</p>
        </section>

        <section className="landing-highlights" aria-label="GlassSaaS highlights">
          <article className="landing-highlight">
            <span className="landing-highlight__number">01</span>
            <div>
              <h2>Progress at a glance</h2>
              <p>See active, completed, and overdue projects together.</p>
            </div>
          </article>
          <article className="landing-highlight">
            <span className="landing-highlight__number">02</span>
            <div>
              <h2>Activity that matters</h2>
              <p>Follow recent work without digging through every project.</p>
            </div>
          </article>
          <article className="landing-highlight">
            <span className="landing-highlight__number">03</span>
            <div>
              <h2>Deadlines in view</h2>
              <p>Keep upcoming dates visible while you plan the next move.</p>
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}
