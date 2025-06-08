// Test file to verify deployment is working correctly
console.log("Mindseye website loaded successfully!");
document.addEventListener("DOMContentLoaded", () => {
  const root = document.getElementById("root");
  if (root) {
    root.innerHTML = `
      <div style="text-align: center; padding: 50px;">
        <h1>Mindseye Website Test Page</h1>
        <p>If you're seeing this page, basic deployment is working but there might be other issues.</p>
        <img src="/images/logo.webp" alt="Mindseye Logo" style="max-width: 200px;">
        <div style="margin-top: 20px;">
          <h2>Testing Image Loading:</h2>
          <img src="/images/screenshots/screenshot1.jpg" alt="Screenshot 1" style="max-width: 300px; margin: 10px;">
          <img src="/images/screenshots/screenshot2.jpg" alt="Screenshot 2" style="max-width: 300px; margin: 10px;">
        </div>
      </div>
    `;
  }
}); 