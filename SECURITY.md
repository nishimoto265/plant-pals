# セキュリティガイドライン

このドキュメントは、Plant Palsプロジェクトのセキュリティ上のベストプラクティスを説明しています。

## 🔒 機密情報の管理

### 絶対にGitHubにプッシュしてはいけないファイル

- `.env`、`.env.*` - 環境変数ファイル
- `config/secrets.json` - APIキーとシークレット
- `*.tfvars` - Terraformの変数ファイル
- `local.properties` - Android SDKパス
- `google-services.json` - Firebase設定
- `GoogleService-Info.plist` - iOS Firebase設定
- `*.keystore` - Android署名キー（debug除く）

### 環境変数として管理すべき情報

```bash
# API設定
REACT_APP_SUPABASE_URL=
REACT_APP_SUPABASE_ANON_KEY=
REACT_APP_GOOGLE_MAPS_API_KEY=

# 外部サービス
REACT_APP_OPENAI_API_KEY=
REACT_APP_FIREBASE_API_KEY=

# データベース
DATABASE_URL=
```

## 📋 公開前のチェックリスト

### 1. ファイルのセキュリティチェック
- [ ] `.env`ファイルが`.gitignore`に含まれている
- [ ] 機密情報を含むファイルがリポジトリに含まれていない
- [ ] ハードコードされたAPIキーがコード内にない
- [ ] `local.properties`がコミットされていない

### 2. 設定ファイルの確認
- [ ] `.env.example`が適切に設定されている
- [ ] `config/`ディレクトリに機密情報が含まれていない
- [ ] Firebase設定ファイルがexampleファイルとして提供されている

### 3. コードの確認
- [ ] ハードコードされたURL、キー、パスワードがない
- [ ] デバッグ情報や開発者のコメントが削除されている
- [ ] `console.log`による機密情報の出力がない

### 4. ドキュメントの確認
- [ ] README.mdにセキュリティ注意事項が記載されている
- [ ] セットアップ手順が明確に記載されている
- [ ] 必要な環境変数が文書化されている

## 🚨 セキュリティインシデント時の対応

もし機密情報を誤ってコミットしてしまった場合：

1. **即座にGitの履歴を修正**:
   ```bash
   git filter-branch --force --index-filter \
   'git rm --cached --ignore-unmatch path/to/sensitive/file' \
   --prune-empty --tag-name-filter cat -- --all
   ```

2. **該当するAPIキーを無効化**:
   - 影響を受けるすべてのAPIキーを即座に無効化
   - 新しいキーを生成

3. **GitHubサポートに連絡**:
   - プライベートな機密情報がキャッシュから削除されるよう依頼

## 🔐 推奨セキュリティプラクティス

### 開発時
- 実際のAPIキーは絶対にコードに直接書かない
- `.env`ファイルは常にローカルに保持
- 定期的に使用していないAPIキーを確認・削除

### デプロイ時
- 本番環境とステージング環境で異なるAPIキーを使用
- 最小権限の原則でAPIキーの権限を設定
- 定期的にAPIキーをローテーション

### チーム開発時
- 機密情報は安全な方法で共有（1Password、LastPassなど）
- 新しいチームメンバーにはセキュリティガイドラインを共有
- 定期的なセキュリティレビューの実施

## 📞 セキュリティ報告

セキュリティ上の問題を発見した場合は、公開のIssueではなく、直接メンテナーに連絡してください。

---

**注意**: このプロジェクトのセキュリティは全ての貢献者の責任です。疑問がある場合は、安全側に行動してください。 