// Este es el "contrato" entre el admin y el sitio: cada campo que aparece
// aquí es un campo editable desde /admin. Cuando agreguemos una sección
// nueva (Galería, Reservaciones, etc.) se amplía este esquema primero.

export type PhilosophyCard = {
  id: string;
  title: string;
  teaser: string;
  image: string;
};

export type CompositionItem = {
  id: string;
  name: string;
  descriptor: string;
  image: string;
};

export type CraftStep = {
  number: string;
  text: string;
};

export type FeaturedDish = {
  id: string;
  name: string;
  category: string;
  shortDescription: string;
  price: string;
  image: string;
  tagline: string;
  fullDescription: string;
  composition: CompositionItem[];
  craftSteps: CraftStep[];
  chefQuote: string;
  chefPhoto: string;
  heroVideo: string;
  winePairing: {
    name: string;
    origin: string;
    glassPrice: string;
    bottlePrice: string;
    backgroundImage: string;
  };
};

export type Testimonial = {
  id: string;
  quote: string;
  author: string;
  source: string;
  role: string;
};

export type Award = {
  id: string;
  label: string;
  icon: string;
};

export type GallerySection = {
  number: string;
  title: string;
  tagline: string;
  images: string[];
};

export type SiteContent = {
  restaurantName: string;
  hero: {
    tagline: string;
    backgroundImage: string;
  };
  aboutUs: {
    text: string;
    image: string;
  };
  ourPhilosophy: {
    intro: string;
    cards: PhilosophyCard[];
  };
  featuredMenu: {
    dishes: FeaturedDish[];
  };
  gallery: {
    exhibitionTitle: string;
    exhibitionSubtitle: string;
    heroImage: string;
    ctaImage: string;
    previewImages: string[];
    sections: GallerySection[];
  };
  chefStory: {
    chefName: string;
    text: string;
    image: string;
  };
  testimonials: Testimonial[];
  awards: Award[];
  reservations: {
    text: string;
    hours: string;
    image: string;
  };
  location: {
    address: string;
    phone: string;
    hours: string;
  };
  footer: {
    instagram: string;
    facebook: string;
    newsletterText: string;
  };
  kitchen: {
    intro: string;
    image: string;
    teamText: string;
    ingredientsText: string;
  };
};
