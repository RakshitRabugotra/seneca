"use client";

import AgreementCard from "@/components/component/AgreementCard";
import { ThemeToggle } from "@/components/component/theme-toggle";
import { toast } from "@/components/ui/use-toast";
import { authClient } from "@/lib/axios";
import { useEffect } from "react";

import { HiDocumentText } from "react-icons/hi2";
import { IoDocumentLock } from "react-icons/io5";
import { FaHandshakeSimple } from "react-icons/fa6";
import { FaUserFriends } from "react-icons/fa";
import { FaRegMessage } from "react-icons/fa6";
import { MdMiscellaneousServices } from "react-icons/md";

const cards = [
  {
    title: "Employment Agreement",
    image: <HiDocumentText className="scale-150 text-red-400" />,
  },
  {
    title: "Non-Disclosure Agreement",
    image: <IoDocumentLock className="scale-150 text-orange-400" />,
  },
  {
    title: "Service Agreement",
    image: <MdMiscellaneousServices className="scale-150 text-gray-400" />,
  },
  {
    title: "Consulting Agreement",
    image: <FaRegMessage className="scale-150 text-blue-400" />,
  },
  {
    title: "Partnership Agreement",
    image: <FaUserFriends className="scale-150 text-yellow-400" />,
  },
  {
    title: "Lease Agreement",
    image: <FaHandshakeSimple className="scale-150 text-green-400" />,
  },
];

export default function Home() {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await authClient.get("/@me");
      } catch (error) {
        console.log("User not found: ", error);
        // toast({
        //   title: "An error occurred",
        //   description: "User not found.",
        //   variant: "destructive",
        // });
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <div className="hero-section-background min-h-[100vh] text-white">
        <header className="flex justify-between p-6 lg:px-10 lg:py-4">
          <h1 className="text-3xl  font-heading font-extrabold">Seneca</h1>
          <div className="w-10 h-10 bg-white rounded-full"></div>
        </header>
        <section className=" mt-5 mb-10 lg:my-10 lg:w-[50%] m-auto">
          <p className="text-4xl lg:text-6xl font-extrabold text-center font-body leading-tight">
            Create Legal Agreements in Minutes with{" "}
            <span className="custom-span">AI Precision.</span>
          </p>
        </section>
        <section className="grid grid-cols-2 lg:grid-cols-3 gap-4 p-4 lg:w-[50%] m-auto justify-items-center items-center font-body gap-y-8 ">
          {cards.map((card, index) => (
            <AgreementCard key={index} title={card.title} icon={card.image} />
          ))}
        </section>
      </div>
    </>
  );
}
