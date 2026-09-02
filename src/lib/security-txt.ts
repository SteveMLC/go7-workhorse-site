/**
 * RFC 9116 security.txt. Pure, so the build writes it and a test can read the
 * same text back. `Expires` is one year from the build; the file is rewritten
 * on every deploy, so it never goes stale while the site is maintained.
 */
import { SECURITY_ADVISORY_URL, SECURITY_MD_URL } from "./pages.ts";
import { CONTACT_EMAIL, SITE_ORIGIN } from "./site.ts";

export function expiresAt(from: Date): string {
  const year = new Date(from.getTime());
  year.setUTCFullYear(year.getUTCFullYear() + 1);
  return `${year.toISOString().slice(0, 19)}Z`;
}

export function securityTxt(now: Date): string {
  return [
    "# Go7 Workhorse runs on your machine under your own vendor logins.",
    "# What is in scope, and what the desk assumes, is in the policy below.",
    "",
    `Contact: ${SECURITY_ADVISORY_URL}`,
    `Contact: mailto:${CONTACT_EMAIL}`,
    `Expires: ${expiresAt(now)}`,
    `Policy: ${SECURITY_MD_URL}`,
    "Preferred-Languages: en",
    `Canonical: ${SITE_ORIGIN}/.well-known/security.txt`,
    "",
  ].join("\n");
}
