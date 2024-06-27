import {Pagination} from "./pagination.ts";

export type PaginatedUsers = Pagination & {
  users: User[]
}

export type User = {
  userId: string, 
  userName: string
}
