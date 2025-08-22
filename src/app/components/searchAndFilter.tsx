"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const Regions = [
    "Africa",
    "Asia",
    "Europe",
    "Oceania"
];

export default function SearchAndFilter() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [ search, setSearch] = useState(searchParams.get("search") || "");
    const [ region, setRegion] = useState(searchParams.get("region") || "");

    const updateFilters = () => {
        const params = new URLSearchParams();

        if (search) params.set("search", search);
        if (region) params.set("region", region);

        const queryString = params.toString();
        const url = queryString ? `/?${queryString}` : "/";

        router.push(url);
    };

    const clearFilters = () => {
        setSearch("");
        setRegion("");
        router.push("/");
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
                {/*Search input*/}
                <div className="flex-1">
                    <label htmlFor="search" className="block text-sm font-medium text-grey-700 mb-2">Search Countries</label>
                    <input
                    id="search"
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by country name"
                    className="w-full px-4 py-2 border border-grey-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                <div className="flex-1">
                    <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-2">Filter by region</label>
                    <select
                    id="region"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option value="">All regions</option>
                        {Regions.map((regionOption) => (
                            <option key={regionOption} value={regionOption}>{regionOption}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={updateFilters}>Apply filters</button>
                <button onClick={clearFilters}>Clear filters</button>
            </div>
        </div>
    );

}