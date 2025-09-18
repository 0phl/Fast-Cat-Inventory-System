import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import { getParts } from "@/services/api";
import type { Part } from "@/types";

export function useStockManagement() {
    const [activeTab, setActiveTab] = useState("stock-in");
    const [searchTerm, setSearchTerm] = useState("");
    const [parts, setParts] = useState<Part[]>([]);
    const [selectedPart, setSelectedPart] = useState<Part | null>(null);
    const [quantity, setQuantity] = useState("");
    const [source, setSource] = useState("");
    const [destination, setDestination] = useState("");
    const [notes, setNotes] = useState("");
    const [showQRScanner, setShowQRScanner] = useState(false);
    const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);
    const searchInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        getParts().then(setParts);
    }, []);

    const filteredParts = useMemo(() => {
        if (!searchTerm) return parts;
        return parts.filter(
            (part) =>
                part.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                part.category.toLowerCase().includes(searchTerm.toLowerCase()),
        );
    }, [searchTerm, parts]);

    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    }, []);

    const handlePartSelect = useCallback((part: Part) => {
        setSelectedPart(part);
        setQuantity("");
        setSource("");
        setDestination("");
        setNotes("");
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedPart || !quantity) return;

        const action = activeTab === "stock-in" ? "Stock In" : "Stock Out";
        console.log(`${action} submitted:`, {
            part: selectedPart,
            quantity: Number.parseInt(quantity),
            source: activeTab === "stock-in" ? source : undefined,
            destination: activeTab === "stock-out" ? destination : undefined,
            notes,
        });

        // Reset form
        setQuantity("");
        setSource("");
        setDestination("");
        setNotes("");
        alert(`${action} request submitted successfully!`);
    };

    const handleScanResult = (result: string) => {
        const foundPart = parts.find(
            (part) =>
                part.id.toLowerCase() === result.toLowerCase() || part.name.toLowerCase().includes(result.toLowerCase()),
        );

        if (foundPart) {
            handlePartSelect(foundPart);
            setSearchTerm(result);
        } else {
            setSearchTerm(result);
        }

        setShowQRScanner(false);
        setShowBarcodeScanner(false);
    };

    const simulateScan = () => {
        const sampleResults = parts.map(p => p.id);
        const randomResult = sampleResults[Math.floor(Math.random() * sampleResults.length)];

        setTimeout(() => {
            handleScanResult(randomResult);
        }, 1500);
    };

    return {
        activeTab, setActiveTab,
        searchTerm, searchInputRef, handleSearchChange,
        filteredParts,
        selectedPart, handlePartSelect,
        quantity, setQuantity,
        source, setSource,
        destination, setDestination,
        notes, setNotes,
        handleSubmit,
        showQRScanner, setShowQRScanner,
        showBarcodeScanner, setShowBarcodeScanner,
        simulateScan
    };
}
