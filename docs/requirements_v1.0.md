# 観葉植物キャラクター育成アプリ — 要件定義書 (v1.0, 2025‑05‑12)

---

## 1. 目的・背景

観葉植物ユーザーが日々の世話を楽しく継続できるよう、撮影した植物を「ゆるふわ」なキャラクターとして育成・交流できるスマートフォン／Webアプリを提供する。AI による植物識別・個体識別・健康解析・キャラクター生成・音声対話、AR 表示、ゲーミフィケーション、家族共有、SNS 交流を統合し、既存サービスとの差別化を図る。

## 2. スコープ

| レイヤ           | 採用技術                                        | 備考                                        |
| ------------- | ------------------------------------------- | ----------------------------------------- |
| **モバイル**      | React Native (Expo Router) + TypeScript     | iOS / Android 同時リリース                      |
| **Web**       | Next.js 14 (App Router, Server Actions)     | 管理ポータル & SSR ランディング                       |
| **BFF / API** | Supabase Edge Functions (Deno + TypeScript) | 認証・DB・Realtime・Storage 一体運用               |
| **AI 推論**     | Python FastAPI (AWS EKS)                    | Plant ID / Individual ID / Health / GenAI |
| **ストレージ**     | Supabase Storage → Cloudflare Images CDN    | 画像/動画を変換・キャッシュ                            |
| **Realtime**  | Supabase Realtime Channels                  | SNS / Family Share 更新                     |
| **AR**        | Viro React (ARCore / ARKit)                 | 鉢上に 3D キャラを表示                             |
| **CI/CD**     | GitHub Actions + Supabase Deploy + Expo EAS | mono‑repo ワンボタンデプロイ                       |

## 3. 想定ユーザー（ペルソナ）

| ID | プロフィール              | ニーズ                  |
| -- | ------------------- | -------------------- |
| A  | 都市部の20代女性／初心者       | 水やり忘れ防止・インテリア性       |
| B  | 趣味で複数株を育てる30代男性／中級者 | 個体ごとの記録・育成ゲーミフィケーション |
| C  | ファミリー層／子どもと利用       | 共有管理・キャラ遊び・AR 体験     |

## 4. 用語定義

* **キャラクター化**: 撮影画像の特徴を元に生成する 2D/3D アバター。
* **個体 ID**: 同一品種内の葉模様等をもとに推定する固有識別子。
* **AR オーバーレイ**: 実鉢に重畳表示する 3D キャラクター。
* **タイムライン**: アプリ内 SNS 投稿一覧（Home／Public／キャラ別）。

## 5. 全体ユーザーフロー

1. **撮影** → Plant/Individual ID 推論。
2. **キャラ生成** → アバター即時生成・性格付与。
3. **ホーム** → 棚／吊り鉢レイアウトで常駐アニメ。
4. **健康チェック** → 画像 / センサー解析 → 音声アドバイス。
5. **きせかえ** → ガチャ & Customizer で外見編集。
6. **AR 撮影** → SNS シェア。
7. **タイムライン** → 他ユーザーと交流。
8. **バッジ & ログインボーナス** → 継続利用促進。
9. **Family Manager** → 共有メンバー招待／権限設定。

## 6. 機能要件（主要）

### 6.0 認証 / ログイン

* メール＋パスワード、Google、Apple、GitHub OAuth2。
* ゲストモード可（投稿不可、後からアカウント連携）。
* JWT を SecureStore に暗号化保存、Refresh Token で 7 日サイレントログイン。

### 6.1 植物識別

* Top‑1 Accuracy ≥ 92 %、Macro F1 ≥ 0.90（Swin‑V2 Fine‑Tune）。

### 6.2 個体識別

* ArcFace × ConvNeXt‑Tiny Embedding、類似度 < 0.7 を別個体と判定。

### 6.3 キャラクター生成

* SDXL Turbo 512² PNG ≤ 3 s、性格タグ（陽気／クール…）。

### 6.4 ホーム画面（棚＋吊り鉢）

* Draggable Sprite、残水タイマー、タップリアクション < 100 ms。

### 6.5 AR モード

* 平面検出後 1 s 以内にキャラ配置、fps 30。

### 6.6 SNS / タイムライン

* 画像/動画(≤60 s) 投稿、Like/Reply/フォロー/ブロック、モデレーション。

### 6.7 ゲーミフィケーション

