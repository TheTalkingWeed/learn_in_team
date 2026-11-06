import Link from "next/link";
import React, { useState } from "react";
import logo from "@/assets/logo.png";
import Image from "next/image";
import { InputText } from "primereact/inputtext";
import { UserAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";

const linkClass = "text-white text-lg hover:text-purple-300 transition-colors duration-300";

function SearchForm({
  className,
  onSearched,
}: {
  className: string;
  onSearched?: () => void;
}) {
  const router = useRouter();
  const [search, setSearch] = useState<string>("");
  return (
    <form
      // className has to set the display (e.g. "flex" or "hidden md:flex"), a base "flex" here would override "hidden"
      className={`flex-row items-stretch h-11 ${className}`}
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        const query = search.trim();
        if (!query) return;
        router.push(`/search?q=${encodeURIComponent(query)}`);
        onSearched?.();
      }}
    >
      <InputText
        placeholder="Search questions"
        className="p-inputtext-sm w-full rounded-r-none!"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        aria-label="Search questions"
      />
      <button
        type="submit"
        className="px-3 bg-purple-600 hover:bg-purple-700 text-white rounded-r-md cursor-pointer duration-200 disabled:opacity-60 disabled:cursor-default"
        disabled={!search.trim()}
        aria-label="Search"
        title="Search"
      >
        <i className="pi pi-search" />
      </button>
    </form>
  );
}

export default function Navbar() {
  const { user, logOut } = UserAuth();
  const router = useRouter();
  // the menu panel on phones and tablets
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const closeMenu = () => setMenuOpen(false);

  const handleLogOut = async () => {
    closeMenu();
    try {
      await logOut();
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  const links = (
    <>
      <Link href="/about" className={linkClass} onClick={closeMenu}>
        About
      </Link>
      {user && (
        <Link href="/ask-a-question" className={linkClass} onClick={closeMenu}>
          Ask a question
        </Link>
      )}
      <Link href="/topics" className={linkClass} onClick={closeMenu}>
        Topics
      </Link>
    </>
  );

  const accountButtons = user ? (
    <>
      <Link
        href="/profile"
        onClick={closeMenu}
        className="flex justify-center items-center gap-2 h-11 px-3 bg-white rounded-full text-gray-800 font-bold hover:bg-slate-200 duration-300"
        title="Profile"
      >
        <i className="pi pi-user" style={{ fontSize: "1rem" }} />
        <span className="xl:hidden">Profile</span>
      </Link>
      <button
        onClick={handleLogOut}
        className="h-11 px-4 py-2 text-center font-bold bg-purple-600 text-white rounded-lg cursor-pointer hover:bg-purple-700 duration-300"
      >
        Log out
      </button>
    </>
  ) : (
    <>
      <Link
        href="/login"
        onClick={closeMenu}
        className="h-11 px-4 py-2 text-center font-bold bg-slate-100 text-gray-800 rounded-lg cursor-pointer hover:bg-slate-200 duration-300"
      >
        Log in
      </Link>
      <Link
        href="/registration"
        onClick={closeMenu}
        className="h-11 px-4 py-2 text-center font-bold bg-purple-600 text-white rounded-lg cursor-pointer hover:bg-purple-700 duration-300"
      >
        Sign up
      </Link>
    </>
  );

  return (
    <nav className="bg-gray-800 w-full relative z-40">
      <div className="h-20 flex flex-row justify-between items-center gap-4 px-4 sm:px-8 xl:px-12">
        <Link
          href="/"
          onClick={closeMenu}
          className="text-2xl sm:text-3xl font-bold text-white tracking-wider sm:tracking-widest flex flex-row items-center shrink-0"
        >
          <Image src={logo} alt="logo" width={50} className="cursor-pointer w-10 sm:w-[50px] h-auto transition-transform duration-500 hover:rotate-12" />
          LearnInTeam
        </Link>

        {/* large screens: everything in one row */}
        <div className="hidden xl:flex flex-row items-center gap-8">
          <div className="flex flex-row gap-x-5 items-center">{links}</div>
          <SearchForm className="flex w-72" />
          <div className="flex flex-row items-center gap-x-4">{accountButtons}</div>
        </div>

        {/* tablets: search stays in the bar, the rest goes in the menu */}
        <SearchForm className="hidden md:flex xl:hidden flex-1 max-w-sm ml-auto" />

        <button
          className="xl:hidden w-11 h-11 shrink-0 flex items-center justify-center rounded-lg text-white hover:bg-gray-700 cursor-pointer duration-200"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          {/* the key makes the icon remount, so it pops in when it changes */}
          <i
            key={menuOpen ? "close" : "open"}
            className={`${menuOpen ? "pi pi-times" : "pi pi-bars"} animate-pop-in`}
            style={{ fontSize: "1.4rem" }}
          />
        </button>
      </div>

      {/* phones and tablets: the menu panel */}
      {menuOpen && (
        <div className="xl:hidden absolute top-20 inset-x-0 bg-gray-800 border-t border-gray-700 shadow-xl px-4 sm:px-8 pb-6 pt-4 flex flex-col gap-5 animate-slide-down">
          <SearchForm className="flex md:hidden w-full" onSearched={closeMenu} />
          <div className="flex flex-col gap-4">{links}</div>
          <div className="flex flex-row flex-wrap gap-3">{accountButtons}</div>
        </div>
      )}
    </nav>
  );
}
