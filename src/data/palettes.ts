import type { PalettePreset } from '../types'

export const PALETTE_PRESETS: PalettePreset[] = [
  {
    id: 'ecommerce',
    icon: 'shopping-bag',
    name: 'E-commerce & Shopping',
    desc: 'Trust + urgency — brand colors that sell, warm accents for buy buttons.',
    palettes: [
      { name: 'Classic Commerce', desc: 'Navy builds trust, orange drives the buy button — the proven conversion pair.', colors: [['Primary', '#1D4ED8'], ['Secondary', '#0F766E'], ['Accent', '#F97316'], ['Background', '#F8FAFC'], ['Surface', '#FFFFFF'], ['Text', '#0F172A']] },
      { name: 'Modern Marketplace', desc: 'Indigo + teal feels contemporary; rose tags pop for deals and sales.', colors: [['Primary', '#4F46E5'], ['Secondary', '#0D9488'], ['Accent', '#F43F5E'], ['Background', '#FAFAFA'], ['Surface', '#FFFFFF'], ['Text', '#18181B']] },
      { name: 'Luxury Retail', desc: 'Near-black and gold whisper premium; stone tones keep it warm, not cold.', colors: [['Primary', '#1C1917'], ['Secondary', '#57534E'], ['Accent', '#D97706'], ['Background', '#FAFAF9'], ['Surface', '#FFFFFF'], ['Text', '#1C1917']] },
      { name: 'Fresh & Friendly', desc: 'Teal and coral feel approachable — great for lifestyle and dropshipping shops.', colors: [['Primary', '#0D9488'], ['Secondary', '#FB7185'], ['Accent', '#F59E0B'], ['Background', '#FFFBEB'], ['Surface', '#FFFFFF'], ['Text', '#292524']] },
    ],
  },
  {
    id: 'saas',
    icon: 'monitor',
    name: 'SaaS & Tech',
    desc: 'Clean, modern interfaces — from light minimal to dark mode.',
    palettes: [
      { name: 'Clean Indigo', desc: 'Indigo signals modern software; emerald marks success states and billing.', colors: [['Primary', '#4F46E5'], ['Secondary', '#0EA5E9'], ['Accent', '#10B981'], ['Background', '#F8FAFC'], ['Surface', '#FFFFFF'], ['Text', '#0F172A']] },
      { name: 'Dark Mode Tech', desc: 'A developer-favorite dark canvas with glowing sky and indigo accents.', colors: [['Primary', '#38BDF8'], ['Secondary', '#818CF8'], ['Accent', '#34D399'], ['Background', '#020617'], ['Surface', '#0F172A'], ['Text', '#F1F5F9']] },
      { name: 'Minimal Violet', desc: 'A single bold violet voice with fuchsia energy for product-led growth sites.', colors: [['Primary', '#7C3AED'], ['Secondary', '#6366F1'], ['Accent', '#C026D3'], ['Background', '#FAFAFA'], ['Surface', '#FFFFFF'], ['Text', '#18181B']] },
    ],
  },
  {
    id: 'fintech',
    icon: 'banknote',
    name: 'Fintech & Banking',
    desc: 'Stability and trust — deep blues, greens, and gold accents.',
    palettes: [
      { name: 'Trust Blue', desc: 'Deep navy = security; green = money moving the right way.', colors: [['Primary', '#1E3A8A'], ['Secondary', '#0369A1'], ['Accent', '#059669'], ['Background', '#F8FAFC'], ['Surface', '#FFFFFF'], ['Text', '#0F172A']] },
      { name: 'Modern Neobank', desc: 'Dark and electric — the challenger-bank look with cyan data accents.', colors: [['Primary', '#4F46E5'], ['Secondary', '#22D3EE'], ['Accent', '#10B981'], ['Background', '#020617'], ['Surface', '#0F172A'], ['Text', '#E2E8F0']] },
      { name: 'Classic Banking', desc: 'Heritage green and gold — built to feel established and safe.', colors: [['Primary', '#064E3B'], ['Secondary', '#57534E'], ['Accent', '#D97706'], ['Background', '#F8FAFC'], ['Surface', '#FFFFFF'], ['Text', '#0F172A']] },
    ],
  },
  {
    id: 'health',
    icon: 'heart-pulse',
    name: 'Healthcare & Medical',
    desc: 'Calm, clean, and clinical — gentle teals and soft blues.',
    palettes: [
      { name: 'Calm Teal', desc: 'Teal soothes, amber adds warmth without clinical coldness.', colors: [['Primary', '#0F766E'], ['Secondary', '#14B8A6'], ['Accent', '#F59E0B'], ['Background', '#F0FDFA'], ['Surface', '#FFFFFF'], ['Text', '#134E4A']] },
      { name: 'Clinical Blue', desc: 'Sky blue reads clean and precise — the modern medical default.', colors: [['Primary', '#0284C7'], ['Secondary', '#2563EB'], ['Accent', '#10B981'], ['Background', '#F0F9FF'], ['Surface', '#FFFFFF'], ['Text', '#0C4A6E']] },
      { name: 'Soft Mint', desc: 'Fresh mint feels gentle and hygienic; orange offers a caring touch.', colors: [['Primary', '#059669'], ['Secondary', '#0D9488'], ['Accent', '#F97316'], ['Background', '#ECFDF5'], ['Surface', '#FFFFFF'], ['Text', '#064E3B']] },
    ],
  },
  {
    id: 'food',
    icon: 'utensils',
    name: 'Restaurant & Food',
    desc: 'Appetite-first palettes — warm, rich, and delicious.',
    palettes: [
      { name: 'Appetizing Warm', desc: 'Red-orange heat stimulates appetite — the restaurant classic.', colors: [['Primary', '#C2410C'], ['Secondary', '#B91C1C'], ['Accent', '#F59E0B'], ['Background', '#FFF7ED'], ['Surface', '#FFFFFF'], ['Text', '#431407']] },
      { name: 'Farm Fresh', desc: 'Garden greens with a golden yolk accent — organic and homemade.', colors: [['Primary', '#15803D'], ['Secondary', '#65A30D'], ['Accent', '#D97706'], ['Background', '#F7FEE7'], ['Surface', '#FFFFFF'], ['Text', '#365314']] },
      { name: 'Dark Bistro', desc: 'Charcoal + amber candlelight — moody, intimate, premium dining.', colors: [['Primary', '#F59E0B'], ['Secondary', '#E7E5E4'], ['Accent', '#C2410C'], ['Background', '#1C1917'], ['Surface', '#292524'], ['Text', '#FAFAF9']] },
    ],
  },
  {
    id: 'travel',
    icon: 'plane',
    name: 'Travel & Hospitality',
    desc: 'Fresh skies, seas, and adventure — wanderlust hues.',
    palettes: [
      { name: 'Tropical', desc: 'Sky, sea, and sunset coral — instant vacation mood.', colors: [['Primary', '#0EA5E9'], ['Secondary', '#14B8A6'], ['Accent', '#FB7185'], ['Background', '#F0F9FF'], ['Surface', '#FFFFFF'], ['Text', '#0C4A6E']] },
      { name: 'Serene Coast', desc: 'Deep ocean blue with sandy amber — calm and upscale resort.', colors: [['Primary', '#0369A1'], ['Secondary', '#0F766E'], ['Accent', '#FBBF24'], ['Background', '#F8FAFC'], ['Surface', '#FFFFFF'], ['Text', '#0F172A']] },
      { name: 'Adventure', desc: 'Forest green and trail orange — built for outdoor and trekking brands.', colors: [['Primary', '#15803D'], ['Secondary', '#B45309'], ['Accent', '#EA580C'], ['Background', '#FAFAFA'], ['Surface', '#FFFFFF'], ['Text', '#1C1917']] },
    ],
  },
  {
    id: 'realestate',
    icon: 'home',
    name: 'Real Estate',
    desc: 'Premium, grounded, and inviting — stone, navy, and gold.',
    palettes: [
      { name: 'Premium Estate', desc: 'Stone and bronze — understated luxury for high-end listings.', colors: [['Primary', '#292524'], ['Secondary', '#78716C'], ['Accent', '#B45309'], ['Background', '#FAFAF9'], ['Surface', '#FFFFFF'], ['Text', '#1C1917']] },
      { name: 'Modern Property', desc: 'Slate + blue reads clean and architectural; great for new developments.', colors: [['Primary', '#0F172A'], ['Secondary', '#64748B'], ['Accent', '#2563EB'], ['Background', '#F8FAFC'], ['Surface', '#FFFFFF'], ['Text', '#0F172A']] },
      { name: 'Nature Living', desc: 'Deep greens and earth tones for eco and green-living projects.', colors: [['Primary', '#14532D'], ['Secondary', '#4D7C0F'], ['Accent', '#A16207'], ['Background', '#F0FDF4'], ['Surface', '#FFFFFF'], ['Text', '#14532D']] },
    ],
  },
  {
    id: 'corporate',
    icon: 'building-2',
    name: 'Corporate & B2B',
    desc: 'Professional, dependable, and restrained — enterprise-ready.',
    palettes: [
      { name: 'Professional Navy', desc: 'The enterprise uniform — navy, gray, and a sky accent.', colors: [['Primary', '#1E3A8A'], ['Secondary', '#475569'], ['Accent', '#0EA5E9'], ['Background', '#F8FAFC'], ['Surface', '#FFFFFF'], ['Text', '#0F172A']] },
      { name: 'Executive Slate', desc: 'Quiet slate with an indigo spark — confident, not loud.', colors: [['Primary', '#334155'], ['Secondary', '#64748B'], ['Accent', '#4F46E5'], ['Background', '#F1F5F9'], ['Surface', '#FFFFFF'], ['Text', '#0F172A']] },
      { name: 'Trust Green', desc: 'Deep green authority with a touch of gold for premium B2B.', colors: [['Primary', '#064E3B'], ['Secondary', '#475569'], ['Accent', '#B45309'], ['Background', '#F8FAFC'], ['Surface', '#FFFFFF'], ['Text', '#0F172A']] },
    ],
  },
  {
    id: 'education',
    icon: 'graduation-cap',
    name: 'Education',
    desc: 'Focused and friendly — clarity for learning platforms.',
    palettes: [
      { name: 'Academic', desc: 'Blue for focus, amber for highlighting — the study-friendly pair.', colors: [['Primary', '#1D4ED8'], ['Secondary', '#0F766E'], ['Accent', '#F59E0B'], ['Background', '#F8FAFC'], ['Surface', '#FFFFFF'], ['Text', '#0F172A']] },
      { name: 'Friendly Learning', desc: 'Sky and violet feel welcoming; rose adds playful energy.', colors: [['Primary', '#0284C7'], ['Secondary', '#7C3AED'], ['Accent', '#F43F5E'], ['Background', '#F0F9FF'], ['Surface', '#FFFFFF'], ['Text', '#0C4A6E']] },
      { name: 'Classic School', desc: 'Red, blue, and yellow — instantly familiar and institutional.', colors: [['Primary', '#B91C1C'], ['Secondary', '#1D4ED8'], ['Accent', '#F59E0B'], ['Background', '#FAFAFA'], ['Surface', '#FFFFFF'], ['Text', '#18181B']] },
    ],
  },
  {
    id: 'kids',
    icon: 'toy-brick',
    name: 'Kids & Family',
    desc: 'Playful and bright — colors made for young audiences.',
    palettes: [
      { name: 'Playful Rainbow', desc: 'Primary brights on warm cream — happy without shouting.', colors: [['Primary', '#F59E0B'], ['Secondary', '#EC4899'], ['Accent', '#22D3EE'], ['Background', '#FFFBEB'], ['Surface', '#FFFFFF'], ['Text', '#292524']] },
      { name: 'Candy Pop', desc: 'Pink and violet candy tones with a golden sprinkle.', colors: [['Primary', '#EC4899'], ['Secondary', '#8B5CF6'], ['Accent', '#FBBF24'], ['Background', '#FDF2F8'], ['Surface', '#FFFFFF'], ['Text', '#500724']] },
      { name: 'Bright Blocks', desc: 'High-contrast red/blue/lime — bold, simple, toddler-approved.', colors: [['Primary', '#EF4444'], ['Secondary', '#3B82F6'], ['Accent', '#84CC16'], ['Background', '#FFFBEB'], ['Surface', '#FFFFFF'], ['Text', '#1C1917']] },
    ],
  },
  {
    id: 'fashion',
    icon: 'shirt',
    name: 'Fashion & Luxury',
    desc: 'Elegant and editorial — mono, blush, and bold statements.',
    palettes: [
      { name: 'Elegant Mono', desc: 'Black, gray, white, and gold — the timeless fashion formula.', colors: [['Primary', '#0A0A0A'], ['Secondary', '#737373'], ['Accent', '#D97706'], ['Background', '#FAFAFA'], ['Surface', '#FFFFFF'], ['Text', '#0A0A0A']] },
      { name: 'Blush Beauty', desc: 'Rose and cream — soft, feminine, beauty-brand perfect.', colors: [['Primary', '#BE185D'], ['Secondary', '#DB2777'], ['Accent', '#F472B6'], ['Background', '#FDF2F8'], ['Surface', '#FFFFFF'], ['Text', '#500724']] },
      { name: 'Editorial Bold', desc: 'Crimson and charcoal — magazine-cover drama with an amber flash.', colors: [['Primary', '#881337'], ['Secondary', '#1C1917'], ['Accent', '#F59E0B'], ['Background', '#FAFAF9'], ['Surface', '#FFFFFF'], ['Text', '#1C1917']] },
    ],
  },
  {
    id: 'portfolio',
    icon: 'palette',
    name: 'Portfolio & Creative',
    desc: 'Showcase-ready — bold minimal to artistic dark.',
    palettes: [
      { name: 'Bold Minimal', desc: 'White space, black type, one red statement — let the work speak.', colors: [['Primary', '#09090B'], ['Secondary', '#71717A'], ['Accent', '#F43F5E'], ['Background', '#FAFAFA'], ['Surface', '#FFFFFF'], ['Text', '#09090B']] },
      { name: 'Artistic Dark', desc: 'Violet, pink, and cyan on near-black — a gallery in dark mode.', colors: [['Primary', '#8B5CF6'], ['Secondary', '#EC4899'], ['Accent', '#22D3EE'], ['Background', '#09090B'], ['Surface', '#18181B'], ['Text', '#F4F4F5']] },
      { name: 'Vibrant Studio', desc: 'Violet, orange, and cyan — loud, creative, multi-disciplinary.', colors: [['Primary', '#7C3AED'], ['Secondary', '#F97316'], ['Accent', '#06B6D4'], ['Background', '#FAFAFA'], ['Surface', '#FFFFFF'], ['Text', '#18181B']] },
    ],
  },
  {
    id: 'blog',
    icon: 'newspaper',
    name: 'Blog & Editorial',
    desc: 'Reading-first palettes — paper tones and strong ink.',
    palettes: [
      { name: 'Classic Editorial', desc: 'Paper white, ink black, serif-red accents — timeless reading.', colors: [['Primary', '#18181B'], ['Secondary', '#78716C'], ['Accent', '#B91C1C'], ['Background', '#FAFAF9'], ['Surface', '#FFFFFF'], ['Text', '#1C1917']] },
      { name: 'Modern Magazine', desc: 'Slate + gold — contemporary editorial with a premium feel.', colors: [['Primary', '#0F172A'], ['Secondary', '#64748B'], ['Accent', '#D97706'], ['Background', '#F1F5F9'], ['Surface', '#FFFFFF'], ['Text', '#0F172A']] },
      { name: 'Clean Reading', desc: 'Warm paper tones and ink text — maximum readability, zero noise.', colors: [['Primary', '#292524'], ['Secondary', '#A8A29E'], ['Accent', '#0F766E'], ['Background', '#FAFAF9'], ['Surface', '#FFFFFF'], ['Text', '#1C1917']] },
    ],
  },
  {
    id: 'gaming',
    icon: 'gamepad-2',
    name: 'Gaming & Entertainment',
    desc: 'High energy — neon darks and arcade brights.',
    palettes: [
      { name: 'Neon Dark', desc: 'Purple and cyan glow on black — classic gamer RGB energy.', colors: [['Primary', '#A855F7'], ['Secondary', '#06B6D4'], ['Accent', '#F43F5E'], ['Background', '#09090B'], ['Surface', '#18181B'], ['Text', '#F4F4F5']] },
      { name: 'Arcade Bright', desc: 'Red, blue, and arcade yellow on dark — retro coin-op fun.', colors: [['Primary', '#EF4444'], ['Secondary', '#3B82F6'], ['Accent', '#FACC15'], ['Background', '#18181B'], ['Surface', '#27272A'], ['Text', '#F4F4F5']] },
      { name: 'Esports', desc: 'Red vs blue rivalry with cyan highlights — competitive and sharp.', colors: [['Primary', '#F43F5E'], ['Secondary', '#3B82F6'], ['Accent', '#22D3EE'], ['Background', '#020617'], ['Surface', '#0F172A'], ['Text', '#F1F5F9']] },
    ],
  },
  {
    id: 'fitness',
    icon: 'dumbbell',
    name: 'Fitness & Wellness',
    desc: 'Energetic and balanced — from volt to zen.',
    palettes: [
      { name: 'Energetic', desc: 'Electric lime with orange pop — performance and energy.', colors: [['Primary', '#65A30D'], ['Secondary', '#18181B'], ['Accent', '#F97316'], ['Background', '#FAFAFA'], ['Surface', '#FFFFFF'], ['Text', '#18181B']] },
      { name: 'Zen Wellness', desc: 'Olive, stone, and muted gold — calm, natural, balanced.', colors: [['Primary', '#4D7C0F'], ['Secondary', '#78716C'], ['Accent', '#A16207'], ['Background', '#FAFAF9'], ['Surface', '#FFFFFF'], ['Text', '#1C1917']] },
      { name: 'Athletic', desc: 'Volt yellow on black — sportswear attitude at full volume.', colors: [['Primary', '#FACC15'], ['Secondary', '#F4F4F5'], ['Accent', '#F97316'], ['Background', '#09090B'], ['Surface', '#18181B'], ['Text', '#FAFAFA']] },
    ],
  },
]
