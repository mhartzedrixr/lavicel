"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export default function PrintButton() {
    const handlePrint = () => {
        window.print();
    };

    return (
        <Button onClick={handlePrint} variant="default" size="lg">
            <Download className="mr-2 h-5 w-5" />
            Download Receipt
        </Button>
    );
}
