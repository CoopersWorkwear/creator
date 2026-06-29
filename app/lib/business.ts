// Central source of truth for Berwick Mechanical Services business details.
// Edit values here and they update everywhere across the site.

export const business = {
  name: "Berwick Mechanical Services",
  shortName: "Berwick Mechanical",
  established: 2003,
  tagline: "Berwick's trusted local mechanics since 2003",
  blurb:
    "Honest, high-quality mechanical repairs and roadworthy inspections for every make and model — from daily drivers and 4WDs to vintage classics.",

  phone: "(03) 9769 7677",
  phoneHref: "tel:+61397697677",
  mobile: "0431 143 110",
  mobileHref: "tel:+61431143110",
  email: "theprez1987@hotmail.com",
  emailHref: "mailto:theprez1987@hotmail.com",

  address: {
    line1: "Factory 1-2 / 6 Enterprise Avenue",
    suburb: "Berwick",
    state: "VIC",
    postcode: "3806",
  },
  get addressFull() {
    return `${this.address.line1}, ${this.address.suburb} ${this.address.state} ${this.address.postcode}`;
  },
  mapsHref:
    "https://www.google.com/maps/search/?api=1&query=Berwick+Mechanical+Services+6+Enterprise+Avenue+Berwick+VIC+3806",
  mapEmbed:
    "https://maps.google.com/maps?q=6%20Enterprise%20Avenue%20Berwick%20VIC%203806&t=&z=15&ie=UTF8&iwloc=&output=embed",

  hours: [
    { day: "Monday – Friday", time: "8:00am – 5:30pm" },
    { day: "Saturday", time: "By appointment" },
    { day: "Sunday", time: "Closed" },
  ] as const,

  accreditations: [
    "VicRoads Licensed Vehicle Tester",
    "VACC Member",
  ] as const,
} as const;

export const navLinks = [
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Why Us", href: "#why-us" },
  { label: "Contact", href: "#contact" },
] as const;
