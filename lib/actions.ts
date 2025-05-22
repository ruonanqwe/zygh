"use server"

interface JobRecommendation {
  岗位名称: string
  行业: string
  岗位描述: string
  匹配特质: string
  优势: string
  需要掌握的技能: string
  适合人群画像: string
}

// AI models to try in sequence if one fails
const AI_MODELS = [
  { model: "Qwen/QwQ-32B" },
  { model: "Qwen/Qwen3-8B" },
  { model: "THUDM/GLM-Z1-9B-0414" },
  { model: "deepseek-ai/DeepSeek-R1-Distill-Qwen-7B" },
]

// API key and URL for SiliconFlow API
const API_KEY = "sk-yvsmejuumtbmcluteqsgvdntauhdnujthocvluzdtbnuecqu"
const API_URL = "https://api.siliconflow.cn/v1/chat/completions"

/**
 * Try to generate job recommendations using a specific AI model
 */
async function tryGenerateWithModel(
  model: string,
  school: string,
  major: string,
  interestCode: string,
): Promise<JobRecommendation[] | null> {
  const systemPrompt = `你是一个职业生涯分析专家，请根据用户的学校、专业、兴趣代码，推荐10个最适合的职业，并严格按照如下JSON数组格式返回：\n[\n  {\n    "岗位名称": "",\n    "行业": "",\n    "岗位描述": "",\n    "匹配特质": "",\n    "优势": "",\n    "需要掌握的技能": "",\n    "适合人群画像": ""\n  }\n  // ...共10个\n]\n只返回JSON数组，不要有多余解释。`
  const userPrompt = `我的学校：${school}\n我的专业：${major}\n我的兴趣代码：${interestCode}`

  const body = {
    model,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    stream: false,
    max_tokens: 2048,
    temperature: 0.7,
    top_p: 0.7,
    top_k: 50,
    frequency_penalty: 0.5,
    n: 1,
    response_format: { type: "text" },
  }

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      throw new Error(`API request failed with status ${res.status}`)
    }

    const data = await res.json()
    const reply = data.choices?.[0]?.message?.content || ""

    try {
      const jobs = JSON.parse(reply)
      if (Array.isArray(jobs) && jobs.length > 0) {
        return jobs
      }
      return null
    } catch (e) {
      console.error("Failed to parse JSON response:", e)
      return null
    }
  } catch (err) {
    console.error(`Error with model ${model}:`, err)
    return null
  }
}

/**
 * Generate job recommendations by trying multiple AI models in sequence
 */
export async function generateJobRecommendations(
  school: string,
  major: string,
  interestCode: string,
): Promise<JobRecommendation[]> {
  for (const { model } of AI_MODELS) {
    console.log(`Trying to generate with model: ${model}`)
    const result = await tryGenerateWithModel(model, school, major, interestCode)

    if (result && Array.isArray(result) && result.length > 0) {
      return result
    }
  }

  // If all models fail, return an empty array
  return []
}
