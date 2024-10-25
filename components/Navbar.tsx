"use client";
import { useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed w-full top-0 bg-gray-800 text-white shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="/" className="text-xl font-bold">
              <span className="text-red-500">Debat</span> Kandidat
            </a>
          </div>

          {/* Menu Tengah */}
          <div className="hidden md:flex space-x-4 justify-center items-center">
            <Link href="/" className="hover:text-gray-300">
              Home
            </Link>
            <Link href="/settings" className="hover:text-gray-300">
              Settings
            </Link>
            <Link
              href="/live-timer"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-300"
            >
              Live Timer
            </Link>
            <Link href="/about" className="hover:text-gray-300">
              About
            </Link>
          </div>

          {/* Profil dan Dropdown Kanan */}
          <div className="hidden md:flex items-center">
            {/* <span className="text-gray-300">Profil</span> */}
            <Menu as="div" className="relative inline-block text-left">
              <div>
                <Menu.Button className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-md hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                  <UserCircleIcon className="w-5 h-5 ml-2 -mr-1" />
                </Menu.Button>
              </div>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 w-32 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="px-1 py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`${
                            active ? "bg-gray-100" : ""
                          } group flex rounded-md items-center w-full px-2 py-2 text-sm text-gray-700`}
                        >
                          Logout
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>

          {/* Tombol Menu Mobile */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white focus:outline-none"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={
                    isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Menu Mobile */}
      {isOpen && (
        <div className="md:hidden bg-gray-800 px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <a
            href="/"
            className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-gray-300"
          >
            Home
          </a>
          <a
            href="/"
            className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-gray-300"
          >
            Settings
          </a>
          <a
            href="/"
            className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-gray-300"
          >
            Live Timer
          </a>
          <a
            href="/about"
            className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-gray-300"
          >
            About
          </a>
          <div>
            <a
              href="#"
              className="block px-3 py-2 rounded-md text-base font-medium text-red-500 hover:text-red-300"
            >
              Logout
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
