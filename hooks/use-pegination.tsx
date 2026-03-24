import { useMemo, useState } from "react";

export function usePagination<T>(
    data: T[],
    itemsPerPage = 10,
    searchTerm = "",
    searchableKeys: (keyof T)[] = []
) {
    const [currentPage, setCurrentPage] = useState(1);

    const filteredData = useMemo(() => {
        if (!searchTerm) return data;
        return data.filter((item) =>
            searchableKeys.some((key) =>
                String(item[key]).toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [data, searchTerm, searchableKeys]);

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredData.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredData, currentPage, itemsPerPage]);

    return {
        paginatedData,
        currentPage,
        totalPages,
        setCurrentPage,
        filteredDataLength: filteredData.length,
    };
}
