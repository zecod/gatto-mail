"use client";

import { Github } from "lucide-react";
import React, { useEffect, useState } from "react";
import Link from "next/link";

const HomeNavbar = () => {
  const [stars, setStars] = useState<number | null>(null);

  useEffect(() => {
    fetch("https://api.github.com/repos/zecod/gatto-mail")
      .then((res) => res.json())
      .then((data) => setStars(data.stargazers_count))
      .catch(() => setStars(null));
  }, []);

  return (
    <div className="flex items-center justify-between gap-10 p-4 font-mono">
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

      <Link
        href="https://github.com/zecod/gatto-mail"
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className="flex items-center gap-2 border rounded-lg p-2">
          <Github size={22} />
          <span className="text-sm">
            Stars on GitHub {stars !== null ? stars : "–"}
          </span>
        </div>
      </Link>
    </div>
  );
};

export default HomeNavbar;
