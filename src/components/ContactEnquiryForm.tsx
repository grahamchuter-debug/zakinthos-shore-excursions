"use client";

import { useState, type FormEvent } from "react";

type ContactEnquiryFormProps = {
  toEmail: string;
  siteName: string;
  destinationLabel: string;
};

export function ContactEnquiryForm({
  toEmail,
  siteName,
  destinationLabel,
}: ContactEnquiryFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const subject = encodeURIComponent(`${siteName} enquiry`);
    const body = encodeURIComponent(
      [`Name: ${name}`, `Email: ${email}`, "", message].join("\n"),
    );
    window.location.href = `mailto:${toEmail}?subject=${subject}&body=${body}`;
  }

  return (
    <form className="mt-8 space-y-4" onSubmit={onSubmit}>
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
        />
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
          placeholder={`Tell us about your ${destinationLabel} port day — ship, hours ashore, interests and how we can help...`}
        />
      </div>
      <button type="submit" className="btn-primary">
        Send enquiry
      </button>
      <p className="text-xs text-gray-500">
        Opens your email app to send to {toEmail}.
      </p>
    </form>
  );
}
