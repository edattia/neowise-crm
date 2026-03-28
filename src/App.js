import { useState, useRef } from "react";

// ═══════════════════════════════════════════════════════════
// DONNÉES
// ═══════════════════════════════════════════════════════════
const USERS = [
  { id: "elie", name: "Elie-Dan ATTIA", role: "Expert-Comptable & CAC", initials: "EA", color: "#1a5c8a" },
  { id: "collab", name: "Collaboratrice", role: "Collaboratrice", initials: "CO", color: "#2d7a4f" },
];

const today = new Date("2026-03-28");
const fmt = (d) => new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
const fmtM = (n) => (n || 0).toLocaleString("fr-FR") + " €";
const daysLeft = (d) => Math.ceil((new Date(d) - today) / 86400000);

const INITIAL_CLIENTS = [
  {
    id: 1, nom: "SARL DUPONT & FILS", forme: "SARL", tva: "Réel normal", activite: "BTP",
    ca: 850000, contact: "Marc Dupont", email: "m.dupont@dupont-fils.fr", tel: "06 12 34 56 78",
    responsable: "elie", statut: "En cours", honorairesMensuels: 2400,
    avancement: { saisie: 80, rapprochement: 60, declarations: 40, bilan: 10 },
    docs: [{ nom: "Factures janv.", statut: "Reçu" }, { nom: "Relevés bancaires", statut: "En attente" }, { nom: "Notes de frais", statut: "Reçu" }],
    demandes: [
      { id: 1, date: "2026-03-10", sujet: "Simulation IS 2025", statut: "En cours", priorite: "Haute" },
      { id: 2, date: "2026-02-28", sujet: "Attestation TVA", statut: "Traité", priorite: "Normale" }
    ],
    factures: [
      { id: "F2026-001", date: "2026-01-31", montant: 2400, statut: "Payée", libelle: "Honoraires jan." },
      { id: "F2026-008", date: "2026-02-28", montant: 2400, statut: "Payée", libelle: "Honoraires fév." },
      { id: "F2026-015", date: "2026-03-31", montant: 2400, statut: "À envoyer", libelle: "Honoraires mar." }
    ],
    temps: [
      { id: 1, date: "2026-03-25", collaborateur: "elie", mission: "Saisie comptable", duree: 3.5, notes: "" },
      { id: 2, date: "2026-03-26", collaborateur: "elie", mission: "Déclaration TVA", duree: 1.5, notes: "" },
      { id: 3, date: "2026-03-20", collaborateur: "collab", mission: "Rapprochement bancaire", duree: 2, notes: "" },
    ],
    lettresMission: [
      { id: 1, titre: "Lettre de mission 2025", date: "2025-01-05", statut: "Signée", missions: ["Tenue comptable", "Déclarations fiscales", "Établissement bilan"] }
    ],
    echeancesIds: [1, 2],
    notes: "Client fidèle depuis 2018. TVA mensuelle CA3. Exercice 31/12."
  },
  {
    id: 2, nom: "SASU MARTIN CONSEIL", forme: "SASU", tva: "Franchise", activite: "Conseil",
    ca: 95000, contact: "Léa Martin", email: "lea@martin-conseil.fr", tel: "07 23 45 67 89",
    responsable: "collab", statut: "Avancé", honorairesMensuels: 1200,
    avancement: { saisie: 100, rapprochement: 95, declarations: 80, bilan: 50 },
    docs: [{ nom: "Factures ventes", statut: "Reçu" }, { nom: "Relevés bancaires", statut: "Reçu" }],
    demandes: [{ id: 1, date: "2026-03-15", sujet: "Liasse fiscale 2025", statut: "En cours", priorite: "Haute" }],
    factures: [
      { id: "F2026-002", date: "2026-01-31", montant: 1200, statut: "Payée", libelle: "Honoraires jan." },
      { id: "F2026-009", date: "2026-02-28", montant: 1200, statut: "En attente", libelle: "Honoraires fév." }
    ],
    temps: [
      { id: 1, date: "2026-03-22", collaborateur: "collab", mission: "Liasse fiscale", duree: 4, notes: "" },
      { id: 2, date: "2026-03-18", collaborateur: "collab", mission: "Saisie comptable", duree: 2, notes: "" },
    ],
    lettresMission: [
      { id: 1, titre: "Lettre de mission 2025", date: "2025-01-10", statut: "Signée", missions: ["Tenue comptable", "Liasse fiscale"] }
    ],
    echeancesIds: [4, 2],
    notes: "Franchise TVA. Président assimilé salarié. Clôture 31/12."
  },
  {
    id: 3, nom: "EI BENALI PLOMBERIE", forme: "EI", tva: "Réel simplifié", activite: "Artisan",
    ca: 220000, contact: "Karim Benali", email: "k.benali@gmail.com", tel: "06 98 76 54 32",
    responsable: "elie", statut: "En retard", honorairesMensuels: 800,
    avancement: { saisie: 30, rapprochement: 20, declarations: 10, bilan: 0 },
    docs: [{ nom: "Factures Q4 2025", statut: "Manquant" }, { nom: "Relevés bancaires", statut: "En attente" }],
    demandes: [
      { id: 1, date: "2026-03-01", sujet: "TVA annuelle CA12", statut: "Urgent", priorite: "Urgente" },
      { id: 2, date: "2026-03-20", sujet: "Passage EURL ?", statut: "En cours", priorite: "Normale" }
    ],
    factures: [
      { id: "F2026-003", date: "2026-01-31", montant: 800, statut: "Impayée", libelle: "Honoraires jan." },
      { id: "F2026-010", date: "2026-02-28", montant: 800, statut: "Impayée", libelle: "Honoraires fév." }
    ],
    temps: [
      { id: 1, date: "2026-03-15", collaborateur: "elie", mission: "Saisie partielle", duree: 1.5, notes: "En attente docs client" },
    ],
    lettresMission: [
      { id: 1, titre: "Lettre de mission 2024", date: "2024-01-15", statut: "À renouveler", missions: ["Tenue comptable", "Déclarations TVA", "Liasse"] }
    ],
    echeancesIds: [3, 6],
    notes: "⚠️ Documents en retard. Relancer client. CA12 à déposer avant 30/04."
  },
  {
    id: 4, nom: "SCI LES GLYCINES", forme: "SCI", tva: "Sans TVA", activite: "Immobilier",
    ca: 48000, contact: "Pierre & Anne Rousseau", email: "glycines.sci@orange.fr", tel: "06 11 22 33 44",
    responsable: "collab", statut: "En cours", honorairesMensuels: 600,
    avancement: { saisie: 90, rapprochement: 85, declarations: 70, bilan: 60 },
    docs: [{ nom: "Quittances loyers", statut: "Reçu" }, { nom: "Charges copro", statut: "Reçu" }],
    demandes: [{ id: 1, date: "2026-03-18", sujet: "Déclaration 2072", statut: "En cours", priorite: "Haute" }],
    factures: [{ id: "F2026-004", date: "2026-01-31", montant: 600, statut: "Payée", libelle: "Honoraires jan." }],
    temps: [
      { id: 1, date: "2026-03-20", collaborateur: "collab", mission: "Déclaration 2072", duree: 3, notes: "" },
    ],
    lettresMission: [
      { id: 1, titre: "Lettre de mission 2025", date: "2025-02-01", statut: "Signée", missions: ["Déclaration 2072", "Tenue comptable SCI"] }
    ],
    echeancesIds: [5, 7],
    notes: "SCI à l'IR. 3 associés. Bien locatif résidentiel."
  },
  {
    id: 5, nom: "SAS TECHFLOW", forme: "SAS", tva: "Réel normal", activite: "Tech / SaaS",
    ca: 1200000, contact: "Sofia Chen", email: "s.chen@techflow.io", tel: "07 55 44 33 22",
    responsable: "elie", statut: "En cours", honorairesMensuels: 4800,
    avancement: { saisie: 65, rapprochement: 55, declarations: 35, bilan: 5 },
    docs: [{ nom: "Grand livre export", statut: "Reçu" }, { nom: "FEC janv.", statut: "En attente" }],
    demandes: [
      { id: 1, date: "2026-03-22", sujet: "CIR – Crédit Impôt Recherche", statut: "En cours", priorite: "Haute" },
      { id: 2, date: "2026-03-05", sujet: "Audit TVA intracommunautaire", statut: "Traité", priorite: "Haute" }
    ],
    factures: [
      { id: "F2026-005", date: "2026-01-31", montant: 4800, statut: "Payée", libelle: "Honoraires jan." },
      { id: "F2026-011", date: "2026-02-28", montant: 4800, statut: "Payée", libelle: "Honoraires fév." },
      { id: "F2026-018", date: "2026-03-31", montant: 4800, statut: "À envoyer", libelle: "Honoraires mar." }
    ],
    temps: [
      { id: 1, date: "2026-03-26", collaborateur: "elie", mission: "Revue analytique", duree: 2.5, notes: "" },
      { id: 2, date: "2026-03-24", collaborateur: "elie", mission: "CIR dossier", duree: 3, notes: "" },
      { id: 3, date: "2026-03-22", collaborateur: "collab", mission: "Saisie comptable", duree: 4, notes: "" },
    ],
    lettresMission: [
      { id: 1, titre: "Lettre de mission 2025", date: "2025-01-02", statut: "Signée", missions: ["Tenue comptable", "Déclarations fiscales", "Bilan", "CAC"] }
    ],
    echeancesIds: [1, 2, 4, 8, 9],
    notes: "JEI à vérifier. CIR potentiel. TVA intracommunautaire active. Clôture 31/12."
  }
];

const ECHEANCES = [
  { id: 1, label: "TVA CA3 – Mars 2026", date: "2026-04-21", type: "TVA", priorite: "haute" },
  { id: 2, label: "IS acompte 1er trim.", date: "2026-04-15", type: "IS", priorite: "haute" },
  { id: 3, label: "TVA CA12 annuelle", date: "2026-04-30", type: "TVA", priorite: "urgente" },
  { id: 4, label: "Liasse fiscale 2065", date: "2026-05-15", type: "Liasse", priorite: "haute" },
  { id: 5, label: "Déclaration 2072 SCI", date: "2026-04-30", type: "Déclaration", priorite: "haute" },
  { id: 6, label: "Déclaration IR (2042)", date: "2026-05-31", type: "IR", priorite: "normale" },
  { id: 7, label: "CFE – Acompte", date: "2026-06-15", type: "CFE", priorite: "normale" },
  { id: 8, label: "DSN Avril 2026", date: "2026-05-05", type: "DSN", priorite: "normale" },
  { id: 9, label: "Bilan clôture 31/12/2025", date: "2026-06-30", type: "Bilan", priorite: "haute" },
  { id: 10, label: "Liasse fiscale 2031", date: "2026-05-15", type: "Liasse", priorite: "haute" },
];

