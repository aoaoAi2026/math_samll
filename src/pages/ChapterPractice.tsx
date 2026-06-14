import { Link, useParams } from 'react-router-dom';
import { Star, ChevronRight, Lock, CheckCircle, Play, BookOpen } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { getQuestionsByChapter, knowledgePoints } from '@/data/questions';
import { resolveQuestionsImages } from '@/utils/resolveQuestionImage';

export default function ChapterPractice() {
  const { grade: gradeParam, chapter: chapterParam } = useParams<{ grade: string; chapter: string }>();
  const grade = gradeParam ? parseInt(gradeParam) : 1;
  const chapter = chapterParam ? parseInt(chapterParam) : 1;
  const { userProgress } = useGameStore();

  const gradeData = knowledgePoints.find(kp => kp.grade === grade);
  const chapterData = gradeData?.chapters.find(c => c.id === chapter);
  const questions = resolveQuestionsImages(getQuestionsByChapter(grade, chapter));

  if (!chapterData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">章节不存在</div>
      </div>
    );
  }

  const prevChapterProgress = userProgress.progress[grade]?.chapters?.[chapter - 1];
  const canAccess = chapter === 1 || (prevChapterProgress && prevChapterProgress.passed);

  if (!canAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Lock className="w-16 h-16 text-white/50 mx-auto mb-4" />
          <div className="text-white text-xl mb-2">该章节未解锁</div>
          <div className="text-white/60">请先完成第{chapter - 1}章</div>
        </div>
      </div>
    );
  }

  const chapterProgress = userProgress.progress[grade]?.chapters?.[chapter];
  const questionProgress = userProgress.progress[grade]?.questions || {};
  const completedQuestions = questions.filter(q => questionProgress[q.id]?.passed).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <nav className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to={`/grade/${grade}`} className="text-white hover:text-yellow-400 transition-colors">
          <span className="text-xl font-bold">奥数闯关王</span>
        </Link>
        <div className="flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
          <span className="text-white">{userProgress.totalStars}</span>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">{grade}年级 - 第{chapter}章 {chapterData.name}</h1>
            <p className="text-white/60">{questions.length}道题目</p>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{completedQuestions}</div>
                <div className="text-white/60 text-sm">已完成</div>
              </div>
              <div className="w-px h-10 bg-white/20"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">{chapterProgress?.stars || 0} <Star className="w-5 h-5 inline fill-yellow-400" /></div>
                <div className="text-white/60 text-sm">获得星星</div>
              </div>
              <div className="w-px h-10 bg-white/20"></div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${chapterProgress?.passed ? 'text-green-400' : 'text-white'}`}>
                  {chapterProgress?.passed ? '已通关' : '进行中'}
                </div>
                <div className="text-white/60 text-sm">状态</div>
              </div>
            </div>
          </div>
          <div className="w-full bg-white/10 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${(completedQuestions / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-3">
          {questions.map((question, index) => {
            const progress = questionProgress[question.id];
            const passed = progress?.passed;
            const wrongCount = progress?.wrongCount || 0;

            return (
              <Link
                key={question.id}
                to={`/practice/${question.id}`}
                className={`relative p-3 rounded-xl border text-center transition-all duration-300 ${
                  passed 
                    ? 'bg-green-500/20 border-green-500/50' 
                    : wrongCount > 0
                      ? 'bg-red-500/20 border-red-500/50'
                      : 'bg-white/10 border-white/20 hover:border-white/40'
                }`}
              >
                <div className={`text-lg font-bold ${passed ? 'text-green-400' : wrongCount > 0 ? 'text-red-400' : 'text-white'}`}>
                  {index + 1}
                </div>
                {passed && (
                  <div className="absolute top-1 right-1">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  </div>
                )}
                <div className="flex items-center justify-center gap-0.5 mt-1">
                  {[1, 2, 3, 4].map((star) => (
                    <Star
                      key={star}
                      className={`w-2.5 h-2.5 ${star <= question.difficulty ? 'text-yellow-400 fill-yellow-400' : 'text-white/20'}`}
                    />
                  ))}
                </div>
              </Link>
            );
          })}
        </div>

        {completedQuestions < questions.length && (
          <div className="mt-8 text-center">
            <Link
              to={`/practice/${questions.find(q => !questionProgress[q.id]?.passed)?.id || questions[0].id}`}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-300"
            >
              <Play className="w-5 h-5" />
              继续学习
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
