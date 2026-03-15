import "./globals.css";
import { AuthProviderWrapper } from "./components/AuthProviderWrapper";

export const metadata = {
  title: "EduKids — Nền tảng học tập thông minh cho trẻ em",
  description:
    "Học tiếng Anh và nhiều môn học khác qua flashcard, quiz tương tác, nhận diện cử chỉ tay. Bảng xếp hạng toàn cầu hàng tuần.",
  keywords:
    "edukids, education, kids, learning, english, flashcard, quiz, pronunciation, gesture, leaderboard",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "EduKids",
  },
  openGraph: {
    title: "EduKids — Nền tảng học tập thông minh cho trẻ em",
    description:
      "Flashcard, quiz, phát âm, cử chỉ tay — học thông minh, chơi vui vẻ",
    type: "website",
    locale: "vi_VN",
    url: "https://english4kids.jackle.dev",
  },
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/icon-192.png",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0a0a1a",
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AuthProviderWrapper>{children}</AuthProviderWrapper>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
