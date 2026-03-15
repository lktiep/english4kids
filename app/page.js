"use client";

import { useEffect } from "react";
import { useAuth } from "./context/AuthContext";
import { useI18n } from "./context/i18nContext";
import { useRouter } from "next/navigation";
import styles from "./landing.module.css";

export default function LandingPage() {
  const { user, loading } = useAuth();
  const { t, locale, setLocale, loadPage } = useI18n();
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await loadPage("landing");
      if (cancelled) return;
    })();
    return () => {
      cancelled = true;
    };
  }, [loadPage]);

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
          <span className={styles.logo}>🎓 {t("app_name")}</span>
          <div className={styles.navLinks}>
            <a href="#features" className={styles.navLink}>
              {t("nav_features")}
            </a>
            <a href="#subjects" className={styles.navLink}>
              {t("nav_subjects")}
            </a>
            <a
              className={styles.navLink}
              onClick={() => router.push("/leaderboard")}
              style={{ cursor: "pointer" }}
            >
              {t("nav_leaderboard")}
            </a>
            {/* Language Switcher */}
            <button
              className={styles.langSwitch}
              onClick={() => setLocale(locale === "vi" ? "en" : "vi")}
              title={
                locale === "vi" ? "Switch to English" : "Chuyển sang Tiếng Việt"
              }
            >
              {locale === "vi" ? "🇻🇳 VI" : "🇬🇧 EN"}
            </button>
            {!loading &&
              (user ? (
                <button
                  className={styles.navBtn}
                  onClick={() => router.push("/dashboard")}
                >
                  {t("nav_dashboard")}
                </button>
              ) : (
                <button
                  className={styles.navBtn}
                  onClick={() => router.push("/login")}
                >
                  {t("nav_login")}
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
            <span>🚀</span>{" "}
            {t("hero_badge", {}, "Nền tảng giáo dục #1 cho trẻ em")}
          </div>
          <h1 className={styles.heroTitle}>
            {t("hero_line1", {}, "Học mà chơi,")}
            <br />
            <span className={styles.heroGradient}>
              {t("hero_line2", {}, "chơi mà học")}
            </span>
          </h1>
          <p className={styles.heroDesc}>{t("hero_subtitle")}</p>
          <div className={styles.heroBtns}>
            <button className={styles.ctaPrimary} onClick={handleCTA}>
              {t("btn_start_free")} →
            </button>
            <button
              className={styles.ctaSecondary}
              onClick={() => router.push("/learn/english")}
            >
              {t("btn_start_learning")}
            </button>
          </div>
          <div className={styles.heroStats}>
            <div className={styles.stat}>
              <span className={styles.statNum}>174+</span>
              <span className={styles.statLabel}>
                {t("stat_vocab", {}, "Từ vựng")}
              </span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={styles.statNum}>16</span>
              <span className={styles.statLabel}>
                {t("stat_topics", {}, "Chủ đề")}
              </span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={styles.statNum}>AI</span>
              <span className={styles.statLabel}>
                {t("stat_gesture", {}, "Cử chỉ tay")}
              </span>
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
          {t("features_title", {}, "Tại sao chọn")}{" "}
          <span className={styles.heroGradient}>{t("app_name")}</span>
          {locale === "vi" ? "?" : "?"}
        </h2>
        <p className={styles.sectionSubtitle}>
          {t("features_sub", {}, "Mọi thứ bé cần để học hiệu quả và vui vẻ")}
        </p>
        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🖐️</div>
            <h3>{t("feat_gesture_title", {}, "Cử chỉ tay AI")}</h3>
            <p>
              {t(
                "feat_gesture_desc",
                {},
                "Bật webcam và trả lời bằng cách giơ ngón tay. Nắm tay để xác nhận, 👍 để tiếp tục.",
              )}
            </p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🎨</div>
            <h3>{t("feat_images_title", {}, "Hình ảnh siêu thực")}</h3>
            <p>
              {t(
                "feat_images_desc",
                {},
                "Hình ảnh 3D cinematic chất lượng Pixar cho mỗi từ vựng — giúp bé ghi nhớ tốt hơn.",
              )}
            </p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🏆</div>
            <h3>{t("feat_leaderboard_title", {}, "Xếp hạng toàn cầu")}</h3>
            <p>
              {t(
                "feat_leaderboard_desc",
                {},
                "Thi đua cùng bạn bè khắp thế giới. Bảng xếp hạng reset mỗi tuần.",
              )}
            </p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>📊</div>
            <h3>{t("feat_progress_title", {}, "Theo dõi tiến độ")}</h3>
            <p>
              {t(
                "feat_progress_desc",
                {},
                "Phụ huynh dễ dàng quản lý hồ sơ con em và xem báo cáo học tập chi tiết.",
              )}
            </p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🔊</div>
            <h3>{t("feat_pronunciation_title", {}, "Phát âm chuẩn")}</h3>
            <p>
              {t(
                "feat_pronunciation_desc",
                {},
                "Nghe phát âm từ vựng bằng giọng đọc tự nhiên. Học nói đúng ngay từ đầu.",
              )}
            </p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🎵</div>
            <h3>{t("feat_sound_title", {}, "Âm thanh vui nhộn")}</h3>
            <p>
              {t(
                "feat_sound_desc",
                {},
                "Hiệu ứng âm thanh chúc mừng khi trả lời đúng — fanfare, arpeggio, và melody.",
              )}
            </p>
          </div>
        </div>
      </section>

      {/* Subjects Section */}
      <section className={styles.subjects} id="subjects">
        <h2 className={styles.sectionTitle}>
          {t("subjects_title", {}, "Giáo trình")}{" "}
          <span className={styles.heroGradient}>
            {t("subjects_rich", {}, "đa dạng")}
          </span>
        </h2>
        <p className={styles.sectionSubtitle}>
          {t(
            "subjects_sub",
            {},
            "Nhiều môn học, nhiều chủ đề — phong phú mỗi ngày",
          )}
        </p>
        <div className={styles.subjectsGrid}>
          <div
            className={styles.subjectCardLarge}
            onClick={() => router.push("/learn/english")}
          >
            <span className={styles.subjectIconLarge}>🇬🇧</span>
            <h3>{t("subject_english")}</h3>
            <p>
              16 {t("stat_topics", {}, "chủ đề")} • 174+{" "}
              {t("stat_vocab", {}, "từ vựng")} • 20{" "}
              {t("stat_ai_images", {}, "hình AI")}
            </p>
            <div className={styles.subjectTopics}>
              <span>🐾 {t("topic_animals", {}, "Động vật")}</span>
              <span>🍎 {t("topic_fruits", {}, "Trái cây")}</span>
              <span>🌸 {t("topic_flowers", {}, "Hoa")}</span>
              <span>🚗 {t("topic_vehicles", {}, "Xe cộ")}</span>
              <span>+12 {t("more", {}, "khác")}</span>
            </div>
          </div>
          <div className={`${styles.subjectCardSmall} ${styles.locked}`}>
            <span className={styles.subjectIconLarge}>🔢</span>
            <h3>{t("subject_math")}</h3>
            <p>{t("coming_soon")}</p>
          </div>
          <div className={`${styles.subjectCardSmall} ${styles.locked}`}>
            <span className={styles.subjectIconLarge}>🔬</span>
            <h3>{t("subject_science")}</h3>
            <p>{t("coming_soon")}</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <div className={styles.ctaGlow} />
        <h2 className={styles.ctaTitle}>{t("cta_title")}</h2>
        <p className={styles.ctaDesc}>{t("cta_subtitle")}</p>
        <button className={styles.ctaPrimary} onClick={handleCTA}>
          🎓 {t("btn_start_free")}
        </button>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <span className={styles.footerLogo}>🎓 {t("app_name")}</span>
          <span className={styles.footerText}>{t("footer_text")}</span>
        </div>
      </footer>
    </div>
  );
}
