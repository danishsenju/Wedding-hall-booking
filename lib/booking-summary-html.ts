import type { BookingWithDetails } from "@/types"

function fmt(date: string) {
  return new Date(date + "T00:00:00").toLocaleDateString("en-MY", {
    weekday: "short",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

function fmtRm(amount: number) {
  return `RM ${amount.toLocaleString("en-MY", { minimumFractionDigits: 2 })}`
}

function fmtGenerated(iso: string) {
  return new Date(iso).toLocaleDateString("en-MY", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export function generateBookingSummaryHTML(
  booking: BookingWithDetails,
  logoUrl: string
): string {
  const addons = booking.addons ?? []
  const hasAddons = addons.length > 0
  const hasTotal = !!booking.total_rm
  const hasDeposit = !!booking.deposit_rm
  const addonTotal = addons.reduce((sum, a) => sum + (a.price_rm ?? 0), 0)

  const addonChips = addons
    .map((a) => `<span class="addon-chip">${a.addon.name} — ${fmtRm(a.price_rm)}</span>`)
    .join("")

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Booking Summary ${booking.ref} — Laman Troka</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  @page {
    size: A4 portrait;
    margin: 0;
  }

  html, body {
    width: 210mm;
    height: 297mm;
    overflow: hidden;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    font-family: 'DM Sans', sans-serif;
    background: #ffffff;
  }

  .page {
    width: 210mm;
    height: 297mm;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background: #ffffff;
  }

  /* ── HEADER ── */
  .header {
    background: linear-gradient(135deg, #0A0B10 0%, #1a0a3d 55%, #2B1B52 100%);
    padding: 14px 28px 11px;
    position: relative;
    overflow: hidden;
    flex-shrink: 0;
  }
  .header::before {
    content: '';
    position: absolute;
    top: -50px; right: -40px;
    width: 200px; height: 200px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(109,40,217,0.3) 0%, transparent 70%);
  }
  .header-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    z-index: 1;
  }
  .brand {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .brand-logo {
    width: 40px;
    height: 40px;
    object-fit: contain;
    border-radius: 8px;
  }
  .brand-text h1 {
    font-family: 'Cormorant Garamond', serif;
    font-size: 17px;
    font-weight: 400;
    letter-spacing: 0.15em;
    color: #EDE9FE;
    line-height: 1.15;
  }
  .brand-text p {
    font-size: 8px;
    font-weight: 300;
    color: #A78BFA;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    margin-top: 1px;
  }
  .doc-meta {
    text-align: right;
    position: relative;
    z-index: 1;
  }
  .doc-meta .doc-type {
    font-size: 7.5px;
    font-weight: 400;
    color: #A78BFA;
    letter-spacing: 0.28em;
    text-transform: uppercase;
  }
  .doc-meta .ref-number {
    font-family: 'Cormorant Garamond', serif;
    font-size: 16px;
    font-weight: 500;
    color: #C4B5FD;
    letter-spacing: 0.12em;
    display: block;
    line-height: 1.2;
  }
  .doc-meta .gen-date {
    font-size: 7px;
    color: #6b5b9e;
    margin-top: 1px;
  }
  .header-divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(196,181,253,0.35) 30%, rgba(109,40,217,0.55) 60%, transparent);
    margin: 9px 0 8px;
    position: relative;
    z-index: 1;
  }
  .header-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    z-index: 1;
  }
  .doc-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 10px;
    font-weight: 300;
    color: #A78BFA;
    letter-spacing: 0.3em;
    text-transform: uppercase;
  }
  .status-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 3px 9px;
    border-radius: 20px;
    font-size: 8.5px;
    font-weight: 500;
    letter-spacing: 0.06em;
    background: rgba(245,158,11,0.14);
    border: 1px solid rgba(245,158,11,0.38);
    color: #FCD34D;
  }
  .status-dot {
    width: 5px; height: 5px;
    border-radius: 50%;
    background: #F59E0B;
  }

  /* ── BODY ── */
  .body {
    flex: 1;
    padding: 13px 28px 10px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    overflow: hidden;
    min-height: 0;
  }

  /* Couple + venue row */
  .top-row {
    display: flex;
    gap: 10px;
    align-items: stretch;
  }
  .couple-block {
    flex: 1;
    background: linear-gradient(135deg, #f9f5ff, #f0e9ff);
    border: 1px solid rgba(109,40,217,0.13);
    border-radius: 9px;
    padding: 9px 14px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .couple-label {
    font-size: 7.5px;
    font-weight: 500;
    color: #7C3AED;
    letter-spacing: 0.24em;
    text-transform: uppercase;
    margin-bottom: 2px;
  }
  .couple-names {
    font-family: 'Cormorant Garamond', serif;
    font-size: 18px;
    font-weight: 400;
    color: #2B1B52;
    letter-spacing: 0.03em;
    line-height: 1.2;
  }
  .couple-amp {
    color: #9D4EDD;
    font-style: italic;
    margin: 0 6px;
    font-size: 15px;
  }
  .venue-block {
    background: linear-gradient(135deg, #f0e9ff, #e8d8ff);
    border: 1px solid rgba(109,40,217,0.15);
    border-radius: 9px;
    padding: 9px 14px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-width: 160px;
  }
  .venue-label {
    font-size: 7.5px;
    font-weight: 500;
    color: #7C3AED;
    letter-spacing: 0.24em;
    text-transform: uppercase;
    margin-bottom: 2px;
  }
  .venue-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 13px;
    font-weight: 500;
    color: #2B1B52;
    line-height: 1.25;
  }
  .venue-loc {
    font-size: 8.5px;
    color: #7C3AED;
    margin-top: 1px;
  }

  /* Section */
  .section { display: flex; flex-direction: column; gap: 5px; }
  .section-title {
    font-size: 7.5px;
    font-weight: 600;
    color: #6D28D9;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    border-bottom: 1px solid rgba(109,40,217,0.14);
    padding-bottom: 4px;
  }

  /* Details grid */
  .details-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 7px 16px;
  }
  .details-grid.two-col { grid-template-columns: repeat(2, 1fr); }
  .detail-item .dl { font-size: 7.5px; font-weight: 500; color: #9D4EDD; letter-spacing: 0.16em; text-transform: uppercase; margin-bottom: 1px; }
  .detail-item .dv { font-size: 10.5px; font-weight: 500; color: #1a0a3d; line-height: 1.35; }

  /* Add-ons chips */
  .addon-chips { display: flex; flex-wrap: wrap; gap: 5px; }
  .addon-chip {
    background: rgba(109,40,217,0.07);
    border: 1px solid rgba(109,40,217,0.18);
    border-radius: 20px;
    padding: 3px 9px;
    font-size: 9px;
    font-weight: 500;
    color: #4C1D95;
  }

  /* Pricing + special requests row */
  .bottom-row {
    display: flex;
    gap: 10px;
    align-items: flex-start;
  }
  .pricing-block {
    flex: 1;
    background: linear-gradient(135deg, #f0e9ff, #e8d8ff);
    border: 1px solid rgba(109,40,217,0.18);
    border-radius: 9px;
    padding: 9px 12px;
  }
  .pricing-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 3px 0;
    font-size: 9.5px;
    border-bottom: 1px solid rgba(109,40,217,0.08);
  }
  .pricing-row:last-child { border-bottom: none; }
  .pricing-row .pl { color: #4C1D95; }
  .pricing-row .pv { font-weight: 500; color: #1a0a3d; }
  .pricing-row.total-row {
    border-top: 1.5px solid rgba(109,40,217,0.22);
    border-bottom: none;
    padding-top: 6px;
    margin-top: 3px;
  }
  .pricing-row.total-row .pl { font-weight: 600; color: #2B1B52; font-size: 10px; }
  .pricing-row.total-row .pv {
    font-family: 'Cormorant Garamond', serif;
    font-size: 15px;
    font-weight: 600;
    color: #6D28D9;
  }
  .pricing-row.deposit-row .pv { color: #7C3AED; font-weight: 600; }

  .notes-block {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  .special-box {
    background: rgba(196,181,253,0.09);
    border-left: 2.5px solid #7C3AED;
    border-radius: 0 7px 7px 0;
    padding: 8px 10px;
    font-size: 9px;
    color: #2B1B52;
    font-style: italic;
    line-height: 1.5;
    flex: 1;
  }

  /* Next steps compact strip */
  .steps-strip {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 6px;
  }
  .step-card {
    background: rgba(109,40,217,0.04);
    border: 1px solid rgba(109,40,217,0.1);
    border-radius: 7px;
    padding: 7px 8px;
  }
  .step-num-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 16px; height: 16px;
    border-radius: 50%;
    background: linear-gradient(135deg, #6D28D9, #7C3AED);
    color: white;
    font-size: 8px;
    font-weight: 600;
    margin-bottom: 4px;
  }
  .step-title {
    font-size: 8.5px;
    font-weight: 600;
    color: #1a0a3d;
    margin-bottom: 2px;
    line-height: 1.3;
  }
  .step-desc {
    font-size: 7.5px;
    color: #6b5b9e;
    line-height: 1.4;
  }

  /* ── FOOTER ── */
  .footer {
    background: linear-gradient(135deg, #0A0B10, #1a0a3d);
    padding: 9px 28px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-shrink: 0;
  }
  .footer-brand {
    font-family: 'Cormorant Garamond', serif;
    font-size: 12px;
    color: #A78BFA;
    letter-spacing: 0.1em;
  }
  .footer-contact {
    text-align: center;
    font-size: 8px;
    color: #6b5b9e;
    line-height: 1.8;
  }
  .footer-note-text {
    text-align: right;
    font-size: 7.5px;
    color: #4a3a6e;
    max-width: 200px;
    line-height: 1.5;
  }

  @media screen {
    html, body { background: #f0ebfa; }
    .page {
      max-width: 210mm;
      margin: 24px auto;
      border-radius: 10px;
      box-shadow: 0 8px 48px rgba(109,40,217,0.15);
      overflow: hidden;
    }
  }
  @media print {
    html, body { background: white; }
    .page { margin: 0; border-radius: 0; box-shadow: none; }
  }
</style>
</head>
<body>
<div class="page">

  <!-- HEADER -->
  <div class="header">
    <div class="header-top">
      <div class="brand">
        <img src="${logoUrl}" alt="Laman Troka" class="brand-logo" />
        <div class="brand-text">
          <h1>LAMAN TROKA</h1>
          <p>Premium Wedding Venue · Kuala Lumpur</p>
        </div>
      </div>
      <div class="doc-meta">
        <div class="doc-type">Booking Summary</div>
        <span class="ref-number">${booking.ref}</span>
        <div class="gen-date">Generated ${fmtGenerated(new Date().toISOString())}</div>
      </div>
    </div>
    <div class="header-divider"></div>
    <div class="header-bottom">
      <div class="doc-title">Booking Request Confirmation</div>
      <div class="status-badge">
        <div class="status-dot"></div>
        Pending Review
      </div>
    </div>
  </div>

  <!-- BODY -->
  <div class="body">

    <!-- Couple + Venue -->
    <div class="top-row">
      <div class="couple-block">
        <div class="couple-label">The Couple</div>
        <div class="couple-names">
          ${booking.bride_name}<span class="couple-amp">&amp;</span>${booking.groom_name}
        </div>
      </div>
      <div class="venue-block">
        <div class="venue-label">Venue</div>
        <div class="venue-name">${booking.venue?.name ?? "Laman Troka"}</div>
        <div class="venue-loc">${booking.venue?.location ?? "Kuala Lumpur, Malaysia"}</div>
      </div>
    </div>

    <!-- Event Details -->
    <div class="section">
      <div class="section-title">Event Details</div>
      <div class="details-grid">
        <div class="detail-item">
          <div class="dl">Event Date</div>
          <div class="dv">${fmt(booking.event_date)}</div>
        </div>
        <div class="detail-item">
          <div class="dl">Time Slot</div>
          <div class="dv">${booking.time_slot}</div>
        </div>
        <div class="detail-item">
          <div class="dl">Guest Count</div>
          <div class="dv">${booking.guest_count} guests</div>
        </div>
        <div class="detail-item">
          <div class="dl">Package</div>
          <div class="dv">${booking.package?.name ?? "—"}</div>
        </div>
        ${booking.theme ? `<div class="detail-item"><div class="dl">Theme</div><div class="dv">${booking.theme}</div></div>` : ""}
        ${booking.layout_preference ? `<div class="detail-item"><div class="dl">Layout</div><div class="dv">${booking.layout_preference}</div></div>` : ""}
      </div>
    </div>

    <!-- Contact -->
    <div class="section">
      <div class="section-title">Contact Information</div>
      <div class="details-grid two-col">
        <div class="detail-item">
          <div class="dl">Email</div>
          <div class="dv">${booking.email}</div>
        </div>
        <div class="detail-item">
          <div class="dl">Phone</div>
          <div class="dv">${booking.phone}</div>
        </div>
      </div>
    </div>

    ${hasAddons ? `
    <!-- Add-ons -->
    <div class="section">
      <div class="section-title">Selected Add-ons</div>
      <div class="addon-chips">${addonChips}</div>
    </div>` : ""}

    <!-- Pricing + Notes -->
    <div class="bottom-row">
      ${(hasTotal || hasDeposit || booking.package) ? `
      <div class="pricing-block">
        <div class="section-title" style="margin-bottom:6px">Pricing Summary</div>
        ${booking.package ? `<div class="pricing-row"><span class="pl">${booking.package.name} Package</span><span class="pv">${fmtRm(booking.package.price_rm)}</span></div>` : ""}
        ${hasAddons ? `<div class="pricing-row"><span class="pl">Add-ons (${addons.length})</span><span class="pv">${fmtRm(addonTotal)}</span></div>` : ""}
        ${hasTotal ? `<div class="pricing-row total-row"><span class="pl">Total</span><span class="pv">${fmtRm(booking.total_rm!)}</span></div>` : ""}
        ${hasDeposit ? `<div class="pricing-row deposit-row"><span class="pl">Deposit Due</span><span class="pv">${fmtRm(booking.deposit_rm!)}</span></div>` : ""}
      </div>` : ""}

      ${booking.special_requests ? `
      <div class="notes-block">
        <div class="section-title">Special Requests</div>
        <div class="special-box">"${booking.special_requests}"</div>
      </div>` : ""}
    </div>

    <!-- What Happens Next -->
    <div class="section">
      <div class="section-title">What Happens Next</div>
      <div class="steps-strip">
        <div class="step-card">
          <div class="step-num-badge">1</div>
          <div class="step-title">Review</div>
          <div class="step-desc">We review your request within 24–48 hours</div>
        </div>
        <div class="step-card">
          <div class="step-num-badge">2</div>
          <div class="step-title">Confirmation</div>
          <div class="step-desc">Formal quotation &amp; deposit invoice via email</div>
        </div>
        <div class="step-card">
          <div class="step-num-badge">3</div>
          <div class="step-title">Site Visit</div>
          <div class="step-desc">Complimentary venue tour with our coordinator</div>
        </div>
        <div class="step-card">
          <div class="step-num-badge">4</div>
          <div class="step-title">Your Day</div>
          <div class="step-desc">An unforgettable experience for you &amp; your guests</div>
        </div>
      </div>
    </div>

  </div>

  <!-- FOOTER -->
  <div class="footer">
    <div class="footer-brand">Laman Troka</div>
    <div class="footer-contact">
      hello@lamantroka.com.my &nbsp;·&nbsp; +60 19-277 4203 &nbsp;·&nbsp; Kuala Lumpur, Malaysia
    </div>
    <div class="footer-note-text">
      This is a booking request summary, not a confirmed booking. A formal agreement will be issued upon approval.
    </div>
  </div>

</div>
<script>
  window.addEventListener('load', function () {
    setTimeout(function () { window.print(); }, 500);
  });
</script>
</body>
</html>`
}
