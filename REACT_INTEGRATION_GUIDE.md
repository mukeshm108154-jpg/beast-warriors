# React Component Integration Guide

This guide provides instructions on how to integrate the React pricing component (`pricing.tsx`) inside a React project configured with TypeScript, Tailwind CSS, and shadcn.

---

## 🏗️ 1. Why `/components/ui` is Crucial
In the shadcn ecosystem, the **`/components/ui`** directory is the standard location for low-level, reusable primitive elements (e.g., buttons, inputs, dialogs, sliders). 
- **Modularity**: It separates generic style primitives from layout-specific page features.
- **CLI Compatibility**: The shadcn CLI (`npx shadcn@latest add <component>`) targets this folder by default. Overriding or deviating from this structure will cause CLI commands to fail or overwrite custom setups unless strictly specified in your `components.json` configuration.

---

## 🚀 2. Setting Up a New React/Next.js Project

If you do not have an existing React app supporting TypeScript, Tailwind, and shadcn, follow these steps to initialize one from scratch:

### Step A: Initialize Next.js App
Run the standard creation script:
```bash
npx create-next-app@latest my-beast-app --typescript --tailwind --eslint
```
Ensure you select the following options during the prompts:
- Would you like to use **src/ directory**? `Yes` (recommended)
- Would you like to use **App Router**? `Yes`
- Customize default import alias? `Yes` (use `@/*`)

### Step B: Initialize shadcn UI
Run the shadcn initialization CLI inside your new project directory:
```bash
npx shadcn@latest init
```
Select the **Default** style and your main global CSS entry point (usually `src/app/globals.css`).

---

## 📦 3. Install NPM Dependencies

Our pricing component depends on several animation, utility, and UI packages. Run this command inside your React project root:

```bash
npm install clsx lucide-react framer-motion tailwind-merge canvas-confetti @number-flow/react @radix-ui/react-slot class-variance-authority
```

### Install Types for TypeScript
Since `canvas-confetti` is a vanilla JS library, we must install its types package to satisfy the TypeScript compiler:
```bash
npm install -D @types/canvas-confetti
```

---

## 📂 4. Integrating the Files

1. **Base Component**:
   Copy the pricing component code into your project directory at:
   `src/components/ui/pricing.tsx` (create the file and paste the React pricing script).
   
2. **Demo Component**:
   Copy the demo code to showcase the component at:
   `src/components/pricing-demo.tsx` (or inside pages).

3. **Extend Theme Styles**:
   If using Tailwind CSS v4, append the theme configuration rules directly into your `src/app/globals.css` file:
   ```css
   @import "tailwindcss";
   @import "tw-animate-css";

   @theme inline {
     --color-destructive-foreground: oklch(1 0 0);
     --color-color-destructive-foreground: var(----color-destructive-foreground);
   }

   :root {
     --destructive-foreground: oklch(1 0 0);
   }

   .dark {
     --destructive-foreground: oklch(1 0 0);
   }
   ```
   
   If using Tailwind CSS v3, add custom colors to the `tailwind.config.js` theme file:
   ```js
   module.exports = {
     theme: {
       extend: {
         colors: {
           destructive: {
             foreground: "oklch(1 0 0)",
           }
         }
       }
     }
   }
   ```
