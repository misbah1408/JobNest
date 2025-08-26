"use client";

import { Loader2 } from "lucide-react";
import React, { useState } from "react";
import { Document, Page } from "react-pdf";
import { pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const PDFViewer = ({ url }) => {
  const [numPages, setNumPages] = useState(null);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const copyTextFromPDF = async () => {
    try {
      setLoading(true);
      const pdf = await pdfjs.getDocument(url).promise;
      let fullText = "";

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const strings = content.items.map((item) => item.str);
        fullText += strings.join(" ") + "\n\n";
      }

      await navigator.clipboard.writeText(fullText);
      // console.log(fullText);

      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (error) {
      console.error("Failed to copy text from PDF:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex flex-col items-center gap-4 p-4 w-full  h-full">
      <Document
        file={url}
        onLoadSuccess={onDocumentLoadSuccess}
        loading={<p>Loading PDF...</p>}
        error={<p>Failed to load PDF.</p>}
      >
        {Array.from(new Array(numPages), (_, index) => (
          <Page
            key={`page_${index + 1}`}
            pageNumber={index + 1}
            width={600}
            renderTextLayer={false}
            renderAnnotationLayer={false}
          />
        ))}
      </Document>
      {/* <button
          onClick={copyTextFromPDF}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center gap-1">
              <Loader2 className="animate-spin h-4 w-4" />
              Extracting...
            </span>
          ) : copied ? (
            "Copied Content!"
          ) : (
            "Copy Resume Content"
          )}
        </button> */}
    </div>
  );
};

export default PDFViewer;
