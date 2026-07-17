import Link from "next/link";
import { FiCheck, FiX } from "react-icons/fi";

const DARK_LIST = [
  { yes: false, text: <>No <strong>assigning tasks</strong> or chasing due dates</> },
  { yes: false, text: <>No <strong>editing someone else&apos;s account</strong> of the meeting</> },
  { yes: true, text: <>Just <strong>one note per person, per meeting</strong>, kept forever</> },
  { yes: true, text: <><strong>Everyone reads everything</strong> — nothing is siloed</> },
];

const STEPS = [
  {
    title: "Create a project",
    copy: "Name it, give it a key, and it's ready — no templates to configure first.",
  },
  {
    title: "Share one invite link",
    copy: "Anyone who opens it joins as an editor. No seat limits to negotiate.",
  },
  {
    title: "Write after every meeting",
    copy: "Each person adds their own note. Everyone can read; only the author can edit.",
  },
];

const FEATURES = [
  {
    title: "Roles that make sense",
    copy: "Owners manage the project and its members. Editors join, meet, and write — nothing more, nothing less.",
  },
  {
    title: "Your notes are yours",
    copy: "Only you can edit or delete what you wrote. Everyone else's account of the meeting stays exactly as they left it.",
  },
  {
    title: "Search the whole history",
    copy: "Find a decision by project, meeting, or a phrase you remember someone writing months ago.",
  },
  {
    title: "One link to invite",
    copy: "Generate a link, share it anywhere, and new teammates are in as editors — no seat approvals.",
  },
  {
    title: "Meetings, dated and ordered",
    copy: "Every meeting keeps its title and timestamp, so the journal reads in the order things happened.",
  },
  {
    title: "Multiple projects, one account",
    copy: "Own a few projects, get invited to others — everything stays sorted on one dashboard.",
  },
];

export default function Home() {
  return (
    <div className="landing">
      <section className="landing-hero">
        <div className="container">
          <div className="landing-nav-inner">
            <Link href="/" className="landing-nav-brand">
              <span className="app-navbar-logo-badge">PJ</span>
              <span>Project Journal</span>
            </Link>
            <div className="landing-nav-actions">
              <Link href="#how-it-works" className="landing-nav-link">
                How it works
              </Link>
              <Link href="/login" className="landing-nav-link">
                Log in
              </Link>
              <Link href="/register" className="landing-btn landing-btn-primary">
                Start journaling — free
              </Link>
            </div>
          </div>

          <div className="landing-hero-inner">
            <div>
              <span className="landing-eyebrow">A diary for project teams</span>
              <h1 className="landing-hero-heading">
                Every meeting deserves <em>a paper trail.</em>
              </h1>
              <p className="landing-hero-copy">
                Project Journal isn&apos;t another board of tickets. It&apos;s where
                your team writes down what actually happened — one entry per
                person, every meeting, kept in order.
              </p>
              <div className="landing-hero-actions">
                <Link href="/register" className="landing-btn landing-btn-primary">
                  Start journaling — free
                </Link>
                <Link href="#how-it-works" className="landing-btn landing-btn-outline">
                  See how it works
                </Link>
              </div>
              <p className="landing-hero-note">
                No credit card. Invite your team in one link.
              </p>
            </div>

            <div className="landing-hero-visual">
              <div className="landing-mock-card">
                <div className="landing-mock-date">Jul 1 · 10:00 AM</div>
                <div className="landing-mock-title">Sprint planning</div>

                <div className="landing-mock-note highlight">
                  <span className="landing-mock-avatar accent">YO</span>
                  <div>
                    <div className="landing-mock-note-name">You</div>
                    <div className="landing-mock-note-text">
                      Discussed homepage timeline. Need final assets from
                      design by Thursday.
                    </div>
                  </div>
                </div>

                <div className="landing-mock-note">
                  <span className="landing-mock-avatar">PS</span>
                  <div>
                    <div className="landing-mock-note-name">Priya</div>
                    <div className="landing-mock-note-text">
                      Checkout API is ready for review. Blocked on staging
                      credentials.
                    </div>
                  </div>
                </div>

                <div className="landing-mock-note">
                  <span className="landing-mock-avatar slate">JL</span>
                  <div>
                    <div className="landing-mock-note-name">Jordan</div>
                    <div className="landing-mock-note-text">
                      Client approved the palette. Dark mode is a stretch goal
                      now.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-dark">
        <div className="container">
          <div className="landing-dark-inner">
            <div>
              <span className="landing-eyebrow on-dark">Not a task tracker</span>
              <h2 className="landing-dark-heading">
                No boards. No statuses. No tickets to groom.
              </h2>
              <p className="landing-dark-copy">
                Project Journal has one job: keep an honest, dated record of
                what every person on the team said, meeting after meeting —
                so nobody has to reconstruct a decision from memory three
                weeks later.
              </p>
            </div>

            <div className="landing-dark-list">
              {DARK_LIST.map((item, i) => (
                <div className="landing-dark-list-item" key={i}>
                  <span className={`landing-dark-list-icon ${item.yes ? "yes" : "no"}`}>
                    {item.yes ? <FiCheck /> : <FiX />}
                  </span>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="landing-section" id="how-it-works">
        <div className="container">
          <div className="landing-section-head">
            <span className="landing-eyebrow">How it works</span>
            <h2 className="landing-section-title">Three steps, no onboarding call</h2>
            <p className="landing-section-copy">
              Set up a project, bring your team in, and start writing.
              That&apos;s the whole learning curve.
            </p>
          </div>

          <div className="landing-steps">
            {STEPS.map((step, i) => (
              <div className="landing-step" key={step.title}>
                <span className="landing-step-index">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="landing-step-title">{step.title}</div>
                <p className="landing-step-copy">{step.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-section landing-features">
        <div className="container">
          <div className="landing-section-head">
            <span className="landing-eyebrow">Built for how teams actually meet</span>
            <h2 className="landing-section-title">Everything a running record needs</h2>
          </div>

          <div className="landing-feature-grid">
            {FEATURES.map((feature, i) => (
              <div className="landing-feature-card" key={feature.title}>
                <span className="landing-feature-index">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="landing-feature-title">{feature.title}</div>
                <p className="landing-feature-copy">{feature.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-cta">
        <div className="container">
          <span className="landing-eyebrow on-dark">Ready when you are</span>
          <h2 className="landing-cta-heading">
            Start today&apos;s entry before the meeting ends.
          </h2>
          <p className="landing-cta-copy">
            Free to start, no credit card, and your team is in with one
            invite link.
          </p>
          <div className="landing-cta-actions">
            <Link href="/register" className="landing-btn landing-btn-primary">
              Start journaling — free
            </Link>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="container landing-footer-inner">
          <span>© {new Date().getFullYear()} Project Journal</span>
          <span>Built for teams who write things down.</span>
        </div>
      </footer>
    </div>
  );
}