const TAUX_HORAIRE = { elie: 180, collab: 90 };
const MISSIONS_TYPES = ["Saisie comptable", "Rapprochement bancaire", "Déclaration TVA", "Liasse fiscale", "Révision", "Bilan", "Conseil", "Lettre de mission", "CIR", "Autre"];

// ═══════════════════════════════════════════════════════════
// UTILITAIRES UI
// ═══════════════════════════════════════════════════════════
const sc = (s) => ({
  "Payée": "#2d7a4f", "En attente": "#b07d1a", "Impayée": "#c0392b", "À envoyer": "#1a5c8a",
  "Traité": "#2d7a4f", "En cours": "#1a5c8a", "Urgent": "#c0392b", "Avancé": "#2d7a4f",
  "En retard": "#c0392b", "Reçu": "#2d7a4f", "Manquant": "#c0392b", "Signée": "#2d7a4f",
  "À renouveler": "#c0392b", "En attente signature": "#b07d1a",
}[s] || "#666");

const pc = (p) => ({ urgente: "#c0392b", haute: "#b07d1a", normale: "#1a5c8a" }[p?.toLowerCase()] || "#666");

const Badge = ({ label, color }) => (
  <span style={{ display: "inline-block", padding: "2px 10px", borderRadius: 20, background: (color || "#666") + "18", color: color || "#666", border: `1px solid ${color || "#666"}40`, fontSize: 11, fontWeight: 700, letterSpacing: 0.4, whiteSpace: "nowrap" }}>{label}</span>
);

