import { useState, useMemo } from "react";
import { ShieldCheck, ShieldAlert, ShieldX, Loader2, Search, Globe } from "lucide-react";

const LANGUAGES = [
  { code: "ro", label: "Română", flag: "🇷🇴" },
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "it", label: "Italiano", flag: "🇮🇹" },
];

const UI = {
  ro: {
    eyebrow: "Proiect în dezvoltare — demo funcțional",
    subtitle: "Colegul tău de încredere care verifică mesajele, email-urile și SMS-urile suspecte înainte să te păcălească. Lipește un text mai jos și vezi cum funcționează.",
    inspection: "INSPECȚIE MESAJ",
    caseNr: "DOSAR NR.",
    placeholder: "Lipește aici textul SMS-ului, email-ului sau mesajului primit...",
    btnAnalyze: "Inspectează mesajul",
    btnLoading: "Se inspectează...",
    confidence: "Încredere în verdict:",
    signals: "Semnale de alarmă",
    explanation: "Explicație",
    error: "Analiza nu a putut fi finalizată. Verifică textul și încearcă din nou.",
    noExplanation: "Nu a fost furnizată o explicație.",
    noRecommendation: "Verifică direct cu instituția menționată, prin canale oficiale.",
    examples: [
      { eticheta: "SMS bancă", text: "ALERTĂ: Contul tău bancar a fost restricționat din motive de securitate. Confirmă identitatea în următoarele 2 ore: banca-verificare-cont.com/login, altfel contul va fi închis definitiv." },
      { eticheta: "Email premiu", text: "Felicitări! Adresa ta de email a fost selectată câștigătoare a unui iPhone 15 Pro în cadrul extragerii din 2026. Trimite numele complet, adresa și un cod de livrare de 49 RON în 24 de ore." },
      { eticheta: "Livrare colet", text: "Coletul tău nu a putut fi livrat din cauza unei taxe vamale neachitate de 7.99 RON. Achită aici pentru reprogramare: livrare-taxe.ro/plata" },
    ],
    verdicts: { sigur: "SIGUR", suspect: "SUSPECT", frauda: "FRAUDĂ" },
  },
  en: {
    eyebrow: "Project in development — functional demo",
    subtitle: "Your trusted companion that checks suspicious messages, emails and texts before they fool you. Paste a message below and see how it works.",
    inspection: "MESSAGE INSPECTION",
    caseNr: "CASE NO.",
    placeholder: "Paste the SMS, email or message you received here...",
    btnAnalyze: "Inspect message",
    btnLoading: "Inspecting...",
    confidence: "Confidence:",
    signals: "Warning signals",
    explanation: "Explanation",
    error: "Analysis could not be completed. Check the text and try again.",
    noExplanation: "No detailed explanation was provided.",
    noRecommendation: "Contact the mentioned institution directly through official channels.",
    examples: [
      { eticheta: "Bank SMS", text: "ALERT: Your bank account has been restricted for security reasons. Confirm your identity within 2 hours: secure-bank-verify.com/login or your account will be permanently closed." },
      { eticheta: "Prize email", text: "Congratulations! Your email was selected as the winner of an iPhone 15 Pro in the 2026 draw. To claim your prize, send your full name, address and a delivery code of $9.99 within 24 hours." },
      { eticheta: "Parcel delivery", text: "Your parcel could not be delivered due to an unpaid customs fee of $2.99. Pay here to reschedule: delivery-fees-tracking.com/pay" },
    ],
    verdicts: { sigur: "SAFE", suspect: "SUSPICIOUS", frauda: "FRAUD" },
  },
  fr: {
    eyebrow: "Projet en développement — démo fonctionnelle",
    subtitle: "Votre compagnon de confiance qui vérifie les messages, emails et SMS suspects avant qu'ils ne vous piègent. Collez un texte ci-dessous et voyez comment ça fonctionne.",
    inspection: "INSPECTION DU MESSAGE",
    caseNr: "DOSSIER N°",
    placeholder: "Collez ici le texte du SMS, de l'email ou du message reçu...",
    btnAnalyze: "Inspecter le message",
    btnLoading: "Inspection en cours...",
    confidence: "Confiance dans le verdict :",
    signals: "Signaux d'alarme",
    explanation: "Explication",
    error: "L'analyse n'a pas pu être finalisée. Vérifiez le texte et réessayez.",
    noExplanation: "Aucune explication détaillée fournie.",
    noRecommendation: "Contactez directement l'institution mentionnée via les canaux officiels.",
    examples: [
      { eticheta: "SMS banque", text: "ALERTE : Votre compte bancaire a été restreint pour des raisons de sécurité. Confirmez votre identité dans les 2 heures : banque-verification-compte.com/login sinon votre compte sera définitivement fermé." },
      { eticheta: "Email prix", text: "Félicitations ! Votre adresse email a été sélectionnée gagnante d'un iPhone 15 Pro lors du tirage 2026. Pour réclamer votre prix, envoyez vos nom, adresse et un code de livraison de 9,99€ sous 24h." },
      { eticheta: "Livraison colis", text: "Votre colis n'a pas pu être livré en raison de frais de douane impayés de 2,99€. Payez ici pour reprogrammer : livraison-frais-suivi.com/payer" },
    ],
    verdicts: { sigur: "SÛR", suspect: "SUSPECT", frauda: "FRAUDE" },
  },
  de: {
    eyebrow: "Projekt in Entwicklung — funktionale Demo",
    subtitle: "Ihr vertrauenswürdiger Begleiter, der verdächtige Nachrichten, E-Mails und SMS prüft, bevor sie Sie täuschen. Fügen Sie unten einen Text ein und sehen Sie, wie es funktioniert.",
    inspection: "NACHRICHTENPRÜFUNG",
    caseNr: "FALL NR.",
    placeholder: "Fügen Sie hier den Text der SMS, E-Mail oder Nachricht ein...",
    btnAnalyze: "Nachricht prüfen",
    btnLoading: "Wird geprüft...",
    confidence: "Konfidenz:",
    signals: "Warnsignale",
    explanation: "Erklärung",
    error: "Die Analyse konnte nicht abgeschlossen werden. Prüfen Sie den Text und versuchen Sie es erneut.",
    noExplanation: "Keine detaillierte Erklärung angegeben.",
    noRecommendation: "Wenden Sie sich direkt über offizielle Kanäle an die genannte Institution.",
    examples: [
      { eticheta: "Bank-SMS", text: "ALERT: Ihr Bankkonto wurde aus Sicherheitsgründen gesperrt. Bestätigen Sie Ihre Identität innerhalb von 2 Stunden: bank-konto-verify.com/login, sonst wird Ihr Konto dauerhaft geschlossen." },
      { eticheta: "Gewinn-Email", text: "Herzlichen Glückwunsch! Ihre E-Mail-Adresse wurde als Gewinnerin eines iPhone 15 Pro bei der Ziehung 2026 ausgewählt. Um Ihren Preis zu beanspruchen, senden Sie Ihren vollständigen Namen, Adresse und einen Lieferkode von 9,99€ innerhalb von 24 Stunden." },
      { eticheta: "Paketlieferung", text: "Ihr Paket konnte aufgrund unbezahlter Zollgebühren von 2,99€ nicht geliefert werden. Zahlen Sie hier für eine Neuterminierung: paket-zoll-tracking.com/zahlen" },
    ],
    verdicts: { sigur: "SICHER", suspect: "VERDÄCHTIG", frauda: "BETRUG" },
  },
  es: {
    eyebrow: "Proyecto en desarrollo — demo funcional",
    subtitle: "Tu compañero de confianza que verifica mensajes, correos y SMS sospechosos antes de que te engañen. Pega un texto abajo y ve cómo funciona.",
    inspection: "INSPECCIÓN DE MENSAJE",
    caseNr: "EXPEDIENTE N°",
    placeholder: "Pega aquí el texto del SMS, correo o mensaje recibido...",
    btnAnalyze: "Inspeccionar mensaje",
    btnLoading: "Inspeccionando...",
    confidence: "Confianza en el veredicto:",
    signals: "Señales de alarma",
    explanation: "Explicación",
    error: "El análisis no pudo completarse. Verifica el texto e inténtalo de nuevo.",
    noExplanation: "No se proporcionó explicación detallada.",
    noRecommendation: "Contacta directamente con la institución mencionada a través de canales oficiales.",
    examples: [
      { eticheta: "SMS banco", text: "ALERTA: Tu cuenta bancaria ha sido restringida por razones de seguridad. Confirma tu identidad en las próximas 2 horas: banco-verificacion-cuenta.com/login o tu cuenta será cerrada definitivamente." },
      { eticheta: "Email premio", text: "¡Felicitaciones! Tu dirección de email fue seleccionada ganadora de un iPhone 15 Pro en el sorteo 2026. Para reclamar tu premio, envía tu nombre completo, dirección y un código de envío de 9,99€ en 24 horas." },
      { eticheta: "Entrega paquete", text: "Tu paquete no pudo ser entregado por tasas aduaneras impagadas de 2,99€. Paga aquí para reprogramar: entrega-tasas-seguimiento.com/pagar" },
    ],
    verdicts: { sigur: "SEGURO", suspect: "SOSPECHOSO", frauda: "FRAUDE" },
  },
  it: {
    eyebrow: "Progetto in sviluppo — demo funzionale",
    subtitle: "Il tuo compagno di fiducia che verifica messaggi, email e SMS sospetti prima che ti ingannino. Incolla un testo qui sotto e scopri come funziona.",
    inspection: "ISPEZIONE MESSAGGIO",
    caseNr: "FASCICOLO N°",
    placeholder: "Incolla qui il testo dell'SMS, dell'email o del messaggio ricevuto...",
    btnAnalyze: "Ispeziona messaggio",
    btnLoading: "Ispezione in corso...",
    confidence: "Fiducia nel verdetto:",
    signals: "Segnali di allarme",
    explanation: "Spiegazione",
    error: "L'analisi non ha potuto essere completata. Controlla il testo e riprova.",
    noExplanation: "Nessuna spiegazione dettagliata fornita.",
    noRecommendation: "Contatta direttamente l'istituzione menzionata tramite i canali ufficiali.",
    examples: [
      { eticheta: "SMS banca", text: "ALLERTA: Il tuo conto bancario è stato limitato per motivi di sicurezza. Conferma la tua identità entro 2 ore: banca-verifica-conto.com/login altrimenti il conto verrà chiuso definitivamente." },
      { eticheta: "Email premio", text: "Congratulazioni! Il tuo indirizzo email è stato selezionato come vincitore di un iPhone 15 Pro nell'estrazione del 2026. Per riscattare il premio, invia nome completo, indirizzo e un codice di spedizione di 9,99€ entro 24 ore." },
      { eticheta: "Consegna pacco", text: "Il tuo pacco non ha potuto essere consegnato a causa di tasse doganali non pagate di 2,99€. Paga qui per riprogrammare: consegna-tasse-tracking.com/pagare" },
    ],
    verdicts: { sigur: "SICURO", suspect: "SOSPETTO", frauda: "TRUFFA" },
  },
};

