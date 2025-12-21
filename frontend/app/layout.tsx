import "./globals.css";

export const metadata = {
  title: "Vintage Africana",
  description: "Vintage Africana website"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
