import { Link, useParams } from 'react-router-dom';
import { Star, Lock, CheckCircle, BookOpen, Target, Trophy, Play, Clock } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { getKnowledgeByGrade, difficultyLabels, getTopicById } from '@/data/knowledge';
import { generateMockQuestions } from '@/utils/generateMockQuestions';
import { useState, useEffect } from 'react';

import type { Question } from '@/data/questions/types';

export default function TopicPractice() {
  const { grade: gradeParam, topicId: topicIdParam } = useParams<{ grade: string; topicId: string }>();
  const grade = gradeParam ? parseInt(gradeParam) : 1;
  const topicId = topicIdParam ? parseInt(topicIdParam) : 1;
  const { userProgress, updateQuestionProgress } = useGameStore();
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  const topic = getTopicById(grade, topicId);

  useEffect(() => {
    // 记录当前年级和知识点到 sessionStorage
    sessionStorage.setItem('lastGrade', String(grade));
    sessionStorage.setItem('lastTopicId', String(topicId));
    
    // 从后端API获取题目
    fetch(`http://localhost:3001/api/questions?grade=${grade}&topicId=${topicId}&limit=50`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        console.log('API返回数据:', data);
        if (data.questions && data.questions.length > 0) {
          // 为题目添加 chapter 字段
          const processed = data.questions.map((q: any) => ({
            ...q,
            chapter: q.chapter || topicId
          }));
          setQuestions(processed);
          // 保存所有题目到 sessionStorage 供 Practice 页面使用
          sessionStorage.setItem(`questions_${grade}_${topicId}`, JSON.stringify(processed));
        } else {
          // 如果API没有返回数据，使用mock数据
          const mockData = generateMockQuestions(grade, topicId);
          setQuestions(mockData);
          sessionStorage.setItem(`questions_${grade}_${topicId}`, JSON.stringify(mockData));
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('获取题目失败:', err);
        // 使用mock数据
        const mockData = generateMockQuestions(grade, topicId);
        setQuestions(mockData);
        sessionStorage.setItem(`questions_${grade}_${topicId}`, JSON.stringify(mockData));
        setLoading(false);
      });
  }, [grade, topicId]);

  const topicProgress = userProgress.progress[grade]?.topics?.[topicId] || { completed: 0, stars: 0 };
  const completedCount = Object.entries(userProgress.progress[grade]?.questions || {})
    .filter(([id, _]) => id.startsWith(`g${grade}t${topicId}`))
    .filter(([_, data]: [string, any]) => data.passed).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <nav className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to={`/grade/${grade}`} className="text-white hover:text-yellow-400 transition-colors">
          <span className="text-xl font-bold">奥数闯关王</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link to="/exam" className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
            <Trophy className="w-4 h-4 text-yellow-400" />
            <span className="text-white text-sm">模拟考试</span>
          </Link>
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            <span className="text-white">{userProgress.totalStars}</span>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
            topic?.difficulty === 1 ? 'bg-gradient-to-br from-green-500 to-emerald-500' :
            topic?.difficulty === 2 ? 'bg-gradient-to-br from-blue-500 to-cyan-500' :
            topic?.difficulty === 3 ? 'bg-gradient-to-br from-orange-500 to-red-500' :
            'bg-gradient-to-br from-red-600 to-pink-600'
          }`}>
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white">{topic?.name || '题型练习'}</h1>
            <p className="text-white/60">
              {grade}年级 · {topic?.description || ''} · 
              <span className={`ml-2 ${
                topic?.difficulty === 1 ? 'text-green-400' :
                topic?.difficulty === 2 ? 'text-blue-400' :
                topic?.difficulty === 3 ? 'text-orange-400' : 'text-red-400'
              }`}>
                {difficultyLabels[topic?.difficulty || 1]}
              </span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-2">
              <BookOpen className="w-5 h-5 text-blue-400" />
              <span className="text-white/60">题目数量</span>
            </div>
            <div className="text-3xl font-bold text-white">{questions.length || '加载中...'}</div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-white/60">已完成</span>
            </div>
            <div className="text-3xl font-bold text-green-400">{completedCount}</div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-2">
              <Star className="w-5 h-5 text-yellow-400" />
              <span className="text-white/60">获得星星</span>
            </div>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4].map((star) => (
                <Star
                  key={star}
                  className={`w-6 h-6 ${star <= (topicProgress.stars || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-white/30'}`}
                />
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-white text-xl">加载题目中...</div>
          </div>
        ) : questions.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-12 border border-white/20 text-center">
            <BookOpen className="w-16 h-16 text-white/30 mx-auto mb-4" />
            <div className="text-white text-xl mb-2">该题型暂无题目</div>
            <div className="text-white/60 mb-6">题目库正在更新中，敬请期待</div>
            <Link
              to={`/grade/${grade}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 rounded-xl text-white hover:bg-white/20 transition-colors"
            >
              返回年级页面
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-3 mb-8">
              {questions.map((q, index) => {
                const isCompleted = userProgress.progress[grade]?.questions?.[q.id]?.passed;
                return (
                  <Link
                      key={q.id}
                      onClick={() => {
                        sessionStorage.setItem('currentQuestion', JSON.stringify(q));
                      }}
                      to={`/practice/${q.id}`}
                      className={`p-3 rounded-xl border text-center transition-all duration-300 ${
                        isCompleted 
                          ? 'bg-green-500/20 border-green-500/50' 
                          : 'bg-white/10 border-white/20 hover:border-white/40'
                      }`}
                    >
                    <div className={`text-lg font-bold ${isCompleted ? 'text-green-400' : 'text-white'}`}>
                      {index + 1}
                    </div>
                    <div className="flex items-center justify-center gap-0.5 mt-1">
                      {[1, 2, 3, 4].map((star) => (
                        <Star
                          key={star}
                          className={`w-2 h-2 ${star <= q.difficulty ? 'text-yellow-400 fill-yellow-400' : 'text-white/20'}`}
                        />
                      ))}
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className="flex justify-center">
              <Link
                to={`/practice/${questions[0]?.id || ''}`}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-300"
              >
                <Play className="w-5 h-5" />
                开始练习
              </Link>
            </div>
          </>
        )}

        {/* 知识点详解 */}
        {topic && (
          <div className="mt-8 bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-yellow-400" />
              知识点详解
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="text-white/60 text-sm mb-1">题型名称</div>
                <div className="text-white font-medium">{topic.name}</div>
              </div>
              <div>
                <div className="text-white/60 text-sm mb-1">难度等级</div>
                <div className={`font-medium ${
                  topic.difficulty === 1 ? 'text-green-400' :
                  topic.difficulty === 2 ? 'text-blue-400' :
                  topic.difficulty === 3 ? 'text-orange-400' : 'text-red-400'
                }`}>
                  {difficultyLabels[topic.difficulty]}
                </div>
              </div>
              <div className="md:col-span-2">
                <div className="text-white/60 text-sm mb-1">题型描述</div>
                <div className="text-white">{topic.description}</div>
              </div>
              <div className="md:col-span-2">
                <div className="text-white/60 text-sm mb-1">解题技巧</div>
                <div className="text-white">
                  {topic.name.includes('和差') && '大数=(和+差)÷2，小数=(和-差)÷2'}
                  {topic.name.includes('和倍') && '1倍数=和÷(倍数+1)，多倍数=1倍数×倍数'}
                  {topic.name.includes('差倍') && '1倍数=差÷(倍数-1)'}
                  {topic.name.includes('鸡兔同笼') && '假设法：先假设全是鸡或兔'}
                  {topic.name.includes('植树') && '分清三种情况：两端种、一端种、两端不种'}
                  {topic.name.includes('相遇') && '路程和=速度和×相遇时间'}
                  {topic.name.includes('追及') && '路程差=速度差×追及时间'}
                  {topic.name.includes('等差数列') && '和=(首项+末项)×项数÷2'}
                  {topic.name.includes('工程') && '工作效率×工作时间=工作总量'}
                  {topic.name.includes('浓度') && '溶质÷溶液=浓度'}
                  {!topic.name.includes('和差') && !topic.name.includes('和倍') && !topic.name.includes('差倍') && 
                   !topic.name.includes('鸡兔同笼') && !topic.name.includes('植树') && 
                   !topic.name.includes('相遇') && !topic.name.includes('追及') && 
                   !topic.name.includes('等差数列') && !topic.name.includes('工程') && 
                   !topic.name.includes('浓度') && '分析题意，找准方法'}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