function buildSystemPrompt(langCode) {
  const langNames = { ro: "Romanian", en: "English", fr: "French", de: "German", es: "Spanish", it: "Italian" };
  const lang = langNames[langCode] || "English";
  return `You are an expert cybersecurity analyst specialised in identifying scam, phishing and fraud messages (SMS, email, WhatsApp, social media).

You analyse the text submitted by the user and determine how likely it is to be fraudulent. You look for signals such as: artificial urgency, spelling mistakes or awkward translations, suspicious links or domains, requests for personal/financial data, unrealistic rewards, impersonation of institutions (banks, couriers, authorities), sender addresses that do not match the claimed institution.

Respond STRICTLY with a JSON object, no extra text, no explanations outside the JSON, no code fences. Exact structure:

{"verdict": "sigur" | "suspect" | "frauda", "incredere": <integer 0-100>, "semnale": [<max 5 short strings>], "explicatie": "<2-3 clear sentences>", "recomandare": "<one sentence with what the person should do>"}

IMPORTANT: All text values (semnale, explicatie, recomandare) MUST be written in ${lang}. The keys remain exactly as shown above.`;
}

function curatText(raw) {
  return raw.replace(/```json|```/g, "").trim();
}

export default function ScamGuard() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [dosarNr, setDosarNr] = useState(1);
  const [lang, setLang] = useState("ro");
  const [langOpen, setLangOpen] = useState(false);

  const t = UI[lang];

  const wavePaths = useMemo(() => {
    const paths = [];
    for (let i = 0; i < 14; i++) {
      const amplitude = 10 + (i % 4) * 5;
      const wavelength = 70 + ((i * 13) % 60);
      const phase = i * 0.45;
      const yBase = i * 15 + 10;
      let d = `M 0 ${yBase}`;
      for (let x = 0; x <= 800; x += 10) {
        const y = yBase + amplitude * Math.sin((x / wavelength) * Math.PI * 2 + phase);
        d += ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
      }
      paths.push(d);
    }
    return paths;
  }, []);

  async function inspecteaza() {
    if (!text.trim() || loading) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          systemPrompt: buildSystemPrompt(lang),
        })
      });
      if (!response.ok) throw new Error("request-failed");
      const data = await response.json();
      const blocText = data.content.find((b) => b.type === "text");
      if (!blocText) throw new Error("no-text");
      const parsed = JSON.parse(curatText(blocText.text));
      setResult(parsed);
      setDosarNr((n) => n + 1);
    } catch (e) {
      setError(t.error);
    } finally {
      setLoading(false);
    }
  }

  function incarcaExemplu(ex) {
    setText(ex.text);
    setResult(null);
    setError(null);
  }

  function selectLang(code) {
    setLang(code);
    setLangOpen(false);
    setResult(null);
    setError(null);
  }

  const verdictConfig = {
    sigur:   { label: t.verdicts.sigur,   color: "var(--stamp-green)", Icon: ShieldCheck },
    suspect: { label: t.verdicts.suspect, color: "var(--stamp-amber)", Icon: ShieldAlert },
    frauda:  { label: t.verdicts.frauda,  color: "var(--stamp-red)",   Icon: ShieldX },
  };

  const vc = result ? verdictConfig[result.verdict] || verdictConfig.suspect : null;
  const currentLang = LANGUAGES.find((l) => l.code === lang);

  return (
    <div className="scamguard-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Mono:wght@400;700&family=IBM+Plex+Mono:wght@400;500&display=swap');

        .scamguard-root {
          --paper: #EAEDE6;
          --paper-line: #C9CEC2;
          --card: #F4F5F0;
          --ink: #1B2A4A;
          --ink-soft: #57626F;
          --stamp-red: #A8362B;
          --stamp-amber: #A6791F;
          --stamp-green: #3B6B4A;
          --accent-line: #8B93A1;
          background: var(--paper);
          color: var(--ink);
          font-family: 'Inter', -apple-system, sans-serif;
          min-height: 100%;
          position: relative;
        }
        .scamguard-root * { box-sizing: border-box; }
        .sg-mono { font-family: 'IBM Plex Mono', monospace; }
        .sg-display { font-family: 'Space Mono', monospace; }

        /* Language switcher */
        .sg-lang-bar {
          display: flex;
          justify-content: flex-end;
          padding: 10px 20px 0;
          position: relative;
          z-index: 100;
        }
        .sg-lang-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: var(--card);
          border: 1px solid var(--paper-line);
          border-radius: 3px;
          padding: 6px 12px;
          font-size: 12px;
          color: var(--ink-soft);
          cursor: pointer;
          font-family: 'IBM Plex Mono', monospace;
          letter-spacing: 0.04em;
          transition: border-color 0.15s, color 0.15s;
        }
        .sg-lang-btn:hover { border-color: var(--ink); color: var(--ink); }
        .sg-lang-btn:focus-visible { outline: 2px solid var(--ink); outline-offset: 2px; }
        .sg-lang-dropdown {
          position: absolute;
          top: calc(100% + 4px);
          right: 20px;
          background: var(--card);
          border: 1px solid var(--paper-line);
          border-radius: 4px;
          box-shadow: 0 4px 16px rgba(27,42,74,0.12);
          min-width: 150px;
          overflow: hidden;
          z-index: 200;
        }
        .sg-lang-option {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          padding: 9px 14px;
          background: transparent;
          border: none;
          font-size: 13px;
          color: var(--ink);
          cursor: pointer;
          text-align: left;
          transition: background 0.12s;
        }
        .sg-lang-option:hover { background: var(--paper); }
        .sg-lang-option.active { font-weight: 600; }

        .sg-hero {
          position: relative;
          overflow: hidden;
          padding: 32px 24px 40px;
          border-bottom: 1px solid var(--paper-line);
        }
        .sg-hero-pattern {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          opacity: 0.35;
          pointer-events: none;
        }
        .sg-hero-content {
          position: relative;
          max-width: 640px;
          margin: 0 auto;
          text-align: center;
        }
        .sg-eyebrow {
          font-size: 11px;
          letter-spacing: 0.14em;
          color: var(--ink-soft);
          text-transform: uppercase;
          margin-bottom: 14px;
        }
        .sg-title {
          font-size: clamp(32px, 6vw, 48px);
          font-weight: 700;
          letter-spacing: -0.01em;
          margin: 0 0 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }
        .sg-subtitle {
          font-size: 15px;
          color: var(--ink-soft);
          line-height: 1.55;
          max-width: 460px;
          margin: 0 auto;
        }

        .sg-main {
          max-width: 640px;
          margin: -20px auto 0;
          padding: 0 24px 64px;
          position: relative;
        }
        .sg-card {
          background: var(--card);
          border: 1px solid var(--paper-line);
          border-radius: 4px;
          box-shadow: 0 1px 2px rgba(27,42,74,0.06), 0 8px 24px rgba(27,42,74,0.05);
        }
        .sg-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 20px;
          border-bottom: 1px dashed var(--paper-line);
          font-size: 11px;
          color: var(--ink-soft);
        }
        .sg-card-body { padding: 22px 20px 24px; }

        .sg-textarea {
          width: 100%;
          min-height: 120px;
          resize: vertical;
          border: 1px solid var(--paper-line);
          border-radius: 3px;
          background: #fff;
          padding: 14px;
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          line-height: 1.55;
          color: var(--ink);
        }
        .sg-textarea:focus-visible { outline: 2px solid var(--ink); outline-offset: 1px; }
        .sg-textarea::placeholder { color: #9BA3AC; }

        .sg-examples {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin: 12px 0 18px;
        }
        .sg-chip {
          font-size: 12px;
          padding: 6px 12px;
          border: 1px solid var(--paper-line);
          border-radius: 999px;
          background: transparent;
          color: var(--ink-soft);
          cursor: pointer;
          transition: background 0.15s, color 0.15s;
        }
        .sg-chip:hover { background: var(--paper); color: var(--ink); }
        .sg-chip:focus-visible { outline: 2px solid var(--ink); outline-offset: 2px; }

        .sg-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: var(--ink);
          color: var(--paper);
          border: none;
          border-radius: 3px;
          padding: 12px 22px;
          font-family: 'Space Mono', monospace;
          font-size: 13px;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          cursor: pointer;
          width: 100%;
          justify-content: center;
        }
        .sg-btn:disabled { opacity: 0.45; cursor: not-allowed; }
        .sg-btn:not(:disabled):hover { background: #0f1930; }
        .sg-btn:focus-visible { outline: 2px solid var(--ink); outline-offset: 2px; }
        .sg-spin { animation: sg-rotate 0.9s linear infinite; }
        @keyframes sg-rotate { to { transform: rotate(360deg); } }
        @media (prefers-reduced-motion: reduce) { .sg-spin { animation: none; } }

        .sg-error {
          margin-top: 16px;
          padding: 12px 14px;
          border: 1px solid var(--stamp-red);
          border-radius: 3px;
          font-size: 13px;
          color: var(--stamp-red);
          background: rgba(168,54,43,0.06);
        }

        .sg-result { margin-top: 22px; padding-top: 20px; border-top: 1px dashed var(--paper-line); }
        .sg-stamp-row { display: flex; justify-content: center; margin-bottom: 18px; }
        .sg-stamp {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 12px 22px;
          border: 3px solid var(--stamp-color);
          border-radius: 6px;
          color: var(--stamp-color);
          transform: rotate(-4deg);
          font-family: 'Space Mono', monospace;
          font-size: 20px;
          font-weight: 700;
          letter-spacing: 0.08em;
        }
        .sg-stamp::before {
          content: "";
          position: absolute;
          inset: 3px;
          border: 1px solid var(--stamp-color);
          border-radius: 3px;
          opacity: 0.5;
        }

        .sg-confidence {
          text-align: center;
          font-size: 12px;
          color: var(--ink-soft);
          margin-bottom: 20px;
        }
        .sg-confidence-num { color: var(--ink); font-weight: 600; }

        .sg-section-label {
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--ink-soft);
          margin-bottom: 8px;
        }
        .sg-flags { list-style: none; padding: 0; margin: 0 0 18px; display: flex; flex-direction: column; gap: 6px; }
        .sg-flags li { font-size: 13.5px; padding-left: 16px; position: relative; line-height: 1.5; }
        .sg-flags li::before { content: "—"; position: absolute; left: 0; color: var(--stamp-color); }
        .sg-explain { font-size: 14px; line-height: 1.6; color: var(--ink); margin-bottom: 14px; }
        .sg-recommend {
          font-size: 13.5px;
          padding: 12px 14px;
          background: var(--paper);
          border-left: 3px solid var(--stamp-color);
          border-radius: 2px;
          line-height: 1.55;
        }
      `}</style>

      {/* Language switcher */}
      <div className="sg-lang-bar">
        <div style={{ position: "relative" }}>
          <button className="sg-lang-btn" onClick={() => setLangOpen((o) => !o)} aria-label="Switch language">
            <Globe size={13} />
            <span>{currentLang?.flag} {currentLang?.label}</span>
          </button>
          {langOpen && (
            <div className="sg-lang-dropdown">
              {LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  className={`sg-lang-option${lang === l.code ? " active" : ""}`}
                  onClick={() => selectLang(l.code)}
                >
                  <span>{l.flag}</span>
                  <span>{l.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="sg-hero">
        <svg className="sg-hero-pattern" viewBox="0 0 800 220" preserveAspectRatio="none">
          {wavePaths.map((d, i) => (
            <path key={i} d={d} fill="none" stroke="var(--accent-line)" strokeWidth="0.7" />
          ))}
        </svg>
        <div className="sg-hero-content">
          <div className="sg-eyebrow sg-mono">{t.eyebrow}</div>
          <h1 className="sg-title sg-display">
            <ShieldCheck size={34} strokeWidth={2} />
            ScamGuard
          </h1>
          <p className="sg-subtitle">{t.subtitle}</p>
        </div>
      </div>

      <div className="sg-main">
        <div className="sg-card">
          <div className="sg-card-header sg-mono">
            <span>{t.caseNr} {String(dosarNr).padStart(6, "0")}</span>
            <span>{t.inspection}</span>
          </div>
          <div className="sg-card-body">
            <textarea
              className="sg-textarea"
              aria-label={t.placeholder}
              placeholder={t.placeholder}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <div className="sg-examples">
              {t.examples.map((ex) => (
                <button key={ex.eticheta} className="sg-chip" onClick={() => incarcaExemplu(ex)}>
                  {ex.eticheta}
                </button>
              ))}
            </div>
            <button className="sg-btn" onClick={inspecteaza} disabled={loading || !text.trim()}>
              {loading ? (
                <><Loader2 size={16} className="sg-spin" /> {t.btnLoading}</>
              ) : (
                <><Search size={16} /> {t.btnAnalyze}</>
              )}
            </button>

            {error && <div className="sg-error">{error}</div>}

            {result && vc && (
              <div className="sg-result" style={{ "--stamp-color": vc.color }}>
                <div className="sg-stamp-row">
                  <div className="sg-stamp">
                    <vc.Icon size={22} strokeWidth={2.4} />
                    {vc.label}
                  </div>
                </div>
                <div className="sg-confidence sg-mono">
                  {t.confidence} <span className="sg-confidence-num">{result.incredere ?? "—"}%</span>
                </div>

                {Array.isArray(result.semnale) && result.semnale.length > 0 && (
                  <>
                    <div className="sg-section-label">{t.signals}</div>
                    <ul className="sg-flags">
                      {result.semnale.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                  </>
                )}

                <div className="sg-section-label">{t.explanation}</div>
                <p className="sg-explain">{result.explicatie || t.noExplanation}</p>

                <div className="sg-recommend">
                  {result.recomandare || t.noRecommendation}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
