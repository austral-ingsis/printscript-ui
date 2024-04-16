export const validFiles = ["ps"]
export const isValidFile = (fileName?: string) => {
  return fileName && validFiles.includes(fileName)
}
