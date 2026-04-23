import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ResumeData, Education, WorkExperience, Skill, Project, Certification, CustomSection, PersonalInfo } from '../types/resume';
import { createEmptyResume, DEFAULT_SECTION_ORDER } from '../types/resume';

interface ResumeState {
  resume: ResumeData;
  setResume: (resume: ResumeData) => void;
  updatePersonalInfo: (info: Partial<PersonalInfo>) => void;
  setSummary: (summary: string) => void;
  setEducation: (education: Education[]) => void;
  addEducation: (education: Education) => void;
  removeEducation: (id: string) => void;
  updateEducation: (id: string, data: Partial<Education>) => void;
  setWorkExperience: (experience: WorkExperience[]) => void;
  addWorkExperience: (experience: WorkExperience) => void;
  removeWorkExperience: (id: string) => void;
  updateWorkExperience: (id: string, data: Partial<WorkExperience>) => void;
  setSkills: (skills: Skill[]) => void;
  addSkill: (skill: Skill) => void;
  removeSkill: (id: string) => void;
  updateSkill: (id: string, data: Partial<Skill>) => void;
  setProjects: (projects: Project[]) => void;
  addProject: (project: Project) => void;
  removeProject: (id: string) => void;
  updateProject: (id: string, data: Partial<Project>) => void;
  setCertifications: (certifications: Certification[]) => void;
  addCertification: (certification: Certification) => void;
  removeCertification: (id: string) => void;
  updateCertification: (id: string, data: Partial<Certification>) => void;
  setCustomSections: (sections: CustomSection[]) => void;
  addCustomSection: (section: CustomSection) => void;
  removeCustomSection: (id: string) => void;
  updateCustomSection: (id: string, data: Partial<CustomSection>) => void;
  updateMeta: (meta: Partial<ResumeData['meta']>) => void;
  resetResume: () => void;
}

function updateList<T extends { id: string }>(
  list: T[],
  id: string,
  data: Partial<T>,
): T[] {
  return list.map((item) => (item.id === id ? { ...item, ...data } : item));
}

