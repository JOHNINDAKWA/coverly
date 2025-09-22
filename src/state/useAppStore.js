import { create } from "zustand";
import { persist } from "zustand/middleware";
import { renderTemplate } from "../assets/templates";

/* -------------------- Helpers -------------------- */
const nl = (...lines) => lines.filter((l) => l !== undefined && l !== null).join("\n");

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
      e.end === "Present"
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

/* -------------------- Draft builders -------------------- */
function buildResumeDrafts(profile, jd) {
  const p = profile || {};
  const name = p.name || "Your Name";
  const contact = [p.email, p.phone, p.location].filter(Boolean).join(" • ");
  const role = roleFromJD(jd);
  const skills = (p.skills || []).join(", ");
  const exp = (p.experience || []).map(expBlock).join("\n\n");

  const edu = (p.education || [])
    .map((ed) =>
      [ed.degree, ed.field, ed.school, `${ed.startYear || ""}–${ed.endYear || ""}`]
        .filter(Boolean)
        .join(" • ")
    )
    .join("\n");

  const summaryDefault =
    "Applicant for " +
    role +
    " with " +
    yearsFromExp(p) +
    "+ years' experience. Strengths: " +
    listTopSkills(p, 5) +
    ".";

  const concise = nl(
    name,
    contact,
    "",
    "SUMMARY",
    p.summary ? String(p.summary) : summaryDefault,
    "",
    "SKILLS",
    skills,
    "",
    "EXPERIENCE",
    exp,
    "",
    "EDUCATION",
    edu
  );

  const skillsFirst = nl(
    name,
    contact,
    "",
    "SKILLS HIGHLIGHT",
    skills,
    "",
    "EXPERIENCE",
    exp,
    "",
    "EDUCATION",
    edu
  );

  const impact = nl(
    name,
    contact,
    "",
    "PROFILE",
    "Focused on " + role + ". Recently " + firstAchievement(p) + ".",
    "",
    "EXPERIENCE",
    exp,
    "",
    "EDUCATION",
    edu
  );

  return { concise, skillsFirst, impact };
}

function buildLetterDrafts(profile, jd) {
  const p = profile || {};
  const name = p.name || "Your Name";
  const contact = [p.email, p.phone, p.location].filter(Boolean).join(" • ");
  const today = new Date().toLocaleDateString();
  const role = roleFromJD(jd);
  const company = companyFromJD(jd);

  const highlights =
    ((p.experience || [])
      .flatMap((e) => (Array.isArray(e.bullets) ? e.bullets : []))
      .slice(0, 3)
      .map((b) => "• " + b)
      .join("\n")) || "• Drove measurable impact in prior roles.";

  const classic = nl(
    today,
    "",
    "Dear Hiring Manager,",
    "",
    "I am excited to apply for the " +
      role +
      " at " +
      company +
      ". With " +
      yearsFromExp(p) +
      "+ years' experience, I bring " +
      listTopSkills(p, 3) +
      " and a record of delivering results.",
    "",
    "Highlights from my work:",
    highlights,
    "",
    "I would welcome the opportunity to discuss how I can contribute to " +
      company +
      ". Thank you for your time and consideration.",
    "",
    "Sincerely,",
    name,
    contact
  );

  const friendly = nl(
    "Dear Hiring Team,",
    "",
    "Hi, I am " +
      name +
      ". I am applying for the " +
      role +
      " at " +
      company +
      ". I have worked with " +
      listTopSkills(p, 4) +
      ", and recently " +
      firstAchievement(p) +
      ".",
    "",
    "I would love to help " + company + " hit its goals. Looking forward to chatting!",
    "",
    name,
    contact
  );

  return { classic, friendly };
}

/* -------------------- Initial state -------------------- */
const initialState = {
  stage: 0,
  docType: "cv", // 'cv' | 'cover-letter'
  files: [],
  jobAdFiles: [],
  jdText: "",
  extractedProfile: null,

  drafts: null,
  selectedDraftKey: null,
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

      switchDocType: (t) => set({ docType: t }), // ✅ NEW for upsell flow

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
          },
          stage: Math.max(s.stage, 1),
        });
      },

      generateDrafts: async () => {
        const s = get();
        const profile = s.extractedProfile || {};
        const jd = s.jdText || "";

        const drafts =
          s.docType === "cv"
            ? buildResumeDrafts(profile, jd)
            : buildLetterDrafts(profile, jd);

        set({ drafts, stage: Math.max(s.stage, 2) });
      },

      chooseDraft: (key) => set({ selectedDraftKey: key }),

      preparePreview: async () => {
        const s = get();
        const draftText = s.selectedDraftKey
          ? s.drafts?.[s.selectedDraftKey] || ""
          : "";
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
      partialize: (state) => ({
        extractedProfile: state.extractedProfile,
      }),
    }
  )
);
