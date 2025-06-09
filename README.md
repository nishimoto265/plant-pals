# Plant Pals 🌱

植物愛好家のための包括的なプラント管理アプリケーション

## 🛡️ セキュリティについて

**重要: このプロジェクトをフォークまたはクローンする際の注意事項**

1. **環境変数ファイル**: `.env`ファイルや機密情報を含むファイルは絶対にGitHubにプッシュしないでください
2. **APIキー**: すべてのAPIキーは環境変数として管理し、`.env.example`ファイルを参考にしてください
3. **Terraformファイル**: `*.tfvars`ファイルにはインフラの機密情報が含まれるため、Gitにコミットしないでください
4. **データベース認証情報**: Supabase、Firebase、その他のサービスの認証情報は環境変数として管理してください

## 🚀 はじめに

このプロジェクトは React Native と TypeScript を使用して構築された植物管理アプリです。

### 前提条件

- Node.js (v16以上)
- React Native CLI
- Android Studio (Android開発用)
- Xcode (iOS開発用、macOSのみ)

### セットアップ

1. プロジェクトのクローン:
```bash
git clone https://github.com/your-username/plant-pals.git
cd plant-pals
```

2. 依存関係のインストール:
```bash
npm install
# または
yarn install
```

3. 環境変数の設定:
```bash
cp .env.example .env
# .envファイルを編集して実際の値を入力
```

4. iOS依存関係のインストール (macOSのみ):
```bash
cd ios && pod install && cd ..
```

### 開発サーバーの起動

```bash
# Metroバンドラーの起動
npm start
# または
yarn start
```

別のターミナルで:

```bash
# Android
npm run android
# または
yarn android

# iOS (macOSのみ)
npm run ios
# または
yarn ios
```

## 🧪 テスト

```bash
# ユニットテストの実行
npm test
# または
yarn test

# E2Eテストの実行
npm run test:e2e
# または
yarn test:e2e
```

## 📱 機能

- 植物の登録・管理
- 水やりスケジュール
- 植物の成長記録
- 写真アップロード
- リマインダー機能
- コミュニティ機能

## 🏗️ アーキテクチャ

- **フロントエンド**: React Native + TypeScript
- **状態管理**: Context API / Redux Toolkit
- **バックエンド**: Supabase
- **認証**: Supabase Auth
- **データベース**: PostgreSQL (Supabase)
- **ファイルストレージ**: Supabase Storage

## 📁 プロジェクト構造

```
PlantPals/
├── src/
│   ├── ui/
│   │   ├── screens/      # 画面コンポーネント
│   │   │   └── navigation/   # ナビゲーション設定
│   │   ├── components/   # 再利用可能なコンポーネント
│   │   └── navigation/   # ナビゲーション設定
│   ├── services/         # API呼び出し
│   ├── hooks/           # カスタムフック
│   ├── utils/           # ユーティリティ関数
│   └── types/           # TypeScript型定義
├── config/              # 設定ファイル
├── tests/               # テストファイル
└── docs/                # ドキュメント
```

## 🤝 コントリビューション

1. このリポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m '素晴らしい機能を追加'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを開く

## 📄 ライセンス

このプロジェクトは MIT ライセンスの下で公開されています。詳細は [LICENSE](LICENSE) ファイルを参照してください。

## 📞 サポート

問題や質問がある場合は、[Issues](https://github.com/your-username/plant-pals/issues) で報告してください。

## 📝 更新履歴

### v1.0.0
- 初期リリース
- 基本的な植物管理機能
- ユーザー認証
- 水やりリマインダー

---

**注意**: 開発環境での実行には適切な環境変数の設定が必要です。本番環境への展開前には、すべてのAPIキーとシークレットが正しく設定されていることを確認してください。
