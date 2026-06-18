import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import GradeSelect from "@/pages/GradeSelect";
import TopicPractice from "@/pages/TopicPractice";
import Practice from "@/pages/Practice";
import Exam from "@/pages/Exam";
import Platforms from "@/pages/Platforms";
import QuickPractice from "@/pages/QuickPractice";
import ExamQuestions from "@/pages/ExamQuestions";
import WrongQuestions from "@/pages/WrongQuestions";
import AdventureMap from "@/pages/AdventureMap";
import AdventureStage from "@/pages/AdventureStage";
import LearningCenter from "@/pages/LearningCenter";
import LearnTopic from "@/pages/LearnTopic";
import SpeedCalc from "@/pages/SpeedCalc";
import Report from "@/pages/Report";
import SettingsPage from "@/pages/Settings";
import Leaderboard from "@/pages/Leaderboard";
import { useEffect } from "react";
import { initSound } from "@/utils/sound";
import { ThemeProvider } from "@/components/ThemeProvider";

export default function App() {
  // 全局点击初始化/恢复音效（浏览器要求用户手势后才能播放声音）
  useEffect(() => {
    const handler = () => { initSound(); };
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, []);

  return (
    <ThemeProvider>
      <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/grade" element={<GradeSelect />} />
        <Route path="/grade/:grade" element={<GradeSelect />} />
        <Route path="/topic/:grade/:topicId" element={<TopicPractice />} />
        <Route path="/practice/:id" element={<Practice />} />
        <Route path="/exam" element={<Exam />} />
        <Route path="/platforms" element={<Platforms />} />
        <Route path="/practice" element={<QuickPractice />} />
        <Route path="/exam-questions" element={<ExamQuestions />} />
        <Route path="/wrong-questions" element={<WrongQuestions />} />
        <Route path="/adventure" element={<AdventureMap />} />
        <Route path="/adventure/stage/:stageId" element={<AdventureStage />} />
        <Route path="/learn" element={<LearningCenter />} />
        <Route path="/learn/:grade" element={<LearningCenter />} />
        <Route path="/learn/:grade/:topicId" element={<LearnTopic />} />
        <Route path="/speed-calc" element={<SpeedCalc />} />
        <Route path="/report" element={<Report />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>
    </Router>
    </ThemeProvider>
  );
}
