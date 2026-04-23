// src/content.config.ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

// ── Shared flex helpers ──────────────────────────
const flexDate = z
  .union([z.string(), z.date().transform((d) => d.toISOString().split('T')[0])])
  .nullable()
  .optional();

const flexStringArray = z
  .union([
    z.string(),
    z.array(z.union([z.string(), z.null()])).transform((arr) =>
      arr.filter((x): x is string => x !== null),
    ),
  ])
  .nullable()
  .optional();

// ── Canonical ID: reject ??? / NAN / empty ─────────────────────────────────
const canonicalId = z
  .union([z.number(), z.string()])
  .transform((v) => String(v).trim())
  .refine((v) => v !== '' && v !== '???' && !Number.isNaN(Number(v)) || v.includes('-'), {
    message: 'mascotId must be a real identifier — not ???, NAN, or empty',
  })
  .nullable()
  .optional();

// ── Enums ──────────────────────────────────────
const corruptionLevel = z.enum(['none', 'low', 'medium', 'high', 'critical']).nullable().optional();
const glitchFrequency = z.enum(['none', 'rare', 'low', 'medium', 'high', 'burst', 'constant']).nullable().optional();
const renderState = z.enum(['deferred', 'active', 'corrupted', 'phantom', 'archived']).nullable().optional();
const completionState = z.enum(['draft', 'partial', 'full', 'canonical']).default('draft');

export const mascots = defineCollection({
  loader: glob({ base: './src/content/docs/mascots', pattern: '**/*.md' }),
  schema: z
    .object({
      // IDENTITY
      mascotId: canonicalId,
      name: z.string().nullable().optional(),
      title: z.string().nullable().optional(),
      slug: z.string().nullable().optional(),
      emoji: z.string().nullable().optional(),
      emojiUrl: z.string().nullable().optional(),

      // PREVIEW
      tagline: z.string().nullable().optional(),
      description: z.string().nullable().optional(),
      summary: z.string().nullable().optional(),
      slogan: z.string().nullable().optional(),
      subtitle: z.string().nullable().optional(),

      // COMPLETION
      completionState,

      // STAT BLOCK
      corruptionLevel,
      glitchFrequency,
      renderState,
      rotAffinity: z.string().nullable().optional(),
      emotionalIntegrity: z.string().nullable().optional(),
      emotionalIntegrityBuffer: z.string().nullable().optional(),

      // DATES
      date: z.coerce.date().nullable().optional(),
      updatedAt: z.coerce.date().nullable().optional(),
      lastKnownGoodState: flexDate,
      firstSeen: flexDate,
      lastSeen: flexDate,

      // STATUS
      status: z.string().nullable().optional(),
      deprecated: z.boolean().nullable().optional(),
      visibility: z.string().nullable().optional(),

      // LORE
      origin: z.string().nullable().optional(),
      manifestedBy: z.string().nullable().optional(),
      mascotLineage: z.string().nullable().optional(),
      systemAffiliation: z.string().nullable().optional(),
      breedingProgram: z.string().nullable().optional(),
      knownFailures: flexStringArray,
      ceremonialTasks: flexStringArray,
      notes: z.string().nullable().optional(),

      // META
      author: z.string().nullable().optional(),
      compiledBy: z.string().nullable().optional(),
      version: z.union([z.string(), z.number().transform(String)]).nullable().optional(),
      tags: flexStringArray,

      // ASSETS
      image: z.string().nullable().optional(),
      imageUrl: z.string().nullable().optional(),

      // SORA
      soraPrompt: z.unknown().optional(),
      soraPromptEnabled: z.boolean().nullable().optional(),
      soraConfig: z.unknown().optional(),
    })
    .transform((data) => {
      const displayName = data.name ?? data.title ?? null;
      const rawDesc = data.description ?? data.summary ?? data.slogan ?? data.subtitle ?? null;
      const cardDescription = data.tagline ?? (rawDesc ? rawDesc.slice(0, 120) : null);
      const isComplete = !!(displayName && cardDescription);
      const hasLore = !!(data.origin || (data.knownFailures?.length ?? 0) > 0);
      const derivedState =
        !displayName
          ? 'draft'
          : !cardDescription
          ? 'draft'
          : hasLore && data.corruptionLevel
          ? 'full'
          : isComplete
          ? 'partial'
          : 'draft';

      return {
        ...data,
        displayName,
        cardDescription,
        isComplete,
        completionState: data.completionState !== 'draft' ? data.completionState : derivedState,
      };
    }),
});

const lorelogSeverity = z
  .enum(['info', 'notice', 'warning', 'critical', 'classified'])
  .default('info');

const lorelogDisposition = z
  .enum(['filed', 'archived', 'contested', 'deferred', 'expunged', 'redacted'])
  .default('filed');

const lorelogResolution = z
  .enum(['pending', 'resolved', 'unresolvable', 'appealed', 'void'])
  .default('pending');

const lorelogClassification = z
  .enum(['public', 'internal', 'restricted', 'sealed'])
  .default('public');

const lorelog = defineCollection({
  loader: glob({ base: './src/content/lorelog', pattern: '*.md' }),
  schema: z.object({
    // REQUIRED
    title:        z.string(),
    date:         z.coerce.date(),
    versionLabel: z.string(),
    description:  z.string(),
    // STATUS
    severity:       lorelogSeverity,
    disposition:    lorelogDisposition,
    resolution:     lorelogResolution,
    classification: lorelogClassification,
    // BUREAUCRATIC IDENTITY
    caseNumber:  z.string().optional(),
    filedBy:     z.string().optional(),
    filedAt:     z.string().optional(),
    // RELATIONS
    mascotRef:      z.string().optional(),
    relatedEntries: z.array(z.string()).optional(),
    // IMPACT
    affectedSystems: z.array(z.string()).optional(),
    escalationPath:  z.string().optional(),
    // META
    tags:     z.array(z.string()).optional(),
    notes:    z.string().optional(),
    redacted: z.boolean().default(false),
  }),
});

const logSchema = z.object({
  title: z.string(),
  date: z.coerce.date(),
  summary: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

const releases = defineCollection({
  loader: glob({ base: './src/content/docs/releases', pattern: '**/*.md' }),
  schema: logSchema,
});

const changelog = defineCollection({
  loader: glob({ base: './src/content/docs/changelog', pattern: '**/*.md' }),
  schema: logSchema,
});

export const collections = {
  docs: defineCollection({ loader: docsLoader(), schema: docsSchema() }),
  mascots,
  lorelog,
  releases,
  changelog,
};

