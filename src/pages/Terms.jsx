import "../css/Policy.css";

function Terms() {
  return (
    <main className="policy-page">
      <section className="policy-hero">
        <span>DVOC E-Learning</span>
        <h1>Terms and Conditions</h1>
        <p>
          Conditions for using the DVOC learning platform.
        </p>
      </section>

      <article className="policy-container">
        <h2>1. Student Accounts</h2>
        <p>
          Students must provide accurate information and keep their
          login credentials secure.
        </p>

        <h2>2. Course Access</h2>
        <p>
          Course access is provided to the registered student and
          must not be shared or redistributed.
        </p>

        <h2>3. Learning Content</h2>
        <p>
          Videos, notes, projects and other materials remain the
          intellectual property of their respective owners.
        </p>

        <h2>4. Platform Conduct</h2>
        <p>
          Users must not misuse the platform, copy restricted
          content or attempt unauthorised access.
        </p>

        <h2>5. Updates</h2>
        <p>
          DVOC may update course content, features and platform
          terms when required.
        </p>
      </article>
    </main>
  );
}

export default Terms;