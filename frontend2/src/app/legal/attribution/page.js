export default function AttributionPage() {
  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-4xl font-black mb-6">Data Attribution & Fair Use</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-black mb-4">Affiliation Disclaimer</h2>
        <p className="mb-4">
          pophits.org is <strong>NOT affiliated with</strong>,{" "}
          <strong>endorsed by</strong>, or <strong>sponsored by</strong>
          Billboard, Penske Media Corporation, or any related entities. We are
          an independent historical music archive.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-black mb-4">Affiliation Disclaimer</h2>
        <p className="mb-4">
          pophits.org is <strong>NOT affiliated with</strong>,{" "}
          <strong>endorsed by</strong>, or <strong>sponsored by </strong>
          Billboard, Prometheus Global Media, or any related entities. We are an
          independent historical music archive.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-black mb-4">Fair Use Justification</h2>
        <p className="mb-4">
          We believe our use of historical chart data constitutes fair use under
          U.S. copyright law:
        </p>
        <ul className="list-disc list-inside space-y-2 text-sm">
          <li>
            <strong>Purpose:</strong> Educational and archival research
          </li>
          <li>
            <strong>Nature:</strong> Factual data (song titles, artists,
            positions, dates)
          </li>
          <li>
            <strong>Amount:</strong> Only necessary data for historical context
          </li>
          <li>
            <strong>Effect:</strong> No commercial competition with Billboard
          </li>
          <li>
            <strong>Attribution:</strong> All sources properly credited
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-black mb-4">Contact Us</h2>
        <p>
          If you have concerns about data usage or attribution, please contact
          us 
          <a
            href="/contact"
            className="text-blue-600 hover:underline"
          >
            {" "}
            here
          </a>
        </p>
      </section>
    </div>
  );
}
