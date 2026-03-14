import "./globals.css";

export const metadata = {
  title: "EnglishKids — Vừa học vừa chơi tiếng Anh",
  description:
    "Ứng dụng học tiếng Anh cho bé với flashcard, quiz, phát âm, và webcam nhận diện cử chỉ tay",
  keywords:
    "english, kids, learning, flashcard, quiz, pronunciation, gesture, vietnamese",
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
