import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="space-y-4">
      <h1 className="text-3xl font-bold tracking-tight">Page not found</h1>
      <p className="text-muted-foreground">
        The page you’re looking for doesn’t exist or isn’t published.
      </p>
      <Button asChild>
        <Link href="/">Go to Home</Link>
      </Button>
    </main>
  );
}
