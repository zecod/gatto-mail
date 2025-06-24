import React from "react";

const TermsPrivacy = () => (
  <main className="max-w-2xl mx-auto py-16 px-4 space-y-8">
    <h1 className="text-3xl font-bold mb-4">Terms & Privacy</h1>
    <section className="space-y-4">
      <p>
        <strong>Gatto Mail</strong> is an open source project licensed under the
        MIT License. Anyone can self-host this project or contribute to its
        development. You can find the source code and more details at:
        <br />
        <a
          href="https://github.com/zecod/gatto-mail.git"
          className="text-primary underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://github.com/zecod/gatto-mail.git
        </a>
      </p>
      <p>
        <strong>Do not use this service for any illegal activity.</strong> This
        tool is intended for legitimate and ethical use only.
      </p>
      <p>
        To prevent spam and abuse, the default rate limit is{" "}
        <strong>5 requests per hour</strong> per user.
      </p>
      <p>
        <strong>We do not store the emails you verify.</strong> All checks are
        performed in real time and no email addresses are saved or shared.
      </p>
      <p>
        By using this service, you agree to these terms and the MIT License.
      </p>
    </section>
  </main>
);

export default TermsPrivacy;