* バッジ（育成／SNS／連続ログイン）、ガチャ → S12 Result。

### 6.8 Family Share

* Roles: owner / editor / viewer、Supabase Row Level Security。

### 6.9 通知

* FCM Push: 水やり、コメント返信、バッジ獲得。

## 7. 非機能要件

| 指標            | 目標                               |
| ------------- | -------------------------------- |
| p95 API レイテンシ | ≤ 400 ms                         |
| 可用性           | 99.5 % / 月                       |
| オフライン         | キャラ表示・閲覧済みタイムライン・設定OK            |
| セキュリティ        | OAuth2、E2E 暗号化、GDPR/JP 個人情報保護法遵守 |
| アクセシビリティ      | WCAG AA、VoiceOver/TalkBack 対応    |

## 8. UI / UX 要件

### 8.1 主要スクリーン一覧

| ID                  | 目的               | 主要要素                                   |
| ------------------- | ---------------- | -------------------------------------- |
| S00 Welcome         | ロゴ & 言語選択        | Lottie、LocalePicker                    |
| S01 Auth            | メール & OAuth ログイン | TextInput、SocialButton                 |
| S02 Onboarding      | 権限許可・使い方         | Carousel、PermissionDialog              |
| S03 Camera          | 植物撮影             | GuideFrame、ShutterBtn                  |
| **S04 Home**        | 棚＋吊り鉢キャラ表示       | ShelfLayout(3段・Hooks×2)、AnimatedSprite |
| S05 Timeline        | SNS Home/Public  | PostCell、FAB                           |
| S06 AR Viewer       | 実鉢＋3D キャラ        | PlaneIndicator、RecordBtn               |
| S07 Profile         | ユーザー情報           | Avatar、Bio、Logout                      |
| S08 Settings        | 言語・通知等           | ToggleList、LocalePicker                |
| S09 Badge Center    | 実績一覧             | BadgeGrid、ProgressRing                 |
| S10 Store           | キセカエ & ガチャ       | ItemGrid、PurchaseBtn                   |
| S11 Customizer      | キャラ詳細編集          | AvatarEditor、ColorPicker               |
| S12 Gacha Result    | ガチャ演出            | CardFlipAnim、ShareBtn                  |
| S13 Plant Library   | 品種辞典             | SpeciesSearch、CareTips                 |
| S14 Notification    | 通知履歴             | NotificationCardList                   |
| S15 Family Manager  | 共有メンバー           | MemberList、InviteQR                    |
| S16 Checkout        | 課金               | PaywallCard、ConfirmModal               |
| S17 Error / Offline | 障害・オフライン         | Illustration、RetryBtn                  |

### 8.2 デザインガイドライン

* **テーマ**: *ゆるふわ Botanic Garden*（パステル＋木目）。
* **カラー**: 深緑 #2C6E49, 若葉 #97BC62, アイボリー #F2EFEA, アクセント #FFD166 / #EF476F。
* **タイポ**: Poppins SemiBold（見出し）、Noto Sans（本文）。
* **モーション**: Framer Motion，300 ms ease‑out。

## 9. データ要件

* **schemas**: users, plants, individuals, posts, follows, badges, families。
* **Media**: Supabase Storage (WebP/H.265) ＋ Cloudflare Images 変換。

## 10. AI / ML 要件

| モデル                  | 目的            | 指標             | 推論環境               |
| -------------------- | ------------- | -------------- | ------------------ |
| Swin‑V2 Large        | Plant ID      | Acc ≥ 0.92     | Cloud GPU / TFLite |
| ConvNeXtTiny+ArcFace | Individual ID | ROC‑AUC ≥ 0.95 | Edge               |
| SDXL Turbo           | Avatar Gen    | Latency ≤ 3 s  | Cloud GPU          |
| ResNet‑101 FT        | Health        | F1 ≥ 0.85      | Edge / Cloud       |
| Whisper v3           | STT           | WER ≤ 10 %     | Cloud              |
| VITS multi‑lang      | TTS           | MOS ≥ 4.0      | Edge               |
| GPT‑4o               | Dialogue      | CSAT ≥ 4.2/5   | Cloud              |

## 11. 外部連携

* Supabase Auth (Apple/Google/GitHub)。
* SNS シェア: X, Instagram, TikTok。
* 支払い: App Store / Google Play In‑App Purchase。

## 12. 運用・保守

