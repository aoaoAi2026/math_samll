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

export default function App() {
  return (
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
      </Routes>
    </Router>
  );
}
