const faqs = [
  {
    q: "Can I try the space before committing?",
    a: "Yes — buy a day pass at the front desk, no membership or sales call required. Most people who join have spent at least one full day here first.",
  },
  {
    q: "What actually happens when the power goes?",
    a: "Nothing you can feel. Inverters carry the whole floor instantly and the generator takes over behind them. Network equipment sits on a separate protected circuit so your connection never drops during a transfer.",
  },
  {
    q: "Is there somewhere to take calls?",
    a: "Phone booths on every floor, plus bookable meeting rooms for anything longer than a quick call. The quiet zone is call-free by rule, not by request.",
  },
  {
    q: "Do you have 24/7 access?",
    a: "On the 24/7 monthly plan, yes — card access any hour, any day. Day, week and business-hours plans run from 8am to 8pm.",
  },
  {
    q: "What is the notice period on a monthly plan?",
    a: "Thirty days, in writing, and your deposit is returned within fourteen days of your last day. No auto-renewal traps.",
  },
  {
    q: "Can my whole team work from here?",
    a: "Private offices seat two to eight. Larger teams are possible — email us and we will work out the layout before you visit.",
  },
];

export default function Faq() {
  return (
    <div className="mx-auto max-w-3xl divide-y divide-white/8 border-y border-white/8">
      {faqs.map((faq) => (
        <details key={faq.q} className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-left text-base font-medium text-white transition-colors hover:text-ember-200 [&::-webkit-details-marker]:hidden">
            {faq.q}
            <svg
              className="h-5 w-5 shrink-0 text-ink-400 transition-transform duration-200 group-open:rotate-45"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
          </summary>
          <p className="pb-6 pr-10 text-sm leading-relaxed text-ink-400">{faq.a}</p>
        </details>
      ))}
    </div>
  );
}
