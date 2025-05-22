"use client"

import type React from "react"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { generateJobRecommendations } from "@/lib/actions"

interface JobRecommendation {
  岗位名称: string
  行业: string
  岗位描述: string
  匹配特质: string
  优势: string
  需要掌握的技能: string
  适合人群画像: string
}

export default function CareerRecommendationSystem() {
  const [school, setSchool] = useState("四川财经职业学院")
  const [major, setMajor] = useState("")
  const [interestCode, setInterestCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showForm, setShowForm] = useState(true)
  const [jobList, setJobList] = useState<JobRecommendation[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setShowForm(false)

    try {
      const jobs = await generateJobRecommendations(school, major, interestCode)
      setJobList(jobs)
    } catch (error) {
      console.error("Failed to generate recommendations:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const prevJob = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const nextJob = () => {
    if (currentIndex < jobList.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const resetForm = () => {
    setShowForm(true)
    setJobList([])
  }

  return (
    <div className="min-h-screen bg-[#f7f9fa] py-12">
      <div className="container mx-auto max-w-[600px] rounded-2xl bg-white p-8 shadow-lg">
        <h2 className="mb-8 text-center text-2xl font-bold">智能职业推荐系统</h2>

        {showForm ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="school">学校</Label>
              <Select value={school} onValueChange={setSchool} required>
                <SelectTrigger>
                  <SelectValue placeholder="选择学校" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="四川财经职业学院">四川财经职业学院</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="major">专业</Label>
              <Select value={major} onValueChange={setMajor} required>
                <SelectTrigger>
                  <SelectValue placeholder="选择专业" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="工业互联网应用">工业互联网应用</SelectItem>
                  <SelectItem value="无人机应用技术">无人机应用技术</SelectItem>
                  <SelectItem value="智能网联汽车技术">智能网联汽车技术</SelectItem>
                  <SelectItem value="大数据技术">大数据技术</SelectItem>
                  <SelectItem value="信息安全技术应用">信息安全技术应用</SelectItem>
                  <SelectItem value="人工智能技术应用">人工智能技术应用</SelectItem>
                  <SelectItem value="财税大数据应用">财税大数据应用</SelectItem>
                  <SelectItem value="政府采购管理">政府采购管理</SelectItem>
                  <SelectItem value="财政支出绩效管理">财政支出绩效管理</SelectItem>
                  <SelectItem value="金融服务与管理">金融服务与管理</SelectItem>
                  <SelectItem value="金融科技应用">金融科技应用</SelectItem>
                  <SelectItem value="财富管理">财富管理</SelectItem>
                  <SelectItem value="大数据与财务管理">大数据与财务管理</SelectItem>
                  <SelectItem value="大数据与会计">大数据与会计</SelectItem>
                  <SelectItem value="大数据与审计">大数据与审计</SelectItem>
                  <SelectItem value="会计信息管理">会计信息管理</SelectItem>
                  <SelectItem value="市场调查与统计分析">市场调查与统计分析</SelectItem>
                  <SelectItem value="工商企业管理">工商企业管理</SelectItem>
                  <SelectItem value="市场营销">市场营销</SelectItem>
                  <SelectItem value="电子商务">电子商务</SelectItem>
                  <SelectItem value="移动商务">移动商务</SelectItem>
                  <SelectItem value="农村电子商务">农村电子商务</SelectItem>
                  <SelectItem value="商务数据分析与应用">商务数据分析与应用</SelectItem>
                  <SelectItem value="现代物流管理">现代物流管理</SelectItem>
                  <SelectItem value="酒店管理与数字化运营">酒店管理与数字化运营</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="interestCode">兴趣代码</Label>
              <Input
                id="interestCode"
                value={interestCode}
                onChange={(e) => setInterestCode(e.target.value)}
                placeholder="请输入兴趣代码"
                required
              />
            </div>

            <div className="text-center">
              <img
                src="/public/43a268f5d5ef2e8cb7a71b7f11223c4.jpg"
                alt="职业兴趣六边形"
                className="mx-auto max-w-full rounded-xl shadow-md"
              />
            </div>

            <Button type="submit" className="w-full rounded-full py-6 text-lg">
              生成推荐
            </Button>
          </form>
        ) : (
          <>
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                <p className="mt-4 text-muted-foreground">正在生成职业推荐，请稍候...</p>
              </div>
            ) : jobList.length > 0 ? (
              <div className="flex items-center justify-center">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={prevJob}
                  disabled={currentIndex === 0}
                  className="mr-2 h-12 w-12 rounded-full shadow-sm"
                >
                  <ChevronLeft className="h-6 w-6" />
                  <span className="sr-only">上一个</span>
                </Button>

                <div className="job-card-container w-full max-w-[420px] touch-pan-y">
                  <Card className="animate-fadeIn rounded-xl bg-[#f6f8fa] p-6 shadow-sm">
                    <h4 className="text-xl font-bold">{jobList[currentIndex].岗位名称}</h4>
                    <span className="mt-1 inline-block rounded-full bg-[#1890ff22] px-3 py-1 text-sm text-[#1890ff]">
                      {jobList[currentIndex].行业}
                    </span>

                    <p className="mt-4">{jobList[currentIndex].岗位描述}</p>

                    <div className="mt-6 space-y-2">
                      <div className="rounded-lg bg-[#e6f7ff] p-3">
                        <span className="font-semibold">匹配特质：</span>
                        {jobList[currentIndex].匹配特质}
                      </div>
                      <div className="rounded-lg bg-[#fffbe6] p-3">
                        <span className="font-semibold">优势：</span>
                        {jobList[currentIndex].优势}
                      </div>
                      <div className="rounded-lg bg-[#f6ffed] p-3">
                        <span className="font-semibold">需要掌握的技能：</span>
                        {jobList[currentIndex].需要掌握的技能}
                      </div>
                      <div className="rounded-lg bg-[#f0f5ff] p-3">
                        <span className="font-semibold">适合人群画像：</span>
                        {jobList[currentIndex].适合人群画像}
                      </div>
                    </div>
                  </Card>

                  <div className="mt-3 text-center text-sm text-muted-foreground">
                    {currentIndex + 1} / {jobList.length}
                  </div>

                  <div className="mt-4 text-center">
                    <Button variant="outline" onClick={resetForm} className="rounded-full">
                      重新填写
                    </Button>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={nextJob}
                  disabled={currentIndex === jobList.length - 1}
                  className="ml-2 h-12 w-12 rounded-full shadow-sm"
                >
                  <ChevronRight className="h-6 w-6" />
                  <span className="sr-only">下一个</span>
                </Button>
              </div>
            ) : (
              <div className="py-8 text-center">
                <p>未能获取到职业推荐，请重试。</p>
                <Button onClick={resetForm} className="mt-4">
                  重新填写
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
