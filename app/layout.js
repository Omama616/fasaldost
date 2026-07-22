import "./globals.css";

export const metadata = {
  title: "FasalDost — AI Crop Doctor & Farm Diary",
  description:
    "A free AI-powered farm companion for small-holder farmers: diagnose crop problems from a photo, ask farming questions, and track your fields and expenses.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
