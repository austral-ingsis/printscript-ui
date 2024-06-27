
export type FormatRule = {
    // id: string,
    // name: string,
    // isActive: boolean,
    // value?: string | number | null,
    type: string,
    allowed: boolean,
    maxInt: number
}

export type LintRule = {
    [key:string]: string | boolean
}