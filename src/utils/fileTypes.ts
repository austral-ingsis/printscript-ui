export const fileTypes = [
  {
    value: "printscript",
    fileType: "ps",
  },
  {
    value: "python",
    fileType: "py",
  },
  {
    value: "Java",
    fileType: "java",
  }
]
export const getFileLanguage = (fileExt?: string) => {
  return fileExt && fileTypes?.find(x => x.fileType == fileExt)
}

