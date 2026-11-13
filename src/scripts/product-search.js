  const normalizeA = (s) =>
    s.toLowerCase().replace(/ß/g, "ss").normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  const normalizeB = (s) =>
    s.toLowerCase().replace(/ß/g, "ss").replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue");

  const form = document.getElementById("product-search");

  if (form) {
    const input = form.querySelector("input");
    const cards = document.querySelectorAll(".product-card");
    const noResults = document.getElementById("no-results");
    const index = Array.from(cards).map((card) => {
      const raw = card.dataset.search ?? "";
      return { card, a: normalizeA(raw), b: normalizeB(raw) };
    });

    const run = () => {
      const value = input?.value.trim() ?? "";
      const words = value.split(/\s+/).filter(Boolean);
      let visible = 0;

      index.forEach(({ card, a, b }) => {
        const match = words.every(
          (w) => a.includes(normalizeA(w)) || b.includes(normalizeB(w))
        );
        card.hidden = !match;
        if (match) visible++;
      });

      if (noResults) noResults.hidden = visible > 0;
    };

    input?.addEventListener("input", run);
    form.addEventListener("submit", (e) => e.preventDefault());
  }