* Logs: Supabase Logs + Sentry + Datadog。
* Monitoring: OpenTelemetry Tracing、Prometheus Metrics。
* SLA: P1 バグは 24 h 以内修正。

## 13. テスト & QA（TDD）

| レイヤ         | ツール                                    |
| ----------- | -------------------------------------- |
| Lint / Type | ESLint, Prettier, TypeScript --noEmit  |
| Unit        | Jest + @testing‑library/react‑native   |
| Integration | MSW / Supabase Test Utils              |
| E2E         | Detox (React Native), Playwright (Web) |
| Contract    | Pact (mobile ↔ Edge)                   |
| Coverage    | ≥80 %(BL), ≥60 %(UI), ≥90 %(API)       |

## 14. スケジュール

| フェーズ   | 期限      | 完了条件                    |
| ------ | ------- | ----------------------- |
| 要件凍結   | 2025‑06 | 本書承認                    |
| プロトタイプ | 2025‑08 | 撮影→キャラ生成→AR 表示          |
| β版     | 2025‑10 | SNS・ゲーミフィケーション・多言語      |
| RC     | 2025‑12 | Family Share・CI 緑 100 % |
| リリース   | 2026‑02 | ストア公開                   |

## 15. リスク & 対応

| リスク        | 対応策                      |
| ---------- | ------------------------ |
| モデル精度不足    | 継続学習 & 追加データ収集           |
| 不適切投稿      | AI + 人手モデレーション、通報＜2 h 対応 |
| AR パフォーマンス | LOD 切替・端末別最適化            |
| 個人情報漏洩     | E2E 暗号化、最小権限ポリシー         |

## 16. コーディング規約（TypeScript / Python）

* ESLint Airbnb + Prettier、Conventional Commits、Semantic Versioning。
* ファイル/Dir=kebab‑case、クラス=PascalCase、関数=camelCase。

## 17. アーキテクチャ

