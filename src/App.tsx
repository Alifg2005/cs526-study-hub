import { Route, Routes } from "react-router";
import { Layout } from "./components/Layout";
import { HomePage } from "./pages/HomePage";
import { LecturePage } from "./pages/LecturePage";
import { QuizPage } from "./pages/QuizPage";
import { EssayPrepPage } from "./pages/EssayPrepPage";
import { NotFoundPage } from "./pages/NotFoundPage";

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="lectures/:slug" element={<LecturePage />} />
        <Route path="lectures/:slug/quiz" element={<QuizPage />} />
        <Route path="essays" element={<EssayPrepPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
