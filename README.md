# Block Puzzle Game

React Native + Expoで学習用として開発しているAndroidアプリ。テトリス風のブロック積み上げパズルゲームです。

## 概要

- **言語**: TypeScript
- **フレームワーク**: React Native + Expo
- **対象プラットフォーム**: Android（Web開発対応）
- **学習目的**: React Native、Expoを使ったモバイルゲーム開発の習得

## 機能（実装予定）

- [x] タイトル画面
  - ゲームタイトル表示
  - スタートボタン
  - ハイスコア表示（ベスト3）
  - フッター（著作権表示）
- [ ] ゲーム画面
  - 7×7グリッド表示
  - ブロック操作ロジック
  - スコア計算
  - ゲームオーバー画面
- [ ] ローカルストレージ
  - ハイスコア保存
  - ゲーム設定の保存

## プロジェクト構成

```
BlockPuzzleGame/
├── app/                    # Expoルーター（ナビゲーション）
│   ├── _layout.tsx
│   └── index.tsx           # タイトル画面
├── components/             # Reactコンポーネント
│   ├── TitleScreen.tsx
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── HighScoreList.tsx
│   └── StartButton.tsx
├── styles/                 # スタイル定義（色・タイポグラフィ・余白）
│   ├── colors.ts
│   ├── typography.ts
│   └── spacing.ts
├── types/                  # TypeScript型定義
│   └── game.ts
├── data/                   # モックデータ
│   └── mockHighScores.ts
├── hooks/                  # Reactカスタムフック
├── assets/                 # 画像・フォント等
├── package.json
└── README.md
```

## セットアップ

### 必須環境
- Node.js 18.0以上
- npm または yarn

### インストール

```bash
# リポジトリをクローン
git clone https://github.com/yourusername/BlockPuzzleGame.git
cd BlockPuzzleGame

# 依存パッケージをインストール
npm install
```

### 開発サーバーの起動

```bash
# 開発サーバーを起動
npm start

# または
expo start
```

起動後、以下のオプションで実行：
- **Web**: `w`キーを押す（推奨：学習段階）
- **Android**: `a`キーを押す（要Android Studio設定）
- **iOS**: `i`キーを押す（Macのみ）

## 学習内容

このプロジェクトを通じて学習している内容：

- [ ] React Nativeの基礎（コンポーネント、State、Props）
- [ ] Expoルーターでのナビゲーション
- [ ] StyleSheetを使ったスタイリング
- [ ] TypeScriptの型定義
- [ ] ゲームロジック実装
- [ ] ローカルストレージ操作
- [ ] コンポーネント分割設計

## 開発の進め方

1. **タイトル画面** ✅ 完了
2. **ゲーム画面基本フレーム** - 次のステップ
3. **グリッド表示とブロック操作**
4. **ゲームロジック実装**
5. **スコア計算**
6. **ハイスコア保存機能**

## ファイル説明

| ファイル | 説明 |
|---------|------|
| `styles/colors.ts` | アプリ全体の色定義を一元管理 |
| `styles/typography.ts` | フォントサイズ・太さを一元管理 |
| `styles/spacing.ts` | マージン・パディングを一元管理 |
| `types/game.ts` | TypeScript型定義（HighScoreなど） |
| `data/mockHighScores.ts` | 初期データ（モックハイスコア） |

## ライセンス

MIT License - 学習目的での使用を想定

## 注意事項

このプロジェクトはテトリス風のパズルゲームですが、以下の点に留意して開発しています：
- 独自のゲームシステム設計
- オリジナルのアート・サウンド
- 教育的な学習プロジェクトとして公開

## 参考リンク

- [React Native公式ドキュメント](https://reactnative.dev/)
- [Expo公式ドキュメント](https://docs.expo.dev/)
- [TypeScript公式](https://www.typescriptlang.org/)

---

**作成者**: hisao  
**開始日**: 2026-05-27

## 免責事項

このゲームはテトリス風のオリジナルパズルゲームです。
Tetris®は登録商標です。本プロジェクトはテトリスとは
一切関係のない独立した学習プロジェクトです。