* **Frontend**: React Native (RN / Expo) & Next.js Monorepo。
* **BFF**: Supabase Edge Functions (Deno)。
* **AI Service**: FastAPI on AWS EKS。
* **spec/ ↔ src/**: YAML とコードを鏡合わせ、`scripts/generate_*` で同期。

## 18. 拡張性設計原則

SOLID, Feature Flags (LaunchDarkly), Remote Config, Plugin System, OpenTelemetry。

## 19. YAML 運用ポリシー

* SSOT: `config/stack.yaml` `services.yaml` `features.yaml`。
* spec/ に UI/Route など詳細 YAML、src/ に対応コード。
* `sync_yaml.py` & JSON Schema で CI バリデーション。

## 20. フルリポジトリ構成（spec と src を“完全ミラー”）

> **原則**: `spec/` と `src/` はトップレベル以外の階層を **1 byte も変えず** に一致させる。
> 例）`spec/ui/screens/S04_home.yaml` ←→ `src/ui/screens/S04_home/index.tsx`

```
plant-pals/
├─ config/                      # 📜 プロジェクト横断 YAML (SSOT)
│   ├─ stack.yaml
│   ├─ services.yaml
│   ├─ features.yaml
│   └─ schema/
│       ├─ stack.schema.json
│       ├─ service.schema.json
│       └─ feature.schema.json
│
├─ spec/                        # 🗂 仕様 (鏡元) — すべて YAML
│   ├─ ui/
│   │   └─ screens/
│   │       ├─ S00_welcome.yaml
│   │       ├─ S01_auth.yaml
│   │       ├─ S04_home.yaml
│   │       └─ … (S17 まで)
│   ├─ server/
│   │   └─ routers/
│   │       ├─ identify.yaml
│   │       ├─ timeline.yaml
│   │       └─ health.yaml
│   ├─ edge/
│   │   └─ functions/
│   │       ├─ auth.yaml
│   │       └─ plant.yaml
│   ├─ tests/                   # Gherkin / YAML テスト仕様
│   │   ├─ e2e/
│   │   │   └─ login.feature.yaml
│   │   └─ contract/
│   │       └─ plant_id_contract.yaml
│   └─ schema/                  # spec 用 JSON Schema
│       └─ screen.schema.json
│
├─ src/                         # 💻 実装コード (鏡先)
│   ├─ ui/
│   │   └─ screens/
│   │       ├─ S00_welcome/
│   │       │   ├─ index.tsx
│   │       │   ├─ styles.ts
│   │       │   └─ __tests__/snapshot.test.tsx
│   │       ├─ S01_auth/
│   │       │   └─ index.tsx
│   │       └─ S04_home/
│   │           ├─ index.tsx
│   │           └─ styles.ts
│   ├─ server/                  # FastAPI サービス
│   │   ├─ main.py
│   │   ├─ routers/
│   │   │   ├─ identify.py
│   │   │   ├─ timeline.py
│   │   │   └─ health.py
│   │   ├─ models/
│   │   ├─ schemas/
│   │   └─ tests/
│   │       └─ test_identify.py
│   ├─ edge/                    # Supabase Edge Functions (Deno TS)
│   │   ├─ auth.ts
│   │   └─ plant.ts
│   ├─ packages/
│   │   ├─ shared/              # utils, hooks, theme tokens
│   │   └─ api/                 # Supabase / GraphQL SDK
│   └─ storybook/               # UI カタログ (自動登録)
│       └─ index.ts
│
├─ infra/                       # ☁️ IaC & CI/CD
│   ├─ terraform/
│   │   ├─ main.tf              # AWS / VPC / RDS / EKS
│   │   ├─ supabase.tf          # Supabase プロジェクト
│   │   └─ cloudflare.tf        # Images CDN
│   ├─ k8s/
│   │   ├─ fastapi-deploy.yaml
│   │   ├─ ingress.yaml
│   │   └─ hpa.yaml
│   └─ github/
│       └─ workflows/
│           ├─ ci.yml           # Lint → Test → Build
│           ├─ cd.yml           # Deploy to Supabase & EKS
│           └─ sync.yml         # YAML → generate_* → validate_spec
│
├─ scripts/                     # 🔧 ユーティリティ
│   ├─ generate_ui.ts          # spec/ui → src/ui コード生成
│   ├─ generate_routes.py       # spec/server → src/server
│   ├─ generate_edge.ts         # spec/edge → src/edge
│   ├─ validate_spec.py         # パス対称性・JSON Schema 検証
│   └─ sync_yaml.py             # config ↔ docs シンクロ
│
├─ tests/                       # 🔬 Black‑box E2E & Contract
│   ├─ e2e/                     # Detox (mobile) / Playwright (web)
│   │   ├─ auth.e2e.ts
│   │   └─ ar_overlay.e2e.ts
│   └─ contract/                # Pact files
│       ├─ plant_id_contract.json
│       └─ timeline_contract.json
│
├─ docs/                        # 📖 非技術ドキュメント
│   ├─ README.md
│   ├─ architecture.md
│   ├─ api_spec.yaml            # OpenAPI 3.1
│   └─ diagrams/
│       ├─ sequence_create_character.drawio
│       └─ deployment_aws.drawio
│
├─ .env.example                 # 環境変数サンプル
├─ package.json / pnpm-workspace.yaml
├─ tsconfig.base.json
├─ .gitignore
└─ LICENSE
```

### 20.1 “完全ミラー” チェックロジック

```ts
// validate_spec.ts (pseudo)
for (const yamlPath of glob('spec/**/*.{yaml,yml}')) {
  const rel = path.relative('spec', yamlPath);
  let codePath = path.join('src', rel);
  if (rel.startsWith('ui/screens')) {
    codePath = codePath.replace(/\.ya?ml$/, '/index.tsx');
  } else if (rel.startsWith('server/routers')) {
    codePath = codePath.replace(/\.ya?ml$/, '.py');
  } else if (rel.startsWith('edge/functions')) {
    codePath = codePath.replace(/\.ya?ml$/, '.ts');
  }
  assert(fs.existsSync(codePath), `Missing mirror for ${yamlPath}`);
}
```

### 20.2 例外ルール（spec → src 変換表）

| spec パス                      | 生成先 (src)                         | 自動生成内容                           | 備考                              |
| ---------------------------- | --------------------------------- | -------------------------------- | ------------------------------- |
| `ui/screens/{ID}.yaml`       | `/ui/screens/{ID}/index.tsx`      | React Native コンポーネントテンプレ         | `styles.ts`・`__tests__` は手書き追加可 |
| `server/routers/{name}.yaml` | `/server/routers/{name}.py`       | FastAPI Router + Pydantic Schema | 依存 import 自動解決                  |
| `edge/functions/{name}.yaml` | `/edge/{name}.ts`                 | Supabase Deno Edge Function      | JWT ‑ 保護等テンプレ含む                 |
| `tests/e2e/{case}.yaml`      | `/tests/e2e/{case}.e2e.ts`        | Detox / Playwright テスト雛形         | GIVEN–WHEN–THEN を YAML で記述      |
| `tests/contract/{api}.yaml`  | `/tests/contract/{api}.pact.ts`   | Pact DSL テンプレ                    | Provider / Consumer 名も YAML で指定 |
| その他ファイル                      | `/src/` 以下同相対パス `.yaml → .ts/.py` | スクリプトに委任                         |                                 |

### 20.3 テスト仕様 YAML 例

```yaml
# spec/tests/e2e/login.yaml
id: login_e2e
platform: mobile  # or web
steps:
  - open: app
  - tap: "LoginButton"
  - fill: { selector: "EmailInput", text: "user@example.com" }
  - fill: { selector: "PasswordInput", text: "••••" }
  - tap: "Submit"
  - expect: { selector: "HomeScreen", exists: true }
