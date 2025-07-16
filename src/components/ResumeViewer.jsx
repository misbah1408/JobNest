import { useState } from "react";
import { ArrowRight, ExternalLink, Loader2, X } from "lucide-react";
import PDFViewer from "./PDFViewer"; // Adjust path if needed
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import Link from "next/link";

export default function ResumeViewer({ name, resumeUrl, isOpen, setIsOpen }) {
  const [showModal, setShowModal] = useState(false);
  // console.log(applicant);
// name, resumeUrl
  return (
    <>
      <Button variant={'link'}
        className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
        onClick={() => {
          setShowModal(true);
        }}
      >
        View resume <ArrowRight className="h-4 w-4" />
      </Button>

      <Dialog open={isOpen} onOpenChange={() => setIsOpen(false)}>
        <DialogContent className="md:max-w-fit max-h-[650px] overflow-hidden flex flex-col">
          <DialogHeader className="flex justify-between items-center border-b p-4">
            <DialogTitle>{name}'s Resume</DialogTitle>
          </DialogHeader>

          <div className="overflow-y-auto p-4 flex-grow">
            <PDFViewer url={resumeUrl} />
          </div>

          {/* Optional Footer */}
          <div className="border-t p-4 text-center">
            {/* Add action buttons if needed */}
            <Link href={resumeUrl} target="_blank">
              <Button variant={"outline"}>
                View Full <ExternalLink />
              </Button>
            </Link>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
