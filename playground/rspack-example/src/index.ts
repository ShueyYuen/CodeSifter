import "./index.css";

document.querySelector("#root")!.innerHTML = `
<div class="content">
  <h1>Vanilla Rspack</h1>
  <!-- #if IS_PRODUCTION -->
  <p>Start building amazing things with Rspack.</p>
  <!-- #endif -->
</div>
`;