export const useResumeStore = create<ResumeState>()(
  persist(
    (set) => ({
      resume: createEmptyResume(),

      setResume: (resume) => set({ resume }),

      updatePersonalInfo: (info) =>
        set((state) => ({
          resume: {
            ...state.resume,
            personalInfo: { ...state.resume.personalInfo, ...info },
            meta: { ...state.resume.meta, updatedAt: new Date().toISOString() },
          },
        })),

      setSummary: (summary) =>
        set((state) => ({
          resume: { ...state.resume, summary, meta: { ...state.resume.meta, updatedAt: new Date().toISOString() } },
        })),

      setEducation: (education) =>
        set((state) => ({
          resume: { ...state.resume, education, meta: { ...state.resume.meta, updatedAt: new Date().toISOString() } },
        })),
      addEducation: (education) =>
        set((state) => ({
          resume: { ...state.resume, education: [...state.resume.education, education] },
        })),
      removeEducation: (id) =>
        set((state) => ({
          resume: { ...state.resume, education: state.resume.education.filter((e) => e.id !== id) },
        })),
      updateEducation: (id, data) =>
        set((state) => ({
          resume: { ...state.resume, education: updateList(state.resume.education, id, data) },
        })),

      setWorkExperience: (workExperience) =>
        set((state) => ({
          resume: { ...state.resume, workExperience, meta: { ...state.resume.meta, updatedAt: new Date().toISOString() } },
        })),
      addWorkExperience: (experience) =>
        set((state) => ({
          resume: { ...state.resume, workExperience: [...state.resume.workExperience, experience] },
        })),
      removeWorkExperience: (id) =>
        set((state) => ({
          resume: { ...state.resume, workExperience: state.resume.workExperience.filter((e) => e.id !== id) },
        })),
      updateWorkExperience: (id, data) =>
        set((state) => ({
          resume: { ...state.resume, workExperience: updateList(state.resume.workExperience, id, data) },
        })),

      setSkills: (skills) =>
        set((state) => ({
          resume: { ...state.resume, skills, meta: { ...state.resume.meta, updatedAt: new Date().toISOString() } },
        })),
      addSkill: (skill) =>
        set((state) => ({
          resume: { ...state.resume, skills: [...state.resume.skills, skill] },
        })),
      removeSkill: (id) =>
        set((state) => ({
          resume: { ...state.resume, skills: state.resume.skills.filter((s) => s.id !== id) },
        })),
      updateSkill: (id, data) =>
        set((state) => ({
          resume: { ...state.resume, skills: updateList(state.resume.skills, id, data) },
        })),

      setProjects: (projects) =>
        set((state) => ({
          resume: { ...state.resume, projects, meta: { ...state.resume.meta, updatedAt: new Date().toISOString() } },
        })),
      addProject: (project) =>
        set((state) => ({
          resume: { ...state.resume, projects: [...state.resume.projects, project] },
        })),
      removeProject: (id) =>
        set((state) => ({
          resume: { ...state.resume, projects: state.resume.projects.filter((p) => p.id !== id) },
        })),
      updateProject: (id, data) =>
        set((state) => ({
          resume: { ...state.resume, projects: updateList(state.resume.projects, id, data) },
        })),

      setCertifications: (certifications) =>
        set((state) => ({
          resume: { ...state.resume, certifications, meta: { ...state.resume.meta, updatedAt: new Date().toISOString() } },
        })),
      addCertification: (certification) =>
        set((state) => ({
          resume: { ...state.resume, certifications: [...state.resume.certifications, certification] },
        })),
      removeCertification: (id) =>
        set((state) => ({
          resume: { ...state.resume, certifications: state.resume.certifications.filter((c) => c.id !== id) },
        })),
      updateCertification: (id, data) =>
        set((state) => ({
          resume: { ...state.resume, certifications: updateList(state.resume.certifications, id, data) },
        })),

      setCustomSections: (customSections) =>
        set((state) => ({
          resume: { ...state.resume, customSections, meta: { ...state.resume.meta, updatedAt: new Date().toISOString() } },
        })),
      addCustomSection: (section) =>
        set((state) => ({
          resume: { ...state.resume, customSections: [...state.resume.customSections, section] },
        })),
      removeCustomSection: (id) =>
        set((state) => ({
          resume: { ...state.resume, customSections: state.resume.customSections.filter((s) => s.id !== id) },
        })),
      updateCustomSection: (id, data) =>
        set((state) => ({
          resume: { ...state.resume, customSections: updateList(state.resume.customSections, id, data) },
        })),

      updateMeta: (meta) =>
        set((state) => ({
          resume: { ...state.resume, meta: { ...state.resume.meta, ...meta, updatedAt: new Date().toISOString() } },
        })),

      resetResume: () => set({ resume: createEmptyResume() }),
    }),
    {
      name: 'resume-data',
      version: 3,
      migrate: (persisted: unknown) => {
        const state = persisted as Record<string, unknown>;
        const resume = (state?.resume || {}) as Record<string, unknown>;
        const meta = (resume?.meta || {}) as Record<string, unknown>;
        const personalInfo = (resume?.personalInfo || {}) as Record<string, unknown>;
        // Migrate sectionOrder
        if (!meta.sectionOrder) {
          meta.sectionOrder = [...DEFAULT_SECTION_ORDER];
        }
        // Add 'summary' to sectionOrder if missing
        const order = meta.sectionOrder as string[];
        if (!order.includes('summary')) {
          const piIdx = order.indexOf('personalInfo');
          order.splice(piIdx + 1, 0, 'summary');
        }
        // Move summary from personalInfo to top level
        if (personalInfo.summary && !resume.summary) {
          resume.summary = personalInfo.summary;
          delete personalInfo.summary;
        }
        if (resume.summary === undefined) {
          resume.summary = '';
        }
        return { ...state, resume: { ...resume, meta, personalInfo } };
      },
    },
  ),
);
