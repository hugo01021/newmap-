"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, type ReactNode } from "react";
import type { Account, Onboarding, PlanId, ServerSpec, WizardAnswers, WizardState } from "./types";

const STORAGE_KEY = "servcraft:wizard:v1";

export const initialState: WizardState = {
  prompt: "",
  answers: {},
  spec: null,
  plan: null,
  account: null,
  paid: false,
  built: false,
  server: null,
  onboarding: { cfxKey: "", cfxDone: false, discordCreated: false, discordBuilt: false, playDone: false },
  billing: null,
};

type Action =
  | { type: "hydrate"; state: WizardState }
  | { type: "setPrompt"; prompt: string }
  | { type: "answer"; answers: Partial<WizardAnswers> }
  | { type: "setSpec"; spec: ServerSpec | null }
  | { type: "patchSpec"; spec: Partial<ServerSpec> }
  | { type: "setPlan"; plan: PlanId }
  | { type: "setAccount"; account: Account | null }
  | { type: "setPaid"; paid: boolean }
  | { type: "setServer"; server: WizardState["server"] }
  | { type: "setOnboarding"; patch: Partial<Onboarding> }
  | { type: "setBilling"; billing: WizardState["billing"] }
  | { type: "newServer" }
  | { type: "reset" };

function reducer(state: WizardState, action: Action): WizardState {
  switch (action.type) {
    case "hydrate":
      // Les parcours sauvegardés avant l'ajout d'un champ gardent des valeurs par défaut.
      return { ...initialState, ...action.state, onboarding: { ...initialState.onboarding, ...(action.state.onboarding ?? {}) } };
    case "setPrompt":
      // Un nouveau prompt invalide la fiche générée.
      return { ...state, prompt: action.prompt, spec: state.prompt === action.prompt ? state.spec : null };
    case "answer":
      return { ...state, answers: { ...state.answers, ...action.answers }, spec: null };
    case "setSpec":
      return { ...state, spec: action.spec };
    case "patchSpec":
      return state.spec ? { ...state, spec: { ...state.spec, ...action.spec } } : state;
    case "setPlan":
      return { ...state, plan: action.plan };
    case "setAccount":
      return { ...state, account: action.account };
    case "setPaid":
      return { ...state, paid: action.paid };
    case "setServer":
      return { ...state, server: action.server, built: Boolean(action.server) };
    case "setOnboarding":
      return { ...state, onboarding: { ...state.onboarding, ...action.patch } };
    case "setBilling":
      return { ...state, billing: action.billing };
    case "newServer":
      // Nouveau parcours : on garde uniquement le compte.
      return { ...initialState, account: state.account };
    case "reset":
      return initialState;
    default:
      return state;
  }
}

interface WizardContextValue {
  state: WizardState;
  hydrated: boolean;
  setPrompt: (prompt: string) => void;
  answer: (answers: Partial<WizardAnswers>) => void;
  setSpec: (spec: ServerSpec | null) => void;
  patchSpec: (spec: Partial<ServerSpec>) => void;
  setPlan: (plan: PlanId) => void;
  setAccount: (account: Account | null) => void;
  setPaid: (paid: boolean) => void;
  setServer: (server: WizardState["server"]) => void;
  setOnboarding: (patch: Partial<Onboarding>) => void;
  setBilling: (billing: WizardState["billing"]) => void;
  newServer: () => void;
  reset: () => void;
}

const WizardContext = createContext<WizardContextValue | null>(null);

export function WizardProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [hydrated, markHydrated] = useReducer(() => true, false);

  // Lecture du parcours sauvegardé (permet de revenir en arrière et de reprendre).
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) dispatch({ type: "hydrate", state: JSON.parse(raw) as WizardState });
    } catch {
      /* stockage indisponible : on continue sans persistance */
    }
    markHydrated();
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state, hydrated]);

  const setPrompt = useCallback((prompt: string) => dispatch({ type: "setPrompt", prompt }), []);
  const answer = useCallback((answers: Partial<WizardAnswers>) => dispatch({ type: "answer", answers }), []);
  const setSpec = useCallback((spec: ServerSpec | null) => dispatch({ type: "setSpec", spec }), []);
  const patchSpec = useCallback((spec: Partial<ServerSpec>) => dispatch({ type: "patchSpec", spec }), []);
  const setPlan = useCallback((plan: PlanId) => dispatch({ type: "setPlan", plan }), []);
  const setAccount = useCallback((account: Account | null) => dispatch({ type: "setAccount", account }), []);
  const setPaid = useCallback((paid: boolean) => dispatch({ type: "setPaid", paid }), []);
  const setServer = useCallback((server: WizardState["server"]) => dispatch({ type: "setServer", server }), []);
  const setOnboarding = useCallback((patch: Partial<Onboarding>) => dispatch({ type: "setOnboarding", patch }), []);
  const setBilling = useCallback((billing: WizardState["billing"]) => dispatch({ type: "setBilling", billing }), []);
  const newServer = useCallback(() => dispatch({ type: "newServer" }), []);
  const reset = useCallback(() => dispatch({ type: "reset" }), []);

  const value = useMemo<WizardContextValue>(
    () => ({ state, hydrated, setPrompt, answer, setSpec, patchSpec, setPlan, setAccount, setPaid, setServer, setOnboarding, setBilling, newServer, reset }),
    [state, hydrated, setPrompt, answer, setSpec, patchSpec, setPlan, setAccount, setPaid, setServer, setOnboarding, setBilling, newServer, reset],
  );

  return <WizardContext.Provider value={value}>{children}</WizardContext.Provider>;
}

export function useWizard() {
  const ctx = useContext(WizardContext);
  if (!ctx) throw new Error("useWizard doit être utilisé dans WizardProvider");
  return ctx;
}

/** Fiche de démonstration utilisée quand on ouvre le panel sans avoir créé de serveur. */
export const demoSpec: ServerSpec = {
  name: "Los Santos Legacy",
  tagline: "Une ville qui vit, même quand tu dors.",
  language: "Français",
  style: "semi",
  players: 64,
  economy: "realiste",
  jobs: ["Police", "EMS", "Mécano", "Taxi"],
  gangs: ["Ballas", "Vagos"],
  options: ["Whitelist avec candidatures", "Discord généré automatiquement", "Immobilier et location", "Braquages"],
};

export const labels = {
  seriousness: { casual: "Casual", semi: "Semi-RP", hardcore: "Hardcore RP" },
  economy: { rapide: "Rapide", realiste: "Réaliste", hardcore: "Hardcore" },
} as const;
