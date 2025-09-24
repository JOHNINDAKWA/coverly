import { create } from "zustand";
import { persist } from "zustand/middleware";
import { renderTemplate } from "../assets/templates";

/* -------------------- Helpers -------------------- */
const nl = (...lines) => lines.filter((l) => l !== undefined && l !== null && String(l).length).join("\n");

const roleFromJD = (jd) => {
  const text = String(jd || "");
  const m = text.match(
    /(Senior|Lead|Junior)?\s*(Product Manager|Software Engineer|Developer|Designer|Data Analyst|Accountant|Marketing Manager|Customer Support|Operations Manager|Project Manager)/i
  );
  return m ? m[0] : "the advertised role";
};

const companyFromJD = (jd) => {
  const text = String(jd || "");
  const m = text.match(/\b(?:at|with)\s+([A-Z][A-Za-z0-9&.\- ]{2,})/);
  return m ? m[1].trim() : "your company";
};

const yearsFromExp = (profile) => {
  const p = profile || {};
  const exp = p.experience || [];
  if (!exp.length) return 0;
  const totals = exp.map((e) => {
    const sy = parseInt(String(e.start || "").slice(0, 4), 10);
    const ey =
      String(e.end).toLowerCase() === "present"
        ? new Date().getFullYear()
        : parseInt(String(e.end || "").slice(0, 4), 10);
    if (!sy || !ey) return 0;
    const diff = ey - sy;
    return diff > 0 ? diff : 0;
  });
  return totals.reduce((a, b) => a + b, 0);
};

const listTopSkills = (profile, n) => {
  const p = profile || {};
  const k = Array.isArray(p.skills) ? p.skills : [];
  const take = typeof n === "number" ? n : 4;
  return k.slice(0, take).join(", ") || "relevant skills";
};

const firstAchievement = (profile) => {
  const p = profile || {};
  const e = (p.experience || []).find(
    (x) => Array.isArray(x?.bullets) && x.bullets.length > 0
  );
  return e ? e.bullets[0] : "delivered measurable results";
};

const expBlock = (e) => {
  const job = e || {};
  const titleLine = [job.role, job.company, job.city].filter(Boolean).join(" • ");
  const dates = [job.start || "", job.end || "Present"].filter(Boolean).join(" – ");
  const bullets = (job.bullets || []).map((b) => "• " + b).join("\n");
  return nl(titleLine, dates, bullets);
};

/* -------------------- Single-draft builders -------------------- */
function buildResumeDraft(profile, jd) {
  const p = profile || {};
  const name = p.name || "Your Name";
  const contact = [p.email, p.phone, p.location].filter(Boolean).join(" • ");
  const role = roleFromJD(jd);

  const summaryDefault =
    `Applicant for ${role} with ${yearsFromExp(p)}+ years' experience. ` +
    `Strengths: ${listTopSkills(p, 5)}.`;

  const skills = (p.skills || []).join(", ");

  const exp = (p.experience || [])
    .map((e) => expBlock(e))
    .join("\n\n");

  const edu = (p.education || [])
    .map((ed) =>
      [ed.degree, ed.field, ed.school, `${ed.startYear || ""}–${ed.endYear || ""}`]
        .filter(Boolean)
        .join(" • ")
    )
    .join("\n");

  // Optional sections for on-screen draft preview
  const achievements = (p.achievements || []).length
    ? "ACHIEVEMENTS\n" + (p.achievements || []).map((a) => "• " + a).join("\n")
    : "";

  const certs = (p.certifications || []).length
    ? "CERTIFICATIONS\n" +
      (p.certifications || [])
        .map((c) =>
          ["• " + (c.name || ""), c.issuer ? `(${c.issuer})` : "", c.year || ""]
            .filter(Boolean)
            .join(" ")
        )
        .join("\n")
    : "";

  const refs = (p.references || []).length
    ? "REFERENCES\n" +
      (p.references || [])
        .map((r) =>
          [
            "• " + (r.name || ""),
            r.title || "",
            r.company ? `— ${r.company}` : "",
            [r.email, r.phone].filter(Boolean).join(" • "),
          ]
            .filter(Boolean)
            .join(" ")
        )
        .join("\n")
    : "";

  // Single primary draft (used by Generate screen)
  const primary = nl(
    name,
    contact,
    "",
    "PROFILE",
    p.summary ? String(p.summary) : summaryDefault,
    "",
    "SKILLS",
    skills,
    "",
    "EXPERIENCE",
    exp,
    "",
    "EDUCATION",
    edu,
    achievements ? "\n" + achievements : "",
    certs ? "\n\n" + certs : "",
    refs ? "\n\n" + refs : ""
  );

  return { primary };
}

