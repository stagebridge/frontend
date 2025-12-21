// src/pages/mypage/ProfilePersonalInfo.tsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { defaultSettings, loadSettings, saveSettings } from "../../app/storage/mypageStorage";
import { useAuth } from "../../contexts/AuthContext";
import type { MySettings } from "../../types/mypage";

type Props = {
  onChanged?: () => void;
};

function isValidEmail(email: string) {
  return /^\S+@\S+\.\S+$/.test(email);
}

function normalizePhone(phone: string) {
  return phone.replace(/[^0-9]/g, "");
}

function formatPhone(phone: string) {
  const n = normalizePhone(phone);
  if (n.length === 11) return `${n.slice(0, 3)}-${n.slice(3, 7)}-${n.slice(7)}`;
  if (n.length === 10) return `${n.slice(0, 3)}-${n.slice(3, 6)}-${n.slice(6)}`;
  return phone;
}

// ✅ auth.user.email이 비어 있으면 auth.user.id를 이메일 후보로 사용합니다.
// (상단 헤더에 abcd@gmail.com이 보이는 케이스를 확실히 커버)
function resolveEmailCandidate(user: { id: string; email?: string } | null) {
  if (!user) return "";
  const fromEmail = (user.email ?? "").trim();
  if (fromEmail) return fromEmail;

  const fromId = (user.id ?? "").trim();
  return isValidEmail(fromId) ? fromId : "";
}

