import Container from "@/components/Container";

export default function ProductBasedOnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Container>{children}</Container>;
}
