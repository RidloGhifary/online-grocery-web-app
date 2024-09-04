import Container from "@/components/Container";
import CreateStoreForm from "./_components/CreateStoreForm";

const api_url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export default function CreateStore() {
  return (
    <Container>
      <CreateStoreForm api_url={api_url} />
    </Container>
  );
}
