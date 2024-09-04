import Container from "@/components/Container";

const api_url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export default function RedirectLayout({ children }: { children: React.ReactNode }) {
  return (
    <Container>{children}</Container>
  )
}