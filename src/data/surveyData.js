// アンケート調査の質問データ
export const surveyData = {
  // ブロック1: 基本情報（全員回答）
  block1: {
    title: 'Ⅰ．2025年10月現在の貴社概要をお伺いします',
    questions: [
      {
        id: 'q1',
        type: 'section',
        title: '問1：回答時点の貴社の概要',
        fields: [
          { name: 'companyName', label: '貴社名', type: 'text', required: true },
          {
            name: 'position',
            label: '役職',
            type: 'select',
            required: true,
            options: ['代表者', '役員', '部長', '課長', '係長', '担当']
          },
          { name: 'responderName', label: '担当者名', type: 'text', required: true },
          {
            name: 'gender',
            label: '回答者の性別',
            type: 'radio',
            required: true,
            options: ['男性', '女性']
          },
          { name: 'email', label: 'メールアドレス', type: 'email', required: true },
          {
            name: 'prefecture',
            label: '貴社の所在地：都道府県',
            type: 'select',
            required: true,
            options: [
              '北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県',
              '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県',
              '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県', '岐阜県',
              '静岡県', '愛知県', '三重県', '滋賀県', '京都府', '大阪府', '兵庫県',
              '奈良県', '和歌山県', '鳥取県', '島根県', '岡山県', '広島県', '山口県',
              '徳島県', '香川県', '愛媛県', '高知県', '福岡県', '佐賀県', '長崎県',
              '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県'
            ]
          }
        ]
      },
      {
        id: 'q2',
        type: 'checkbox',
        title: '問2：貴社が実施している事業内容は何ですか。該当するもの全てを選択して下さい。',
        required: true,
        options: [
          '【一般】一般自動車貨物運送事業',
          '【特積】貨物自動車運送事業',
          '【特定】貨物自動車運送事業',
          '利用運送事業',
          '貨物軽自動車運送事業'
        ],
        hasOther: true
      },
      {
        id: 'q3',
        type: 'number',
        title: '問3：貴社が保有するトラック運送事業用自動車の台数をご入力ください。（非牽引車を含める）',
        required: true,
        unit: '台'
      },
      {
        id: 'q4',
        type: 'radio',
        title: '問4：貴社では、女性ドライバーを雇用していますか。該当するもの１つを選択して下さい。',
        required: true,
        options: [
          { value: 'currently_employed', label: '現在、女性ドライバーを雇用している' },
          { value: 'previously_employed', label: '過去に女性ドライバーを雇用したことがあるが、現在は雇用していない' },
          { value: 'never_employed', label: '過去から現在まで、一度も女性ドライバーを雇用したことがない' }
        ],
        branching: true
      },
      {
        id: 'q5',
        type: 'radio',
        title: '問5：女性ドライバーの雇用の必要性や意義を感じますか。該当するもの１つを選択して下さい。',
        required: true,
        options: [
          'とても感じる',
          '少し感じる',
          'どちらでもない',
          'あまり感じない',
          '全く感じない'
        ]
      },
      {
        id: 'q6',
        type: 'radio',
        title: '問6：女性ドライバーの雇用に関する今後の予定について、該当するもの１つを選択して下さい。',
        required: true,
        options: [
          '雇用を増加させたい',
          '条件が合えば雇用したい',
          '女性の雇用に係る費用の助成金・補助金制度等があれば検討したい',
          '増加の予定はない',
          '雇用については、特に男女の区別をしていない'
        ]
      }
    ]
  },

  // ブロック2: 現在雇用している場合の質問
  block2: {
    title: 'Ⅱ．貴社の女性ドライバーの実態',
    condition: 'currently_employed',
    questions: [
      {
        id: 'b2q1',
        type: 'grid',
        title: '問1：2020年及び2025年10月現在の貴社の男女別従業員数（パート、アルバイトを含む）と、その内訳（ドライバー・その他）のおおよその人数をご入力ください。',
        required: true,
        note: '※複数従事している場合、最も多く従事しているものでカウントします。',
        rows: [
          { label: '全ドライバー（男性）', name: 'maleDrivers' },
          { label: '全ドライバー（女性）', name: 'femaleDrivers' },
          { label: '全従業員（男性）', name: 'maleEmployees' },
          { label: '全従業員（女性）', name: 'femaleEmployees' }
        ],
        columns: ['2025年度', '2020年度'],
        selectOptions: ['0'].concat(Array.from({ length: 200 }, (_, i) => `${i + 1}`))
      },
      {
        id: 'b2q2',
        type: 'select',
        title: '問2：女性ドライバーの平均在職年数について、おおよその数字をご入力ください。',
        required: true,
        options: Array.from({ length: 50 }, (_, i) => `約${i + 1}年`)
      },
      {
        id: 'b2q3',
        type: 'grid',
        title: '問3：1日当たりの運行距離別に、従事している女性ドライバーの人数をご入力ください。',
        required: true,
        note: 'なお、複数従事している場合、最も多く従事しているものでカウントします。',
        rows: [
          { label: '長距離（500km超）', name: 'longDistance' },
          { label: '中距離（200～500km）', name: 'mediumDistance' },
          { label: '近距離（50～200km）', name: 'shortDistance' },
          { label: '市内配送（100km以内）', name: 'cityDelivery' }
        ],
        columns: ['女性ドライバー人数'],
        selectOptions: ['0'].concat(Array.from({ length: 200 }, (_, i) => `${i + 1}`)),
        firstColumnLabel: '1日当たりの運行距離'
      },
      {
        id: 'b2q4',
        type: 'grid',
        title: '問4：車両別に、女性ドライバーが乗務している人数をご入力回答ください。',
        required: true,
        note: '※ 複数の種類に乗務している場合は、乗務時間が大きい方に入れてください。※複数従事している場合、最も多く従事しているものでカウントします。',
        rows: [
          { label: '軽貨物自動車', name: 'keiCargo' },
          { label: '小型車', name: 'smallTruck' },
          { label: '中型車', name: 'mediumTruck' },
          { label: '大型車', name: 'largeTruck' },
          { label: 'トレーラ', name: 'trailer' },
          { label: 'その他', name: 'otherVehicle', hasTextField: true }
        ],
        columns: ['女性ドライバー人数'],
        selectOptions: ['0'].concat(Array.from({ length: 200 }, (_, i) => `${i + 1}`))
      },
      {
        id: 'b2q5',
        type: 'grid',
        title: '問5：以下の車両形状別に、女性ドライバーが乗務している人数をご入力回答ください。',
        required: true,
        note: '※ 複数の形状に乗務している場合は、乗務時間が大きい方に入れてください。※複数従事している場合、最も多く従事しているものでカウントします。',
        rows: [
          { label: 'バン車（ウイング、冷凍冷蔵車等）', name: 'vanTruck' },
          { label: '平ボディ車', name: 'flatBody' },
          { label: 'ダンプ車', name: 'dumpTruck' },
          { label: 'ユニック車', name: 'unic' },
          { label: 'タンク車', name: 'tankTruck' },
          { label: '塵芥車', name: 'garbageTruck' },
          { label: 'セミトレーラー（その他トレーラ含む）', name: 'semiTrailer' },
          { label: 'その他', name: 'otherShape', hasTextField: true }
        ],
        columns: ['女性ドライバー人数'],
        selectOptions: ['0'].concat(Array.from({ length: 200 }, (_, i) => `${i + 1}`))
      },
      {
        id: 'b2q6',
        type: 'checkbox',
        title: '問6：女性ドライバーが取扱っている主な品目は何ですか。該当するもの全てを選択してください。',
        required: true,
        options: [
          '農水産品、林産品',
          '海上コンテナ',
          '紙・パルプ',
          '建設資材（砂利含む）',
          '金属・金属製品',
          '石油製品',
          '化学品',
          '繊維工業品',
          '日用品',
          '機械・機械部品',
          '食料品'
        ],
        hasOther: true
      },
      {
        id: 'b2q7',
        type: 'checkbox',
        title: '問7：女性ドライバーの主な積込み・取卸しに関する荷役作業について、該当するもの全てを選択してください。',
        required: true,
        options: [
          '手積み・手卸しによる荷役作業',
          'フォークリフトによる積込み・取卸し等の荷役作業',
          '車輪付きラックによる積込み・取卸し作業',
          '検品作業',
          '屋内への搬入作業',
          '荷役作業はない'
        ],
        hasOther: true
      },
      {
        id: 'b2q8',
        type: 'checkbox',
        title: '問8：採用した女性ドライバーで「必要な免許は保有していなかった」場合の対応をお聞きします。免許取得あるいは免許区分の上位免許の更新についてどのようにしましたか。',
        required: true,
        options: [
          '会社が全額負担',
          '会社が費用の一部を負担',
          '女性ドライバーがすべて自己負担で免許を取得'
        ],
        hasOther: true
      },
      {
        id: 'b2q9',
        type: 'checkbox',
        title: '問9：女性ドライバーは運転免許以外にどのような免許を取得していますか、該当するもの全てを選択してください。',
        required: true,
        options: [
          'フォークリフト',
          '危険物取扱',
          '玉掛け',
          '移動式クレーン',
          '運行管理者（貨物）'
        ],
        hasOther: true
      }
    ]
  },

  // ブロック3: 現在雇用または過去に雇用していた場合の質問
  block3: {
    title: 'Ⅲ．女性ドライバーの採用について',
    condition: ['currently_employed', 'previously_employed'],
    questions: [
      {
        id: 'b3q10',
        type: 'checkbox',
        title: '問1：貴社の女性ドライバーの採用方法について、該当するもの全てを選択してください。',
        required: true,
        options: [
          'ハローワーク',
          'インターネット求人サイト',
          '自社のホームページ',
          'ＳＮＳ（動画サイト以外）',
          'YOUTUBE、TikTokなどの動画サイト',
          '学校・教育機関（新卒者の受け入れ）',
          '社員や知人、取引先等による紹介',
          '求人誌'
        ],
        hasOther: true
      },
      {
        id: 'b3q11',
        type: 'checkbox',
        title: '問2：女性ドライバーを採用するために、工夫していることはありますか。',
        required: true,
        options: [
          '勤務希望時間帯に即した仕事を切り出し、仕事を生み出すこと',
          '女性を積極的に採用していることのアピール',
          '女性が活躍していることのアピール',
          '短時間勤務、柔軟な休暇取得可能など「働きやすさ」のアピール',
          '免許取得補助など支援・助成制度のアピール',
          '入社祝金、紹介謝礼金制度の導入',
          '会社説明会や見学会等の実施',
          'インターンシップ制度の活用など、学校との連携',
          '女性ドライバー・管理職採用に関する社内向けトイレ・休憩室等設置',
          '職場環境の整備（更衣室、トイレ、休憩室等）',
          '自社（提携）託児所の設置',
          '男性従業員への意識改革の促進',
          '産前・産後の休業取得',
          '特になし'
        ],
        hasOther: true
      },
      {
        id: 'b3q12',
        type: 'textarea',
        title: '問3：前問でお答えいただいた工夫について、特に有効と考えられる採用方法や工夫があれば、お差し支えない範囲で具体的にご入力ください。',
        required: false,
        maxLength: 500
      },
      {
        id: 'b3q13',
        type: 'checkbox',
        title: '問4：女性ドライバーの雇用によるメリット（良い点）について、該当するもの全てを選択してください。',
        required: true,
        options: [
          'コミュニケーションが円滑になり、社内の雰囲気が良くなった',
          '「荷扱いが丁寧」など、取引先から高い評価を得た',
          '人手不足の解消につながった',
          '会社のイメージが良くなった',
          '特にメリットは感じられない'
        ],
        hasOther: true
      },
      {
        id: 'b3q14',
        type: 'checkbox',
        title: '問5：女性ドライバーを雇用することで、問題をお感じですか。該当するもの全てを選択してください。',
        required: true,
        options: [
          '男女関係や派閥を作るなど、人間関係が難しくなる',
          '子どもの病気などによる急な欠勤があり、その際の代替要員の確保等が困難',
          '技能、技術、体力の不足等の理由から、作業内容が限定される',
          '職場環境（トイレ、更衣室等）の整備',
          '勤務体系を考慮する必要がある',
          'セクハラ対策を始めとする各種ハラスメント対策',
          '女性ドライバーでもあっても、男性ドライバーと変わらない（何の問題もない）'
        ],
        hasOther: true
      },
      {
        id: 'b3q15',
        type: 'textarea',
        title: '問6：前問でご回答いただいた問題について、具体的にどのようなことがありますか。また、問題解決のために取組まれている対策について、具体的にご入力ください。',
        required: false,
        maxLength: 500
      },
      {
        id: 'b3q16',
        type: 'radio',
        title: '問7：貴社では、女性ドライバーは定着している（または定着していた）と思いますか。該当するもの１つを選択してください。',
        note: 'なお、「定着傾向」にあるとは、少なくとも「１年以上勤務を継続している状態」を言います。',
        required: true,
        options: [
          '女性ドライバーは定着する傾向にある',
          '女性ドライバーは定着しない傾向にある',
          'どちらともいえない'
        ]
      },
      {
        id: 'b3q17',
        type: 'textarea',
        title: '問8：女性ドライバーの退職理由にはどのようものがありますか。',
        required: false,
        maxLength: 500
      },
      {
        id: 'b3q18',
        type: 'checkbox',
        title: '問9：女性ドライバーが定着するための取組事項として、該当するもの全てを選択してください。',
        required: true,
        options: [
          '女性管理職の起用',
          '経営トップの女性活躍に関する強いメッセージの発信',
          '職場全体での女性活躍に関する理解の促進',
          'ジェンダー平等を基本とし、女性ドライバーには採用、配置に差は設けない',
          '従業員参加型のレクリエーションの実施等、良好な人間関係づくりのサポート',
          '男女差別のない人事評価制度、賃金制度',
          '育児休業や短時間勤務などの働きやすい勤務体系',
          '柔軟な休暇取得、突発的な休暇申し出にも柔軟に対応',
          '業務の分担や軽負担化などの業務内容の見直し及び改善',
          '子供の保育施設を整備（組合、他社と協同して取組みしている場合を含む）',
          '子供の保育費用を助成',
          '女性専用トイレや更衣室などの職場環境の整備',
          'ＡＴ車やパワーゲート等女性でも操作できる車両や機械の導入',
          'セクハラ対策等管理者によるマネジメントの工夫',
          '男性ドライバーと「ツーマン運行」をさせない',
          '宿泊を伴う「長距離運行」をさせない',
          '教育・研修制度の充実',
          '何もしていない'
        ],
        hasOther: true
      },
      {
        id: 'b3q19',
        type: 'textarea',
        title: '問10：上記でご回答された社内の取組について、具体的にお教えください。',
        required: false,
        maxLength: 500
      },
      {
        id: 'b3q20',
        type: 'textarea',
        title: '問11：女性ドライバーから、日頃どのような相談、要望がありますか。',
        required: false,
        maxLength: 500
      }
    ]
  },

  // ブロック4: 全員回答
  block4: {
    title: 'Ⅳ．その他',
    questions: [
      {
        id: 'b4q1',
        type: 'checkbox',
        title: '問1：女性を採用するうえで、お悩みの事柄はありますか。該当するもの全てを選択してください。',
        required: true,
        options: [
          '両立支援のための制度整備（勤務時間、休暇等）',
          '既存の従業員の女性活用に関する理解',
          '社内及び社外でトラブルが発生した際の対応',
          '特になし'
        ],
        hasOther: true
      },
      {
        id: 'b4q2',
        type: 'checkbox',
        title: '問2：トラック運送業界における女性活躍を進めるために、経営者のお立場から望むことは何ですか。該当するもの全てを選択してください。',
        required: true,
        options: [
          '女性ドライバーによる有益性をアピールまた活躍を発信する媒体（冊子・SNS等）',
          '女性ドライバーを含むドライバー定着率向上のため女性管理職の起用',
          '女性ドライバー運行ルート上のトイレ・休憩場所問題の解決・マップ等の作成（共有する仕組み）',
          '子育てママドライバーに関する託児（社内・委託）に対する助成金・補助金制度の創設',
          '女性ドライバー・管理職採用に関する社内向けトイレ・休憩室等設置に関する各種助成金',
          'ジェンダー平等とし特に採用、配置に差は設けないこと',
          '社内でのジェンダー平等に対する勉強会やセミナーの開催',
          '男性従業員（ドライバー含む）の育児休暇の積極的な取得'
        ],
        hasOther: true
      },
      {
        id: 'b4q3',
        type: 'radio',
        title: '問3：女性活躍に対する助成金制度（厚生労働省「両立支援等助成金」等）について、該当するもの1つを選択してください。',
        required: true,
        options: [
          '制度を活用したことがある（活用している）',
          '制度は知っているが、活用したことがない',
          '制度を活用してみたいが、申請方法が複雑で、諦めている',
          'そもそも制度を知らなかった'
        ]
      },
      {
        id: 'b4q4',
        type: 'textarea',
        title: '問4：女性活躍のために、助成金をどのように活用したいと思いますか。',
        required: false,
        maxLength: 500,
        rows: 4
      },
      {
        id: 'b4q5',
        type: 'textarea',
        title: '問5：女性ドライバーの採用や人材育成について、ご意見やご要望がありましたら、自由にご入力ください。',
        required: false,
        maxLength: 500,
        rows: 6
      }
    ]
  }
};