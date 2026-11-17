import {ReactNode, useCallback, useMemo, useState} from "react";
import {PaginationContext, defaultPagination} from "./paginationContext.tsx";

export const PaginationProvider = ({children}: { children: ReactNode }) => {
  const [page, setPage] = useState<number>(defaultPagination.page ?? 0)
  const [pageSize, setPageSize] = useState<number>(defaultPagination.page_size ?? 10)
  const [count, setCount] = useState(defaultPagination.count ?? 10)

  const handleGoToPage = useCallback((nextPage: number) => {
    setPage(nextPage)
  }, [])

  const handleChangePageSize = useCallback((nextPageSize: number) => {
    setPageSize(nextPageSize)
  }, [])

  const handleChangeCount = useCallback((newCount: number) => {
    setCount(newCount)
  }, [])

  const value = useMemo(() => ({
    page,
    page_size: pageSize,
    count,
    handleGoToPage,
    handleChangePageSize,
    handleChangeCount
  }), [page, pageSize, count, handleGoToPage, handleChangePageSize, handleChangeCount])

  return (
      <PaginationContext.Provider value={value}>
        {children}
      </PaginationContext.Provider>
  )
}