function buildLetterDraft(profile, jd) {
  const p = profile || {};
  const name = p.name || "Your Name";
  const today = new Date().toLocaleDateString();
  const role = roleFromJD(jd);
  const company = companyFromJD(jd);

  const topBullets =
    ((p.experience || [])
      .flatMap((e) => (Array.isArray(e.bullets) ? e.bullets : []))
      .slice(0, 3)) || [];

  const extraLine = (p.achievements && p.achievements[0])
    ? ` I recently ${p.achievements[0].toLowerCase()}.`
    : (p.certifications && p.certifications[0] && p.certifications[0].name)
    ? ` I also hold ${p.certifications[0].name}${
        p.certifications[0].issuer ? " from " + p.certifications[0].issuer : ""
      }.`
    : "";

  const primary = nl(
    today,
    "",
    "Dear Hiring Manager,",
    "",
    `I’m excited to apply for the ${role} at ${company}. With ${yearsFromExp(p)}+ years’ experience, I bring ${listTopSkills(p, 3)} and a track record of measurable results.` + extraLine,
    "",
    "Highlights:",
    topBullets.length ? topBullets.map((b) => "• " + b).join("\n") : "• Drove measurable impact in prior roles.",
    "",
    `I’d welcome the chance to discuss how I can help ${company} hit its goals. Thank you for your time and consideration.`,
    "",
    "Sincerely,",
    name,
    [p.email, p.phone, p.location].filter(Boolean).join(" • ")
  );

  return { primary };
}

/* -------------------- Initial state -------------------- */
const initialState = {
  stage: 0,
  docType: "cv", // 'cv' | 'cover-letter'
  files: [],
  jobAdFiles: [],
  jdText: "",
  extractedProfile: null,

  drafts: null,             // { primary: string }
  selectedDraftKey: null,   // "primary"
  previewHTML: "",
  selectedTemplate: null,
};

/* -------------------- Store -------------------- */
export const useAppStore = create(
  persist(
    (set, get) => ({
      ...initialState,

      selectTemplate: (tpl) => set({ selectedTemplate: tpl }),

      setDocTypeFromQuery: (t) => {
        const val = t === "cover-letter" ? "cover-letter" : "cv";
        set({ docType: val });
      },

      // used by upsell flow to flip cv <-> cover-letter
      switchDocType: (t) => set({ docType: t }),

      addFiles: (fs) => set((state) => ({ files: state.files.concat(fs || []) })),
      setJobAdFiles: (fs) => set({ jobAdFiles: fs || [] }),

      setJDText: (txt) => set({ jdText: String(txt || "") }),

      extractProfile: async () => {
        const s = get();
        if (s.extractedProfile) {
          set({ stage: Math.max(s.stage, 1) });
          return;
        }
        set({
          extractedProfile: {
            name: "",
            title: "",
            email: "",
            phone: "",
            location: "",
            skills: [],
            experience: [],
            education: [],
            // NEW optional sections kept in state
            achievements: [],
            certifications: [], // [{name, issuer, year}]
            references: [],     // [{name, title, company, email, phone}]
          },
          stage: Math.max(s.stage, 1),
        });
      },

      // Generate exactly ONE draft and auto-select it
      generateDrafts: async () => {
        const s = get();
        const profile = s.extractedProfile || {};
        const jd = s.jdText || "";

        const drafts = s.docType === "cv"
          ? buildResumeDraft(profile, jd)   // { primary }
          : buildLetterDraft(profile, jd);  // { primary }

        set({
          drafts,
          selectedDraftKey: "primary",
          stage: Math.max(s.stage, 2),
        });
      },

      chooseDraft: (key) => set({ selectedDraftKey: key }),

      preparePreview: async () => {
        const s = get();
        const draftText =
          s.selectedDraftKey
            ? s.drafts?.[s.selectedDraftKey] || ""
            : s.drafts?.primary || ""; // fallback to primary if key not set

        const tplId = s.selectedTemplate?.id || "sleek";
        const html = renderTemplate({
          templateId: tplId,
          docType: s.docType,
          profile: s.extractedProfile || {},
          body: draftText,
        });
        set({ previewHTML: html, stage: Math.max(s.stage, 3) });
      },

      reset: () => set({ ...initialState }),
    }),
    {
      name: "coverly-storage",
      // keep only durable bits in storage (profile is enough)
      partialize: (state) => ({
        extractedProfile: state.extractedProfile,
      }),
    }
  )
);
