import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProtectedRoute from "./components/ProtectedRoute";
import NewPostPage from "./pages/NewPostPage";
import SearchPage from "./pages/SearchPage";
import EditProfilePage from "./pages/EditProfilePage";
import HomePage from "./pages/HomePage";
import Layout from "./components/Layout";
import OtherProfilePage from "./pages/OtherProfilePage";
import CommentsPage from "./pages/CommentsPage";
import ShowFollowerPage from "./pages/ShowFollowerPage";
import ProfilePage from "./pages/ProfilePage";
import LoadingScreen from "./components/LoadingScreen";

const client = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={client}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<LoadingScreen />} />

            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<RegisterPage />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/home" element={<HomePage />} />
              <Route path="/:userID/profile" element={<ProfilePage />} />
              <Route
                path="/:userID/edit-profile"
                element={<EditProfilePage />}
              />
              <Route path="/:userID/new-post" element={<NewPostPage />} />
              <Route
                path="/:userId/profile/follower"
                element={<ShowFollowerPage />}
              />
              <Route
                path="/other-profile/:profileID"
                element={<OtherProfilePage />}
              />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/comments/:postId" element={<CommentsPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/home" />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
