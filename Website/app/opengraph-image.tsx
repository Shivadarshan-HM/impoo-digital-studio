import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "IMPOO Digital Studio — Luxury Wedding Photography & Cinematography in Mysore & HD Kote";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#0E0D0A",
          backgroundImage: "radial-gradient(circle at 50% 30%, #1c1813 0%, #0E0D0A 75%)",
          padding: "70px 80px",
          border: "1px solid rgba(200, 168, 107, 0.25)",
          boxSizing: "border-box",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Decorative Gold Accent Corners */}
        <div
          style={{
            position: "absolute",
            top: "28px",
            left: "28px",
            width: "36px",
            height: "36px",
            borderTop: "2px solid #C8A86B",
            borderLeft: "2px solid #C8A86B",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "28px",
            right: "28px",
            width: "36px",
            height: "36px",
            borderTop: "2px solid #C8A86B",
            borderRight: "2px solid #C8A86B",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "28px",
            left: "28px",
            width: "36px",
            height: "36px",
            borderBottom: "2px solid #C8A86B",
            borderLeft: "2px solid #C8A86B",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "28px",
            right: "28px",
            width: "36px",
            height: "36px",
            borderBottom: "2px solid #C8A86B",
            borderRight: "2px solid #C8A86B",
          }}
        />

        {/* Top Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <span
              style={{
                color: "#C8A86B",
                fontSize: "15px",
                letterSpacing: "0.35em",
                textTransform: "uppercase",
                fontWeight: 600,
              }}
            >
              ✦ EST. KARNATAKA
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              color: "#A89F92",
              fontSize: "13px",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
            }}
          >
            <span>ISO 100</span>
            <span style={{ color: "#C8A86B" }}>│</span>
            <span>F2.8</span>
            <span style={{ color: "#C8A86B" }}>│</span>
            <span>1/250</span>
          </div>
        </div>

        {/* Center Main Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            marginTop: "auto",
            marginBottom: "auto",
            gap: "16px",
          }}
        >
          <div
            style={{
              color: "#C8A86B",
              fontSize: "16px",
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              fontWeight: 500,
            }}
          >
            WE PRESERVE EMOTIONS
          </div>

          <div
            style={{
              color: "#F5F2EB",
              fontSize: "64px",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              fontWeight: 700,
              textTransform: "uppercase",
            }}
          >
            IMPOO DIGITAL STUDIO
          </div>

          <div
            style={{
              width: "80px",
              height: "2px",
              backgroundColor: "#C8A86B",
              marginTop: "8px",
              marginBottom: "8px",
            }}
          />

          <div
            style={{
              color: "#D4CEBF",
              fontSize: "24px",
              fontWeight: 300,
              letterSpacing: "0.02em",
              maxWidth: "850px",
            }}
          >
            Luxury Wedding Photography, Cinematography & Editorial Stories
          </div>
        </div>

        {/* Bottom Footer Details */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            borderTop: "1px solid rgba(245, 242, 235, 0.12)",
            paddingTop: "24px",
          }}
        >
          <div
            style={{
              color: "#A89F92",
              fontSize: "15px",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
            }}
          >
            Heggadadevanakote (HD Kote) • Mysore • Karnataka
          </div>

          <div
            style={{
              color: "#C8A86B",
              fontSize: "15px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            impodigitalstudio.com
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
