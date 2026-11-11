/* Do Zero ao App — comportamento da página. Sem dependências. */
(function () {
  "use strict";

  // Preencha antes de publicar (veja README.md). Enquanto houver "{{", o Pixel não é carregado.
  var PIXEL_ID = "{{META_PIXEL_ID}}";
  var CHAVE = "arcalabs_cookies_v1";

  var doc = document;
  doc.documentElement.classList.remove("sem-js");

  /* ---------- Consentimento ---------- */
  function lerConsent() {
    try { return window.localStorage.getItem(CHAVE); } catch (e) { return null; }
  }
  function gravarConsent(v) {
    try { window.localStorage.setItem(CHAVE, v); } catch (e) { /* sem armazenamento: pergunta de novo na próxima visita */ }
  }

  /* ---------- Pixel do Meta (só depois de aceitar) ---------- */
  var pixelPronto = false;
  function carregarPixel() {
    if (pixelPronto || PIXEL_ID.indexOf("{{") !== -1) return;
    pixelPronto = true;
    /* eslint-disable */
    !function (f, b, e, v, n, t, s) {
      if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = "2.0"; n.queue = [];
      t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    }(window, doc, "script", "https://connect.facebook.net/en_US/fbevents.js");
    /* eslint-enable */
    window.fbq("init", PIXEL_ID);
    window.fbq("track", "PageView");
  }

  var aviso = doc.getElementById("cookies");
  function fechar() { if (aviso) aviso.classList.remove("aberto"); }
  var atual = lerConsent();
  if (atual === "sim") carregarPixel();
  else if (atual !== "nao" && aviso) aviso.classList.add("aberto");

  var bSim = doc.getElementById("cookies-sim");
  var bNao = doc.getElementById("cookies-nao");
  if (bSim) bSim.addEventListener("click", function () { gravarConsent("sim"); fechar(); carregarPixel(); });
  if (bNao) bNao.addEventListener("click", function () { gravarConsent("nao"); fechar(); });

  /* ---------- Botões de compra: mantém UTMs e avisa o Pixel ---------- */
  var utms = {};
  try {
    new URLSearchParams(window.location.search).forEach(function (valor, nome) {
      if (nome.indexOf("utm_") === 0) utms[nome] = valor;
    });
  } catch (e) { /* navegador muito antigo: segue sem UTMs */ }

  var compras = doc.querySelectorAll("[data-compra]");
  Array.prototype.forEach.call(compras, function (a) {
    var href = a.getAttribute("href") || "";
    if (Object.keys(utms).length && /^https?:/i.test(href)) {
      try {
        var u = new URL(href);
        Object.keys(utms).forEach(function (k) { u.searchParams.set(k, utms[k]); });
        a.setAttribute("href", u.toString());
      } catch (e) { /* link inválido: mantém como está */ }
    }
    a.addEventListener("click", function () {
      if (pixelPronto && window.fbq) window.fbq("track", "InitiateCheckout");
    });
  });

  /* ---------- Entrada suave ao rolar ---------- */
  var itens = doc.querySelectorAll(".rev");
  var reduz = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduz || !("IntersectionObserver" in window)) {
    Array.prototype.forEach.call(itens, function (el) { el.classList.add("vis"); });
  } else {
    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("vis"); obs.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    Array.prototype.forEach.call(itens, function (el) { obs.observe(el); });
  }

  /* ---------- Ano do rodapé ---------- */
  var ano = doc.getElementById("ano");
  if (ano) ano.textContent = String(new Date().getFullYear());
})();
