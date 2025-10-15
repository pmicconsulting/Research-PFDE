import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import Button from '../components/common/Button'
import AccordionSection from '../components/survey/AccordionSection'
import ErrorBoundary from '../components/ErrorBoundary'
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
import ProgressBar from '../components/survey/ProgressBar'

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
  const [currentBlock, setCurrentBlock] = useState(1)

  // 自動保存機能を有効化
  const {
    lastSaveTime,
    isSaving,
    saveStatus,
    loadDraft,
    manualSave
  } = useAutoSave(formData, true)

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
  }, []) // loadDraftを依存配列から除外（初回のみ実行）

  // 各ブロックの完了状況を計算
  const calculateBlockCompletion = () => {
    const completion = {}

    // ブロック1の必須フィールドチェック
    const block1RequiredFields = ['companyName', 'position', 'responderName', 'gender', 'email', 'prefecture', 'q2', 'q3', 'q4', 'q5', 'q6']
    completion.block1 = block1RequiredFields.every(field => formData[field] && formData[field] !== '')

    // ブロック2（該当する場合）
    if (q4Answer === 'currently_employed') {
      const block2RequiredFields = ['b2q1', 'b2q2', 'b2q3', 'b2q4', 'b2q5', 'b2q6', 'b2q7', 'b2q10', 'b2q11']
      completion.block2 = block2RequiredFields.every(field => formData[field])
    }

    // ブロック3（該当する場合）
    if (q4Answer === 'currently_employed' || q4Answer === 'previously_employed') {
      const block3RequiredFields = ['b3q10', 'b3q11', 'b3q13', 'b3q14', 'b3q16', 'b3q18']
      completion.block3 = block3RequiredFields.every(field => formData[field])
    }

    // ブロック4の必須フィールドチェック
    const block4RequiredFields = ['b4q1', 'b4q2', 'b4q3', 'b4q5']
    completion.block4 = block4RequiredFields.every(field => formData[field])

    return completion
  }

  // 問の回答に基づいて表示するブロックを決定
  useEffect(() => {
    if (q4Answer === 'currently_employed') {
      setOpenSections(prev => ({ ...prev, block2: true, block3: true }))
    } else if (q4Answer === 'previously_employed' || q4Answer === 'never_employed') {
      setOpenSections(prev => ({ ...prev, block2: true, block3: true }))
    }
  }, [q4Answer])

  const handleInputChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }))

    // 問の回答を特別に処理
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
            <h4 className="font-semibold text-gray-800 mb-3">{question.title}</h4>
            {question.fields.map(field => (
              <div key={field.name}>
                {field.type === 'text' && (
                  <TextField
                    label={field.label}
                    name={field.name}
                    value={formData[field.name] || ''}
                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                    required={field.required}
                  />
                )}
                {field.type === 'email' && (
                  <TextField
                    label={field.label}
                    name={field.name}
                    type="email"
                    value={formData[field.name] || ''}
                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                    required={field.required}
                  />
                )}
                {field.type === 'select' && (
                  <SelectField
                    label={field.label}
                    name={field.name}
                    value={formData[field.name] || ''}
                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                    required={field.required}
                    options={field.options}
                  />
                )}
                {field.type === 'radio' && (
                  <RadioField
                    label={field.label}
                    name={field.name}
                    value={formData[field.name] || ''}
                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                    required={field.required}
                    options={field.options}
                  />
                )}
              </div>
            ))}
          </div>
        )

      case 'grid':
        return (
          <GridField
            label={question.title}
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
          />
        )

      case 'grid_select':
        return (
          <GridSelectField
            label={question.title}
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
        )

      default:
        return null
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (isSubmitting) return

    setIsSubmitting(true)
    console.log('=== Submit Start ===')
    console.log('Form data:', formData)
    console.log('Q4 Answer:', q4Answer)

    try {
      // Supabaseに保存
      console.log('Calling saveSurveyResponse...')
      const result = await saveSurveyResponse(formData)
      console.log('Save result:', result)

      if (result.success) {
        console.log('Survey saved successfully:', result.data)

        // メール送信
        if (formData.email) {
          console.log('=== 確認メール送信 ===')
          console.log('送信先:', formData.email)
          console.log('回答ID:', result.data.respondent_id)

          // Node.jsサーバー経由でメール送信
          sendConfirmationEmail(formData, result.data.respondent_id)
            .then(emailResult => {
              if (emailResult.success) {
                console.log('Confirmation email sent successfully')
              } else {
                console.error('Failed to send confirmation email:', emailResult.error)
              }
            })
            .catch(error => {
              console.error('Error sending email:', error)
            })
        }

        // 完了ページに回答IDを渡す
        navigate('/completion', {
          state: {
            respondentId: result.data.respondent_id,
            sessionId: result.data.session_id,
            emailSent: !!formData.email
          }
        })
      } else {
        console.error('Failed to save survey:', result.error)
        console.error('Full error object:', result)
        alert('アンケートの送信に失敗しました。もう一度お試しください。\n\nエラー: ' + result.error)
      }
    } catch (error) {
      console.error('Unexpected error:', error)
      console.error('Error stack:', error.stack)
      alert('予期しないエラーが発生しました。もう一度お試しください。\n\n' + error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  // ブロック2の表示判定（現在雇用している場合のみ）
  const shouldShowBlock2 = q4Answer === 'currently_employed'

  // ブロック3の表示判定（現在雇用または過去に雇用していた場合）
  const shouldShowBlock3 = q4Answer === 'currently_employed' || q4Answer === 'previously_employed'

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <Header />

      {/* 固定プログレスバー */}
      <div className="sticky top-0 z-50 bg-white shadow-md">
        <div className="max-w-4xl mx-auto px-4">
          <ProgressBar
            currentBlock={currentBlock}
            totalBlocks={4}
            blockCompletion={calculateBlockCompletion()}
            isSaving={isSaving}
            lastSaveTime={lastSaveTime}
            onManualSave={manualSave}
          />
        </div>
      </div>

      <main className="flex-grow py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-12">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* ブロック1: 基本情報（全員回答） */}
              <AccordionSection
                title={surveyData.block1.title}
                isOpen={openSections.block1}
                onToggle={() => {
                  toggleSection('block1')
                  setCurrentBlock(1)
                }}
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
              {shouldShowBlock2 && (
                <ErrorBoundary>
                  <AccordionSection
                    title={surveyData.block2.title}
                    isOpen={openSections.block2}
                    onToggle={() => {
                      toggleSection('block2')
                      setCurrentBlock(2)
                    }}
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
              {shouldShowBlock3 && (
                <AccordionSection
                  title={surveyData.block3.title}
                  isOpen={openSections.block3}
                  onToggle={() => {
                    toggleSection('block3')
                    setCurrentBlock(3)
                  }}
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
                onToggle={() => {
                  toggleSection('block4')
                  setCurrentBlock(4)
                }}
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
                  {isSubmitting ? '送信中...' : '回答を送信'}
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
