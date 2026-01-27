import "./globals.css";

export const metadata = {
    title: "Travel Buddy AI",
    description: "AI-powered travel timeline planner",
};

export default function RootLayout({children,}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className="antialiased">
                {children}
            </body>
        </html>
    );
}
