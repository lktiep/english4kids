import "./globals.css";

export const metadata = {
  title: "EnglishKids — Vừa học vừa chơi tiếng Anh",
  description:
    "Ứng dụng học tiếng Anh cho bé với flashcard, quiz, phát âm, và webcam nhận diện cử chỉ tay",
  keywords:
    "english, kids, learning, flashcard, quiz, pronunciation, gesture, vietnamese",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "EnglishKids",
  },
  openGraph: {
    title: "EnglishKids — Vừa học vừa chơi tiếng Anh",
    description:
      "Flashcard, quiz, phát âm, cử chỉ tay — học tiếng Anh siêu vui cho bé",
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
  themeColor: "#667eea",
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body>
        {children}
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
