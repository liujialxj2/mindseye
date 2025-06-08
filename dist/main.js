// 这是一个测试文件，用于确认部署是否正常
console.log("Mindseye 网站已成功加载！");
document.addEventListener("DOMContentLoaded", () => {
  const root = document.getElementById("root");
  if (root) {
    root.innerHTML = `
      <div style="text-align: center; padding: 50px;">
        <h1>Mindseye 网站测试页面</h1>
        <p>如果您看到此页面，说明基本部署已成功，但可能存在其他问题。</p>
        <img src="/images/logo.webp" alt="Mindseye Logo" style="max-width: 200px;">
        <div style="margin-top: 20px;">
          <h2>测试图片加载：</h2>
          <img src="/images/screenshots/screenshot1.jpg" alt="Screenshot 1" style="max-width: 300px; margin: 10px;">
          <img src="/images/screenshots/screenshot2.jpg" alt="Screenshot 2" style="max-width: 300px; margin: 10px;">
        </div>
      </div>
    `;
  }
}); 