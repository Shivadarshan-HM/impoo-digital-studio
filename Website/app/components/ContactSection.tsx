"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./ContactSection.module.css";
import { submitLead } from "@/lib/api";
import { ScrollRevealText } from "@/components/animate-ui/components/ScrollRevealText";

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const elementsRef = useRef<(HTMLElement | null)[]>([]);

  // Form State
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    date: "",
    location: "",
    message: "",
  });

  const addToRefs = (el: HTMLElement | null) => {
    if (el && !elementsRef.current.includes(el)) {
      elementsRef.current.push(el);
    }
  };

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    const section = sectionRef.current;
    if (!section) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      gsap.set(elementsRef.current, { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(elementsRef.current, { opacity: 0, y: 24 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          once: true,
        },
      });

      tl.to(elementsRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.08,
      });
    }, section);

    return () => ctx.revert();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    setSubmitting(true);

    try {
      // Format date if user provided YYYY-MM-DD or valid date string, or pass null
      let parsedDate: string | null = null;
      if (formData.date.trim()) {
        const d = new Date(formData.date.trim());
        if (!isNaN(d.getTime())) {
          parsedDate = d.toISOString().split("T")[0];
        }
      }

      const combinedMessage = formData.location.trim()
        ? `Location: ${formData.location.trim()}\n\n${formData.message.trim()}`
        : formData.message.trim();

      await submitLead({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        event_type: "Wedding",
        event_date: parsedDate,
        message: combinedMessage,
      });

      setFeedback({
        type: "success",
        message: "Thank you for reaching out! Your inquiry has been sent to our team. We will get back to you shortly.",
      });

      // Reset Form
      setFormData({
        name: "",
        phone: "",
        email: "",
        date: "",
        location: "",
        message: "",
      });
    } catch (err: any) {
      setFeedback({
        type: "error",
        message: err.message || "Failed to submit inquiry. Please try again or reach out directly on WhatsApp.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section ref={sectionRef} id="contact" className={styles.section}>
      <div className={styles.container}>
        
        {/* Top Header Section */}
        <div className={styles.header}>
          <ScrollRevealText as="p" className={styles.eyebrow}>
            CONTACT
          </ScrollRevealText>

          <ScrollRevealText type="crazy" as="h2" className={styles.heading}>
            Let's Create Something Beautiful Together.
          </ScrollRevealText>
          
          <div ref={addToRefs} className={styles.divider} aria-hidden="true" />

          <ScrollRevealText type="words" delay={0.2} as="p" className={styles.description}>
            We would love to hear from you. Fill out the form below or visit our studio to discuss how we can beautifully capture your story.
          </ScrollRevealText>
        </div>

        {/* Two-Column Main Content */}
        <div className={styles.grid}>
          {/* Left Side (45%) - Form */}
          <div className={styles.formWrapper}>
            <form className={styles.form} onSubmit={handleSubmit}>
              {feedback && (
                <div
                  className={`p-4 rounded-md mb-4 text-sm font-sans ${
                    feedback.type === "success"
                      ? "bg-emerald-950/80 border border-emerald-500/40 text-emerald-200"
                      : "bg-rose-950/80 border border-rose-500/40 text-rose-200"
                  }`}
                >
                  {feedback.message}
                </div>
              )}

              <div ref={addToRefs} className={styles.inputGroup}>
                <label htmlFor="name" className={styles.label}>Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  autoComplete="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="Your name"
                />
              </div>
              
              <div ref={addToRefs} className={styles.inputGroup}>
                <label htmlFor="phone" className={styles.label}>Phone Number *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  autoComplete="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="+91 000 000 0000"
                />
              </div>

              <div ref={addToRefs} className={styles.inputGroup}>
                <label htmlFor="email" className={styles.label}>Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="your@email.com"
                />
              </div>

              <div ref={addToRefs} className={styles.inputGroup}>
                <label htmlFor="date" className={styles.label}>Wedding Date</label>
                <input
                  type="text"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="YYYY-MM-DD or DD/MM/YYYY"
                />
              </div>
              
              <div ref={addToRefs} className={styles.inputGroup}>
                <label htmlFor="location" className={styles.label}>Wedding Location</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="City, Venue"
                />
              </div>

              <div ref={addToRefs} className={styles.inputGroup}>
                <label htmlFor="message" className={styles.label}>Tell us about your wedding *</label>
                <textarea
                  id="message"
                  name="message"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  className={styles.textarea}
                  placeholder="Share details about your big day..."
                ></textarea>
              </div>

              <div ref={addToRefs} className={styles.buttonWrapper}>
                <button type="submit" disabled={submitting} className={styles.submitButton}>
                  {submitting ? "SENDING INQUIRY..." : "SEND INQUIRY"} <span className={styles.buttonArrow}>→</span>
                </button>
              </div>
            </form>
          </div>

          {/* Right Side (55%) - Location & Map */}
          <div className={styles.locationWrapper}>
            <div ref={addToRefs} className={styles.addressBox}>
              <h3 className={styles.studioName}>IMPOO Digital Studio</h3>
              <p className={styles.address}>
                N.G Complex<br />
                Belaganahalli Road<br />
                Opposite Police Station<br />
                Heggadadevanakote<br />
                Karnataka – 571114<br />
                India
                <br />
                <br />
                <strong>Whatsapp : +91-9739747628</strong>
              </p>
            </div>

            <div ref={addToRefs} className={styles.mapWrapper}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3901.3336775040275!2d76.3308684!3d12.0892888!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba5f380ef1f5bd7%3A0x4c7f652c817ed698!2sImpoo%20Digital%20Studio!5e0!3m2!1sen!2sin!4v1710000000000!5m2!1sen!2sin"
                className={styles.mapIframe}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Impoo Digital Studio Location"
              ></iframe>
            </div>

            <div ref={addToRefs} className={styles.directionsWrapper}>
              <a
                href="https://maps.app.goo.gl/Hf8Cck1eZVhW9ca77"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.directionsButton}
              >
                Get Directions <span className={styles.buttonArrow}>→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
