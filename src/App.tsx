import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { useEffect } from "react";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import ProtectedRoute from "./components/ProtectedRoute";
import NewPostPage from "./pages/NewPostPage";
import SearchPage from "./pages/SearchPage";
import EditProfilePage from "./pages/EditProfilePage";
import HomePage from "./pages/HomePage";
import Layout from "./components/Layout";

const client = new QueryClient();

const containerStyle: React.CSSProperties = {
  width: "60%",
  margin: "0 auto",
  height: "100vh",
};

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
          <Route path="/" element={<Layout containerStyle={containerStyle} />}>
            <Route index element={<LoginPage />} />
            {/* <Route path="/" element={<LoadingScreen />} /> */}
            {/* <Route path="/login" element={<LoginPage/>}/> */}
            <Route path="/signup" element={<RegisterPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/:userID/profile" element={<ProfilePage />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/:userID/add-post" element={<NewPostPage />} />
              <Route
                path="/:userID/edit-profile"
                element={<EditProfilePage />}
              />
            </Route>
            <Route path="/search" element={<SearchPage />} />

            <Route path="*" element={<Navigate to="/" />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
