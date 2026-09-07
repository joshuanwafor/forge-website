/** Shared helpers for the lead-capture API routes. */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isValidEmail(value: unknown): value is string {
  return typeof value === "string" && EMAIL_RE.test(value.trim());
}

/** Trim, collapse whitespace and cap length so a stray paste can't fill a column. */
export function clean(value: unknown, maxLength = 500): string {
  if (typeof value !== "string") return "";
  return value.trim().replace(/\s+/g, " ").slice(0, maxLength);
}

/**
 * Push a contact to a Zoho Campaigns list. Optional: when the credentials are
 * absent this is a no-op, so the site works without Zoho configured.
 * Never throws — a marketing sync failure must not fail the visitor's request.
 */
export async function syncToZoho(
  listKey: string | undefined,
  contact: Record<string, string>
): Promise<void> {
  const apiUrl = process.env.ZOHO_API_URL || "https://campaigns.zoho.com/api/v1.1";
  const authToken = process.env.ZOHO_AUTH_TOKEN;

  if (!authToken || !listKey) return;

  try {
    const res = await fetch(`${apiUrl}/json/listsubscribe`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        authtoken: authToken,
        scope: "CampaignsAPI",
        listkey: listKey,
        contactinfo: JSON.stringify(contact),
        resfmt: "JSON",
      }).toString(),
    });

    const result = await res.json();
    if (result?.status === "error") {
      console.error("Zoho Campaigns rejected the contact:", result);
    }
  } catch (error) {
    console.error("Zoho Campaigns sync failed:", error);
  }
}

export function splitName(fullName: string) {
  const parts = fullName.split(" ").filter(Boolean);
  return {
    firstName: parts[0] ?? fullName,
    lastName: parts.slice(1).join(" "),
  };
}
