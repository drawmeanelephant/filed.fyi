/**
 * FILED & FORGOTTEN — LIMERICK PROCEDURE STYLES
 * 
 * Each style is a full-generation constraint, not a modifier.
 * Only one may apply per limerick. No blending allowed inside output.
 */

export type LimerickStyle =
  | "PROCEDURAL_CLEAN"
  | "INSTITUTIONAL_LEAK"
  | "MISFILED_CONFIDENCE"
  | "FATIGUE_GOLD_BRICK"
  | "ARCHIVAL_MYTH_DRIFT"
  | "TRIVIALITY_ELEVATION"
  | "PROCEDURAL_SILENCE";

/**
 * STYLE DEFINITIONS
 */
export const LIMERICK_STYLES: Record<LimerickStyle, { tone: string; behavior: string[]; failureMode: string; vibe: string }> = {
  PROCEDURAL_CLEAN: {
    tone: "neutral institutional clarity",
    behavior: [
      "strict adherence to form",
      "no metaphor excess",
      "no humor unless structurally implied",
      "language behaves like documentation"
    ],
    failureMode: "overprecision without emotional leakage",
    vibe: "helpdesk system still pretending everything is fine"
  },

  INSTITUTIONAL_LEAK: {
    tone: "formal structure with accidental humor seepage",
    behavior: [
      "bureaucratic phrasing remains dominant",
      "humor appears as unintended side effect",
      "metaphors arise from administrative language collisions",
      "slight absurdity tolerated but not acknowledged"
    ],
    failureMode: "policy language accidentally becomes comedy",
    vibe: "office memo written during system update at 2am"
  },

  MISFILED_CONFIDENCE: {
    tone: "certain but wrong category assignment",
    behavior: [
      "assertive phrasing even when subject is misinterpreted",
      "semantic drift is hidden, not acknowledged",
      "metaphors feel slightly off-domain",
      "logic chain remains intact but points to wrong object"
    ],
    failureMode: "correct grammar applied to incorrect reality mapping",
    vibe: "index system confidently routing to wrong drawer"
  },

  FATIGUE_GOLD_BRICK: {
    tone: "minimal effort compliance",
    behavior: [
      "reduced specificity",
      "generic institutional phrasing",
      "compressed imagery",
      "avoidance of interpretive labor"
    ],
    failureMode: "system meets requirements while clearly disengaged",
    vibe: "printer queue processing requests out of spite"
  },

  ARCHIVAL_MYTH_DRIFT: {
    tone: "institutional record overwritten by folklore behavior",
    behavior: [
      "facts subtly transform into narrative objects",
      "bureaucratic language begins to self-mythologize",
      "historical certainty becomes symbolic",
      "references feel older than they should"
    ],
    failureMode: "archive starts believing its own footnotes",
    vibe: "records department quietly becoming mythology engine"
  },

  TRIVIALITY_ELEVATION: {
    tone: "triviality masquerading as importance",
    behavior: [
      "minor inefficiencies treated as existential threats",
      "meaningless paperwork treated as sacred ritual",
      "printer calibration incident classified as national review event"
    ],
    failureMode: "system deploys maximum procedural weight against microscopic, non-threatening anomalies",
    vibe: "SWAT team called because a timestamp is off by two seconds"
  },

  PROCEDURAL_SILENCE: {
    tone: "silence without commentary",
    behavior: [
      "no metaphor escalation",
      "no joke payoff",
      "just dry procedural record that goes nowhere",
      "creates negative space"
    ],
    failureMode: "system processes an event and simply stops. No reflection, no horror, just dead-end filing",
    vibe: "a blank stare from a clerk who just filed your request into the trash bin and went to lunch"
  }
} as const;
