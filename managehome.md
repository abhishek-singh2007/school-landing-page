Act as an Expert Next.js App Router and Tailwind CSS Developer. I need to make my existing public Hero Carousel mobile-responsive and build a completely new Admin capability to manage these Hero images dynamically using Cloudinary and Firebase. 

Follow these strict, step-by-step implementation instructions:

Phase 1: Fix Public Hero Carousel Responsiveness
- Update the existing Hero Carousel component (shown in the user's reference image).
- Mobile-First Fix: On small screens (`< md`), the carousel items must NOT be side-by-side or squished. Stack the content vertically or ensure each slide takes up full width (`w-full`) with horizontal swipe capabilities. 
- Ensure the navigation arrows are correctly sized and placed for touch targets on mobile devices.

Phase 2: Environment & Package Setup
- Add instructions for me to update `.env.local` with Cloudinary secrets: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`.
- Ensure the `cloudinary` npm package is installed.

Phase 3: The Secure Server Action (Upload Logic)
- Create a new Server Action file (e.g., `src/actions/uploadHeroImage.ts`) with `"use server"`.
- Implement a secure file upload handler using `cloudinary.uploader.upload_stream` because we are using Next.js App Router and receiving a `FormData` file buffer. 
- DO NOT expose Cloudinary API secrets to the client.
- Once successfully uploaded to Cloudinary, take the secure URL and `public_id` and save it as a new document in the Firebase Firestore collection named `hero_images`.

Phase 4: Admin "Manage Home" UI (`app/admin/manage-home/page.tsx`)
- Create the Admin UI using Shadcn components (Card, Button, Input type="file").
- The UI should have a clean, premium layout (Navy Blue and Pillar Yellow theme).
- Include a form with a file input to select an image, and optional text inputs for "Heading" and "Subheading" if the admin wants to overlay text on the hero image.
- Handle the client-side form submission to invoke the Server Action created in Phase 3. Include loading states (e.g., "Uploading...").
- Below the upload form, display a grid of currently uploaded Hero images (fetched from Firebase) with a "Delete" button for each (implement a basic delete Server Action that removes it from both Cloudinary and Firebase).

Phase 5: Public Website Integration
- Update the public Homepage Hero Carousel to fetch its data directly from the Firebase `hero_images` collection instead of using hardcoded placeholders. 
- Ensure the images use the Next.js `<Image />` component with the optimized Cloudinary URLs.

Write the complete code for these files and keep the architecture modular and clean.