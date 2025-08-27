import { useContext } from "react"
import { JwtContext } from "../contexts/jwt-context"

export function useJwt() {
  const context = useContext(JwtContext)
  if (context === undefined) {
    throw new Error("useJwt must be used within a JwtProvider")
  }
  return context.jwt
}
