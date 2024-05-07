export const Parser = (key) => {
  if (key === "D") {
    console.log("changeD to A")
    return "A"
  }

  if (key === "F") {
    console.log("changeF to B")
    return "B"
  }

  return ""
}