"use client";

import { downloadClient } from "@/lib/axios";
import parse from "html-react-parser";
import { useEffect, useState } from "react";

const ResultPage = () => {
  const [htmlContent, setHtmlContent] = useState("");
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  useEffect(() => {
    const storedHtmlContent = localStorage.getItem("styledHtmlContent");
    if (storedHtmlContent) {
      setHtmlContent(storedHtmlContent);
    }
  }, []);

  useEffect(() => {
    const sendAsyncPDFDownload = async () => {
      const response = await downloadClient.post(
        "/pdf",
        {
          query: localStorage.getItem("markdown"),
        },
        {
          responseType: "blob",
        }
      );
      const data = await response.data;
      // Create a URL for the Blob
      const url = window.URL.createObjectURL(
        new Blob([data], { type: "application/pdf" })
      );
      setDownloadUrl(url);
    };
    sendAsyncPDFDownload();
  }, []);

  return (
    <div className="relative bg-dot-black/[0.5]">
      {downloadUrl && (
        <a
          href={downloadUrl}
          download={"document.pdf"}
          className="p-2 px-4 text-lg font-sans bg-blue-500 rounded-md text-white fixed right-4 bottom-4"
        >
          Download PDF
        </a>
      )}
      <header className="flex justify-between p-6 lg:px-10 w-full lg:py-4">
        <h1 className="text-3xl font-heading font-light m-auto">
          Employment Agreement
        </h1>
      </header>

      <div className="lg:w-[60%] m-auto my-4 font-light bg-gray-200 p-4 px-6 border-2 border-dashed border-gray-300 rounded-md">
        {parse(htmlContent)}
        <style jsx>{`
          h1,
          h2,
          h3,
          h4,
          h5,
          h6 {
            color: #007bff;
          }
          pre {
            background-color: #f4f4f4;
            padding: 0.5em;
            border-radius: 4px;
          }
          code {
            background-color: #f4f4f4;
            padding: 0.2em;
            border-radius: 4px;
          }
        `}</style>
      </div>
    </div>
  );
};

export default ResultPage;
