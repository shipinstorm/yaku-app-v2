import { Palette } from "@/themes/palette";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Yaku Hub",
  description:
    "Yaku Hub is your access pass to a smarter platform that delivers value to the ecosystem as a whole.",
};

const ProvidersNoSSR = dynamic(
  () => import("./providers"),
  { ssr: false } // <-- not including this component on server-side
);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>Yaku Hub</title>

        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#f38aff" />
        <meta name="title" content="Yaku Hub" />
        <meta
          name="description"
          content="Yaku Hub is your access pass to a smarter platform that delivers value to the ecosystem as a whole."
        />
        <meta
          name="keywords"
          content="solana, ethereum, holder dashboard, dashboard, cosmic astronauts, yaku corp, yaku.ai, yaku.life"
        />
        <meta name="author" content="Yaku Hub, LLC." />

        <meta property="og:locale" content="en_US" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yaku.ai/" />
        <meta property="og:site_name" content="yaku.ai" />
        <meta property="og:title" content="Yaku Hub" />
        <meta
          property="og:description"
          content="Yaku Hub is your access pass to a smarter platform that delivers value to the ecosystem as a whole."
        />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://yaku.ai/" />
        <meta property="twitter:title" content="Yaku Hub" />
        <meta
          property="twitter:description"
          content="Yaku Hub is your access pass to a smarter platform that delivers value to the ecosystem as a whole."
        />
        <meta name="twitter:creator" content="@yakuhub" />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&family=Inter:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Michroma&display=swap"
          rel="stylesheet"
        ></link>
      </head>
      <body
        className={inter.className}
        style={{
          background:
            Palette.mode === "dark" ? Palette.dark[900] : Palette.dark.light,
          color:
            Palette.mode === "dark" ? Palette.dark.light : Palette.dark.light,
        }}
      >
        <noscript>You need to enable JavaScript to run this app.</noscript>
        <div id="root">
          <ProvidersNoSSR>{children}</ProvidersNoSSR>
        </div>
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-CVG5PKHBB7"
        ></script>
      </body>
    </html>
  );
}
