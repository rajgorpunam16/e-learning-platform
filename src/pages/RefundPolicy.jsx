import "../css/Policy.css";

function RefundPolicy() {
  return (
    <main className="policy-page">
      <section className="policy-hero">
        <span>DVOC E-Learning</span>
        <h1>Refund Policy</h1>
        <p>
          Information about course cancellation and refund eligibility.
        </p>
      </section>

      <article className="policy-container">
        <h2>1. Refund Eligibility</h2>
        <p>
          Refund requests may be considered when submitted within
          the stated refund period and before substantial course
          content has been accessed.
        </p>

        <h2>2. Non-Refundable Cases</h2>
        <p>
          Refunds may not be available after lessons, downloadable
          resources, assessments or certificates have been accessed.
        </p>

        <h2>3. Processing Time</h2>
        <p>
          Approved refunds may take several working days to appear
          in the original payment method.
        </p>

        <h2>4. Contact</h2>
        <p>
          Contact DVOC support with your registered email, course
          name and payment details for assistance.
        </p>
      </article>
    </main>
  );
}

export default RefundPolicy;