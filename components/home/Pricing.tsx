"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

type Plan = {
  name: string;
  blurb: string;
  price: string;
  unit: string;
  note?: string;
  badge?: string;
  features: string[];
  highlight?: boolean;
};

const flexible: Plan[] = [
  {
    name: "Hot desk",
    blurb: "Shared floor, first come first served",
    price: "₦2,000",
    unit: "/ day",
    features: [
      "Any open desk on the shared floor",
      "Gigabit fibre and backup power",
      "Coffee and refreshments",
      "Access to community events",
    ],
  },
  {
    name: "Hot desk week",
    blurb: "Seven days on the shared floor",
    price: "₦10,000",
    unit: "/ week",
    badge: "Save 30%",
    features: [
      "Everything in the day pass",
      "Seven consecutive days",
      "2 hours of meeting room time",
      "Locker for the week",
    ],
  },
  {
    name: "Private day",
    blurb: "A room with a door that closes",
    price: "₦6,000",
    unit: "/ day",
    features: [
      "Private office for the day",
      "Seats up to four",
      "Whiteboard and display",
      "Everything in the day pass",
    ],
  },
  {
    name: "Private week",
    blurb: "The same room, all week",
    price: "₦42,000",
    unit: "/ week",
    badge: "Best value",
    features: [
      "Everything in the private day",
      "Seven consecutive days",
      "Leave your kit set up overnight",
      "Priority support",
    ],
  },
];

const monthly: Plan[] = [
  {
    name: "Business hours",
    blurb: "9am – 6pm, Monday to Friday",
    price: "₦40,000",
    unit: "/ month",
    features: [
      "Your own dedicated desk",
      "Weekday access, 9am to 6pm",
      "4 hours of meeting room time monthly",
      "Unlimited coffee",
      "Locker and mail handling",
    ],
  },
  {
    name: "24/7 access",
    blurb: "Come and go whenever you like",
    price: "₦120,000",
    unit: "/ month",
    badge: "Most popular",
    highlight: true,
    features: [
      "Your own dedicated desk",
      "Round-the-clock building access",
      "10 hours of meeting room time monthly",
      "Unlimited coffee and snacks",
      "Locker, mail handling and printing",
      "Priority support",
    ],
  },
];

const tabs = [
  { id: "flexible", label: "Day & week", plans: flexible, columns: "lg:grid-cols-4" },
  { id: "monthly", label: "Monthly", plans: monthly, columns: "lg:grid-cols-2 lg:max-w-4xl lg:mx-auto" },
] as const;

function Check() {
  return (
    <svg
      className="mt-0.5 h-4 w-4 shrink-0 text-ember-500"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

export default function Pricing() {
  const [active, setActive] = useState<(typeof tabs)[number]["id"]>("flexible");
  const current = tabs.find((t) => t.id === active) ?? tabs[0];

  return (
    <div>
      {/* Tabs */}
      <div className="mb-10 flex justify-center">
        <div
          role="tablist"
          aria-label="Pricing options"
          className="inline-flex rounded-full border border-white/10 bg-white/[0.03] p-1"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              type="button"
              id={`tab-${tab.id}`}
              aria-selected={active === tab.id}
              aria-controls={`panel-${tab.id}`}
              onClick={() => setActive(tab.id)}
              className={cn(
                "rounded-full px-5 py-2 text-sm font-medium transition-colors",
                active === tab.id
                  ? "bg-white text-ink-950"
                  : "text-ink-300 hover:text-white"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div
        role="tabpanel"
        id={`panel-${current.id}`}
        aria-labelledby={`tab-${current.id}`}
        className={cn("grid animate-fade-in gap-5 sm:grid-cols-2", current.columns)}
      >
        {current.plans.map((plan) => (
          <div
            key={plan.name}
            className={cn(
              "relative flex flex-col rounded-2xl border p-6 transition-colors",
              plan.highlight
                ? "border-ember-500/40 bg-gradient-to-b from-ember-500/[0.09] to-transparent"
                : "border-white/8 bg-white/[0.02] hover:border-white/15"
            )}
          >
            {plan.badge ? (
              <span
                className={cn(
                  "absolute -top-2.5 left-6 rounded-full px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider",
                  plan.highlight
                    ? "bg-ember-400 text-ink-950"
                    : "border border-white/15 bg-ink-900 text-ink-300"
                )}
              >
                {plan.badge}
              </span>
            ) : null}

            <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
            {/* Fixed height keeps the price baseline aligned when a blurb wraps. */}
            <p className="mt-1 min-h-[2.5rem] text-sm text-ink-400">{plan.blurb}</p>

            <p className="mt-6 flex items-baseline gap-1.5">
              <span className="font-display text-4xl font-semibold tracking-tight text-white">
                {plan.price}
              </span>
              <span className="text-sm text-ink-400">{plan.unit}</span>
            </p>

            <ul className="mt-6 flex-1 space-y-3 border-t border-white/8 pt-6">
              {plan.features.map((feature) => (
                <li key={feature} className="flex gap-3 text-sm leading-snug text-ink-300">
                  <Check />
                  {feature}
                </li>
              ))}
            </ul>

            <Button
              href="/tour"
              variant={plan.highlight ? "primary" : "secondary"}
              size="md"
              className="mt-7 w-full"
            >
              Get started
            </Button>
          </div>
        ))}
      </div>

      <p className="mt-8 text-center text-sm text-ink-400">
        All prices in naira, inclusive of VAT. Day passes can be bought at the front desk —
        no membership required.
      </p>
    </div>
  );
}
