"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Logo from "@/components/Logo";
import { generateBirthdayImage } from "@/lib/generate-image";

export default function BirthdayClient({ chart, requestedDate }) {
  const searchParams = useSearchParams();
  const name = searchParams.get("name");
  const [shareUrl, setShareUrl] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const url = `${window.location.origin}/birthday/${requestedDate}${
      name ? `?name=${encodeURIComponent(name)}` : ""
    }`;
    setShareUrl(url);
  }, [requestedDate, name]);

  const downloadImage = async () => {
    setIsDownloading(true);
    try {
      const screenshot = await generateBirthdayImage(requestedDate, name);

      const blob = new Blob([screenshot], { type: "image/png" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `top-10-${requestedDate}${name ? `-${name}` : ""}.png`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error downloading image:", err);
      alert("Failed to download image");
    } finally {
      setIsDownloading(false);
    }
  };

  const birthDate = new Date(requestedDate + "T00:00:00");
  const birthFormatted = birthDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const shareText = `Check out the Hot 100 from my birthday: ${birthFormatted}${
    name ? ` - ${name}` : ""
  }`;

  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Shareable Image Preview */}
        <div
          data-chart="birthday"
          className="border-4 border-slate-900 bg-yellow-50 p-6 md:p-8 mb-8"
          style={{ transform: "none" }}
        >
          {/* Header Section with Logo */}
          <div
            style={{
              border: "4px solid #0f172a",
              backgroundColor: "#0f172a",
              color: "#fef3c7",
              padding: "24px",
              textAlign: "center",
              marginBottom: "32px",
            }}
          >
            {/* Logo Component */}
            <div
              style={{
                marginBottom: "16px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <div style={{ color: "#fef3c7" }}>
                <Logo className="text-2xl" />
              </div>
            </div>

            <h1
              style={{
                fontSize: "60px",
                fontWeight: "900",
                letterSpacing: "-0.02em",
                margin: "0 0 16px 0",
                color: "#ffffff",
              }}
            >
              TOP 10
            </h1>
            <div
              style={{
                fontSize: "16px",
                fontWeight: "900",
                borderTop: "2px solid #fcd34d",
                paddingTop: "12px",
                marginTop: "12px",
                color: "#ffffff",
              }}
            >
              <div
                style={{
                  fontSize: "14px",
                  marginBottom: "12px",
                  color: "#fcd34d",
                  fontWeight: "700",
                  letterSpacing: "0.05em",
                }}
              >
                HITS THE DAY YOU WERE BORN
              </div>
              <div
                style={{
                  fontSize: "18px",
                  fontWeight: "900",
                  marginBottom: "8px",
                }}
              >
                {birthFormatted.toUpperCase()}
              </div>
              {name && (
                <div
                  style={{
                    display: "inline-block",
                    backgroundColor: "#eed200",
                    color: "#000000",
                    padding: "4px 16px",
                    borderRadius: "9999px",
                    fontSize: "16px",
                    fontWeight: "600",
                    marginTop: "8px",
                  }}
                >
                  ❤️ {name}&apos;s Birthday
                </div>
              )}
            </div>
          </div>

          {/* Chart Table - 2 columns */}
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginBottom: "32px",
            }}
          >
            <tbody>
              {Array.from({ length: 5 }).map((_, rowIdx) => (
                <tr key={rowIdx} style={{ display: "table-row" }}>
                  {/* Left Column */}
                  <td
                    style={{
                      width: "50%",
                      paddingRight: "16px",
                      paddingBottom: "20px",
                      verticalAlign: "top",
                    }}
                  >
                    {chart.entries[rowIdx * 2] && (
                      <>
                        <div
                          style={{
                            display: "flex",
                            gap: "12px",
                            alignItems: "flex-start",
                            marginBottom: "12px",
                          }}
                        >
                          <div
                            style={{
                              width: "48px",
                              height: "48px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              border: "2px solid #0f172a",
                              backgroundColor: "#0f172a",
                              color: "#fef3c7",
                              fontWeight: "900",
                              fontSize: "18px",
                              flexShrink: 0,
                            }}
                          >
                            {chart.entries[rowIdx * 2].position}
                          </div>
                          <div style={{ flexGrow: 1 }}>
                            <h3
                              style={{
                                fontWeight: "900",
                                fontSize: "18px",
                                textTransform: "uppercase",
                                color: "#0f172a",
                                margin: 0,
                                lineHeight: "1.2",
                              }}
                            >
                              {chart.entries[rowIdx * 2].title}
                            </h3>
                            <p
                              style={{
                                fontSize: "15px",
                                color: "#1e293b",
                                fontWeight: "bold",
                                margin: "6px 0 0 0",
                              }}
                            >
                              {chart.entries[rowIdx * 2].artist}
                            </p>
                          </div>
                        </div>
                        <div
                          style={{
                            borderBottom: "2px solid #0f172a",
                            paddingBottom: "20px",
                          }}
                        />
                      </>
                    )}
                  </td>

                  {/* Right Column */}
                  <td
                    style={{
                      width: "50%",
                      paddingLeft: "16px",
                      paddingBottom: "20px",
                      verticalAlign: "top",
                    }}
                  >
                    {chart.entries[rowIdx * 2 + 1] && (
                      <>
                        <div
                          style={{
                            display: "flex",
                            gap: "12px",
                            alignItems: "flex-start",
                            marginBottom: "12px",
                          }}
                        >
                          <div
                            style={{
                              width: "48px",
                              height: "48px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              border: "2px solid #0f172a",
                              backgroundColor: "#0f172a",
                              color: "#fef3c7",
                              fontWeight: "900",
                              fontSize: "18px",
                              flexShrink: 0,
                            }}
                          >
                            {chart.entries[rowIdx * 2 + 1].position}
                          </div>
                          <div style={{ flexGrow: 1 }}>
                            <h3
                              style={{
                                fontWeight: "900",
                                fontSize: "18px",
                                textTransform: "uppercase",
                                color: "#0f172a",
                                margin: 0,
                                lineHeight: "1.2",
                              }}
                            >
                              {chart.entries[rowIdx * 2 + 1].title}
                            </h3>
                            <p
                              style={{
                                fontSize: "15px",
                                color: "#1e293b",
                                fontWeight: "bold",
                                margin: "6px 0 0 0",
                              }}
                            >
                              {chart.entries[rowIdx * 2 + 1].artist}
                            </p>
                          </div>
                        </div>
                        <div
                          style={{
                            borderBottom: "2px solid #0f172a",
                            paddingBottom: "20px",
                          }}
                        />
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Footer */}
          <div
            style={{
              borderTop: "4px solid #0f172a",
              paddingTop: "16px",
              textAlign: "center",
              fontSize: "14px",
              color: "#1e293b",
              fontWeight: "900",
              margin: 0,
            }}
          >
            <p style={{ margin: 0 }}>PopHits.org</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 max-w-2xl mx-auto">
          <button
            onClick={downloadImage}
            disabled={isDownloading}
            className="bg-slate-900 text-white hover:text-amber-400 disabled:opacity-50 font-black py-4 hover:bg-slate-800 border-3 border-slate-900 transition-all uppercase tracking-wide"
          >
            {isDownloading ? "Generating..." : "Download Image"}
          </button>

          {shareUrl && (
            <>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                  shareText
                )}&url=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-900 text-white hover:text-amber-400 font-black py-4 text-center hover:bg-slate-800 border-3 border-slate-900 transition-all uppercase tracking-wide"
              >
                Share on X
              </a>

              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                  shareUrl
                )}&quote=${encodeURIComponent(shareText)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-900 text-white hover:text-amber-400 font-black py-4 text-center hover:bg-slate-800 border-3 border-slate-900 transition-all uppercase tracking-wide"
              >
                Share on Facebook
              </a>
            </>
          )}
        </div>

        {/* Links */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">

          <Link
            href="/birthday"
            className="inline-block text-slate-900 hover:text-slate-800 font-cherry line text-lg"
          >
            Try Another Birthday
          </Link>
        </div>
      </div>
    </div>
  );
}
