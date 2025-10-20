import questionAnswers from '../data/questionAnswers.json';

/**
 * 質問に対する回答を取得するサービス
 * 現在はモック実装、後でOpenAI APIに置き換え
 */
class AIQuestionService {
  constructor() {
    this.faq = questionAnswers.faq;
  }

  /**
   * JSONファイルから関連する回答を検索
   */
  searchFromJSON(questionId, userQuestion) {
    // 質問IDに基づいて特定の回答を検索
    for (const category of Object.values(this.faq)) {
      const answer = category.find(item => {
        // 質問IDが一致するか確認
        if (item.questionId === questionId) {
          return true;
        }
        // キーワードマッチング
        if (item.keywords && item.keywords.some(keyword =>
          userQuestion.includes(keyword)
        )) {
          return true;
        }
        return false;
      });

      if (answer) {
        return answer.answer;
      }
    }
    return null;
  }

  /**
   * モック回答を生成（後でOpenAI APIに置き換え）
   */
  async generateMockAnswer(questionText, userQuestion) {
    // ランダムな遅延を追加（API呼び出しをシミュレート）
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

    // モック回答のパターン
    const mockAnswers = [
      `「${questionText.substring(0, 20)}...」についてのご質問ですね！\n\nこの設問は、貴社の状況を把握するための重要な項目です。\n\n具体的には、現在の実態に最も近い選択肢をお選びください。不明な場合は、おおよその内容で構いませんよ。\n\n何か他にご不明な点があれば、お気軽に質問してくださいね！`,

      `ご質問ありがとうございます！\n\n「${userQuestion}」について説明しますね。\n\nこの項目は、女性ドライバーの雇用促進に関する調査の一環として重要な情報となります。\n\n正確な数値が分からない場合は、概算でも構いませんので、現状に最も近いものをお答えください。\n\n他にも疑問点があれば、遠慮なくお聞きくださいね！`,

      `なるほど、その点について疑問をお持ちなのですね。\n\nこの設問は、トラック運送業界の現状を正確に把握するためのものです。\n\n回答に迷われる場合は、以下の点を参考にしてください：\n・現在の実態を基準に考える\n・将来の計画ではなく現状を回答\n・不明な場合は「その他」を選択可能\n\n少しでもお役に立てれば嬉しいです！`
    ];

    // ランダムにモック回答を選択
    const randomIndex = Math.floor(Math.random() * mockAnswers.length);
    return mockAnswers[randomIndex];
  }

  /**
   * 質問に対する回答を取得
   */
  async getAnswer(questionId, questionText, userQuestion) {
    try {
      // まずJSONから検索
      const jsonAnswer = this.searchFromJSON(questionId, userQuestion);
      if (jsonAnswer) {
        // トラガールの口調で回答を調整
        return `${jsonAnswer}\n\n他にも気になることがあれば、遠慮なく聞いてくださいね！`;
      }

      // JSONに回答がない場合はモック回答を生成
      // 後でここをOpenAI API呼び出しに置き換え
      const mockAnswer = await this.generateMockAnswer(questionText, userQuestion);
      return mockAnswer;

    } catch (error) {
      console.error('回答取得エラー:', error);
      throw new Error('回答の取得に失敗しました');
    }
  }

  /**
   * OpenAI APIを使用した回答生成（実装準備）
   * TODO: APIキーが用意されたら実装
   */
  async generateAIAnswer(questionText, userQuestion) {
    // OpenAI API実装予定
    // const response = await openai.chat.completions.create({
    //   model: "gpt-3.5-turbo",
    //   messages: [
    //     {
    //       role: "system",
    //       content: "あなたは「トラガール」という女性トラックドライバーです。..."
    //     },
    //     {
    //       role: "user",
    //       content: `設問: ${questionText}\n質問: ${userQuestion}`
    //     }
    //   ]
    // });
    // return response.choices[0].message.content;

    return this.generateMockAnswer(questionText, userQuestion);
  }
}

// シングルトンインスタンスをエクスポート
export default new AIQuestionService();