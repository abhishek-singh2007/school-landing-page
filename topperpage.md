 Full Toppers Page (`/toppers`) Implementation Guide

Yeh document JKD website ke dedicated `/toppers` page ke liye blueprint hai. Iska main goal ek scalable, SEO-friendly aur fully responsive **Grid Layout** banana hai jo aage chalkar custom Admin Panel (MongoDB/Sanity/Cloudinary) ke sath easily integrate ho sake.

---

## 1. Technical Architecture & Constraints
- **Framework:** Next.js (App Router). Is page ko preferably **Server Component** rakhein (unless tabs use kar rahe ho) taaki max SEO benefit mile aur load time zero ho.
- **Styling:** Tailwind CSS (Strictly using CSS Grid).
- **Libraries:** NO heavy slider or carousel libraries. Strictly pure CSS Grid.
- **Code Quality:** Use clear inline comments, semantic HTML (`<section>`, `<article>`), and modular component structure.

---

## 2. Dynamic Data Prep (Future-Proofing for Admin Panel)
Kyunki future mein data admin panel se aayega, AI coder ko strict instruction de ki data hardcode karne ke bajaye ek **Array of Objects** banaye aur usko `.map()` function se render kare. 

```typescript
// Example Data Model for AI Coder:
interface Topper {
  id: string;
  name: string;
  percentage: string; // e.g., "98.6%"
  rank: number;
  image: string; // Cloudinary URL placeholder
  classGroup: "12th" | "10th";
  year: string; // e.g., "2026" - Useful for future admin updates
}

// Create two separate mock arrays:
// const class12Toppers: Topper[] = [ ...10 items ]
// const class10Toppers: Topper[] = [ ...10 items ]
```

---

## 3. Responsive Grid Layout (The Core Rule)
Design clean aur symmetrical hona chahiye. Screen size ke hisaab se grid badlegi:

- **Mobile (Small Devices):** `grid-cols-2` (Ek row mein 2 bacchon ki photo). Use standard gaps (`gap-4`).
- **Tablet (Medium Devices):** `md:grid-cols-3` or `md:grid-cols-4` (Ek row mein 3 ya 4).
- **Desktop (Large Devices):** `lg:grid-cols-5` (Ek row mein 5 bacchon ki photo, taaki 10 bacche exactly 2 rows mein perfect fit aa jayein).

*Tailwind execution:* `<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">`

---

## 4. UI/UX & Card Design
Har topper ka card (Article element) minimalist aur premium dikhna chahiye:
- **Image:** Top half mein student ki photo (Use Next.js `<Image>` with `object-cover`, aspect ratio maintain karein taaki squish na ho).
- **Badge:** Image ke top-right ya top-left corner par ek chota sa badge jo Rank bataye (e.g., "#1", "#2").
- **Content:** Bottom half mein:
  - Name (Bold, Navy Blue `text-slate-900` or `text-white` based on theme).
  - Percentage (Highlighted with Pillar Yellow text or background).
- **Hover Effect:** Card par hover karne par subtle scale up (`hover:-translate-y-1 hover:shadow-lg transition-all`).

---

## 5. Page Layout Structure
1. **Header Section:** Bada title "Hall of Fame 2026" with a small subtitle "Celebrating the academic excellence of JKD International Inter College".
2. **Class 12th Section:** - Section Title: "Class 12th Board Toppers"
   - Grid rendering `class12Toppers` array.
3. **Divider:** A clean UI divider or subtle background change.
4. **Class 10th Section:** - Section Title: "Class 10th Board Toppers"
   - Grid rendering `class10Toppers` array.

---

