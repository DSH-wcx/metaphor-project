import React, { useState } from 'react';

const MetaphorSystem = () => {
  const [activeTab, setActiveTab] = useState('detect');
  const [inputText, setInputText] = useState('');
  const [targetConcept, setTargetConcept] = useState('');
  const [style, setStyle] = useState('poetic');
  const [sourceCulture, setSourceCulture] = useState('chinese');
  const [targetCulture, setTargetCulture] = useState('english');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showApiInput, setShowApiInput] = useState(true);

  const tabs = [
    { id: 'detect', label: '隐喻检测', icon: '🔍', desc: '识别文本中的隐喻表达' },
    { id: 'explain', label: '隐喻解释', icon: '💡', desc: '解析隐喻的深层含义' },
    { id: 'generate', label: '隐喻生成', icon: '✨', desc: '创造新颖的隐喻表达' },
    { id: 'translate', label: '跨文化映射', icon: '🌏', desc: '转换不同文化的隐喻' },
  ];

  const styleOptions = [
    { value: 'poetic', label: '诗意风格' },
    { value: 'philosophical', label: '哲理风格' },
    { value: 'humorous', label: '幽默风格' },
    { value: 'literary', label: '文学风格' },
    { value: 'advertising', label: '广告风格' },
  ];

  const cultureOptions = [
    { value: 'chinese', label: '中文' },
    { value: 'english', label: '英文' },
    { value: 'japanese', label: '日文' },
    { value: 'french', label: '法文' },
    { value: 'spanish', label: '西班牙文' },
  ];

  const getPromptForTask = () => {
    switch (activeTab) {
      case 'detect':
        return `你是一个专业的隐喻分析专家。请分析以下文本中的隐喻表达。

文本：「${inputText}」

请按以下JSON格式返回分析结果（只返回JSON，不要其他内容）：
{
  "hasMetaphor": true,
  "metaphors": [
    {
      "expression": "具体的隐喻表达",
      "type": "隐喻类型（概念隐喻/新奇隐喻/死隐喻/拟人/通感等）",
      "sourceDomain": "源域（具象概念）",
      "targetDomain": "目标域（抽象概念）",
      "mapping": "映射关系说明",
      "creativity": 7,
      "culturalContext": "文化背景说明"
    }
  ],
  "overallAnalysis": "整体分析总结",
  "literalMeaning": "如果是字面意思的解释"
}

如果没有隐喻，返回 hasMetaphor: false`;

      case 'explain':
        return `你是一个专业的隐喻解释专家，擅长将复杂的隐喻表达转化为通俗易懂的解释。

隐喻表达：「${inputText}」

请按以下JSON格式返回解释结果（只返回JSON，不要其他内容）：
{
  "originalExpression": "原始表达",
  "literalExplanation": "字面意思解释（通俗易懂，适合非母语者）",
  "deepMeaning": "深层含义解析",
  "emotionalTone": "情感色彩",
  "usageScenarios": ["适用场景1", "适用场景2", "适用场景3"],
  "similarExpressions": ["类似表达1", "类似表达2"],
  "cognitiveMapping": {
    "sourceConcept": "源概念",
    "targetConcept": "目标概念",
    "sharedFeatures": ["共同特征1", "共同特征2"]
  },
  "exampleSentences": ["例句1", "例句2"]
}`;

      case 'generate':
        return `你是一个富有创意的隐喻创作大师。请为给定的抽象概念创造新颖、贴切的隐喻表达。

抽象概念：「${targetConcept}」
风格要求：${styleOptions.find(s => s.value === style)?.label}

请按以下JSON格式返回生成结果（只返回JSON，不要其他内容）：
{
  "concept": "目标概念",
  "metaphors": [
    {
      "expression": "隐喻表达",
      "explanation": "解释说明",
      "sourceImage": "源域意象",
      "creativityLevel": "创意等级（常规/新颖/突破性）",
      "emotionalColor": "情感色彩",
      "applicableContext": "适用语境"
    }
  ],
  "bestPick": {
    "expression": "最佳推荐表达",
    "reason": "推荐理由"
  },
  "writingTips": "使用建议"
}

请生成5个不同的隐喻表达，从常规到新奇递进。`;

      case 'translate':
        return `你是一个跨文化隐喻转换专家，精通不同语言和文化中隐喻的对应关系。

原始隐喻：「${inputText}」
源文化：${cultureOptions.find(c => c.value === sourceCulture)?.label}
目标文化：${cultureOptions.find(c => c.value === targetCulture)?.label}

请按以下JSON格式返回转换结果（只返回JSON，不要其他内容）：
{
  "originalMetaphor": "原始隐喻",
  "sourceCulture": "源文化",
  "targetCulture": "目标文化",
  "directTranslation": "直译（可能不自然）",
  "culturalEquivalents": [
    {
      "expression": "文化对等表达",
      "explanation": "解释",
      "similarityScore": 8,
      "nuanceDifference": "细微差异说明"
    }
  ],
  "culturalAnalysis": {
    "sourceWorldview": "源文化世界观",
    "targetWorldview": "目标文化世界观",
    "conceptualDifference": "概念差异分析"
  },
  "recommendation": {
    "bestChoice": "最佳选择",
    "reason": "理由"
  },
  "usageNote": "使用注意事项"
}`;

      default:
        return '';
    }
  };

  const handleAnalyze = async () => {
    if (!apiKey.trim()) {
      alert('请先输入你的 DeepSeek API Key');
      setShowApiInput(true);
      return;
    }

    if (activeTab === 'generate' && !targetConcept.trim()) {
      alert('请输入要创造隐喻的抽象概念');
      return;
    }
    if (activeTab !== 'generate' && !inputText.trim()) {
      alert('请输入要分析的文本');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          max_tokens: 2000,
          messages: [
            {
              role: 'user',
              content: getPromptForTask(),
            },
          ],
        }),
      });

      if (!response.ok) {
        let errorMessage = '请求失败';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error?.message || `HTTP ${response.status}`;
        } catch {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        
        if (response.status === 401) {
          throw new Error('API Key 无效。请检查是否正确复制了完整的 API Key。');
        } else if (response.status === 402) {
          throw new Error('账户余额不足，请到 platform.deepseek.com 充值。');
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      const text = data.choices?.[0]?.message?.content || '';
      
      // 清理并解析JSON
      const cleanJson = text.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(cleanJson);
      setResult(parsed);
    } catch (error) {
      console.error('Error:', error);
      setResult({ error: `分析过程中出现错误: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  const renderDetectResult = (data) => {
    if (!data.hasMetaphor) {
      return (
        <div className="no-metaphor">
          <span className="icon">📝</span>
          <p>未检测到隐喻表达</p>
          <p className="literal">{data.literalMeaning}</p>
        </div>
      );
    }

    return (
      <div className="detect-result">
        {data.metaphors?.map((m, i) => (
          <div key={i} className="metaphor-card">
            <div className="card-header">
              <span className="expression">「{m.expression}」</span>
              <span className="type-badge">{m.type}</span>
            </div>
            <div className="card-body">
              <div className="mapping-visual">
                <div className="domain source">
                  <span className="label">源域</span>
                  <span className="value">{m.sourceDomain}</span>
                </div>
                <div className="arrow">→</div>
                <div className="domain target">
                  <span className="label">目标域</span>
                  <span className="value">{m.targetDomain}</span>
                </div>
              </div>
              <p className="mapping-text">{m.mapping}</p>
              <div className="meta-info">
                <span className="creativity">
                  创意指数: {'★'.repeat(Math.round(m.creativity / 2))}{'☆'.repeat(5 - Math.round(m.creativity / 2))}
                </span>
                <span className="culture">{m.culturalContext}</span>
              </div>
            </div>
          </div>
        ))}
        <div className="overall-analysis">
          <h4>整体分析</h4>
          <p>{data.overallAnalysis}</p>
        </div>
      </div>
    );
  };

  const renderExplainResult = (data) => (
    <div className="explain-result">
      <div className="main-explanation">
        <div className="original">
          <span className="quote">「{data.originalExpression}」</span>
        </div>
        <div className="literal-box">
          <h4>💬 通俗解释</h4>
          <p>{data.literalExplanation}</p>
        </div>
        <div className="deep-box">
          <h4>🎯 深层含义</h4>
          <p>{data.deepMeaning}</p>
        </div>
      </div>
      
      <div className="cognitive-map">
        <h4>🧠 认知映射</h4>
        <div className="map-visual">
          <div className="concept-node source">{data.cognitiveMapping?.sourceConcept}</div>
          <div className="features">
            {data.cognitiveMapping?.sharedFeatures?.map((f, i) => (
              <span key={i} className="feature-tag">{f}</span>
            ))}
          </div>
          <div className="concept-node target">{data.cognitiveMapping?.targetConcept}</div>
        </div>
      </div>

      <div className="usage-section">
        <div className="scenarios">
          <h4>📍 适用场景</h4>
          <ul>
            {data.usageScenarios?.map((s, i) => <li key={i}>{s}</li>)}
          </ul>
        </div>
        <div className="similar">
          <h4>🔗 类似表达</h4>
          <div className="similar-tags">
            {data.similarExpressions?.map((s, i) => (
              <span key={i} className="similar-tag">{s}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="examples">
        <h4>📝 例句</h4>
        {data.exampleSentences?.map((e, i) => (
          <p key={i} className="example-sentence">• {e}</p>
        ))}
      </div>
    </div>
  );

  const renderGenerateResult = (data) => (
    <div className="generate-result">
      <div className="concept-header">
        <span className="concept-label">概念</span>
        <span className="concept-value">{data.concept}</span>
      </div>

      <div className="metaphor-list">
        {data.metaphors?.map((m, i) => (
          <div key={i} className={`generated-metaphor ${m.creativityLevel === '突破性' ? 'breakthrough' : m.creativityLevel === '新颖' ? 'novel' : ''}`}>
            <div className="metaphor-header">
              <span className="number">{i + 1}</span>
              <span className="creativity-label">{m.creativityLevel}</span>
            </div>
            <p className="metaphor-text">「{m.expression}」</p>
            <p className="metaphor-explain">{m.explanation}</p>
            <div className="metaphor-meta">
              <span className="source-image">🎨 {m.sourceImage}</span>
              <span className="emotion">💫 {m.emotionalColor}</span>
            </div>
            <p className="context">适用于：{m.applicableContext}</p>
          </div>
        ))}
      </div>

      <div className="best-pick">
        <div className="pick-header">
          <span className="crown">👑</span>
          <span>最佳推荐</span>
        </div>
        <p className="pick-expression">「{data.bestPick?.expression}」</p>
        <p className="pick-reason">{data.bestPick?.reason}</p>
      </div>

      <div className="writing-tips">
        <h4>✍️ 写作建议</h4>
        <p>{data.writingTips}</p>
      </div>
    </div>
  );

  const renderTranslateResult = (data) => (
    <div className="translate-result">
      <div className="translation-header">
        <div className="culture-flow">
          <span className="culture-badge">{data.sourceCulture}</span>
          <span className="flow-arrow">⟹</span>
          <span className="culture-badge">{data.targetCulture}</span>
        </div>
        <p className="original-metaphor">「{data.originalMetaphor}」</p>
      </div>

      <div className="direct-translation">
        <h4>📖 直译</h4>
        <p>{data.directTranslation}</p>
      </div>

      <div className="equivalents">
        <h4>🌐 文化对等表达</h4>
        {data.culturalEquivalents?.map((eq, i) => (
          <div key={i} className="equivalent-card">
            <div className="eq-header">
              <span className="eq-expression">「{eq.expression}」</span>
              <span className="similarity-score">
                相似度: {eq.similarityScore}/10
              </span>
            </div>
            <p className="eq-explanation">{eq.explanation}</p>
            <p className="eq-nuance">⚡ {eq.nuanceDifference}</p>
          </div>
        ))}
      </div>

      <div className="cultural-analysis">
        <h4>🔬 文化分析</h4>
        <div className="worldview-comparison">
          <div className="worldview source">
            <span className="wv-label">源文化视角</span>
            <p>{data.culturalAnalysis?.sourceWorldview}</p>
          </div>
          <div className="worldview target">
            <span className="wv-label">目标文化视角</span>
            <p>{data.culturalAnalysis?.targetWorldview}</p>
          </div>
        </div>
        <div className="concept-diff">
          <span className="diff-label">概念差异</span>
          <p>{data.culturalAnalysis?.conceptualDifference}</p>
        </div>
      </div>

      <div className="recommendation">
        <div className="rec-header">
          <span className="rec-icon">✅</span>
          <span>推荐使用</span>
        </div>
        <p className="rec-choice">「{data.recommendation?.bestChoice}」</p>
        <p className="rec-reason">{data.recommendation?.reason}</p>
      </div>

      <div className="usage-note">
        <h4>⚠️ 使用注意</h4>
        <p>{data.usageNote}</p>
      </div>
    </div>
  );

  const renderResult = () => {
    if (!result) return null;
    if (result.error) {
      return <div className="error-message">{result.error}</div>;
    }

    switch (activeTab) {
      case 'detect': return renderDetectResult(result);
      case 'explain': return renderExplainResult(result);
      case 'generate': return renderGenerateResult(result);
      case 'translate': return renderTranslateResult(result);
      default: return null;
    }
  };

  return (
    <div className="metaphor-system">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;500;600;700&family=ZCOOL+XiaoWei&display=swap');

        .metaphor-system {
          min-height: 100vh;
          background: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #16213e 100%);
          color: #e8e8e8;
          font-family: 'Noto Serif SC', serif;
          padding: 0;
          overflow-x: hidden;
        }

        .metaphor-system * {
          box-sizing: border-box;
        }

        /* API Key Modal */
        .api-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          backdrop-filter: blur(10px);
        }

        .api-modal-content {
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          border: 1px solid rgba(147, 112, 219, 0.3);
          border-radius: 24px;
          padding: 40px;
          max-width: 500px;
          width: 90%;
        }

        .api-modal h2 {
          color: #c9b8ff;
          margin-bottom: 20px;
          font-weight: 500;
        }

        .api-modal p {
          color: rgba(255, 255, 255, 0.6);
          margin-bottom: 20px;
          line-height: 1.6;
        }

        .api-modal a {
          color: #c9b8ff;
        }

        .api-input {
          width: 100%;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 16px 20px;
          color: #e8e8e8;
          font-family: monospace;
          font-size: 0.95rem;
          margin-bottom: 20px;
        }

        .api-input:focus {
          outline: none;
          border-color: rgba(147, 112, 219, 0.5);
        }

        .api-btn {
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, rgba(147, 112, 219, 0.8) 0%, rgba(255, 182, 193, 0.6) 100%);
          border: none;
          border-radius: 12px;
          color: #fff;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s;
        }

        .api-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(147, 112, 219, 0.3);
        }

        .api-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        /* Header */
        .header {
          text-align: center;
          padding: 60px 20px 40px;
          position: relative;
          overflow: hidden;
        }

        .header::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle at 30% 40%, rgba(147, 112, 219, 0.08) 0%, transparent 50%),
                      radial-gradient(circle at 70% 60%, rgba(255, 182, 193, 0.06) 0%, transparent 50%);
          animation: float 20s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(-20px, 20px) rotate(5deg); }
        }

        .title {
          font-family: 'ZCOOL XiaoWei', serif;
          font-size: 3.5rem;
          background: linear-gradient(135deg, #f8f8f8 0%, #c9b8ff 50%, #ffb6c1 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0 0 15px;
          position: relative;
          letter-spacing: 8px;
        }

        .subtitle {
          font-size: 1.1rem;
          color: rgba(255, 255, 255, 0.5);
          font-weight: 400;
          letter-spacing: 4px;
        }

        .change-api-btn {
          position: absolute;
          top: 20px;
          right: 20px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          padding: 8px 16px;
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.3s;
        }

        .change-api-btn:hover {
          background: rgba(255, 255, 255, 0.15);
          color: #fff;
        }

        /* Navigation */
        .nav-tabs {
          display: flex;
          justify-content: center;
          gap: 12px;
          padding: 0 20px;
          flex-wrap: wrap;
          position: relative;
          z-index: 10;
        }

        .nav-tab {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          padding: 18px 28px;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          text-align: center;
          min-width: 160px;
          backdrop-filter: blur(10px);
        }

        .nav-tab:hover {
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(147, 112, 219, 0.3);
          transform: translateY(-3px);
        }

        .nav-tab.active {
          background: linear-gradient(135deg, rgba(147, 112, 219, 0.15) 0%, rgba(255, 182, 193, 0.1) 100%);
          border-color: rgba(147, 112, 219, 0.5);
          box-shadow: 0 8px 32px rgba(147, 112, 219, 0.2);
        }

        .nav-tab .icon {
          font-size: 1.8rem;
          display: block;
          margin-bottom: 8px;
        }

        .nav-tab .label {
          font-size: 1rem;
          font-weight: 500;
          color: #e8e8e8;
        }

        .nav-tab .desc {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.4);
          margin-top: 6px;
        }

        /* Main Content */
        .main-content {
          max-width: 900px;
          margin: 50px auto;
          padding: 0 20px;
        }

        .input-section {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 24px;
          padding: 40px;
          margin-bottom: 30px;
          backdrop-filter: blur(20px);
        }

        .input-label {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.6);
          margin-bottom: 12px;
          display: block;
          letter-spacing: 2px;
        }

        .text-input {
          width: 100%;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 20px 24px;
          color: #e8e8e8;
          font-family: 'Noto Serif SC', serif;
          font-size: 1.1rem;
          line-height: 1.8;
          resize: vertical;
          min-height: 120px;
          transition: all 0.3s;
        }

        .text-input:focus {
          outline: none;
          border-color: rgba(147, 112, 219, 0.5);
          box-shadow: 0 0 30px rgba(147, 112, 219, 0.1);
        }

        .text-input::placeholder {
          color: rgba(255, 255, 255, 0.25);
        }

        .options-row {
          display: flex;
          gap: 20px;
          margin-top: 24px;
          flex-wrap: wrap;
        }

        .option-group {
          flex: 1;
          min-width: 200px;
        }

        .option-label {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.5);
          margin-bottom: 10px;
          display: block;
        }

        .select-input {
          width: 100%;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 14px 18px;
          color: #e8e8e8;
          font-family: 'Noto Serif SC', serif;
          font-size: 1rem;
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%23888' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10l-5 5z'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 15px center;
        }

        .select-input:focus {
          outline: none;
          border-color: rgba(147, 112, 219, 0.5);
        }

        .select-input option {
          background: #1a1a2e;
          color: #e8e8e8;
        }

        .analyze-btn {
          width: 100%;
          margin-top: 30px;
          padding: 20px;
          font-family: 'Noto Serif SC', serif;
          font-size: 1.15rem;
          font-weight: 500;
          color: #fff;
          background: linear-gradient(135deg, rgba(147, 112, 219, 0.8) 0%, rgba(255, 182, 193, 0.6) 100%);
          border: none;
          border-radius: 16px;
          cursor: pointer;
          transition: all 0.4s;
          letter-spacing: 4px;
          position: relative;
          overflow: hidden;
        }

        .analyze-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s;
        }

        .analyze-btn:hover::before {
          left: 100%;
        }

        .analyze-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 40px rgba(147, 112, 219, 0.3);
        }

        .analyze-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        /* Loading */
        .loading {
          text-align: center;
          padding: 60px;
        }

        .loading-spinner {
          width: 60px;
          height: 60px;
          border: 3px solid rgba(147, 112, 219, 0.1);
          border-top-color: rgba(147, 112, 219, 0.8);
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 20px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .loading-text {
          color: rgba(255, 255, 255, 0.5);
          font-size: 1rem;
          letter-spacing: 2px;
        }

        /* Result Section */
        .result-section {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 24px;
          padding: 40px;
          backdrop-filter: blur(20px);
          animation: fadeIn 0.5s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .error-message {
          text-align: center;
          color: #ff6b6b;
          padding: 40px;
        }

        /* Detect Result */
        .no-metaphor {
          text-align: center;
          padding: 40px;
        }

        .no-metaphor .icon {
          font-size: 3rem;
          display: block;
          margin-bottom: 20px;
        }

        .no-metaphor .literal {
          color: rgba(255, 255, 255, 0.5);
          margin-top: 15px;
        }

        .metaphor-card {
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 20px;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          flex-wrap: wrap;
          gap: 10px;
        }

        .expression {
          font-size: 1.3rem;
          color: #c9b8ff;
        }

        .type-badge {
          background: rgba(147, 112, 219, 0.2);
          color: #c9b8ff;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 0.85rem;
        }

        .mapping-visual {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
          margin: 25px 0;
          flex-wrap: wrap;
        }

        .domain {
          text-align: center;
          padding: 15px 25px;
          border-radius: 12px;
        }

        .domain.source {
          background: rgba(255, 182, 193, 0.1);
          border: 1px solid rgba(255, 182, 193, 0.3);
        }

        .domain.target {
          background: rgba(147, 112, 219, 0.1);
          border: 1px solid rgba(147, 112, 219, 0.3);
        }

        .domain .label {
          display: block;
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.5);
          margin-bottom: 6px;
        }

        .domain .value {
          font-size: 1.1rem;
        }

        .arrow {
          font-size: 1.5rem;
          color: rgba(255, 255, 255, 0.3);
        }

        .mapping-text {
          color: rgba(255, 255, 255, 0.7);
          line-height: 1.8;
          margin: 20px 0;
        }

        .meta-info {
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 10px;
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.5);
        }

        .creativity {
          color: #ffd700;
        }

        .overall-analysis {
          margin-top: 30px;
          padding-top: 30px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }

        .overall-analysis h4 {
          color: #c9b8ff;
          margin-bottom: 15px;
          font-weight: 500;
        }

        .overall-analysis p {
          color: rgba(255, 255, 255, 0.7);
          line-height: 1.8;
        }

        /* Explain Result */
        .explain-result h4 {
          color: #c9b8ff;
          font-weight: 500;
          margin-bottom: 12px;
        }

        .main-explanation .original {
          text-align: center;
          margin-bottom: 30px;
        }

        .quote {
          font-size: 1.5rem;
          color: #c9b8ff;
          font-style: italic;
        }

        .literal-box, .deep-box {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 20px;
        }

        .literal-box p, .deep-box p {
          color: rgba(255, 255, 255, 0.8);
          line-height: 1.8;
        }

        .cognitive-map {
          margin: 30px 0;
          padding: 30px;
          background: rgba(147, 112, 219, 0.05);
          border-radius: 16px;
        }

        .map-visual {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 30px;
          margin-top: 20px;
          flex-wrap: wrap;
        }

        .concept-node {
          padding: 15px 25px;
          border-radius: 30px;
          font-size: 1.1rem;
        }

        .concept-node.source {
          background: rgba(255, 182, 193, 0.2);
          color: #ffb6c1;
        }

        .concept-node.target {
          background: rgba(147, 112, 219, 0.2);
          color: #c9b8ff;
        }

        .features {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .feature-tag {
          background: rgba(255, 255, 255, 0.1);
          padding: 6px 12px;
          border-radius: 15px;
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.7);
        }

        .usage-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin: 30px 0;
        }

        @media (max-width: 600px) {
          .usage-section {
            grid-template-columns: 1fr;
          }
        }

        .scenarios, .similar {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 16px;
          padding: 24px;
        }

        .scenarios ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .scenarios li {
          color: rgba(255, 255, 255, 0.7);
          padding: 8px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .scenarios li:last-child {
          border-bottom: none;
        }

        .similar-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 10px;
        }

        .similar-tag {
          background: rgba(147, 112, 219, 0.15);
          color: #c9b8ff;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 0.9rem;
        }

        .examples {
          margin-top: 30px;
        }

        .example-sentence {
          color: rgba(255, 255, 255, 0.7);
          line-height: 1.8;
          padding: 10px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        /* Generate Result */
        .generate-result .concept-header {
          text-align: center;
          margin-bottom: 35px;
        }

        .concept-label {
          display: block;
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.5);
          margin-bottom: 8px;
        }

        .concept-value {
          font-size: 2rem;
          color: #c9b8ff;
        }

        .metaphor-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .generated-metaphor {
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          padding: 24px;
          transition: all 0.3s;
        }

        .generated-metaphor.novel {
          border-color: rgba(147, 112, 219, 0.3);
        }

        .generated-metaphor.breakthrough {
          border-color: rgba(255, 215, 0, 0.3);
          background: rgba(255, 215, 0, 0.03);
        }

        .metaphor-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }

        .number {
          width: 30px;
          height: 30px;
          background: rgba(147, 112, 219, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.9rem;
          color: #c9b8ff;
        }

        .creativity-label {
          font-size: 0.8rem;
          padding: 4px 12px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.7);
        }

        .breakthrough .creativity-label {
          background: rgba(255, 215, 0, 0.2);
          color: #ffd700;
        }

        .metaphor-text {
          font-size: 1.3rem;
          color: #e8e8e8;
          margin-bottom: 12px;
        }

        .metaphor-explain {
          color: rgba(255, 255, 255, 0.6);
          line-height: 1.7;
          margin-bottom: 15px;
        }

        .metaphor-meta {
          display: flex;
          gap: 20px;
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.5);
          margin-bottom: 10px;
        }

        .context {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.4);
          font-style: italic;
        }

        .best-pick {
          margin-top: 35px;
          padding: 30px;
          background: linear-gradient(135deg, rgba(255, 215, 0, 0.08) 0%, rgba(147, 112, 219, 0.08) 100%);
          border: 1px solid rgba(255, 215, 0, 0.2);
          border-radius: 16px;
        }

        .pick-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 15px;
          color: #ffd700;
          font-size: 1.1rem;
        }

        .crown {
          font-size: 1.3rem;
        }

        .pick-expression {
          font-size: 1.4rem;
          color: #e8e8e8;
          margin-bottom: 12px;
        }

        .pick-reason {
          color: rgba(255, 255, 255, 0.6);
          line-height: 1.7;
        }

        .writing-tips {
          margin-top: 30px;
          padding: 24px;
          background: rgba(0, 0, 0, 0.2);
          border-radius: 16px;
        }

        .writing-tips h4 {
          color: #c9b8ff;
          margin-bottom: 12px;
        }

        .writing-tips p {
          color: rgba(255, 255, 255, 0.7);
          line-height: 1.8;
        }

        /* Translate Result */
        .translation-header {
          text-align: center;
          margin-bottom: 35px;
        }

        .culture-flow {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 15px;
          margin-bottom: 20px;
        }

        .culture-badge {
          background: rgba(147, 112, 219, 0.2);
          color: #c9b8ff;
          padding: 8px 20px;
          border-radius: 20px;
          font-size: 0.95rem;
        }

        .flow-arrow {
          font-size: 1.5rem;
          color: rgba(255, 255, 255, 0.4);
        }

        .original-metaphor {
          font-size: 1.5rem;
          color: #e8e8e8;
        }

        .direct-translation {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 25px;
        }

        .direct-translation h4 {
          color: rgba(255, 255, 255, 0.6);
          margin-bottom: 12px;
        }

        .direct-translation p {
          color: rgba(255, 255, 255, 0.8);
          font-size: 1.1rem;
        }

        .equivalents h4 {
          color: #c9b8ff;
          margin-bottom: 20px;
        }

        .equivalent-card {
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 15px;
        }

        .eq-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          flex-wrap: wrap;
          gap: 10px;
        }

        .eq-expression {
          font-size: 1.2rem;
          color: #e8e8e8;
        }

        .similarity-score {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.5);
        }

        .eq-explanation {
          color: rgba(255, 255, 255, 0.7);
          line-height: 1.7;
          margin-bottom: 12px;
        }

        .eq-nuance {
          font-size: 0.9rem;
          color: rgba(255, 182, 193, 0.8);
        }

        .cultural-analysis {
          margin: 30px 0;
          padding: 30px;
          background: rgba(147, 112, 219, 0.05);
          border-radius: 16px;
        }

        .cultural-analysis h4 {
          color: #c9b8ff;
          margin-bottom: 20px;
        }

        .worldview-comparison {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 25px;
        }

        @media (max-width: 600px) {
          .worldview-comparison {
            grid-template-columns: 1fr;
          }
        }

        .worldview {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 12px;
          padding: 20px;
        }

        .wv-label {
          display: block;
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.5);
          margin-bottom: 10px;
        }

        .worldview p {
          color: rgba(255, 255, 255, 0.7);
          line-height: 1.7;
        }

        .concept-diff {
          padding-top: 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }

        .diff-label {
          display: block;
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.5);
          margin-bottom: 10px;
        }

        .concept-diff p {
          color: rgba(255, 255, 255, 0.7);
          line-height: 1.7;
        }

        .recommendation {
          background: linear-gradient(135deg, rgba(0, 200, 83, 0.08) 0%, rgba(147, 112, 219, 0.08) 100%);
          border: 1px solid rgba(0, 200, 83, 0.2);
          border-radius: 16px;
          padding: 30px;
          margin-bottom: 25px;
        }

        .rec-header {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #00c853;
          margin-bottom: 15px;
          font-size: 1.1rem;
        }

        .rec-icon {
          font-size: 1.3rem;
        }

        .rec-choice {
          font-size: 1.3rem;
          color: #e8e8e8;
          margin-bottom: 12px;
        }

        .rec-reason {
          color: rgba(255, 255, 255, 0.6);
          line-height: 1.7;
        }

        .usage-note {
          background: rgba(255, 193, 7, 0.05);
          border: 1px solid rgba(255, 193, 7, 0.2);
          border-radius: 16px;
          padding: 24px;
        }

        .usage-note h4 {
          color: #ffc107;
          margin-bottom: 12px;
        }

        .usage-note p {
          color: rgba(255, 255, 255, 0.7);
          line-height: 1.7;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .title {
            font-size: 2.2rem;
            letter-spacing: 4px;
          }

          .nav-tabs {
            gap: 8px;
          }

          .nav-tab {
            min-width: 140px;
            padding: 14px 20px;
          }

          .input-section, .result-section {
            padding: 25px;
          }

          .options-row {
            flex-direction: column;
          }
        }
      `}</style>

      {showApiInput && (
        <div className="api-modal">
          <div className="api-modal-content">
            <h2>🔑 设置 API Key</h2>
            <p>
              请输入你的 DeepSeek API Key 以使用本系统。
              <br />
              获取 API Key：<a href="https://platform.deepseek.com/api_keys" target="_blank" rel="noopener noreferrer">platform.deepseek.com</a>
            </p>
            <input
              type="password"
              className="api-input"
              placeholder="sk-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <button
              className="api-btn"
              onClick={() => apiKey.trim() && setShowApiInput(false)}
              disabled={!apiKey.trim()}
            >
              确认并开始使用
            </button>
          </div>
        </div>
      )}

      <header className="header">
        <h1 className="title">隐喻之镜</h1>
        <p className="subtitle">METAPHOR UNDERSTANDING & GENERATION</p>
        {!showApiInput && (
          <button className="change-api-btn" onClick={() => setShowApiInput(true)}>
            更换 API Key
          </button>
        )}
      </header>

      <nav className="nav-tabs">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => {
              setActiveTab(tab.id);
              setResult(null);
            }}
          >
            <span className="icon">{tab.icon}</span>
            <span className="label">{tab.label}</span>
            <span className="desc">{tab.desc}</span>
          </div>
        ))}
      </nav>

      <main className="main-content">
        <div className="input-section">
          {activeTab === 'generate' ? (
            <>
              <label className="input-label">输入抽象概念</label>
              <textarea
                className="text-input"
                placeholder="例如：时间、爱情、孤独、希望、成长..."
                value={targetConcept}
                onChange={(e) => setTargetConcept(e.target.value)}
              />
              <div className="options-row">
                <div className="option-group">
                  <label className="option-label">选择风格</label>
                  <select
                    className="select-input"
                    value={style}
                    onChange={(e) => setStyle(e.target.value)}
                  >
                    {styleOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          ) : activeTab === 'translate' ? (
            <>
              <label className="input-label">输入隐喻表达</label>
              <textarea
                className="text-input"
                placeholder="例如：光阴似箭、岁月如梭、时间就是金钱..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
              <div className="options-row">
                <div className="option-group">
                  <label className="option-label">源文化</label>
                  <select
                    className="select-input"
                    value={sourceCulture}
                    onChange={(e) => setSourceCulture(e.target.value)}
                  >
                    {cultureOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="option-group">
                  <label className="option-label">目标文化</label>
                  <select
                    className="select-input"
                    value={targetCulture}
                    onChange={(e) => setTargetCulture(e.target.value)}
                  >
                    {cultureOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          ) : (
            <>
              <label className="input-label">
                {activeTab === 'detect' ? '输入要分析的文本' : '输入隐喻表达'}
              </label>
              <textarea
                className="text-input"
                placeholder={
                  activeTab === 'detect'
                    ? '输入一段文字，系统将自动识别其中的隐喻表达...'
                    : '输入一个隐喻表达，获取详细解释...'
                }
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
            </>
          )}

          <button
            className="analyze-btn"
            onClick={handleAnalyze}
            disabled={loading}
          >
            {loading ? '分析中...' : tabs.find((t) => t.id === activeTab)?.label}
          </button>
        </div>

        {loading && (
          <div className="loading">
            <div className="loading-spinner" />
            <p className="loading-text">正在深度分析...</p>
          </div>
        )}

        {result && !loading && (
          <div className="result-section">{renderResult()}</div>
        )}
      </main>
    </div>
  );
};

export default MetaphorSystem;