const Bar = ({ value, color = "#1a5c8a", label }) => (
  <div style={{ marginBottom: 8 }}>
    {label && <div style={{ fontSize: 11, color: "#888", display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
      <span>{label}</span><span style={{ fontWeight: 800, color }}>{value}%</span>
    </div>}
    <div style={{ background: "#e8ecf0", borderRadius: 6, height: 6 }}>
      <div style={{ width: `${value}%`, height: "100%", background: color, borderRadius: 6, transition: "width .6s" }} />
    </div>
  </div>
);

const Card = ({ children, style = {}, onClick }) => (
  <div onClick={onClick} style={{ background: "#fff", borderRadius: 12, border: "1px solid #e8ecf0", boxShadow: "0 1px 4px rgba(0,0,0,.06)", padding: 20, cursor: onClick ? "pointer" : "default", transition: "box-shadow .2s, transform .15s", ...style }}
    onMouseEnter={e => { if (onClick) { e.currentTarget.style.boxShadow = "0 4px 16px rgba(26,92,138,.12)"; e.currentTarget.style.transform = "translateY(-1px)"; } }}
    onMouseLeave={e => { if (onClick) { e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,.06)"; e.currentTarget.style.transform = "none"; } }}>
    {children}
  </div>
);

const Btn = ({ children, onClick, color = "#1a5c8a", outline, small, style = {} }) => (
  <button onClick={onClick} style={{
    background: outline ? "transparent" : color, color: outline ? color : "#fff",
    border: `1.5px solid ${color}`, borderRadius: 8, padding: small ? "5px 12px" : "8px 16px",
    fontSize: small ? 11 : 13, fontWeight: 700, cursor: "pointer", transition: "all .15s", ...style
  }}
    onMouseEnter={e => { e.currentTarget.style.opacity = ".85"; }}
    onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}>
    {children}
  </button>
);

const Input = ({ label, value, onChange, type = "text", placeholder, style = {} }) => (
  <div style={{ marginBottom: 12, ...style }}>
    {label && <div style={{ fontSize: 11, fontWeight: 700, color: "#555", marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</div>}
    <input type={type} value={value} onChange={onChange} placeholder={placeholder}
      style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #dde3ea", fontSize: 13, boxSizing: "border-box", outline: "none" }}
      onFocus={e => e.target.style.borderColor = "#1a5c8a"}
      onBlur={e => e.target.style.borderColor = "#dde3ea"} />
  </div>
);

const Sel = ({ label, value, onChange, options, style = {} }) => (
  <div style={{ marginBottom: 12, ...style }}>
    {label && <div style={{ fontSize: 11, fontWeight: 700, color: "#555", marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</div>}
    <select value={value} onChange={onChange} style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #dde3ea", fontSize: 13, boxSizing: "border-box" }}>
      {options.map(o => <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>)}
    </select>
  </div>
);

// ═══════════════════════════════════════════════════════════
// MODAL WRAPPER
// ═══════════════════════════════════════════════════════════
const Modal = ({ title, onClose, children, wide }) => (
  <div style={{ position: "fixed", inset: 0, background: "rgba(10,20,40,.55)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
    <div style={{ background: "#fff", borderRadius: 18, width: "100%", maxWidth: wide ? 900 : 560, maxHeight: "90vh", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 20px 60px rgba(0,0,0,.25)" }}>
      <div style={{ padding: "18px 24px", borderBottom: "1px solid #e8ecf0", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#1a2332" }}>{title}</h3>
        <button onClick={onClose} style={{ background: "#f0f4f8", border: "none", borderRadius: 8, width: 32, height: 32, fontSize: 16, cursor: "pointer", color: "#555" }}>✕</button>
      </div>
      <div style={{ flex: 1, overflow: "auto", padding: 24 }}>{children}</div>
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════
// MODULE TEMPS PASSÉ
// ═══════════════════════════════════════════════════════════
const TempsPanel = ({ client, onUpdate, currentUser }) => {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ date: "2026-03-28", collaborateur: currentUser.id, mission: "Saisie comptable", duree: 1, notes: "" });

  const totalHeures = client.temps.reduce((s, t) => s + t.duree, 0);
  const totalCout = client.temps.reduce((s, t) => s + t.duree * (TAUX_HORAIRE[t.collaborateur] || 90), 0);
  const totalFacture = client.factures.filter(f => f.statut === "Payée").reduce((s, f) => s + f.montant, 0);
  const ratio = totalFacture > 0 ? Math.round((totalFacture / totalCout) * 100) : 0;
  const rentabilite = totalFacture - totalCout;

  const addTemps = () => {
    const t = { id: Date.now(), ...form, duree: parseFloat(form.duree) };
    onUpdate(client.id, { temps: [...client.temps, t] });
    setShowForm(false);
  };

  return (
    <div>
      {/* KPIs rentabilité */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
        {[
          { label: "Heures passées", val: totalHeures + "h", color: "#1a5c8a" },
          { label: "Coût interne", val: fmtM(totalCout), color: "#5a3e8a", sub: `@ ${TAUX_HORAIRE.elie}€/h EC · ${TAUX_HORAIRE.collab}€/h collab` },
          { label: "Encaissé", val: fmtM(totalFacture), color: "#2d7a4f" },
          { label: "Rentabilité", val: fmtM(rentabilite), color: rentabilite >= 0 ? "#2d7a4f" : "#c0392b", sub: `Ratio ${ratio}%` },
        ].map((k, i) => (
          <div key={i} style={{ padding: 14, background: "#f7f9fc", borderRadius: 10, border: "1px solid #e8ecf0" }}>
            <div style={{ fontSize: 10, color: "#888", fontWeight: 700, textTransform: "uppercase" }}>{k.label}</div>
            <div style={{ fontSize: 18, fontWeight: 900, color: k.color, margin: "4px 0 2px" }}>{k.val}</div>
            {k.sub && <div style={{ fontSize: 10, color: "#aaa" }}>{k.sub}</div>}
          </div>
        ))}
      </div>

      {/* Indicateur rentabilité visuel */}
      <div style={{ marginBottom: 20, padding: 14, background: ratio >= 100 ? "#f0faf5" : ratio >= 70 ? "#fffbf0" : "#fff0f0", borderRadius: 10, border: `1px solid ${ratio >= 100 ? "#b8e8cc" : ratio >= 70 ? "#ffe5a0" : "#ffcccc"}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 700, marginBottom: 6 }}>
          <span>Ratio honoraires / coût interne</span>
          <span style={{ color: ratio >= 100 ? "#2d7a4f" : ratio >= 70 ? "#b07d1a" : "#c0392b" }}>{ratio}% {ratio >= 100 ? "✅ Rentable" : ratio >= 70 ? "⚠️ Limite" : "🔴 Déficitaire"}</span>
        </div>
        <div style={{ background: "#e8ecf0", borderRadius: 6, height: 10 }}>
          <div style={{ width: `${Math.min(ratio, 100)}%`, height: "100%", background: ratio >= 100 ? "#2d7a4f" : ratio >= 70 ? "#b07d1a" : "#c0392b", borderRadius: 6 }} />
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <h4 style={{ margin: 0, fontSize: 13, fontWeight: 800 }}>Saisies de temps</h4>
        <Btn small onClick={() => setShowForm(!showForm)}>+ Saisir du temps</Btn>
      </div>

      {showForm && (
        <div style={{ padding: 16, background: "#f0f5fa", borderRadius: 10, border: "1px solid #cce0f5", marginBottom: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <Input label="Date" type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
            <Sel label="Collaborateur" value={form.collaborateur} onChange={e => setForm({ ...form, collaborateur: e.target.value })} options={USERS.map(u => ({ value: u.id, label: u.name }))} />
            <Sel label="Mission" value={form.mission} onChange={e => setForm({ ...form, mission: e.target.value })} options={MISSIONS_TYPES} />
            <Input label="Durée (heures)" type="number" value={form.duree} onChange={e => setForm({ ...form, duree: e.target.value })} />
          </div>
          <Input label="Notes" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Observations..." />
          <div style={{ display: "flex", gap: 8 }}>
            <Btn onClick={addTemps}>Enregistrer</Btn>
            <Btn outline onClick={() => setShowForm(false)}>Annuler</Btn>
          </div>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {[...client.temps].sort((a, b) => new Date(b.date) - new Date(a.date)).map(t => {
          const u = USERS.find(u => u.id === t.collaborateur);
          const cout = t.duree * (TAUX_HORAIRE[t.collaborateur] || 90);
          return (
            <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: "#f7f9fc", borderRadius: 8, border: "1px solid #e8ecf0" }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: u?.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: "#fff", flexShrink: 0 }}>{u?.initials}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 700 }}>{t.mission}</div>
                <div style={{ fontSize: 11, color: "#aaa" }}>{fmt(t.date)} · {u?.name}</div>
                {t.notes && <div style={{ fontSize: 11, color: "#888", fontStyle: "italic" }}>{t.notes}</div>}
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 13, fontWeight: 900, color: "#1a2332" }}>{t.duree}h</div>
                <div style={{ fontSize: 11, color: "#888" }}>{fmtM(cout)}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// MODULE LETTRES DE MISSION
// ═══════════════════════════════════════════════════════════
const LettreMissionPanel = ({ client, onUpdate }) => {
  const [showForm, setShowForm] = useState(false);
  const [showPreview, setShowPreview] = useState(null);
  const [form, setForm] = useState({ titre: `Lettre de mission ${new Date().getFullYear()}`, missions: [], honoraires: client.honorairesMensuels, periodicite: "Mensuelle" });
  const [checkMissions, setCheckMissions] = useState({});

  const MISSIONS_DISPONIBLES = [
    "Tenue comptable et saisie", "Rapprochement bancaire", "Déclarations de TVA",
    "Établissement du bilan", "Liasse fiscale", "Conseils fiscaux", "Commissariat aux Comptes",
    "Établissement des bulletins de paie", "Déclarations sociales (DSN)", "Assistance en cas de contrôle fiscal"
  ];

  const addLdm = () => {
    const selected = MISSIONS_DISPONIBLES.filter((_, i) => checkMissions[i]);
    const ldm = { id: Date.now(), titre: form.titre, date: "2026-03-28", statut: "En attente signature", missions: selected, honoraires: form.honoraires, periodicite: form.periodicite };
    onUpdate(client.id, { lettresMission: [...client.lettresMission, ldm] });
    setShowForm(false); setCheckMissions({});
  };

  const LdmPreview = ({ ldm }) => (
    <div style={{ fontFamily: "Georgia, serif", fontSize: 13, lineHeight: 1.7 }}>
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div style={{ fontSize: 18, fontWeight: 900, color: "#1a2332" }}>NEOWISE EXPERTISE</div>
        <div style={{ fontSize: 12, color: "#888" }}>Elie-Dan ATTIA · Expert-Comptable & Commissaire aux Comptes</div>
        <div style={{ borderTop: "2px solid #1a5c8a", marginTop: 12, paddingTop: 12, fontSize: 15, fontWeight: 700 }}>LETTRE DE MISSION</div>
      </div>
      <p><strong>Client :</strong> {client.nom}</p>
      <p><strong>Date :</strong> {fmt(ldm.date)}</p>
      <p><strong>Exercice :</strong> {new Date().getFullYear()}</p>
      <p style={{ marginTop: 16 }}>Par la présente lettre de mission, le cabinet <strong>NEOWISE EXPERTISE</strong>, représenté par <strong>Elie-Dan ATTIA</strong>, Expert-Comptable inscrit à l'Ordre, s'engage à réaliser les missions suivantes pour le compte de <strong>{client.nom}</strong> :</p>
      <ul>{ldm.missions.map((m, i) => <li key={i}>{m}</li>)}</ul>
      <p><strong>Honoraires :</strong> {fmtM(ldm.honoraires)} HT / mois ({ldm.periodicite})</p>
      <p style={{ marginTop: 24, fontStyle: "italic", fontSize: 12, color: "#888" }}>Cette lettre de mission est établie conformément aux dispositions de l'article 11 du Code de déontologie des experts-comptables. Elle annule et remplace toute lettre de mission antérieure.</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, marginTop: 32, fontSize: 12 }}>
        <div><strong>Pour NEOWISE EXPERTISE</strong><br /><br /><br />Elie-Dan ATTIA<br />Expert-Comptable & CAC</div>
        <div><strong>Pour {client.nom}</strong><br /><br /><br />{client.contact}<br />Lu et approuvé</div>
      </div>
    </div>
  );

  return (
    <div>
      {showPreview && <Modal title="Aperçu lettre de mission" onClose={() => setShowPreview(null)} wide>
        <LdmPreview ldm={showPreview} />
        <div style={{ marginTop: 20, padding: 14, background: "#f0f8ff", borderRadius: 10, border: "1px solid #cce0f5", fontSize: 12, color: "#555" }}>
          💡 <strong>Intégration Outlook :</strong> En production, un bouton « Envoyer par email » enverrait cette lettre en PDF via l'API Microsoft Graph à {client.email}.
        </div>
      </Modal>}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h4 style={{ margin: 0, fontSize: 13, fontWeight: 800 }}>Lettres de mission</h4>
        <Btn small onClick={() => setShowForm(!showForm)}>+ Nouvelle lettre</Btn>
      </div>

      {showForm && (
        <div style={{ padding: 16, background: "#f0f5fa", borderRadius: 10, border: "1px solid #cce0f5", marginBottom: 16 }}>
          <Input label="Titre" value={form.titre} onChange={e => setForm({ ...form, titre: e.target.value })} />
          <div style={{ fontSize: 11, fontWeight: 700, color: "#555", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>Missions incluses</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 12 }}>
            {MISSIONS_DISPONIBLES.map((m, i) => (
              <label key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, cursor: "pointer", padding: "5px 8px", borderRadius: 6, background: checkMissions[i] ? "#e8f0f8" : "transparent" }}>
                <input type="checkbox" checked={!!checkMissions[i]} onChange={e => setCheckMissions({ ...checkMissions, [i]: e.target.checked })} />
                {m}
              </label>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <Input label="Honoraires HT/mois (€)" type="number" value={form.honoraires} onChange={e => setForm({ ...form, honoraires: +e.target.value })} />
            <Sel label="Périodicité" value={form.periodicite} onChange={e => setForm({ ...form, periodicite: e.target.value })} options={["Mensuelle", "Trimestrielle", "Annuelle"]} />
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Btn onClick={addLdm}>Générer</Btn>
            <Btn outline onClick={() => setShowForm(false)}>Annuler</Btn>
          </div>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {client.lettresMission.map(ldm => (
          <div key={ldm.id} style={{ padding: 14, background: "#f7f9fc", borderRadius: 10, border: `1px solid ${sc(ldm.statut)}33` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 800 }}>📄 {ldm.titre}</div>
                <div style={{ fontSize: 11, color: "#aaa", marginTop: 2 }}>Établie le {fmt(ldm.date)} · {fmtM(ldm.honoraires)}/mois</div>
                <div style={{ marginTop: 6, display: "flex", gap: 4, flexWrap: "wrap" }}>
                  {ldm.missions.map((m, i) => <Badge key={i} label={m} color="#555" />)}
                </div>
              </div>
              <Badge label={ldm.statut} color={sc(ldm.statut)} />
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <Btn small outline onClick={() => setShowPreview(ldm)}>👁 Aperçu</Btn>
              {ldm.statut !== "Signée" && (
                <Btn small outline color="#b07d1a" onClick={() => onUpdate(client.id, { lettresMission: client.lettresMission.map(l => l.id === ldm.id ? { ...l, statut: "Signée" } : l) })}>✓ Marquer signée</Btn>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// MODULE ESPACE CLIENT (simulation)
// ═══════════════════════════════════════════════════════════
const EspaceClientPanel = ({ client }) => {
  const [lienCopie, setLienCopie] = useState(false);
  const lienClient = `https://espace.neowise-expertise.fr/client/${client.id}-${client.nom.toLowerCase().replace(/\s/g, "-").replace(/[^a-z0-9-]/g, "")}`;

  const docsDeposes = client.docs.filter(d => d.statut === "Reçu");
  const docsManquants = client.docs.filter(d => d.statut !== "Reçu");

  return (
    <div>
      <div style={{ padding: 16, background: "linear-gradient(135deg,#f0f8ff,#e8f4f8)", borderRadius: 12, border: "1px solid #cce0f5", marginBottom: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: "#1a2332", marginBottom: 8 }}>🔗 Lien espace client sécurisé</div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{ flex: 1, padding: "8px 12px", background: "#fff", borderRadius: 8, border: "1px solid #cce0f5", fontSize: 11, color: "#555", fontFamily: "monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{lienClient}</div>
          <Btn small onClick={() => { setLienCopie(true); setTimeout(() => setLienCopie(false), 2000); }}>{lienCopie ? "✓ Copié !" : "Copier"}</Btn>
        </div>
        <div style={{ fontSize: 11, color: "#888", marginTop: 8 }}>Ce lien unique permet à {client.contact} de déposer des documents en toute sécurité, sans accès à votre CRM.</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
        <div style={{ padding: 14, background: "#f0faf5", borderRadius: 10, border: "1px solid #b8e8cc" }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: "#2d7a4f", marginBottom: 10 }}>✅ Documents reçus ({docsDeposes.length})</div>
          {docsDeposes.map((d, i) => <div key={i} style={{ fontSize: 12, padding: "5px 0", borderBottom: "1px solid #e0f0e8", color: "#444" }}>📄 {d.nom}</div>)}
          {docsDeposes.length === 0 && <div style={{ fontSize: 12, color: "#aaa" }}>Aucun document reçu</div>}
        </div>
        <div style={{ padding: 14, background: "#fff0f0", borderRadius: 10, border: "1px solid #ffcccc" }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: "#c0392b", marginBottom: 10 }}>⏳ Documents en attente ({docsManquants.length})</div>
          {docsManquants.map((d, i) => <div key={i} style={{ fontSize: 12, padding: "5px 0", borderBottom: "1px solid #ffe0e0", color: "#444" }}>📋 {d.nom}</div>)}
          {docsManquants.length === 0 && <div style={{ fontSize: 12, color: "#aaa" }}>Tout est reçu ✓</div>}
        </div>
      </div>

      {/* Simulation email de relance */}
      <div style={{ padding: 16, background: "#f7f9fc", borderRadius: 12, border: "1px solid #e8ecf0" }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: "#1a2332", marginBottom: 12 }}>📧 Relance documents manquants</div>
        <div style={{ padding: 14, background: "#fff", borderRadius: 8, border: "1px solid #dde3ea", fontSize: 12, lineHeight: 1.7, color: "#333", marginBottom: 12, fontFamily: "monospace" }}>
          <strong>À :</strong> {client.email}<br />
          <strong>De :</strong> elie.attia@neowise-expertise.fr<br />
          <strong>Objet :</strong> Documents manquants – Dossier {client.nom}<br /><br />
          Bonjour {client.contact.split(" ")[0]},<br /><br />
          J'espère que vous allez bien. Je reviens vers vous au sujet des documents suivants, nécessaires à l'avancement de votre dossier comptable :<br /><br />
          {docsManquants.map((d, i) => `• ${d.nom}\n`).join("")}<br />
          Vous pouvez les déposer directement sur votre espace sécurisé ou par email.<br /><br />
          Cordialement,<br />
          Elie-Dan ATTIA<br />
          Expert-Comptable & CAC – NEOWISE EXPERTISE
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Btn small onClick={() => alert("✉️ En production : email envoyé via Outlook / Microsoft Graph API à " + client.email)}>📤 Envoyer via Outlook</Btn>
          <div style={{ fontSize: 11, color: "#aaa", alignSelf: "center" }}>Connecté à votre boîte Outlook via Microsoft Graph API</div>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// MODULE ALERTES & RELANCES
// ═══════════════════════════════════════════════════════════
const AlertesPage = ({ clients, onUpdate }) => {
  const [sent, setSent] = useState({});

  const alertes = [];

  // Impayés
  clients.forEach(c => {
    c.factures.filter(f => f.statut === "Impayée").forEach(f => {
      const j = Math.ceil((today - new Date(f.date)) / 86400000);
      alertes.push({ id: `imp-${c.id}-${f.id}`, type: "Impayé", urgence: j > 60 ? "urgente" : "haute", client: c, label: `Facture ${f.id} impayée depuis ${j} jours`, montant: f.montant, email: c.email, emailBody: `Bonjour ${c.contact.split(" ")[0]},\n\nNous n'avons pas reçu le règlement de la facture ${f.id} d'un montant de ${fmtM(f.montant)}, émise le ${fmt(f.date)}.\n\nMerci de procéder au règlement dans les meilleurs délais.\n\nCordialement,\nElie-Dan ATTIA – NEOWISE EXPERTISE` });
    });
  });

  // Docs manquants
  clients.forEach(c => {
    const manquants = c.docs.filter(d => d.statut === "Manquant" || d.statut === "En attente");
    if (manquants.length > 0) {
      alertes.push({ id: `doc-${c.id}`, type: "Docs manquants", urgence: c.statut === "En retard" ? "urgente" : "normale", client: c, label: `${manquants.length} document(s) manquant(s) : ${manquants.map(d => d.nom).join(", ")}`, email: c.email, emailBody: `Bonjour ${c.contact.split(" ")[0]},\n\nAfin d'avancer sur votre dossier, merci de nous faire parvenir :\n${manquants.map(d => `• ${d.nom}`).join("\n")}\n\nCordialement,\nElie-Dan ATTIA – NEOWISE EXPERTISE` });
    }
  });

  // Échéances J-15
  clients.forEach(c => {
    const echs = ECHEANCES.filter(e => c.echeancesIds.includes(e.id) && daysLeft(e.date) <= 15 && daysLeft(e.date) > 0);
    echs.forEach(e => {
      alertes.push({ id: `ech-${c.id}-${e.id}`, type: "Échéance proche", urgence: daysLeft(e.date) <= 7 ? "urgente" : "haute", client: c, label: `${e.label} dans ${daysLeft(e.date)} jours`, email: c.email, emailBody: `Bonjour ${c.contact.split(" ")[0]},\n\nRappel : ${e.label} est à déposer avant le ${fmt(e.date)}.\n\nMerci de vous assurer que tous les éléments sont transmis.\n\nCordialement,\nElie-Dan ATTIA – NEOWISE EXPERTISE` });
    });
  });

  // LDM à renouveler
  clients.forEach(c => {
    c.lettresMission.filter(l => l.statut === "À renouveler").forEach(l => {
      alertes.push({ id: `ldm-${c.id}-${l.id}`, type: "LDM expirée", urgence: "haute", client: c, label: `Lettre de mission expirée : ${l.titre}`, email: c.email, emailBody: "" });
    });
  });

  alertes.sort((a, b) => ({ urgente: 0, haute: 1, normale: 2 }[a.urgence] || 0) - ({ urgente: 0, haute: 1, normale: 2 }[b.urgence] || 0));

  const sendEmail = (a) => {
    setSent(prev => ({ ...prev, [a.id]: true }));
    alert(`✉️ Email envoyé à ${a.email} via Outlook\n\n${a.emailBody}`);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "#1a2332", margin: 0 }}>Alertes & Relances</h2>
          <p style={{ color: "#888", fontSize: 13, margin: "4px 0 0" }}>{alertes.length} alerte(s) active(s) · Relances envoyables via Outlook</p>
        </div>
        <Btn onClick={() => alert("📅 Synchronisation Outlook : toutes les échéances sont exportées vers votre calendrier Microsoft 365.")}>📅 Sync Outlook</Btn>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {alertes.map(a => (
          <div key={a.id} style={{ padding: "14px 18px", background: "#fff", borderRadius: 12, border: `1px solid ${pc(a.urgence)}33`, borderLeft: `4px solid ${pc(a.urgence)}`, boxShadow: "0 1px 4px rgba(0,0,0,.04)" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
              <span style={{ fontSize: 22 }}>{a.type === "Impayé" ? "💰" : a.type === "Docs manquants" ? "📂" : a.type === "Échéance proche" ? "⏳" : "📄"}</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4 }}>
                  <Badge label={a.type} color={pc(a.urgence)} />
                  <Badge label={a.urgence} color={pc(a.urgence)} />
                  <span style={{ fontSize: 12, fontWeight: 800, color: "#1a2332" }}>{a.client.nom}</span>
                </div>
                <div style={{ fontSize: 13, color: "#444" }}>{a.label}</div>
                {a.montant && <div style={{ fontSize: 12, color: "#c0392b", fontWeight: 700, marginTop: 2 }}>{fmtM(a.montant)}</div>}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {a.emailBody && !sent[a.id] && (
                  <Btn small onClick={() => sendEmail(a)}>📧 Relancer</Btn>
                )}
                {sent[a.id] && <Badge label="✓ Envoyé" color="#2d7a4f" />}
              </div>
            </div>
          </div>
        ))}
        {alertes.length === 0 && (
          <div style={{ textAlign: "center", padding: 60, color: "#aaa" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
            <div style={{ fontSize: 16, fontWeight: 700 }}>Aucune alerte active</div>
            <div style={{ fontSize: 13 }}>Tout est sous contrôle</div>
          </div>
        )}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// MODULE INTÉGRATIONS
// ═══════════════════════════════════════════════════════════
const IntegrationsPage = ({ clients, onUpdate }) => {
  const [tiimeStatus, setTiimeStatus] = useState("disconnected");
  const [outlookStatus, setOutlookStatus] = useState("disconnected");
  const [importing, setImporting] = useState(false);
  const [importLog, setImportLog] = useState([]);
  const fileRef = useRef();

  const connectOutlook = () => {
    setOutlookStatus("connecting");
    setTimeout(() => { setOutlookStatus("connected"); }, 1500);
  };

  const connectTiime = () => {
    setTiimeStatus("connecting");
    setTimeout(() => { setTiimeStatus("connected"); }, 1500);
  };

  const simulateImportTiime = () => {
    setImporting(true);
    setImportLog([]);
    const logs = [
      "⏳ Connexion à Tiime Accounting...",
      "📥 Récupération du FEC – SARL DUPONT & FILS (janv. 2026)...",
      "✅ 248 écritures importées · TVA collectée : 14 280 € · TVA déductible : 3 120 €",
      "📥 Récupération du FEC – SAS TECHFLOW (janv. 2026)...",
      "✅ 512 écritures importées · TVA collectée : 48 000 € · TVA déductible : 12 400 €",
      "📊 Mise à jour automatique de l'avancement saisie → 90%",
      "🔄 Synchronisation terminée · 2 dossiers mis à jour",
    ];
    logs.forEach((l, i) => setTimeout(() => {
      setImportLog(prev => [...prev, l]);
      if (i === logs.length - 1) {
        setImporting(false);
        onUpdate(1, { avancement: { saisie: 90, rapprochement: 60, declarations: 40, bilan: 10 } });
        onUpdate(5, { avancement: { saisie: 90, rapprochement: 55, declarations: 35, bilan: 5 } });
      }
    }, (i + 1) * 900));
  };

  const handleCsvImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImportLog([
        `📂 Fichier chargé : ${file.name}`,
        `📊 Analyse du FEC en cours...`,
        `✅ Format FEC valide · ${ev.target.result.split("\n").length - 1} lignes détectées`,
        `🔄 Prêt à importer dans le dossier client`,
      ]);
    };
    reader.readAsText(file);
  };

  const syncOutlookCalendar = () => {
    alert(`📅 Synchronisation Outlook – ${ECHEANCES.length} échéances exportées vers votre calendrier Microsoft 365.\n\nLes événements suivants ont été créés :\n${ECHEANCES.map(e => `• ${e.label} – ${fmt(e.date)}`).join("\n")}`);
  };

  const StatusBadge = ({ status }) => {
    const cfg = { connected: ["✅ Connecté", "#2d7a4f"], connecting: ["⏳ Connexion...", "#b07d1a"], disconnected: ["Non connecté", "#888"] }[status];
    return <Badge label={cfg[0]} color={cfg[1]} />;
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: "#1a2332", margin: 0 }}>Intégrations</h2>
        <p style={{ color: "#888", fontSize: 13, margin: "4px 0 0" }}>Connectez NEOWISE CRM à vos outils métier</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
        {/* Tiime */}
        <Card>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
            <div style={{ width: 48, height: 48, background: "linear-gradient(135deg,#6c3fc5,#4a90d9)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>🔵</div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 900, color: "#1a2332" }}>Tiime Accounting</div>
              <StatusBadge status={tiimeStatus} />
            </div>
          </div>
          <p style={{ fontSize: 12, color: "#666", lineHeight: 1.6 }}>
            Importez automatiquement les FEC, rapprochements bancaires et données de saisie depuis Tiime pour mettre à jour l'avancement des dossiers en temps réel.
          </p>
          <div style={{ fontSize: 11, color: "#888", marginBottom: 14, padding: 10, background: "#f7f9fc", borderRadius: 8 }}>
            <strong>Modes disponibles :</strong><br />
            • Import FEC CSV/TXT (manuel)<br />
            • API Tiime partenaire (accord Tiime requis)<br />
            • Export grand livre → mise à jour avancement auto
          </div>
          {tiimeStatus !== "connected" ? (
            <Btn onClick={connectTiime} style={{ width: "100%" }}>{tiimeStatus === "connecting" ? "Connexion en cours..." : "🔌 Connecter Tiime"}</Btn>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <Btn onClick={simulateImportTiime} style={{ width: "100%" }}>🔄 Importer depuis Tiime</Btn>
              <div style={{ display: "flex", gap: 8 }}>
                <Btn outline small onClick={() => fileRef.current.click()} style={{ flex: 1 }}>📂 Import FEC (CSV)</Btn>
                <input ref={fileRef} type="file" accept=".csv,.txt" style={{ display: "none" }} onChange={handleCsvImport} />
              </div>
            </div>
          )}
        </Card>

        {/* Outlook */}
        <Card>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
            <div style={{ width: 48, height: 48, background: "linear-gradient(135deg,#0078d4,#00bcf2)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>📧</div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 900, color: "#1a2332" }}>Microsoft Outlook 365</div>
              <StatusBadge status={outlookStatus} />
            </div>
          </div>
          <p style={{ fontSize: 12, color: "#666", lineHeight: 1.6 }}>
            Synchronisez votre calendrier avec les échéances fiscales, envoyez des relances directement depuis le CRM, et créez des tâches Outlook pour vos équipes.
          </p>
          <div style={{ fontSize: 11, color: "#888", marginBottom: 14, padding: 10, background: "#f7f9fc", borderRadius: 8 }}>
            <strong>Fonctionnalités :</strong><br />
            • Export échéances → Calendrier Outlook<br />
            • Envoi emails de relance via Microsoft Graph<br />
            • Création de tâches To-Do pour la collaboratrice<br />
            • OAuth 2.0 (connexion sécurisée à votre compte)
          </div>
          {outlookStatus !== "connected" ? (
            <Btn onClick={connectOutlook} color="#0078d4" style={{ width: "100%" }}>{outlookStatus === "connecting" ? "Connexion en cours..." : "🔗 Connecter Outlook"}</Btn>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <Btn color="#0078d4" onClick={syncOutlookCalendar} style={{ width: "100%" }}>📅 Sync calendrier échéances</Btn>
              <Btn outline small color="#0078d4" onClick={() => alert("📋 Tâches créées dans Outlook To-Do pour la collaboratrice")} style={{ width: "100%" }}>✅ Créer tâches équipe</Btn>
            </div>
          )}
        </Card>
      </div>

      {/* Log d'import */}
      {importLog.length > 0 && (
        <Card>
          <h4 style={{ margin: "0 0 12px", fontSize: 13, fontWeight: 800 }}>Journal d'import</h4>
          <div style={{ fontFamily: "monospace", fontSize: 12, background: "#0f1a2a", padding: 16, borderRadius: 10, color: "#7ecbf7" }}>
            {importLog.map((l, i) => <div key={i} style={{ marginBottom: 4, opacity: importing && i === importLog.length - 1 ? 0.7 : 1 }}>{l}</div>)}
            {importing && <span style={{ animation: "blink 1s infinite" }}>▌</span>}
          </div>
        </Card>
      )}

      {/* Architecture technique */}
      <Card style={{ marginTop: 20 }}>
        <h4 style={{ margin: "0 0 14px", fontSize: 13, fontWeight: 800 }}>🏗️ Architecture d'intégration en production</h4>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {[
            { title: "Tiime → CRM (FEC/CSV)", steps: ["Export FEC depuis Tiime (menu Exports)", "Upload dans le CRM (import CSV)", "Parsing automatique des journaux comptables", "Mise à jour avancement + alertes anomalies"], color: "#6c3fc5" },
            { title: "Outlook (Microsoft Graph API)", steps: ["Authentification OAuth 2.0 (une seule fois)", "GET /me/calendars → sync échéances", "POST /me/messages → envoi relances", "POST /me/tasks → tâches collaboratrice"], color: "#0078d4" },
          ].map((block, i) => (
            <div key={i} style={{ padding: 14, background: "#f7f9fc", borderRadius: 10, border: `1px solid ${block.color}33` }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: block.color, marginBottom: 10 }}>{block.title}</div>
              {block.steps.map((s, j) => <div key={j} style={{ fontSize: 11, color: "#555", padding: "4px 0", borderBottom: "1px solid #eee", display: "flex", gap: 8 }}><span style={{ color: block.color, fontWeight: 700 }}>{j + 1}.</span>{s}</div>)}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// FICHE CLIENT COMPLÈTE (modal)
// ═══════════════════════════════════════════════════════════
const ClientDetail = ({ client, onClose, currentUser, onUpdate }) => {
  const [tab, setTab] = useState("avancement");

  const tabs = [
    { id: "avancement", label: "📁 Dossier" },
    { id: "temps", label: "⏱ Temps / Rentabilité" },
    { id: "demandes", label: "📋 Demandes" },
    { id: "facturation", label: "🧾 Facturation" },
    { id: "echeances", label: "⏳ Échéances" },
    { id: "espace", label: "🔗 Espace client" },
    { id: "ldm", label: "📄 Lettres mission" },
    { id: "notes", label: "📝 Notes" },
  ];

  const avg = Math.round(Object.values(client.avancement).reduce((s, v) => s + v, 0) / 4);
  const [editNotes, setEditNotes] = useState(false);
  const [notesVal, setNotesVal] = useState(client.notes);
  const [showDemandeForm, setShowDemandeForm] = useState(false);
  const [newDemande, setNewDemande] = useState({ sujet: "", priorite: "Normale" });

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(10,20,40,.55)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: "#fff", borderRadius: 18, width: "100%", maxWidth: 900, maxHeight: "92vh", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 20px 60px rgba(0,0,0,.3)" }}>

        {/* Header */}
        <div style={{ padding: "18px 24px 14px", background: "linear-gradient(135deg,#1a2332,#1a5c8a)", flexShrink: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <h2 style={{ margin: "0 0 6px", fontSize: 19, fontWeight: 900, color: "#fff" }}>{client.nom}</h2>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {[client.forme, client.tva, client.activite, `CA ${fmtM(client.ca)}`].map(l => <Badge key={l} label={l} color="#7ecbf7" />)}
                <Badge label={client.statut} color={sc(client.statut)} />
              </div>
              <div style={{ fontSize: 12, color: "#aac8e0", marginTop: 6 }}>{client.contact} · {client.email} · {client.tel} · Resp : {USERS.find(u => u.id === client.responsable)?.name}</div>
            </div>
            <button onClick={onClose} style={{ background: "rgba(255,255,255,.15)", border: "none", color: "#fff", borderRadius: 8, width: 32, height: 32, fontSize: 16, cursor: "pointer" }}>✕</button>
          </div>
          <div style={{ marginTop: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#aac8e0", marginBottom: 3 }}>
              <span>Avancement global</span><span style={{ fontWeight: 800 }}>{avg}%</span>
            </div>
            <div style={{ background: "rgba(255,255,255,.2)", borderRadius: 6, height: 6 }}>
              <div style={{ width: `${avg}%`, height: "100%", background: avg >= 80 ? "#4de899" : avg >= 50 ? "#ffc93c" : "#ff6b6b", borderRadius: 6 }} />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", borderBottom: "1px solid #e8ecf0", background: "#f7f9fc", overflowX: "auto", flexShrink: 0 }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ border: "none", background: "none", padding: "10px 14px", fontSize: 12, fontWeight: tab === t.id ? 800 : 500, color: tab === t.id ? "#1a5c8a" : "#888", borderBottom: tab === t.id ? "2px solid #1a5c8a" : "2px solid transparent", cursor: "pointer", whiteSpace: "nowrap" }}>{t.label}</button>
          ))}
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflow: "auto", padding: 22 }}>

          {tab === "avancement" && (
            <div>
              <h3 style={{ fontSize: 13, fontWeight: 800, margin: "0 0 14px" }}>Avancement comptable</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
                {[["saisie", "Saisie comptable", "⌨️"], ["rapprochement", "Rapprochement bancaire", "🏦"], ["declarations", "Déclarations fiscales", "📑"], ["bilan", "Bilan / Liasse", "📊"]].map(([key, label, icon]) => (
                  <div key={key} style={{ padding: 14, background: "#f7f9fc", borderRadius: 10, border: "1px solid #e8ecf0" }}>
                    <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 8 }}>{icon} {label}</div>
                    <Bar value={client.avancement[key]} color={client.avancement[key] >= 80 ? "#2d7a4f" : client.avancement[key] >= 50 ? "#b07d1a" : "#c0392b"} />
                    <input type="range" min={0} max={100} value={client.avancement[key]}
                      onChange={e => onUpdate(client.id, { avancement: { ...client.avancement, [key]: +e.target.value } })}
                      style={{ width: "100%", accentColor: "#1a5c8a" }} />
                  </div>
                ))}
              </div>
              <h3 style={{ fontSize: 13, fontWeight: 800, margin: "0 0 12px" }}>Documents</h3>
              {client.docs.map((d, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 12px", background: "#f7f9fc", borderRadius: 8, border: "1px solid #e8ecf0", marginBottom: 6 }}>
                  <span style={{ fontSize: 12, fontWeight: 600 }}>📄 {d.nom}</span>
                  <Badge label={d.statut} color={sc(d.statut)} />
                </div>
              ))}
            </div>
          )}

          {tab === "temps" && <TempsPanel client={client} onUpdate={onUpdate} currentUser={currentUser} />}

          {tab === "demandes" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <h3 style={{ fontSize: 13, fontWeight: 800, margin: 0 }}>Demandes client</h3>
                <Btn small onClick={() => setShowDemandeForm(!showDemandeForm)}>+ Nouvelle</Btn>
              </div>
              {showDemandeForm && (
                <div style={{ padding: 14, background: "#f0f5fa", borderRadius: 10, marginBottom: 14, border: "1px solid #cce0f5" }}>
                  <Input label="Sujet" value={newDemande.sujet} onChange={e => setNewDemande({ ...newDemande, sujet: e.target.value })} placeholder="Sujet..." />
                  <Sel label="Priorité" value={newDemande.priorite} onChange={e => setNewDemande({ ...newDemande, priorite: e.target.value })} options={["Urgente", "Haute", "Normale"]} />
                  <div style={{ display: "flex", gap: 8 }}>
                    <Btn small onClick={() => { if (!newDemande.sujet) return; onUpdate(client.id, { demandes: [...client.demandes, { id: Date.now(), date: "2026-03-28", sujet: newDemande.sujet, statut: "En cours", priorite: newDemande.priorite }] }); setNewDemande({ sujet: "", priorite: "Normale" }); setShowDemandeForm(false); }}>Ajouter</Btn>
                    <Btn small outline onClick={() => setShowDemandeForm(false)}>Annuler</Btn>
                  </div>
                </div>
              )}
              {client.demandes.map(d => (
                <div key={d.id} style={{ padding: 12, background: "#f7f9fc", borderRadius: 10, border: "1px solid #e8ecf0", marginBottom: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700 }}>{d.sujet}</div>
                      <div style={{ fontSize: 11, color: "#aaa" }}>{fmt(d.date)}</div>
                    </div>
                    <div style={{ display: "flex", gap: 6 }}>
                      <Badge label={d.priorite} color={pc(d.priorite.toLowerCase())} />
                      <Badge label={d.statut} color={sc(d.statut)} />
                    </div>
                  </div>
                  {d.statut !== "Traité" && <Btn small style={{ marginTop: 8 }} color="#2d7a4f" onClick={() => onUpdate(client.id, { demandes: client.demandes.map(x => x.id === d.id ? { ...x, statut: "Traité" } : x) })}>✓ Marquer traité</Btn>}
                </div>
              ))}
            </div>
          )}

          {tab === "facturation" && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 18 }}>
                {[
                  { label: "Total facturé", val: client.factures.reduce((s, f) => s + f.montant, 0), color: "#1a5c8a" },
                  { label: "Encaissé", val: client.factures.filter(f => f.statut === "Payée").reduce((s, f) => s + f.montant, 0), color: "#2d7a4f" },
                  { label: "En attente / impayé", val: client.factures.filter(f => f.statut !== "Payée" && f.statut !== "À envoyer").reduce((s, f) => s + f.montant, 0), color: "#c0392b" },
                ].map((k, i) => (
                  <div key={i} style={{ padding: 12, background: "#f7f9fc", borderRadius: 10, border: "1px solid #e8ecf0", textAlign: "center" }}>
                    <div style={{ fontSize: 10, color: "#888", fontWeight: 700, textTransform: "uppercase" }}>{k.label}</div>
                    <div style={{ fontSize: 18, fontWeight: 900, color: k.color, marginTop: 4 }}>{fmtM(k.val)}</div>
                  </div>
                ))}
              </div>
              {client.factures.map(f => (
                <div key={f.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", background: "#f7f9fc", borderRadius: 8, border: "1px solid #e8ecf0", marginBottom: 6 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 800 }}>{f.id}</div>
                    <div style={{ fontSize: 11, color: "#aaa" }}>{f.libelle} · {fmt(f.date)}</div>
                  </div>
                  <div style={{ fontWeight: 900, fontSize: 13 }}>{fmtM(f.montant)}</div>
                  <Badge label={f.statut} color={sc(f.statut)} />
                </div>
              ))}
            </div>
          )}

          {tab === "echeances" && (
            <div>
              <h3 style={{ fontSize: 13, fontWeight: 800, margin: "0 0 14px" }}>Échéances fiscales & sociales</h3>
              {ECHEANCES.filter(e => client.echeancesIds.includes(e.id)).sort((a, b) => new Date(a.date) - new Date(b.date)).map(e => {
                const j = daysLeft(e.date);
                return (
                  <div key={e.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: j <= 7 ? "#fff0f0" : j <= 15 ? "#fffbf0" : "#f7f9fc", borderRadius: 10, border: `1px solid ${j <= 7 ? "#ffcccc" : j <= 15 ? "#ffe5a0" : "#e8ecf0"}`, marginBottom: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 900, color: j <= 7 ? "#c0392b" : j <= 15 ? "#b07d1a" : "#1a5c8a", minWidth: 48, textAlign: "center", background: j <= 7 ? "#ffecec" : j <= 15 ? "#fff4cc" : "#e8f0f8", borderRadius: 8, padding: "3px 6px" }}>J-{j}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, fontWeight: 700 }}>{e.label}</div>
                      <div style={{ fontSize: 11, color: "#aaa" }}>{fmt(e.date)}</div>
                    </div>
                    <Badge label={e.type} color={pc(e.priorite)} />
                  </div>
                );
              })}
            </div>
          )}

          {tab === "espace" && <EspaceClientPanel client={client} />}
          {tab === "ldm" && <LettreMissionPanel client={client} onUpdate={onUpdate} />}

          {tab === "notes" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <h3 style={{ fontSize: 13, fontWeight: 800, margin: 0 }}>Notes internes</h3>
                <Btn small onClick={() => { if (editNotes) onUpdate(client.id, { notes: notesVal }); setEditNotes(!editNotes); }} color={editNotes ? "#2d7a4f" : "#1a5c8a"}>{editNotes ? "✓ Enregistrer" : "✏️ Modifier"}</Btn>
              </div>
              {editNotes
                ? <textarea value={notesVal} onChange={e => setNotesVal(e.target.value)} style={{ width: "100%", minHeight: 180, padding: 14, borderRadius: 10, border: "1px solid #1a5c8a", fontSize: 13, lineHeight: 1.6, resize: "vertical", boxSizing: "border-box" }} />
                : <div style={{ padding: 16, background: "#f7f9fc", borderRadius: 10, border: "1px solid #e8ecf0", fontSize: 13, lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{client.notes}</div>
              }
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// DASHBOARD
// ═══════════════════════════════════════════════════════════
const Dashboard = ({ clients, currentUser, onSelectClient }) => {
  const totalCA = clients.reduce((s, c) => s + c.ca, 0);
  const allFactures = clients.flatMap(c => c.factures);
  const totalEncaisse = allFactures.filter(f => f.statut === "Payée").reduce((s, f) => s + f.montant, 0);
  const impayees = allFactures.filter(f => f.statut === "Impayée").reduce((s, f) => s + f.montant, 0);
  const totalHeures = clients.flatMap(c => c.temps).reduce((s, t) => s + t.duree, 0);
  const urgentes = ECHEANCES.filter(e => clients.some(c => c.echeancesIds.includes(e.id)) && daysLeft(e.date) <= 30).sort((a, b) => new Date(a.date) - new Date(b.date));
  return (
    <div>
      <div style={{ marginBottom: 22 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: "#1a2332", margin: 0 }}>Tableau de bord</h2>
        <p style={{ color: "#888", fontSize: 13, margin: "4px 0 0" }}>{today.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })} · NEOWISE EXPERTISE · {USERS.find(u => u.id === currentUser.id)?.name}</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 12, marginBottom: 22 }}>
        {[
          { label: "Clients", val: clients.length, sub: `${clients.filter(c => c.responsable === currentUser.id).length} à votre charge`, color: "#1a5c8a", icon: "👥" },
          { label: "CA suivi", val: fmtM(totalCA), sub: "Portefeuille total", color: "#2d7a4f", icon: "📊" },
          { label: "Encaissé", val: fmtM(totalEncaisse), sub: "Honoraires réglés", color: "#5a3e8a", icon: "💳" },
          { label: "Impayés", val: fmtM(impayees), sub: `${clients.flatMap(c => c.factures.filter(f => f.statut === "Impayée")).length} facture(s)`, color: "#c0392b", icon: "⚠️" },
          { label: "Heures passées", val: totalHeures + "h", sub: "Ce mois (tous dossiers)", color: "#b07d1a", icon: "⏱" },
        ].map((k, i) => (
          <Card key={i}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: 10, color: "#888", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8 }}>{k.label}</div>
                <div style={{ fontSize: 20, fontWeight: 900, color: k.color, margin: "4px 0 2px" }}>{k.val}</div>
                <div style={{ fontSize: 10, color: "#aaa" }}>{k.sub}</div>
              </div>
              <span style={{ fontSize: 26 }}>{k.icon}</span>
            </div>
          </Card>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 18 }}>
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <h3 style={{ margin: 0, fontSize: 14, fontWeight: 800 }}>⏳ Échéances 30 jours</h3>
            <Badge label={urgentes.length + ""} color="#c0392b" />
          </div>
          {urgentes.map(e => {
            const j = daysLeft(e.date);
            const clientsE = clients.filter(c => c.echeancesIds.includes(e.id));
            return (
              <div key={e.id} style={{ display: "flex", gap: 10, padding: "8px 10px", background: j <= 7 ? "#fff0f0" : j <= 15 ? "#fffbf0" : "#f7f9fc", borderRadius: 8, border: `1px solid ${j <= 7 ? "#ffcccc" : j <= 15 ? "#ffe5a0" : "#e8ecf0"}`, marginBottom: 6 }}>
                <span style={{ fontSize: 11, fontWeight: 900, color: j <= 7 ? "#c0392b" : j <= 15 ? "#b07d1a" : "#1a5c8a", minWidth: 38, textAlign: "center", background: j <= 7 ? "#ffecec" : j <= 15 ? "#fff4cc" : "#e8f0f8", borderRadius: 6, padding: "2px 4px" }}>J-{j}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 700 }}>{e.label}</div>
                  <div style={{ fontSize: 10, color: "#aaa" }}>{fmt(e.date)} · {clientsE.length} client(s)</div>
                </div>
                <Badge label={e.type} color={pc(e.priorite)} />
              </div>
            );
          })}
        </Card>

        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <h3 style={{ margin: 0, fontSize: 14, fontWeight: 800 }}>📁 Avancement dossiers</h3>
          </div>
          {clients.map(c => {
            const avg = Math.round(Object.values(c.avancement).reduce((s, v) => s + v, 0) / 4);
            return (
              <div key={c.id} onClick={() => onSelectClient(c)} style={{ padding: "8px 10px", borderRadius: 8, border: "1px solid #e8ecf0", marginBottom: 6, cursor: "pointer" }}
                onMouseEnter={e => e.currentTarget.style.background = "#f0f5fa"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 12, fontWeight: 700 }}>{c.nom}</span>
                  <Badge label={c.statut} color={sc(c.statut)} />
                </div>
                <Bar value={avg} color={avg >= 80 ? "#2d7a4f" : avg >= 50 ? "#b07d1a" : "#c0392b"} />
              </div>
            );
          })}
        </Card>
      </div>

      {/* Rentabilité globale */}
      <Card>
        <h3 style={{ margin: "0 0 16px", fontSize: 14, fontWeight: 800 }}>📈 Rentabilité globale du cabinet (mois en cours)</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 12 }}>
          {clients.map(c => {
            const cout = c.temps.reduce((s, t) => s + t.duree * (TAUX_HORAIRE[t.collaborateur] || 90), 0);
            const enc = c.factures.filter(f => f.statut === "Payée").reduce((s, f) => s + f.montant, 0);
            const ratio = cout > 0 ? Math.round((enc / cout) * 100) : 0;
            return (
              <div key={c.id} onClick={() => onSelectClient(c)} style={{ padding: 12, background: "#f7f9fc", borderRadius: 10, border: "1px solid #e8ecf0", cursor: "pointer" }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: "#1a2332", marginBottom: 6 }}>{c.nom.split(" ").slice(0, 2).join(" ")}</div>
                <div style={{ fontSize: 16, fontWeight: 900, color: ratio >= 100 ? "#2d7a4f" : ratio >= 70 ? "#b07d1a" : "#c0392b" }}>{ratio}%</div>
                <div style={{ fontSize: 10, color: "#aaa" }}>{fmtM(enc)} / {fmtM(cout)}</div>
                <Bar value={Math.min(ratio, 100)} color={ratio >= 100 ? "#2d7a4f" : ratio >= 70 ? "#b07d1a" : "#c0392b"} />
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// LISTE CLIENTS
// ═══════════════════════════════════════════════════════════
const ClientsList = ({ clients, onSelect, currentUser }) => {
  const [search, setSearch] = useState("");
  const [filterResp, setFilterResp] = useState("all");
  const filtered = clients.filter(c => (c.nom.toLowerCase().includes(search.toLowerCase()) || c.forme.toLowerCase().includes(search.toLowerCase())) && (filterResp === "all" || c.responsable === filterResp));

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: "#1a2332", margin: 0 }}>Clients</h2>
        <Badge label={`${clients.length} dossiers`} color="#1a5c8a" />
      </div>
      <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Rechercher…" style={{ flex: 1, padding: "9px 14px", borderRadius: 8, border: "1px solid #e8ecf0", fontSize: 13 }} />
        <select value={filterResp} onChange={e => setFilterResp(e.target.value)} style={{ padding: "9px 14px", borderRadius: 8, border: "1px solid #e8ecf0", fontSize: 13 }}>
          <option value="all">Tous</option>
          {USERS.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
        </select>
      </div>
      {filtered.map(c => {
        const avg = Math.round(Object.values(c.avancement).reduce((s, v) => s + v, 0) / 4);
        const resp = USERS.find(u => u.id === c.responsable);
        const impayees = c.factures.filter(f => f.statut === "Impayée").reduce((s, f) => s + f.montant, 0);
        const totalHeures = c.temps.reduce((s, t) => s + t.duree, 0);
        const cout = c.temps.reduce((s, t) => s + t.duree * (TAUX_HORAIRE[t.collaborateur] || 90), 0);
        const enc = c.factures.filter(f => f.statut === "Payée").reduce((s, f) => s + f.montant, 0);
        const ratio = cout > 0 ? Math.round((enc / cout) * 100) : 0;
        return (
          <Card key={c.id} onClick={() => onSelect(c)} style={{ padding: 16, marginBottom: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 44, height: 44, background: "linear-gradient(135deg,#1a5c8a,#2d7a4f)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 900, fontSize: 14, flexShrink: 0 }}>
                {c.nom.replace(/[^A-Z]/g, "").slice(0, 2) || c.nom.slice(0, 2).toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 4 }}>
                  <span style={{ fontSize: 14, fontWeight: 800 }}>{c.nom}</span>
                  <Badge label={c.forme} color="#1a5c8a" />
                  <Badge label={c.statut} color={sc(c.statut)} />
                </div>
                <div style={{ maxWidth: 380 }}><Bar value={avg} color={avg >= 80 ? "#2d7a4f" : avg >= 50 ? "#b07d1a" : "#c0392b"} label={`Avancement : ${avg}%`} /></div>
              </div>
              <div style={{ textAlign: "right", fontSize: 12 }}>
                <div>CA : <strong>{fmtM(c.ca)}</strong></div>
                <div style={{ color: ratio >= 100 ? "#2d7a4f" : ratio >= 70 ? "#b07d1a" : "#c0392b", fontWeight: 700 }}>Renta : {ratio}% ({totalHeures}h)</div>
                {impayees > 0 && <div style={{ color: "#c0392b", fontWeight: 700 }}>Impayé : {fmtM(impayees)}</div>}
                <div style={{ color: "#aaa", fontSize: 11 }}>→ {resp?.name}</div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// CALENDRIER FISCAL
// ═══════════════════════════════════════════════════════════
const CalendrierFiscal = ({ clients }) => {
  const [filter, setFilter] = useState("all");
  const types = [...new Set(ECHEANCES.map(e => e.type))];
  const filtered = ECHEANCES.filter(e => filter === "all" || e.type === filter).sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: "#1a2332", margin: 0 }}>Calendrier fiscal</h2>
        <Btn small onClick={() => alert("📅 Toutes les échéances exportées vers Microsoft Outlook 365")}>📅 Exporter Outlook</Btn>
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {["all", ...types].map(t => (
          <button key={t} onClick={() => setFilter(t)} style={{ border: "none", borderRadius: 20, padding: "6px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer", background: filter === t ? "#1a5c8a" : "#f0f4f8", color: filter === t ? "#fff" : "#555" }}>{t === "all" ? "Toutes" : t}</button>
        ))}
      </div>
      {filtered.map(e => {
        const j = daysLeft(e.date);
        const clientsE = clients.filter(c => c.echeancesIds.includes(e.id));
        return (
          <div key={e.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", background: j <= 7 ? "#fff0f0" : j <= 15 ? "#fffbf0" : "#fff", borderRadius: 12, border: `1px solid ${j <= 7 ? "#ffcccc" : j <= 15 ? "#ffe5a0" : "#e8ecf0"}`, marginBottom: 10, boxShadow: "0 1px 3px rgba(0,0,0,.04)" }}>
            <div style={{ textAlign: "center", minWidth: 64, padding: "6px 8px", background: j <= 7 ? "#ffecec" : j <= 15 ? "#fff4cc" : "#f0f5fa", borderRadius: 10 }}>
              <div style={{ fontSize: 18, fontWeight: 900, color: j <= 7 ? "#c0392b" : j <= 15 ? "#b07d1a" : "#1a5c8a" }}>J-{j}</div>
              <div style={{ fontSize: 10, color: "#aaa" }}>{fmt(e.date)}</div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 4 }}>{e.label}</div>
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                {clientsE.map((c, i) => <Badge key={i} label={c.nom} color="#555" />)}
              </div>
            </div>
            <Badge label={e.type} color={pc(e.priorite)} />
          </div>
        );
      })}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// FACTURATION GLOBALE
// ═══════════════════════════════════════════════════════════
const Facturation = ({ clients }) => {
  const [filter, setFilter] = useState("all");
  const allF = clients.flatMap(c => c.factures.map(f => ({ ...f, client: c.nom, email: c.email }))).sort((a, b) => new Date(b.date) - new Date(a.date));
  const filtered = allF.filter(f => filter === "all" || f.statut === filter);
  const stats = { total: allF.reduce((s, f) => s + f.montant, 0), payees: allF.filter(f => f.statut === "Payée").reduce((s, f) => s + f.montant, 0), attente: allF.filter(f => f.statut === "En attente").reduce((s, f) => s + f.montant, 0), impayees: allF.filter(f => f.statut === "Impayée").reduce((s, f) => s + f.montant, 0) };

  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 800, color: "#1a2332", margin: "0 0 20px" }}>Facturation</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 18 }}>
        {[{ l: "Total facturé", v: stats.total, c: "#1a5c8a" }, { l: "Encaissé", v: stats.payees, c: "#2d7a4f" }, { l: "En attente", v: stats.attente, c: "#b07d1a" }, { l: "Impayés 🔴", v: stats.impayees, c: "#c0392b" }].map((k, i) => (
          <Card key={i}><div style={{ fontSize: 10, color: "#888", fontWeight: 700, textTransform: "uppercase" }}>{k.l}</div><div style={{ fontSize: 20, fontWeight: 900, color: k.c, marginTop: 4 }}>{fmtM(k.v)}</div></Card>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        {["all", "Payée", "En attente", "Impayée", "À envoyer"].map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{ border: "none", borderRadius: 20, padding: "6px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer", background: filter === s ? "#1a5c8a" : "#f0f4f8", color: filter === s ? "#fff" : "#555" }}>{s === "all" ? "Toutes" : s}</button>
        ))}
      </div>
      <Card style={{ padding: 0, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr style={{ background: "#f7f9fc" }}>
            {["N° Facture", "Client", "Libellé", "Date", "Montant", "Statut", "Action"].map(h => (
              <th key={h} style={{ padding: "12px 14px", textAlign: "left", fontSize: 11, fontWeight: 800, color: "#888", textTransform: "uppercase", letterSpacing: 0.4 }}>{h}</th>
            ))}
          </tr></thead>
          <tbody>{filtered.map((f, i) => (
            <tr key={f.id} style={{ borderTop: "1px solid #f0f0f0", background: i % 2 ? "#fafbfc" : "#fff" }}>
              <td style={{ padding: "11px 14px", fontSize: 12, fontWeight: 800, color: "#1a5c8a" }}>{f.id}</td>
              <td style={{ padding: "11px 14px", fontSize: 12 }}>{f.client}</td>
              <td style={{ padding: "11px 14px", fontSize: 12, color: "#555" }}>{f.libelle}</td>
              <td style={{ padding: "11px 14px", fontSize: 12, color: "#888" }}>{fmt(f.date)}</td>
              <td style={{ padding: "11px 14px", fontSize: 13, fontWeight: 900 }}>{fmtM(f.montant)}</td>
              <td style={{ padding: "11px 14px" }}><Badge label={f.statut} color={sc(f.statut)} /></td>
              <td style={{ padding: "11px 14px" }}>
                {f.statut === "Impayée" && <Btn small color="#c0392b" onClick={() => alert(`📧 Relance impayé envoyée à ${f.email} via Outlook\nFacture : ${f.id} · ${fmtM(f.montant)}`)}>📧 Relancer</Btn>}
                {f.statut === "À envoyer" && <Btn small onClick={() => alert(`📤 Facture ${f.id} envoyée à ${f.email} via Outlook`)}>📤 Envoyer</Btn>}
              </td>
            </tr>
          ))}</tbody>
        </table>
      </Card>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// ÉCRAN DE CONNEXION
// ═══════════════════════════════════════════════════════════
const CREDENTIALS = [
  { login: "elie.attia", password: "Neowise2026!", userId: "elie" },
  { login: "collaboratrice", password: "Neowise2026!", userId: "collab" },
];

const LoginScreen = ({ onLogin }) => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    setLoading(true);
    setError("");
    setTimeout(() => {
      const match = CREDENTIALS.find(c => c.login === login.trim() && c.password === password);
      if (match) {
        onLogin(USERS.find(u => u.id === match.userId));
      } else {
        setError("Identifiant ou mot de passe incorrect.");
        setLoading(false);
      }
    }, 600);
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#1a2332 0%,#1a3a5c 60%,#1a5c8a 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <div style={{ width: "100%", maxWidth: 420, padding: 24 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ fontSize: 32, fontWeight: 900, color: "#fff", letterSpacing: 1 }}>NEOWISE</div>
          <div style={{ fontSize: 12, color: "#7ecbf7", fontWeight: 600, letterSpacing: 2.5, textTransform: "uppercase", marginTop: 4 }}>Expertise · CRM</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,.4)", marginTop: 8 }}>Elie-Dan ATTIA · Expert-Comptable & CAC</div>
        </div>

        {/* Card */}
        <div style={{ background: "#fff", borderRadius: 20, padding: 36, boxShadow: "0 24px 80px rgba(0,0,0,.35)" }}>
          <h2 style={{ margin: "0 0 6px", fontSize: 20, fontWeight: 800, color: "#1a2332" }}>Connexion</h2>
          <p style={{ margin: "0 0 28px", fontSize: 13, color: "#888" }}>Accès réservé au cabinet</p>

          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#555", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>Identifiant</div>
            <input
              value={login} onChange={e => setLogin(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSubmit()}
              placeholder="elie.attia ou collaboratrice"
              style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: `1.5px solid ${error ? "#ffcccc" : "#dde3ea"}`, fontSize: 13, boxSizing: "border-box", outline: "none", transition: "border .2s" }}
              onFocus={e => e.target.style.borderColor = "#1a5c8a"}
              onBlur={e => e.target.style.borderColor = error ? "#ffcccc" : "#dde3ea"}
            />
          </div>

          <div style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#555", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>Mot de passe</div>
            <div style={{ position: "relative" }}>
              <input
                type={showPwd ? "text" : "password"}
                value={password} onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSubmit()}
                placeholder="••••••••••"
                style={{ width: "100%", padding: "12px 44px 12px 14px", borderRadius: 10, border: `1.5px solid ${error ? "#ffcccc" : "#dde3ea"}`, fontSize: 13, boxSizing: "border-box", outline: "none" }}
                onFocus={e => e.target.style.borderColor = "#1a5c8a"}
                onBlur={e => e.target.style.borderColor = error ? "#ffcccc" : "#dde3ea"}
              />
              <button onClick={() => setShowPwd(!showPwd)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: 16, color: "#888" }}>
                {showPwd ? "🙈" : "👁"}
              </button>
            </div>
          </div>

          {error && <div style={{ fontSize: 12, color: "#c0392b", marginBottom: 16, padding: "8px 12px", background: "#fff0f0", borderRadius: 8, border: "1px solid #ffcccc" }}>⚠️ {error}</div>}

          <button
            onClick={handleSubmit}
            disabled={loading || !login || !password}
            style={{ width: "100%", padding: "13px", background: loading || !login || !password ? "#ccc" : "linear-gradient(135deg,#1a5c8a,#2d7a4f)", color: "#fff", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 800, cursor: loading || !login || !password ? "not-allowed" : "pointer", marginTop: 8, transition: "all .2s", letterSpacing: 0.5 }}>
            {loading ? "Connexion en cours..." : "Se connecter →"}
          </button>

          <div style={{ marginTop: 24, padding: 14, background: "#f7f9fc", borderRadius: 10, border: "1px solid #e8ecf0" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#888", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>Accès cabinet</div>
            <div style={{ fontSize: 12, color: "#555", lineHeight: 1.8 }}>
              <strong>Expert-Comptable :</strong> elie.attia<br />
              <strong>Collaboratrice :</strong> collaboratrice<br />
              <strong>Mot de passe :</strong> Neowise2026!
            </div>
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: 20, fontSize: 11, color: "rgba(255,255,255,.3)" }}>
          © 2026 NEOWISE EXPERTISE · Accès sécurisé
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// APP ROOT
// ═══════════════════════════════════════════════════════════
export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [page, setPage] = useState("dashboard");
  const [clients, setClients] = useState(INITIAL_CLIENTS);
  const [selectedClient, setSelectedClient] = useState(null);

  const updateClient = (id, changes) => {
    setClients(prev => prev.map(c => c.id === id ? { ...c, ...changes } : c));
    setSelectedClient(prev => prev?.id === id ? { ...prev, ...changes } : prev);
  };

  if (!currentUser) return <LoginScreen onLogin={user => setCurrentUser(user)} />;

  const navItems = [
    { id: "dashboard", label: "Tableau de bord", icon: "🏠" },
    { id: "clients", label: "Clients", icon: "👥" },
    { id: "alertes", label: "Alertes", icon: "🔔", badge: clients.flatMap(c => c.factures.filter(f => f.statut === "Impayée")).length + clients.filter(c => c.docs.some(d => d.statut === "Manquant")).length },
    { id: "echeances", label: "Calendrier fiscal", icon: "📅" },
    { id: "facturation", label: "Facturation", icon: "🧾" },
    { id: "integrations", label: "Intégrations", icon: "🔌" },
  ];

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "'DM Sans', system-ui, sans-serif", background: "#f0f4f8", fontSize: 14 }}>
      {/* Sidebar */}
      <div style={{ width: 224, background: "linear-gradient(180deg,#1a2332 0%,#1a3a5c 100%)", display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ padding: "22px 20px 18px", borderBottom: "1px solid rgba(255,255,255,.08)" }}>
          <div style={{ fontSize: 17, fontWeight: 900, color: "#fff", letterSpacing: 0.5 }}>NEOWISE</div>
          <div style={{ fontSize: 10, color: "#7ecbf7", fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase" }}>Expertise · CRM v2</div>
        </div>
        <nav style={{ flex: 1, padding: "14px 10px" }}>
          {navItems.map(item => (
            <button key={item.id} onClick={() => setPage(item.id)} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 12px", background: page === item.id ? "rgba(126,203,247,.15)" : "none", border: "none", borderRadius: 8, color: page === item.id ? "#7ecbf7" : "rgba(255,255,255,.6)", fontWeight: page === item.id ? 700 : 500, fontSize: 13, cursor: "pointer", textAlign: "left", marginBottom: 2, borderLeft: page === item.id ? "3px solid #7ecbf7" : "3px solid transparent", position: "relative" }}>
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              {item.label}
              {item.badge > 0 && <span style={{ marginLeft: "auto", background: "#c0392b", color: "#fff", borderRadius: 10, fontSize: 10, fontWeight: 900, padding: "1px 6px" }}>{item.badge}</span>}
            </button>
          ))}
        </nav>
        <div style={{ padding: "14px 10px", borderTop: "1px solid rgba(255,255,255,.08)" }}>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,.4)", fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Utilisateur actif</div>
          {USERS.map(u => (
            <button key={u.id} onClick={() => setCurrentUser(u)} style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "8px 10px", background: currentUser.id === u.id ? "rgba(255,255,255,.1)" : "none", border: `1px solid ${currentUser.id === u.id ? "rgba(255,255,255,.2)" : "transparent"}`, borderRadius: 8, cursor: "pointer", marginBottom: 4 }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: u.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: "#fff", flexShrink: 0 }}>{u.initials}</div>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#fff" }}>{u.name.split(" ")[0]}</div>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,.5)" }}>{u.role}</div>
              </div>
            </button>
          ))}
          <button onClick={() => { setCurrentUser(null); setPage("dashboard"); }} style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "8px 10px", background: "none", border: "1px solid rgba(255,255,255,.1)", borderRadius: 8, cursor: "pointer", marginTop: 6, color: "rgba(255,255,255,.5)", fontSize: 12, fontWeight: 600 }}>
            🚪 Se déconnecter
          </button>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, overflow: "auto", padding: 26 }}>
        {page === "dashboard" && <Dashboard clients={clients} currentUser={currentUser} onSelectClient={c => { setSelectedClient(c); }} />}
        {page === "clients" && <ClientsList clients={clients} onSelect={setSelectedClient} currentUser={currentUser} />}
        {page === "alertes" && <AlertesPage clients={clients} onUpdate={updateClient} />}
        {page === "echeances" && <CalendrierFiscal clients={clients} />}
        {page === "facturation" && <Facturation clients={clients} />}
        {page === "integrations" && <IntegrationsPage clients={clients} onUpdate={updateClient} />}
      </div>

      {selectedClient && <ClientDetail client={selectedClient} onClose={() => setSelectedClient(null)} currentUser={currentUser} onUpdate={updateClient} />}
    </div>
  );
}
