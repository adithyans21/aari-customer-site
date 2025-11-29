# AI Travel Assistant Landing Page - Design Guidelines

## Design Approach
**Reference-Based**: Drawing inspiration from Airbnb's visual storytelling, Booking.com's trust-building elements, and modern AI product interfaces like ChatGPT for clean, approachable interaction design.

## Typography System
- **Primary Font**: Plus Jakarta Sans (Google Fonts) - modern, friendly, highly readable
- **Secondary Font**: Inter for body text and UI elements
- **Hierarchy**: 
  - Hero headline: text-5xl lg:text-7xl font-bold
  - Section headers: text-3xl lg:text-5xl font-bold
  - Subheadings: text-xl lg:text-2xl font-medium
  - Body text: text-base lg:text-lg
  - UI elements/hints: text-sm

## Layout System
**Spacing Primitives**: Tailwind units of 4, 6, 8, 12, 16, 20, 24, 32
- Section padding: py-16 lg:py-24
- Component spacing: gap-8 lg:gap-12
- Element margins: mb-6, mb-8, mb-12
- Container: max-w-7xl mx-auto px-6

## Page Structure & Sections

### 1. Hero Section (100vh)
Full-viewport immersive introduction with stunning travel destination imagery showing exotic location (Santorini, Maldives, or Tokyo skyline).
- Centered headline with subheadline explaining AI capabilities
- Primary CTA button with blurred background (backdrop-blur-md bg-white/20)
- Floating trust indicators: "10,000+ trips planned" badge in corner
- Gradient overlay from transparent to semi-dark for text readability

### 2. Interactive Trip Planning Demo (min-h-screen)
Two-column layout (lg:grid-cols-2):
- **Left**: Large interactive card showing AI chat interface with conversation bubbles demonstrating trip planning dialogue
- **Right**: Live preview panel showing selected destinations, itinerary timeline, and suggested activities
- Hint tooltips appear on hover over interactive elements with subtle animations (opacity and transform)

### 3. Cab Booking Showcase
Three-column grid (grid-cols-1 md:grid-cols-3):
- Visual map interface showing route with pickup/dropoff pins
- Real-time pricing breakdown card with fare estimates
- Available vehicle options with ETA displays
- Each card elevated with shadow-lg on hover

### 4. Personalized Profile Builder
Asymmetric two-column (60/40 split):
- **Wider column**: Progressive profile form with sections for travel style, budget preferences, interests (adventure, culture, food, relaxation)
- **Narrower column**: Live preview card showing how profile influences recommendations
- Contextual hints appear when users pause on any input field for 2+ seconds

### 5. Feature Highlights Grid
Four-column grid (grid-cols-1 md:grid-cols-2 lg:grid-cols-4):
- Smart Planning (brain icon)
- Instant Booking (lightning icon)
- AI Personalization (sparkles icon)
- 24/7 Support (headset icon)
Each card: icon at top, bold title, 2-sentence description, micro-stat underneath

### 6. Social Proof Section
Masonry-style testimonial grid (3 columns on desktop):
- Customer photos with names and destinations
- Quote snippets with star ratings
- "Verified traveler" badges
- Staggered heights for visual interest

### 7. How It Works Timeline
Horizontal step-by-step flow with connecting lines:
- Step 1: Tell AI your preferences (chat bubble visual)
- Step 2: Review personalized itinerary (document visual)
- Step 3: Book everything in one place (checkmark visual)
- Step 4: Enjoy your trip (airplane visual)

### 8. Final CTA Section
Centered full-width with supporting imagery:
- Large headline: "Start Your Perfect Journey"
- Primary and secondary CTA buttons side-by-side
- Trust badges below: "No credit card required" + "Free trial" + "Cancel anytime"

### 9. Rich Footer
Four-column grid with:
- Product links (Features, Pricing, About)
- Resources (Blog, Help Center, API)
- Company (Careers, Press, Partners)
- Newsletter signup form with inline submit button

## Component Library

**Hint System Implementation**:
- Subtle question mark icons (text-sm) next to complex elements
- Tooltip appears on hover with smooth fade-in (transition-opacity duration-200)
- Light background (bg-white) with shadow-lg and rounded-lg
- Arrow pointer aligned to trigger element
- Maximum width: max-w-xs
- Positioned absolutely with z-50

**Interactive Cards**:
- All cards: rounded-2xl with shadow-md, hover:shadow-xl transition
- Padding: p-6 lg:p-8
- Border treatment: border border-gray-200 for definition

**Buttons**:
- Primary: Large rounded-full px-8 py-4 text-lg font-semibold
- Secondary: Outlined variant with transparent background
- On-image buttons: backdrop-blur-md with semi-transparent background

**Form Inputs**:
- Rounded-lg with border-2 treatment
- Padding: px-4 py-3
- Focus state: ring-2 offset-2

## Images
**Hero Image**: Full-width, high-quality travel destination photograph (sunset over ocean, mountain vista, or vibrant city). Position: Background cover with gradient overlay.

**Feature Visuals**: Mockup screenshots of the AI interface, map views, and profile dashboard integrated into feature cards.

**Testimonial Photos**: Circular avatars (w-12 h-12 rounded-full) of travelers.

**Decorative Elements**: Subtle geometric patterns or travel-themed illustrations as section dividers.

## Animations
Minimal and purposeful:
- Scroll-triggered fade-ins for section reveals (intersection observer)
- Hover elevation on cards (translate-y-1)
- Hint tooltip fade-in
- No parallax or heavy scroll effects