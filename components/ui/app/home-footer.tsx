"use client";

import * as React from "react";
import Image from "next/image";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function ModeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const HomeFooter: React.FC = () => (
  <footer className="w-full border-t py-6 px-4 flex flex-col md:flex-row items-center justify-between gap-4 bg-background mt-12 font-mono">
    <div className="flex items-center gap-2">
      <img
        src={"/logo-white.png"}
        className="h-10 w-10 hidden dark:flex"
        alt="Gatto Mail logo"
      />
      <img
        src={"/logo-black.png"}
        className="h-10 w-10 dark:hidden"
        alt="Gatto Mail logo"
      />
      <div className="font-semibold">Gatto Mail</div>
    </div>
    <div className="flex items-center gap-4">
      <span className="text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} Gatto Mail. All rights reserved.
      </span>
      <ModeToggle />
    </div>
  </footer>
);

export default HomeFooter;
