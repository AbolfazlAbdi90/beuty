"use client";
import React from "react";
import Container from "./container";
import Link from "next/link";
import { Instagram } from "lucide-react";

export default function AddresInstagram() {
  return (
    <Container>
      <Link
        href="https://www.instagram.com/bea_utyland2025"
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        <div className="bg-[#FF6687] rounded-2xl text-white h-auto md:h-[131px] w-full flex flex-col md:flex-row justify-center md:justify-between items-center gap-3 md:gap-8 px-6 py-6 hover:bg-[#ff4c72] transition-all">
          <h3 className="text-lg font-semibold text-center md:text-right">
            اینستاگرام مارو دنبال کن حتما ...
          </h3>

          <div className="flex items-center gap-3">
            <Instagram size={28} className="text-white" />
            <p className="text-base font-medium">bea_utyland2025</p>
          </div>
        </div>
      </Link>
    </Container>
  );
}
