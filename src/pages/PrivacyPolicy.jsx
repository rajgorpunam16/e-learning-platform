import "../css/Policy.css";

function PrivacyPolicy() {
  return (
    <main className="policy-page">
      <section className="policy-hero">
        <span>DVOC E-Learning</span>
        <h1>Privacy Policy</h1>
        <p>
          Learn how student information is collected and used.
        </p>
      </section>

      <article className="policy-container">
        <h2>1. Information We Collect</h2>
        <p>
          We may collect your name, email address, mobile number,
          account details, course activity and payment-related
          transaction information.
        </p>

        <h2>2. How Information Is Used</h2>
        <p>
          Information is used to manage student accounts, process
          enrolments, provide learning access and improve services.
        </p>

        <h2>3. Data Security</h2>
        <p>
          Reasonable safeguards are used to protect account and
          learning information from unauthorised access.
        </p>

        <h2>4. Contact</h2>
        <p>
          Contact DVOC Institute for questions concerning your
          personal information.
        </p>
      </article>
    </main>
  );
}

export default PrivacyPolicy;