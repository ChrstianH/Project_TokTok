import { Outlet } from "react-router-dom";

interface LayoutProps {
  containerStyle?: React.CSSProperties;
}

const Layout: React.FC<LayoutProps> = ({ containerStyle }) => {
  return (
    <div style={containerStyle}>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
