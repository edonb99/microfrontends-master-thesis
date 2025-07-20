/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
    // Include remote microfrontend paths for Tailwind scanning
    "../mf-product-list/src/**/*.{js,jsx,ts,tsx}",
    "../mf-product-detail/src/**/*.{js,jsx,ts,tsx}",  
    "../mf-cart/src/**/*.{js,jsx,ts,tsx}",
  ],
  safelist: [
    // Layout and positioning
    'fixed', 'relative', 'absolute', 'z-50',
    'top-4', 'right-4', '-top-1', '-right-1',
    'grid', 'grid-cols-1', 'grid-cols-2', 'grid-cols-3',
    'sm:grid-cols-2', 'md:grid-cols-3',
    'flex', 'flex-col', 'items-center', 'justify-center', 'justify-between',
    'space-x-2',
    
    // Spacing
    'p-3', 'p-4', 'px-2', 'px-3', 'px-4', 'px-6',
    'py-0.5', 'py-1', 'py-2', 'py-3', 'py-4',
    'mt-2', 'mt-4', 'mb-2', 'mb-4', 'mx-auto',
    'gap-4', 'gap-6',
    
    // Sizing
    'w-full', 'w-48', 'w-64', 'h-40', 'h-48', 'h-64',
    
    // Colors and backgrounds
    'bg-white', 'bg-blue-500', 'bg-blue-600', 'bg-blue-700', 
    'bg-red-500', 'bg-red-600', 'bg-green-500', 'bg-green-600',
    'bg-gray-100', 'bg-gray-500',
    'text-white', 'text-gray-500', 'text-gray-800',
    
    // Typography
    'text-xs', 'text-sm', 'text-lg', 'text-xl', 'text-2xl',
    'font-bold', 'font-semibold', 'line-clamp-2',
    
    // Effects and interactions
    'rounded', 'rounded-lg', 'rounded-xl', 'rounded-full', 'rounded-2xl',
    'shadow', 'shadow-md', 'shadow-lg',
    'hover:bg-blue-600', 'hover:bg-blue-700', 'hover:bg-red-600', 'hover:bg-green-600',
    'hover:shadow-lg',
    'transition', 'duration-200',
    'cursor-pointer',
    
    // Utilities
    'object-contain', 'text-center',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
