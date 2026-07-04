import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Search } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-transparent backdrop-blur-md border-b border-gray-200/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#C1121F] rounded-lg flex items-center justify-center text-white font-heading font-bold text-xl">R</div>
            <div>
              <h1 className="text-lg font-heading font-bold leading-none tracking-tight uppercase text-[#0B1F3B]">RPIRSG</h1>
              <p className="text-[10px] text-gray-500 font-semibold tracking-wider uppercase">Rover Scout Group</p>
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
            {["Home", "About", "Find Donors", "Blood Request", "Campaigns", "Volunteers"].map((item) => (
                <a key={item} href="#" className={item === "Home" ? "text-[#C1121F]" : "hover:text-[#C1121F] transition-colors"}>{item}</a>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="Search donors..." className="bg-gray-100 border-none rounded-full py-1.5 pl-8 pr-4 text-xs w-48 focus:ring-2 focus:ring-[#C1121F]/20" />
            </div>
            
            <Button className="bg-[#C1121F] hover:bg-[#A00F19] text-white rounded-full text-xs font-bold uppercase tracking-widest shadow-lg shadow-red-200">
              Emergency Request
            </Button>
            
            <div className="md:hidden">
                <Sheet>
                    <SheetTrigger render={<Button variant="ghost" size="icon"><Menu /></Button>} />
                    <SheetContent>
                        {/* Mobile menu content */}
                    </SheetContent>
                </Sheet>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
