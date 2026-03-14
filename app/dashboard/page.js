'use client';

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import styles from './dashboard.module.css';

export default function DashboardPage() {
  const { user, profile, children, activeChild, setActiveChild, loading, signOut, addChild, removeChild } = useAuth();
  const router = useRouter();
  const [showAddChild, setShowAddChild] = useState(false);
  const [childName, setChildName] = useState('');
  const [birthYear, setBirthYear] = useState(2020);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) return null;

  const handleAddChild = async (e) => {
    e.preventDefault();
    if (!childName.trim()) return;
    await addChild(childName.trim(), birthYear);
    setChildName('');
    setBirthYear(2020);
    setShowAddChild(false);
  };

  const currentYear = new Date().getFullYear();
  const yearOptions = [];
  for (let y = currentYear - 2; y >= currentYear - 15; y--) {
    yearOptions.push(y);
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.logo} onClick={() => router.push('/')}>🎓 EduKids</span>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.userInfo}>
            {profile?.avatar_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profile.avatar_url} alt="" className={styles.avatar} />
            )}
            <span className={styles.userName}>{profile?.display_name || user.email}</span>
          </div>
          <button className={styles.signOutBtn} onClick={signOut}>Đăng xuất</button>
        </div>
      </header>

      <main className={styles.main}>
        <h1 className={styles.title}>Xin chào, {profile?.display_name?.split(' ')[0]} 👋</h1>
        <p className={styles.subtitle}>Quản lý hồ sơ con em và theo dõi tiến độ học tập</p>

        {/* Children Section */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>👧 Hồ sơ con em</h2>
            <button 
              className={styles.addBtn}
              onClick={() => setShowAddChild(!showAddChild)}
            >
              {showAddChild ? '✕ Hủy' : '+ Thêm con'}
            </button>
          </div>

          {showAddChild && (
            <form className={styles.addForm} onSubmit={handleAddChild}>
              <input
                type="text"
                placeholder="Tên con"
                value={childName}
                onChange={(e) => setChildName(e.target.value)}
                className={styles.input}
                autoFocus
              />
              <select
                value={birthYear}
                onChange={(e) => setBirthYear(Number(e.target.value))}
                className={styles.select}
              >
                {yearOptions.map(y => (
                  <option key={y} value={y}>Năm sinh: {y} ({currentYear - y} tuổi)</option>
                ))}
              </select>
              <button type="submit" className={styles.submitBtn}>Thêm</button>
            </form>
          )}

          <div className={styles.childrenGrid}>
            {children.map((child) => (
              <div
                key={child.id}
                className={`${styles.childCard} ${activeChild?.id === child.id ? styles.activeChild : ''}`}
                onClick={() => setActiveChild(child)}
              >
                <div className={styles.childAvatar}>{child.avatar || '🧒'}</div>
                <div className={styles.childInfo}>
                  <span className={styles.childName}>{child.name}</span>
                  <span className={styles.childAge}>{currentYear - child.birth_year} tuổi</span>
                </div>
                {activeChild?.id === child.id && (
                  <span className={styles.activeBadge}>Đang chọn</span>
                )}
                <button
                  className={styles.removeBtn}
                  onClick={(e) => { e.stopPropagation(); removeChild(child.id); }}
                >
                  ✕
                </button>
              </div>
            ))}
            {children.length === 0 && !showAddChild && (
              <div className={styles.emptyState}>
                <span className={styles.emptyIcon}>👶</span>
                <p>Chưa có hồ sơ con em nào</p>
                <button className={styles.addBtn} onClick={() => setShowAddChild(true)}>
                  + Thêm con ngay
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Subjects Section */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>📚 Giáo trình</h2>
          <div className={styles.subjectsGrid}>
            <div className={styles.subjectCard} onClick={() => router.push('/')}>
              <span className={styles.subjectIcon}>🇬🇧</span>
              <h3>Tiếng Anh</h3>
              <p>Từ vựng, flashcard, quiz tương tác</p>
              <span className={styles.subjectBadge}>16 chủ đề</span>
            </div>
            <div className={`${styles.subjectCard} ${styles.comingSoon}`}>
              <span className={styles.subjectIcon}>🔢</span>
              <h3>Toán học</h3>
              <p>Phép tính, hình học, logic</p>
              <span className={styles.comingSoonBadge}>Sắp ra mắt</span>
            </div>
            <div className={`${styles.subjectCard} ${styles.comingSoon}`}>
              <span className={styles.subjectIcon}>🔬</span>
              <h3>Khoa học</h3>
              <p>Thế giới tự nhiên, thí nghiệm</p>
              <span className={styles.comingSoonBadge}>Sắp ra mắt</span>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        {activeChild && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>⚡ Hành động nhanh</h2>
            <div className={styles.actionsGrid}>
              <button className={styles.actionCard} onClick={() => router.push('/')}>
                <span>🎯</span>
                <span>Làm Quiz</span>
              </button>
              <button className={styles.actionCard} onClick={() => router.push('/leaderboard')}>
                <span>🏆</span>
                <span>Bảng xếp hạng</span>
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
