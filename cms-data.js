(async function () {
  async function cargar(ruta) {
    try {
      const respuesta = await fetch(ruta, { cache: "no-store" });
      if (!respuesta.ok) return {};
      return await respuesta.json();
    } catch (e) {
      console.warn("No se pudo cargar", ruta, e);
      return {};
    }
  }

  const hotel = await cargar("/contenido/datos-hotel.json");
  const bienvenida = await cargar("/contenido/bienvenida.json");
  const calificar = await cargar("/contenido/calificar.json");
  const datos = { ...hotel, ...bienvenida, ...calificar };

  document.querySelectorAll("[data-cms]").forEach(el => {
    const clave = el.dataset.cms;
    if (datos[clave] !== undefined && datos[clave] !== "") {
      el.textContent = datos[clave];
    }
  });

  document.querySelectorAll("[data-cms-href]").forEach(el => {
    const clave = el.dataset.cmsHref;
    let valor = datos[clave];
    if (!valor) return;
    if (clave === "whatsapp_recepcion") valor = "https://wa.me/" + String(valor).replace(/\D/g, "");
    el.setAttribute("href", valor);
  });

  document.querySelectorAll("[data-cms-template]").forEach(el => {
    const t = el.dataset.cmsTemplate;
    const h = hotel;

    const plantillas = {
      "wifi-a-red": () => `Red: ${h.wifi_casa_a || ""}.`,
      "wifi-a-clave": () => `Clave: ${h.clave_wifi_casa_a || ""}`,
      "wifi-b": () => `${h.wifi_casa_b || "Todas las redes de Casa B"}: Clave: ${h.clave_wifi_casa_b || ""}`,
      "checkin": () => `Tu habitación estará disponible a partir de las ${h.checkin || ""}.`,
      "checkout": () => `La hora de salida es hasta las ${h.checkout || ""}.`,
      "desayuno-horario": () => `Todos los días de ${h.horario_desayuno || ""}.`,
      "desayuno-servicio": () => `El desayuno se sirve en ${h.lugar_desayuno || "Chuska Cocina"} de ${h.horario_desayuno || ""}, para que puedas comenzar el día con calma antes de recorrer Villa de Leyva.`,
      "cafe-servicio": () => h.estacion_cafe || "",
      "parqueadero-servicio": () => h.parqueadero || "",
      "pregunta-checkin": () => `El check-in es a partir de las ${h.checkin || ""}.`,
      "pregunta-checkout": () => `El check-out es hasta las ${h.checkout || ""}.`,
      "pregunta-desayuno": () => `El desayuno se sirve en ${h.lugar_desayuno || "Chuska Cocina"} de ${h.horario_desayuno || ""}.`,
      "politica-fumar": () => h.politica_fumar || ""
    };

    if (plantillas[t]) {
      const valor = plantillas[t]();
      if (valor) el.textContent = valor;
    }
  });
})();
