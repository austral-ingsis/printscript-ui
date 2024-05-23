import {ReactNode, useState} from "react";
import {PaginationContext, defaultPagination} from "./paginationContext.tsx";

export const PaginationProvider = ({children}: { children: ReactNode }) => {
  const [page, setPage] = useState<number>(defaultPagination.page ?? 0)
  const [pageSize, setPageSize] = useState<number>(defaultPagination.page_size ?? 10)
  const [count, setCount] = useState(defaultPagination.count ?? 10)

  const handleGoToPage = (page: number) => {
    setPage(page)
  }

  const handleChangePageSize = (pageSize: number) => {
    setPageSize(pageSize)
  }

  const handleChangeCount = (newCount: number) => {
    setCount(newCount)
  }


  return (
      <PaginationContext.Provider value={{
        page,
        page_size: pageSize,
        count,
        handleGoToPage,
        handleChangePageSize,
        handleChangeCount
      }}>
        {children}
      </PaginationContext.Provider>
  )
}
