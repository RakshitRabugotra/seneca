"use client";

import { authClient } from "@/lib/axios";
import { useRouter } from "next/navigation";
import { ReactNode, useState } from "react";

export interface AgreementCardProps {
  title: string;
  icon: ReactNode;
}

export default function AgreementCard({ title, icon }: AgreementCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  const handleClick = async () => {
    setIsLoading(true);
    try {
      const response = await authClient.get("/@me");
      if (response.status === 200) {
        setIsAuthenticated(true);
      }
      if (!isAuthenticated) {
        router.push("/login");
      }
      router.push("/form");
    } catch {
    } finally {
      setIsLoading(true);
    }
  };
  return (
    <>
      <button onClick={handleClick}>
        <div className="w-36 h-28 p-4 rounded-2xl bg-blue-950 hover:border-gray-400 hover:border flex flex-col items-center justify-around">
          {icon}
          <p className="">{title}</p>
        </div>
      </button>
    </>
  );
}
