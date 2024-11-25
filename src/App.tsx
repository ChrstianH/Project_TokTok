import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import { useEffect } from "react";
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
// import MessagesPage from "./pages/MessagesPage";
// import InboxPage from "./pages/InboxPage";

const client = new QueryClient();

export default function App() {
  // useEffect(() => {

  //   const timer = setTimeout(() => {
  //     window.location.href = '/login';
  //   }, 3000);

  //   return () => clearTimeout(timer);
  // }, []);
  return (
    <QueryClientProvider client={client}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<LoginPage />} />
            {/* <Route path="/" element={<LoadingScreen />} /> */}
            {/* <Route path="/login" element={<LoginPage/>}/> */}
            <Route path="/signup" element={<RegisterPage />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/home" element={<HomePage />} />
              <Route path="/:userID/profile" element={<ProfilePage />} />
              {/* <Route path="/:userID/inbox" element={<InboxPage />} /> */}
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
              {/* <Route
                path="/other-profile/:profileID/messages"
                element={<MessagesPage />}
              /> */}
              <Route path="/search" element={<SearchPage />} />
              <Route path="/comments/:postId" element={<CommentsPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/" />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
