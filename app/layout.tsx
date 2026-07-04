import type {Metadata} from 'next';
import './globals.css';
import { Inter, Outfit } from "next/font/google";
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/lib/firebase";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});
const outfit = Outfit({subsets:['latin'],variable:'--font-heading'});

export const metadata: Metadata = {
  title: 'RPIRSG | Humanitarian Blood Donation',
  description: 'Humanitarian blood donation and emergency medical support platform for Rajshahi Polytechnic Institute Rover Scout Group.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={cn("font-sans", inter.variable, outfit.variable)}>
      <body className="antialiased paper-texture text-gray-900" suppressHydrationWarning>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