export default function ProfilePersonalInfo({ onChanged }: Props) {
  const auth = useAuth();
  const navigate = useNavigate();

  const [settings, setSettings] = useState<MySettings>(() => loadSettings() ?? defaultSettings());
  const [busy, setBusy] = useState(false);

  const [nickname, setNickname] = useState(settings.profile.nickname ?? "");
  const [email, setEmail] = useState(settings.profile.email ?? "");
  const [phone, setPhone] = useState(settings.profile.phone ?? "");
  const [language, setLanguage] = useState<MySettings["profile"]["language"]>(
    settings.profile.language ?? "ko",
  );

  const [marketing, setMarketing] = useState(settings.notifications.marketing ?? false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPassword2, setNewPassword2] = useState("");
  const [showPw, setShowPw] = useState(false);

  const [confirmText, setConfirmText] = useState("");

  // ✅ 핵심: 로그인 사용자 정보로 화면 값(닉네임/이메일)을 “항상” 맞춥니다.
  // 이메일은 user.email이 없으면 user.id(이메일 형태일 때)를 사용합니다.
  useEffect(() => {
    if (!auth.user) return;

    const nextNickname = (auth.user.nickname ?? "").trim();
    const nextEmail = resolveEmailCandidate(auth.user);

    setNickname(nextNickname);
    setEmail(nextEmail);

    const next: MySettings = {
      ...settings,
      profile: {
        ...settings.profile,
        nickname: nextNickname,
        email: nextEmail,
      },
    };

    setSettings(next);
    saveSettings(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.user?.id]);

  const basicChanged = useMemo(() => {
    const p = settings.profile;
    return (
      (nickname.trim() && nickname.trim() !== (p.nickname ?? "")) ||
      (email.trim() && email.trim() !== (p.email ?? "")) ||
      formatPhone(phone) !== (p.phone ?? "") ||
      language !== (p.language ?? "ko") ||
      marketing !== (settings.notifications.marketing ?? false)
    );
  }, [email, language, marketing, nickname, phone, settings]);

  const saveBasic = async () => {
    const safeNickname = nickname.trim();
    const safeEmail = email.trim();
    const safePhone = formatPhone(phone.trim());

    if (!safeNickname) {
      alert("닉네임을 입력해 주세요.");
      return;
    }
    if (safeNickname.length < 2 || safeNickname.length > 15) {
      alert("닉네임은 2~15 글자 내외로 입력해 주세요.");
      return;
    }
    if (!safeEmail || !isValidEmail(safeEmail)) {
      alert("이메일 형식이 올바르지 않습니다.");
      return;
    }
    if (safePhone && normalizePhone(safePhone).length < 9) {
      alert("연락처 형식이 올바르지 않습니다.");
      return;
    }
    setBusy(true);
    try {
      await auth.updateProfile({ nickname: safeNickname, email: safeEmail });

      const next: MySettings = {
        ...settings,
        profile: {
          ...settings.profile,
          nickname: safeNickname,
          email: safeEmail,
          phone: safePhone,
          language,
        },
        notifications: {
          ...settings.notifications,
          marketing,
        },
      };

      setSettings(next);
      saveSettings(next);
      onChanged?.();
      alert("저장되었습니다.");
    } catch (err) {
      alert(err instanceof Error ? err.message : "저장에 실패했습니다.");
    } finally {
      setBusy(false);
    }
  };

  const resendEmail = () => {
    alert("인증 메일을 재발송했습니다. (시연용)");
  };

  const savePassword = async () => {
    if (!currentPassword || !newPassword || !newPassword2) {
      alert("비밀번호 입력값을 모두 입력해 주세요.");
      return;
    }
    if (newPassword.length < 8) {
      alert("새 비밀번호는 여덟 글자 이상으로 입력해 주세요.");
      return;
    }
    if (newPassword !== newPassword2) {
      alert("새 비밀번호가 일치하지 않습니다.");
      return;
    }

    setBusy(true);
    try {
      await auth.changePassword({ currentPassword, newPassword });
      setCurrentPassword("");
      setNewPassword("");
      setNewPassword2("");
      alert("비밀번호가 변경되었습니다.");
    } catch (err) {
      alert(err instanceof Error ? err.message : "비밀번호 변경에 실패했습니다.");
    } finally {
      setBusy(false);
    }
  };

  const deleteAccount = async () => {
    if (confirmText.trim() !== "탈퇴합니다") {
      alert("확인 문구가 일치하지 않습니다.");
      return;
    }

    const ok = window.confirm("정말로 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.");
    if (!ok) return;

    setBusy(true);
    try {
      await auth.deleteAccount();
      localStorage.removeItem("sb_mypage_settings");
      alert("탈퇴가 완료되었습니다.");
      navigate("/", { replace: true });
    } catch (err) {
      alert(err instanceof Error ? err.message : "탈퇴에 실패했습니다.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="sb-surface-soft p-5">
        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">기본 정보</h3>
          <p className="text-xs sb-text-muted">닉네임, 이메일, 연락처, 선호 언어를 변경합니다.</p>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-semibold sb-text-muted">이메일</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="sb-input"
              placeholder="example@email.com"
              autoComplete="email"
            />
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <button type="button" onClick={resendEmail} className="sb-btn-outline">
                인증 메일 재발송
              </button>
              <span className="text-xs sb-text-subtle">백엔드 연동 전에는 시연용으로 동작합니다.</span>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold sb-text-muted">닉네임</label>
            <input
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="sb-input"
              placeholder="닉네임을 입력해 주세요."
              autoComplete="nickname"
            />
            <p className="mt-2 text-xs sb-text-subtle">2~15 글자 내외, 공백 없이 권장합니다.</p>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold sb-text-muted">연락처(선택)</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="sb-input"
              placeholder="010-0000-0000"
              inputMode="numeric"
              autoComplete="tel"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold sb-text-muted">선호 언어</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as MySettings["profile"]["language"])}
              className="sb-input"
            >
              <option value="ko">한국어</option>
              <option value="ja">日本語</option>
              <option value="en">English</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-neutral-700 dark:bg-neutral-900">
              <div>
                <p className="text-sm font-semibold">마케팅 알림 수신</p>
                <p className="text-xs sb-text-muted">신규 공연, 이벤트 소식을 이메일로 안내합니다.</p>
              </div>
              <button
                type="button"
                onClick={() => setMarketing((v) => !v)}
                className={`h-8 w-14 rounded-full p-1 transition ${
                  marketing ? "bg-black dark:bg-white" : "bg-slate-200 dark:bg-neutral-700"
                }`}
                aria-pressed={marketing}
              >
                <span
                  className={`block h-6 w-6 rounded-full bg-white transition dark:bg-black ${
                    marketing ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-end">
          <button
            type="button"
            disabled={!basicChanged || busy}
            onClick={() => void saveBasic()}
            className="sb-btn-primary disabled:opacity-40"
          >
            {busy ? "저장 중" : "저장"}
          </button>
        </div>
      </section>

      <section className="sb-surface-soft p-5">
        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">보안</h3>
          <p className="text-xs sb-text-muted">비밀번호를 변경합니다.</p>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-semibold sb-text-muted">현재 비밀번호</label>
            <input
              type={showPw ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="sb-input"
              autoComplete="current-password"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold sb-text-muted">새 비밀번호</label>
            <input
              type={showPw ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="sb-input"
              autoComplete="new-password"
            />
            <p className="mt-2 text-xs sb-text-subtle">여덟 글자 이상을 권장합니다.</p>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold sb-text-muted">새 비밀번호 확인</label>
            <input
              type={showPw ? "text" : "password"}
              value={newPassword2}
              onChange={(e) => setNewPassword2(e.target.value)}
              className="sb-input"
              autoComplete="new-password"
            />
          </div>

          <div className="flex items-end justify-between gap-3">
            <button type="button" onClick={() => setShowPw((v) => !v)} className="sb-btn-outline">
              {showPw ? "숨기기" : "표시"}
            </button>
            <button
              type="button"
              onClick={() => void savePassword()}
              disabled={busy}
              className="sb-btn-primary disabled:opacity-40"
            >
              {busy ? "변경 중" : "비밀번호 변경"}
            </button>
          </div>
        </div>
      </section>

      <section className="sb-surface-soft border-rose-200 bg-rose-50/40 p-5 dark:border-rose-900/40 dark:bg-rose-950/20">
        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-extrabold text-rose-700 dark:text-rose-300">회원 탈퇴</h3>
          <p className="text-xs text-rose-700/80 dark:text-rose-300/80">회원 탈퇴는 되돌릴 수 없습니다.</p>
        </div>

        <div className="mt-4 space-y-3">
          <p className="text-xs sb-text-muted">
            확인 문구로 "탈퇴합니다"를 입력한 후, 탈퇴 버튼이 활성화됩니다.
          </p>
          <input
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            className="sb-input"
            placeholder='"탈퇴합니다"를 입력해 주세요.'
          />

          <div className="flex items-center justify-end">
            <button
              type="button"
              onClick={() => void deleteAccount()}
              disabled={busy || confirmText.trim() !== "탈퇴합니다"}
              className="sb-btn-outline border-rose-200 text-rose-700 hover:bg-rose-50 disabled:opacity-40 dark:border-rose-900/40 dark:text-rose-300 dark:hover:bg-rose-900/20"
            >
              {busy ? "처리 중" : "회원 탈퇴"}
            </button>
          </div>
        </div>
      </section>

      <p className="text-xs sb-text-subtle">
        참고: 현재 단계에서는 백엔드 없이 시연할 수 있도록 localStorage 기반으로 동작합니다.
      </p>
    </div>
  );
}
