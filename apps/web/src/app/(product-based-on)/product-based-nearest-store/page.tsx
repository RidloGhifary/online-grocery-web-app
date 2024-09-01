import PageContent from "./_components/PageContent";

const api_url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export default function ProductNearestPage() {
  return <PageContent api_url={api_url} />;
}
