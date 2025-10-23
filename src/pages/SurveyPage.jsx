import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import Button from '../components/common/Button'
import AccordionSection from '../components/survey/AccordionSection'
import ErrorBoundary from '../components/ErrorBoundary'
import SurveyCompanion from '../components/SurveyCompanion'
import {
  TextField,
  SelectField,
  RadioField,
  CheckboxField,
  NumberField,
  TextAreaField,
  GridField,
  GridSelectField
} from '../components/survey/FormFields'
import { surveyData } from '../data/surveyData'
import { saveSurveyResponse } from '../services/surveyService'
import { sendConfirmationEmail } from '../services/emailService'
import { useAutoSave } from '../hooks/useAutoSave'

const SurveyPage = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [openSections, setOpenSections] = useState({
    block1: true,
    block2: true,
    block3: true,
    block4: true
  })
  const [q4Answer, setQ4Answer] = useState('')


  // 自動保存機能を有効化
  const {
    loadDraft
  } = useAutoSave(formData, true)

  // ブロック表示判定関数
  const shouldShowBlock2 = () => q4Answer === 'currently_employed'
  const shouldShowBlock3 = () => q4Answer === 'currently_employed' || q4Answer === 'previously_employed'

  // 進捗計算
  const calculateProgress = useMemo(() => {
    // 全質問リスト（条件付き質問も含む）
    const allQuestions = [
      ...surveyData.block1.questions,
      ...(shouldShowBlock2() ? surveyData.block2.questions : []),
      ...(shouldShowBlock3() ? surveyData.block3.questions : []),
      ...surveyData.block4.questions
    ]

    // 各質問の回答状況をチェック
    let answered = 0
    allQuestions.forEach(question => {
      const value = formData[question.id]
      if (value !== undefined && value !== null && value !== '') {
        // 値が存在すればカウント
        if (typeof value === 'object' && !Array.isArray(value)) {
          // グリッド型などのオブジェクトの場合、何か値があればカウント
          if (Object.keys(value).length > 0) {
            answered++
          }
        } else if (Array.isArray(value)) {
          // 配列の場合（checkbox等）
          if (value.length > 0) {
            answered++
          }
        } else {
          answered++
        }
      }
    })

    const total = allQuestions.length
    const progress = total > 0 ? Math.round((answered / total) * 100) : 0

    return { progress, totalQuestions: total, answeredQuestions: answered }
  }, [formData, q4Answer])

  // 現在のブロック判定
  const getCurrentBlock = () => {
    const scrollPosition = window.scrollY
    const windowHeight = window.innerHeight
    const documentHeight = document.documentElement.scrollHeight

    // スクロール位置に基づいてブロックを判定
    const scrollPercentage = (scrollPosition / (documentHeight - windowHeight)) * 100

    if (scrollPercentage < 25) return 1
    if (scrollPercentage < 50) return 2
    if (scrollPercentage < 75) return 3
    return 4
  }

  const [currentBlock, setCurrentBlock] = useState(1)

  // スクロール監視
  useEffect(() => {
    const handleScroll = () => {
      setCurrentBlock(getCurrentBlock())
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // 初回ロード時に下書きを読み込む
  useEffect(() => {
    const initializeDraft = async () => {
      const draft = await loadDraft()
      if (draft) {
        setFormData(draft)
        // q4の回答も復元
        if (draft.q4) {
          setQ4Answer(draft.q4)
        }
      }
    }
    initializeDraft()
  }, [])

  const handleInputChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // q4の回答を特別に追跡
    if (name === 'q4') {
      setQ4Answer(value)
    }
  }

  const handleCheckboxChange = (name, option) => {
    setFormData(prev => {
      const currentValues = prev[name] || []
      if (currentValues.includes(option)) {
        return { ...prev, [name]: currentValues.filter(v => v !== option) }
      }
      return { ...prev, [name]: [...currentValues, option] }
    })
  }

  const toggleSection = (sectionId) => {
    setOpenSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }))
  }


  const renderField = (question) => {
    const value = formData[question.id] || ''

    const fieldElement = (() => {
      switch (question.type) {
        case 'text':
        case 'email':
          return (
            <TextField
              label={question.title}
              name={question.id}
              type={question.type}
              value={value}
              onChange={(e) => handleInputChange(question.id, e.target.value)}
              required={question.required}
              placeholder={question.placeholder}
              note={question.note}
            />
          )

        case 'select':
          return (
            <SelectField
              label={question.title}
              name={question.id}
              value={value}
              onChange={(e) => handleInputChange(question.id, e.target.value)}
              required={question.required}
              options={question.options}
            />
          )

        case 'radio':
          return (
            <RadioField
              label={question.title}
              name={question.id}
              value={value}
              onChange={(e) => handleInputChange(question.id, e.target.value)}
              required={question.required}
              options={question.options}
              note={question.note}
              hasHtml={question.hasHtml}
            />
          )

        case 'checkbox':
          return (
            <CheckboxField
              label={question.title}
              name={question.id}
              values={formData[question.id] || []}
              onChange={(option) => handleCheckboxChange(question.id, option)}
              required={question.required}
              options={question.options}
              hasOther={question.hasOther}
              otherValue={formData[`${question.id}_other`]}
              onOtherChange={(e) => handleInputChange(`${question.id}_other`, e.target.value)}
            />
          )

        case 'number':
          return (
            <NumberField
              label={question.title}
              name={question.id}
              value={value}
              onChange={(e) => handleInputChange(question.id, e.target.value)}
              required={question.required}
              unit={question.unit}
            />
          )

        case 'textarea':
          return (
            <TextAreaField
              label={question.title}
              name={question.id}
              value={value}
              onChange={(e) => handleInputChange(question.id, e.target.value)}
              required={question.required}
              maxLength={question.maxLength}
            />
          )

        case 'section':
          return (
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-800">{question.title}</h4>
              {question.fields.map(field => (
                <div key={field.name}>
                  {/* Section内のフィールド処理（簡略版） */}
                  {renderSectionField(field)}
                </div>
              ))}
            </div>
          )

        case 'grid':
          return (
            <div>
              <span className="block font-medium text-gray-700 mb-2">{question.title}</span>
              <GridField
                label=""
                name={question.id}
                rows={question.rows}
                columns={question.columns}
                values={formData[question.id] || {}}
                onChange={(rowName, colIndex, value) => {
                  setFormData(prev => ({
                    ...prev,
                    [question.id]: {
                      ...prev[question.id],
                      [rowName]: {
                        ...prev[question.id]?.[rowName],
                        [colIndex]: value
                      }
                    }
                  }))
                }}
                onOtherTextChange={(rowName, value) => {
                  setFormData(prev => ({
                    ...prev,
                    [question.id]: {
                      ...prev[question.id],
                      [`${rowName}_text`]: value
                    }
                  }))
                }}
                required={question.required}
                type={question.selectOptions ? 'select' : 'number'}
                selectOptions={question.selectOptions}
                firstColumnLabel={question.firstColumnLabel}
                note={question.note}
              />
            </div>
          )

        case 'grid_select':
          return (
            <div>
              <span className="block font-medium text-gray-700 mb-2">{question.title}</span>
              <GridSelectField
                label=""
                name={question.id}
                rows={question.rows}
                values={formData[question.id] || {}}
                onChange={(rowName, value) => {
                  setFormData(prev => ({
                    ...prev,
                    [question.id]: {
                      ...prev[question.id],
                      [rowName]: value
                    }
                  }))
                }}
                required={question.required}
                note={question.note}
                options={question.options}
              />
            </div>
          )

        default:
          return null
      }
    })()

    return fieldElement
  }

  // セクション内フィールドの簡略レンダリング
  const renderSectionField = (field) => {
    switch (field.type) {
      case 'text':
      case 'email':
        return (
          <TextField
            label={field.label}
            name={field.name}
            type={field.type || 'text'}
            value={formData[field.name] || ''}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            required={field.required}
          />
        )
      case 'select':
        return (
          <SelectField
            label={field.label}
            name={field.name}
            value={formData[field.name] || ''}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            required={field.required}
            options={field.options}
          />
        )
      case 'radio':
        return (
          <RadioField
            label={field.label}
            name={field.name}
            value={formData[field.name] || ''}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            required={field.required}
            options={field.options}
          />
        )
      default:
        return null
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (isSubmitting) return

    setIsSubmitting(true)

    try {
      // デバッグモード（開発環境のみ）
      if (process.env.NODE_ENV === 'development') {
        console.log('送信開始 - formData:', formData)
      }

      // Supabaseに保存
      const result = await saveSurveyResponse(formData)

      if (process.env.NODE_ENV === 'development') {
        console.log('送信結果:', result)
      }

      if (result.success) {
        // メール送信
        if (formData.email) {
          try {
            await sendConfirmationEmail(formData.email, result.respondentId)
          } catch (emailError) {
            console.error('メール送信エラー:', emailError)
          }
        }

        // 完了ページへ遷移
        navigate('/completion', {
          state: {
            respondentId: result.respondentId,
            email: formData.email
          }
        })
      } else {
        console.error('送信失敗:', result.error)
        alert(`送信に失敗しました: ${result.error || '不明なエラー'}`)
      }
    } catch (error) {
      console.error('送信エラー - 詳細:', error)
      alert(`送信中にエラーが発生しました: ${error.message || '不明なエラー'}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <Header />

      {/* サーベイコンパニオン（伴走キャラクター） */}
      <SurveyCompanion
        progress={calculateProgress.progress}
        currentBlock={currentBlock}
        totalQuestions={calculateProgress.totalQuestions}
        answeredQuestions={calculateProgress.answeredQuestions}
      />

      <main className="flex-grow py-6 sm:py-12 px-2 sm:px-4 pb-20 sm:pb-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-8 md:p-12">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* ブロック1: 基本情報（全員回答） */}
              <AccordionSection
                title={surveyData.block1.title}
                isOpen={openSections.block1}
                onToggle={() => toggleSection('block1')}
              >
                <div className="space-y-6">
                  {surveyData.block1.questions.map(question => (
                    <div key={question.id}>
                      {renderField(question)}
                    </div>
                  ))}
                </div>
              </AccordionSection>

              {/* ブロック2: 現在雇用している場合 */}
              {shouldShowBlock2() && (
                <ErrorBoundary>
                  <AccordionSection
                    title={surveyData.block2.title}
                    isOpen={openSections.block2}
                    onToggle={() => toggleSection('block2')}
                    disabled={!q4Answer}
                  >
                    <div className="space-y-6">
                      {surveyData.block2.questions.map(question => (
                        <div key={question.id}>
                          <ErrorBoundary>
                            {renderField(question)}
                          </ErrorBoundary>
                        </div>
                      ))}
                    </div>
                  </AccordionSection>
                </ErrorBoundary>
              )}

              {/* ブロック3: 雇用していない場合 */}
              {shouldShowBlock3() && (
                <AccordionSection
                  title={surveyData.block3.title}
                  isOpen={openSections.block3}
                  onToggle={() => toggleSection('block3')}
                  disabled={!q4Answer}
                >
                  <div className="space-y-6">
                    {surveyData.block3.questions.map(question => (
                      <div key={question.id}>
                        {renderField(question)}
                      </div>
                    ))}
                  </div>
                </AccordionSection>
              )}

              {/* ブロック4: その他（全員回答） */}
              <AccordionSection
                title={surveyData.block4.title}
                isOpen={openSections.block4}
                onToggle={() => toggleSection('block4')}
              >
                <div className="space-y-6">
                  {surveyData.block4.questions.map(question => (
                    <div key={question.id}>
                      {renderField(question)}
                    </div>
                  ))}
                </div>
              </AccordionSection>

              <div className="flex gap-4 pt-6">
                <Button variant="secondary" onClick={() => navigate('/')} disabled={isSubmitting}>
                  戻る
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? '送信中...' : '送信する'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default SurveyPage