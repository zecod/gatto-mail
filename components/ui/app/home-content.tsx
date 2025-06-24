import React from "react";
import Balancer from "react-wrap-balancer";
import { Mail, ListChecks, Globe } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const HomeContent = () => {
  return (
    <section className="max-w-3xl mx-auto py-10 px-4 space-y-10 mt-40">
      <Separator className="w-full my-10" />

      <header className="space-y-4">
        <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
          Email Finder: Free Email Search
        </h2>
        <p className="text-base md:text-lg text-muted-foreground">
          You want to reach someone by email, but don't know the exact email
          address? With the Gatto Mail Email Finder you can find the right email
          address, even if you only know the name and the company. The Email
          Finder tries all possible combinations and checks if the addresses are
          valid.
        </p>
      </header>

      <Separator className="w-full my-10" />

      {/* How it works */}
      <section className="space-y-6">
        <h3 className="text-2xl font-semibold flex items-center gap-2">
          <ListChecks className="w-7 h-7 text-primary" />
          <Balancer>How Does the Email Finder Work?</Balancer>
        </h3>
        <p className="text-base text-muted-foreground">
          <Balancer>
            To find the right email address, we do these steps:
          </Balancer>
        </p>
        <ol className="space-y-8 p-8 bg-accent rounded-lg">
          {/* Step 1: Generate emails */}
          <li className="flex items-start gap-3">
            <span className="mt-1">
              <Mail className="w-5 h-5 text-primary" />
            </span>
            <div>
              <div className="font-medium">Generate emails</div>
              <div className="text-sm text-muted-foreground">
                From the first and last name, we make the most common
                combinations:
                <ul className="list-disc list-inside mt-1 space-y-0.5">
                  <li>firstlast@company.com</li>
                  <li>first.last@company.com</li>
                  <li>last@company.com</li>
                  <li>...and more</li>
                </ul>
              </div>
            </div>
          </li>
          {/* Step 2: Check mail server (MX records) */}
          <li className="flex items-start gap-3">
            <span className="mt-1">
              <Globe className="w-5 h-5 text-primary" />
            </span>
            <div>
              <div className="font-medium">Check mail server</div>
              <div className="text-sm text-muted-foreground">
                In the second step we determine the MX records for the domain.
                Only if the domain has a mail server entry, an email can be
                delivered.
              </div>
            </div>
          </li>
          {/* Step 3: Check connection (SMTP) */}
          <li className="flex items-start gap-3">
            <span className="mt-1">
              <ListChecks className="w-5 h-5 text-primary" />
            </span>
            <div>
              <div className="font-medium">Check connection</div>
              <div className="text-sm text-muted-foreground">
                In the third step we simulate the sending of an email and try to
                establish a connection to the mail server via SMTP. No actual
                email is sent. Only if the mail server is reachable, an email
                can be delivered.
              </div>
            </div>
          </li>
          {/* Step 4: Check Catch-All */}
          <li className="flex items-start gap-3">
            <span className="mt-1">
              <Mail className="w-5 h-5 text-primary" />
            </span>
            <div>
              <div className="font-medium">Check Catch-All</div>
              <div className="text-sm text-muted-foreground">
                If a connection to the mail server is possible, we check if the
                mail server accepts a connection for any email. Only if this is
                not the case, we can say with certainty whether the email
                address is valid.
              </div>
            </div>
          </li>
        </ol>
      </section>

      <Separator className="w-full my-10" />

      {/* Example Section */}
      <section className="space-y-6 mt-12">
        <h3 className="text-2xl font-semibold">Example</h3>
        <p className="text-base text-muted-foreground">
          For the name <span className="font-medium">Sam Altman</span> and the
          company domain <span className="font-mono">openai.com</span> you get
          the following result:
        </p>
        <div className="space-y-4">
          {/* sam@openai.com - verified */}
          <div className="flex items-center gap-4 p-4 bg-background rounded-lg border">
            <span className="font-mono text-base">sam@openai.com</span>
            <span className="ml-auto">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-green-200 dark:bg-green-900 text-green-600 text-xs font-medium">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Verified
              </span>
            </span>
          </div>
          {/* altman@openai.com - not valid */}
          <div className="flex items-center gap-4 p-4 bg-background rounded-lg border">
            <span className="font-mono text-base">altman@openai.com</span>
            <span className="ml-auto">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-red-200 dark:bg-red-950 text-red-500 text-xs font-medium">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                Not valid
              </span>
            </span>
          </div>
          {/* others - not valid */}
          <div className="flex items-center gap-4 p-4 bg-background rounded-lg border">
            <span className="font-mono text-base">s.altman@openai.com</span>
            <span className="ml-auto">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-red-200 dark:bg-red-950 text-red-500 text-xs font-medium">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                Not valid
              </span>
            </span>
          </div>
        </div>
      </section>

      <Separator className="w-full my-10" />

      {/* FAQ Section */}
      <section className="space-y-6 mt-12">
        <h3 className="text-2xl font-semibold">Frequently Asked Questions</h3>
        <div className="space-y-6">
          <div>
            <div className="font-medium mb-1">
              Is the email finder free to use?
            </div>
            <div className="text-sm text-muted-foreground">
              Yes, Gatto Mail's email finder is completely free and does not
              require signup.
            </div>
          </div>
          <div>
            <div className="font-medium mb-1">
              Do you send real emails during validation?
            </div>
            <div className="text-sm text-muted-foreground">
              No, we never send real emails. We only simulate the sending
              process to check if the address is valid.
            </div>
          </div>
          <div>
            <div className="font-medium mb-1">
              Can I use a company name instead of a domain?
            </div>
            <div className="text-sm text-muted-foreground">
              For best results, use the company domain (like openai.com) instead
              of just the company name.
            </div>
          </div>
          <div>
            <div className="font-medium mb-1">Is my data safe?</div>
            <div className="text-sm text-muted-foreground">
              Yes, we do not store or share your search data. All checks are
              performed in real time.
            </div>
          </div>
          <div>
            <div className="font-medium mb-1">
              Why are some emails marked as 'Not valid'?
            </div>
            <div className="text-sm text-muted-foreground">
              If the mail server rejects the address or uses a catch-all, we
              cannot confirm the email is valid. Only addresses that pass all
              checks are marked as verified.
            </div>
          </div>
        </div>
      </section>
    </section>
  );
};

export default HomeContent;
