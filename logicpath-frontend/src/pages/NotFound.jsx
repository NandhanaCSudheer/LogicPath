import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: "100vh", background: "#eef5f9", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
        textAlign: "center"
      }}>
        <div style={{
          fontSize: "80px",
          fontWeight: "900",
          color: "#0c2945",
          letterSpacing: "-2px",
          lineHeight: "1"
        }}>
          404
        </div>
        <h2 style={{ color: "#102d4a", marginTop: "16px", marginBottom: "8px" }}>
          Logic Route Not Found
        </h2>
        <p style={{ color: "#6a8296", maxWidth: "420px", marginBottom: "25px", fontSize: "14px" }}>
          The path you are trying to simulate does not exist in this digital logic network.
        </p>
        <button
          onClick={() => navigate("/dashboard")}
          style={{
            background: "#079bbb",
            color: "white",
            border: "none",
            padding: "12px 26px",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: "700",
            cursor: "pointer"
          }}
        >
          Return to Dashboard →
        </button>
      </div>
    </div>
  );
}

export default NotFound;
