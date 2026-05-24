# 3D Interactive Topper Carousel Implementation Guide

Yeh document JKD website ke Homepage par ek highly interactive, lightweight aur SEO-friendly **3D Topper Carousel** (with Class 10th / 12th Toggle Tabs) build karne ka complete step-by-step technical blueprint hai.

---

## 1. Technical Architecture & Stack
- **Framework:** Next.js (App Router, Client Component for state management)
- **Styling:** Tailwind CSS (for Glassmorphism tabs, positioning, and responsive grids)
- **Animation & Gestures:** `framer-motion` (for custom 3D card sliding, scaling, drag effects, and tab switching)
- **Dependency Rule:** Kisi bhi heavy external slider library (jaise complex Swiper configurations) ka use **NA** karein taaki performance aur bundle size optimal rahe.

---

## 2. Theme & Styling Consistency (STRICT REQUIREMENT)
- **Global Theme Match:** Ye section website ke baaki Hero aur About sections se exactly match hona chahiye. 
- **Color Palette:** - Primary text and accents ke liye **Navy Blue** use karein.
  - Highlights, active tabs, aur glowing effects ke liye **Pillar Yellow** (`bg-yellow-400`, `shadow-yellow-400`) use karein.
- **Dark/Light Mode (next-themes):** Background aur cards ka glassmorphism theme-aware hona chahiye. Light mode mein subtle white glass (`bg-white/80`) aur dark mode mein dark glass (`bg-gray-900/80`) use karein taaki section seamless lage.

---

## 3. Step-by-Step Implementation Logic

### Step 1: State Management aur Data Structure Setup
Data arrays aur state variables define karein jo active tab aur active card index ko track karein.

```typescript
// Data structure for each Topper Card
interface Topper {
  id: number;
  name: string;
  rank: number;
  percentage: string;
  image: string; // Placeholder or Cloudinary URL
  class: "10th" | "12th";
}

// State hooks required inside the component:
const [activeTab, setActiveTab] = useState<"10th" | "12th">("12th");
const [centerIndex, setCenterIndex] = useState<number>(0); // Points to the Rank 1 card initially
Step 2: Tab Toggle Pills (UI & State Swap)
Ek stylish glassmorphism toggle switcher banayein. Jab user tab switch kare, toh automatic centerIndex reset ho jana chahiye.

Active Tab Styling: Premium Pillar Yellow gradient fill (bg-gradient-to-r from-yellow-400 to-amber-500 shadow-md text-slate-900).

Inactive Tab Styling: Translucent semi-transparent look (bg-black/10 for light mode, bg-white/10 for dark mode, with backdrop-blur-sm).

Step 3: The 3D Math & Framer Motion Variants
Hum strictly 3 cards visible rakhenge:

Center Card (Active): Scale: 1.15, Opacity: 1.0, Z-Index: 30, Blur: none, Shadow: Golden Glow (shadow-yellow-400/40).

Left Card (Inactive): Scale: 0.85, Opacity: 0.6, Z-Index: 10, Blur: blur-[2px], Position: x: "-35%".

Right Card (Inactive): Scale: 0.85, Opacity: 0.6, Z-Index: 10, Blur: blur-[2px], Position: x: "35%".

Step 4: Swipe (Drag) aur Click Interactivity
Click to Center: Inactive (blurred) card par click karne se wo smooth slide hokar center mein aana chahiye.

Drag (Swipe) Gesture: Framer Motion ke drag="x" ka use karein. onDragEnd par user ke swipe distance check karke next/previous card ko center mein layein.

Step 5: Clean Navigation & CTA Button
Carousel ke bottom mein dynamic pagination dots show karein. Section ke end mein ek responsive Pillar Yellow call-to-action button add karein:

Button Text: ➡️ VIEW ALL TOPPERS

Behavior: Use Next.js <Link> or router.push('/toppers') for instant client-side routing without a full page refresh.

4. SEO Optimization Rules
Semantic HTML: Use <section aria-label="JKD Toppers"> and semantic <h3> for student names.

Image Accessibility: Base placeholders par explicit height/width set karein aur Next.js <Image> mein robust alt text logic apply karein.

DOM Content Retention: Teeno card ka text data DOM tree mein readable format mein hamesha load hona chahiye.