```

自動生成される `/tests/e2e/login.e2e.ts` を基に、必要に応じて手書きで asserts を拡張。

### 20.4 validate\_spec 拡張 (テスト含む)

```ts
if (rel.startsWith('tests/e2e')) {
  codePath = codePath.replace(/\.ya?ml$/, '.e2e.ts');
} else if (rel.startsWith('tests/contract')) {
  codePath = codePath.replace(/\.ya?ml$/, '.pact.ts');
}
```

> これで **テスト仕様 YAML も spec 側に置き、src/tests に完全ミラー** されます。

## 21. Git 並列開発フロー

* git worktree で複数チェックアウト。
* feat/ ブランチ → `pnpm lint && pnpm test && pnpm typecheck` → PR → CI → main。
* `scripts/validate_spec.py` が YAML↔コード差分ゼロをゲート。

## 22. 実装手順（Spec‑Driven TDD ワークフロー）

> **ゴール**: 仕様 (YAML) → テスト → 実装 → テストPASS の流れを徹底し、TDD を自動化する。

| ステップ                 | 操作                                      | ツール / コマンド                                   | 成果物                                    |
| -------------------- | --------------------------------------- | -------------------------------------------- | -------------------------------------- |
| **1. YAML 定義**       | `spec/` に機能 YAML 追加                     | VS Code + JSON Schema IntelliSense           | 例: `spec/ui/screens/S18_settings.yaml` |
| **2. テスト YAML**      | 同パスで `spec/tests/e2e/{case}.yaml` などを記述 | Gherkin YAML                                 | テスト仕様ファイル                              |
| **3. 自動生成**          | `pnpm generate` (scripts/generate\_\*)  | `generate_ui.ts`, `generate_tests.ts`        | `src/ui/...`, `src/tests/...` 雛形作成     |
| **4. Red**           | `pnpm test` → 失敗を確認                     | Jest / Detox / Playwright                    | テスト RED 状態                             |
| **5. Green**         | 実装を編集 (`src/...`)                       | IDE / AI Copilot / ChatGPT                   | テスト PASS                               |
| **6. Refactor**      | 重複除去・クリーンアップ                            | ESLint Fix, Prettier                         | 品質維持                                   |
| **7. Commit & Push** | Conventional Commit                     | `git commit -m "feat(ui): add S18 settings"` | feat/ ブランチ                             |
| **8. CI**            | GitHub Actions → lint/test/build        | ci.yml                                       | GREEN → レビュー                           |
| **9. Merge**         | PR Review → main                        | GitHub squash merge                          | main 更新 & CD                           |

### 22.1 自動生成スクリプト一覧

| スクリプト                | 入力 (spec)                    | 出力 (src)                      |
| -------------------- | ---------------------------- | ----------------------------- |
| `generate_ui.ts`     | `spec/ui/screens/*.yaml`     | React Native コンポーネント          |
| `generate_routes.py` | `spec/server/routers/*.yaml` | FastAPI Router                |
| `generate_edge.ts`   | `spec/edge/functions/*.yaml` | Supabase Edge Fn              |
| `generate_tests.ts`  | `spec/tests/**/*.yaml`       | Detox / Playwright / Pact テスト |

> **原則**: すべての実装ファイルは対応する spec YAML が存在。YAML 変更後、まずテスト自動生成 → RED → 実装 → GREEN の TDD サイクルを回す。
