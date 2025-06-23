import { Github } from "lucide-react";
import React from "react";

const HomeNavbar = () => {
  return (
    <div className="flex items-center justify-between gap-10 py-4">
      <div className="flex items-center gap-2">
        <img
          src={"/logo-white.png"}
          className="h-10 w-10"
          alt="Gatto Mail logo"
        />
        <div className="font-semibold">Gatto Mail</div>
      </div>

      <div className="flex items-center gap-2 border rounded-lg p-2">
        <Github size={22} />
        <span className="text-sm"> Stars on Github 0</span>
      </div>
    </div>
  );
};

export default HomeNavbar;
