"use client";

import { useAuth } from "./context/AuthContext";
import { useRouter } from "next/navigation";
import styles from "./landing.module.css";

export default function LandingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const handleCTA = () => {
    if (user) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  };

  return (
    <div className={styles.page}>
      {/* Navigation */}
      <nav className={styles.nav}>
        <div className={styles.navInner}>
          <span className={styles.logo}>🎓 EduKids</span>
          <div className={styles.navLinks}>
            <a href="#features" className={styles.navLink}>
              Tính năng
            </a>
            <a href="#subjects" className={styles.navLink}>
              Giáo trình
            </a>
            <a href="#leaderboard" className={styles.navLink}>
              Xếp hạng
            </a>
            {!loading &&
              (user ? (
                <button
                  className={styles.navBtn}
                  onClick={() => router.push("/dashboard")}
                >
                  Dashboard
                </button>
              ) : (
                <button
                  className={styles.navBtn}
                  onClick={() => router.push("/login")}
                >
                  Đăng nhập
                </button>
              ))}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroGlow} />
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>
            <span>🚀</span> Nền tảng giáo dục #1 cho trẻ em
          </div>
          <h1 className={styles.heroTitle}>
            Học mà chơi,
            <br />
            <span className={styles.heroGradient}>chơi mà học</span>
          </h1>
          <p className={styles.heroDesc}>
            Flashcard tương tác, quiz thông minh, nhận diện cử chỉ tay bằng AI,
            và bảng xếp hạng toàn cầu — tất cả trong một nền tảng.
          </p>
          <div className={styles.heroBtns}>
            <button className={styles.ctaPrimary} onClick={handleCTA}>
              Bắt đầu miễn phí →
            </button>
            <button
              className={styles.ctaSecondary}
              onClick={() => router.push("/learn/english")}
            >
              Trải nghiệm ngay
            </button>
          </div>
          <div className={styles.heroStats}>
            <div className={styles.stat}>
              <span className={styles.statNum}>174+</span>
              <span className={styles.statLabel}>Từ vựng</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={styles.statNum}>16</span>
              <span className={styles.statLabel}>Chủ đề</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={styles.statNum}>AI</span>
              <span className={styles.statLabel}>Cử chỉ tay</span>
            </div>
          </div>
        </div>

        {/* Hero Images */}
        <div className={styles.heroImages}>
          <div
            className={styles.heroImageCard}
            style={{ backgroundImage: "url(/images/animals/tiger.png)" }}
          >
            <span className={styles.heroImageLabel}>Tiger 🐯</span>
          </div>
          <div
            className={styles.heroImageCard}
            style={{ backgroundImage: "url(/images/animals/rabbit.png)" }}
          >
            <span className={styles.heroImageLabel}>Rabbit 🐰</span>
          </div>
          <div
            className={styles.heroImageCard}
            style={{ backgroundImage: "url(/images/animals/elephant.png)" }}
          >
            <span className={styles.heroImageLabel}>Elephant 🐘</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features} id="features">
        <h2 className={styles.sectionTitle}>
          Tại sao chọn <span className={styles.heroGradient}>EduKids</span>?
        </h2>
        <p className={styles.sectionSubtitle}>
          Mọi thứ bé cần để học hiệu quả và vui vẻ
        </p>
        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🖐️</div>
            <h3>Cử chỉ tay AI</h3>
            <p>
              Bật webcam và trả lời bằng cách giơ ngón tay. Nắm tay để xác nhận,
              👍 để tiếp tục.
            </p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🎨</div>
            <h3>Hình ảnh siêu thực</h3>
            <p>
              Hình ảnh 3D cinematic chất lượng Pixar cho mỗi từ vựng — giúp bé
              ghi nhớ tốt hơn.
            </p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🏆</div>
            <h3>Xếp hạng toàn cầu</h3>
            <p>
              Thi đua cùng bạn bè khắp thế giới. Bảng xếp hạng reset mỗi tuần.
            </p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>📊</div>
            <h3>Theo dõi tiến độ</h3>
            <p>
              Phụ huynh dễ dàng quản lý hồ sơ con em và xem báo cáo học tập chi
              tiết.
            </p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🔊</div>
            <h3>Phát âm chuẩn</h3>
            <p>
              Nghe phát âm từ vựng bằng giọng đọc tự nhiên. Học nói đúng ngay từ
              đầu.
            </p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🎵</div>
            <h3>Âm thanh vui nhộn</h3>
            <p>
              Hiệu ứng âm thanh chúc mừng khi trả lời đúng — fanfare, arpeggio,
              và melody.
            </p>
          </div>
        </div>
      </section>

      {/* Subjects Section */}
      <section className={styles.subjects} id="subjects">
        <h2 className={styles.sectionTitle}>
          Giáo trình <span className={styles.heroGradient}>đa dạng</span>
        </h2>
        <p className={styles.sectionSubtitle}>
          Nhiều môn học, nhiều chủ đề — phong phú mỗi ngày
        </p>
        <div className={styles.subjectsGrid}>
          <div
            className={styles.subjectCardLarge}
            onClick={() => router.push("/learn/english")}
          >
            <span className={styles.subjectIconLarge}>🇬🇧</span>
            <h3>Tiếng Anh</h3>
            <p>16 chủ đề • 174+ từ vựng • 20 hình AI</p>
            <div className={styles.subjectTopics}>
              <span>🐾 Động vật</span>
              <span>🍎 Trái cây</span>
              <span>🌸 Hoa</span>
              <span>🚗 Xe cộ</span>
              <span>+12 khác</span>
            </div>
          </div>
          <div className={`${styles.subjectCardSmall} ${styles.locked}`}>
            <span className={styles.subjectIconLarge}>🔢</span>
            <h3>Toán học</h3>
            <p>Sắp ra mắt</p>
          </div>
          <div className={`${styles.subjectCardSmall} ${styles.locked}`}>
            <span className={styles.subjectIconLarge}>🔬</span>
            <h3>Khoa học</h3>
            <p>Sắp ra mắt</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <div className={styles.ctaGlow} />
        <h2 className={styles.ctaTitle}>Sẵn sàng bắt đầu?</h2>
        <p className={styles.ctaDesc}>
          Miễn phí, không cần thẻ tín dụng. Đăng nhập bằng Google và bắt đầu
          ngay.
        </p>
        <button className={styles.ctaPrimary} onClick={handleCTA}>
          🎓 Đăng nhập miễn phí
        </button>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <span className={styles.footerLogo}>🎓 EduKids</span>
          <span className={styles.footerText}>
            © 2026 EduKids. Xây dựng với ❤️ cho trẻ em Việt Nam.
          </span>
        </div>
      </footer>
    </div>
  );
}
