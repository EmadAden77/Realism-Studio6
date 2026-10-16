/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { PromptComparisonState } from '../../types/scene.ts';

export interface DetailedPromptDiff {
  added: string[];
  removed: string[];
  modified: { before: string; after: string }[];
  unchangedLocked: string[];
}

/**
 * Splits prompt into discrete semantic sentences or clauses for comparison
 */
function tokenizePromptClauses(prompt: string): string[] {
  return prompt
    .split(/\.\s+|\n+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 5);
}

/**
 * Compares two prompts side-by-side and categorizes differences accurately
 * Fulfills TEST 10
 */
export function comparePrompts(
  promptA: string,
  promptB: string,
  nameA: string = 'Version A (السابق)',
  nameB: string = 'Version B (الحالي)'
): PromptComparisonState & { detailedDiff: DetailedPromptDiff } {
  const clausesA = tokenizePromptClauses(promptA);
  const clausesB = tokenizePromptClauses(promptB);

  const addedInstructions: string[] = [];
  const removedInstructions: string[] = [];
  const modifiedProperties: string[] = [];
  const unchangedLockedRequirements: string[] = [];
  const modifiedList: { before: string; after: string }[] = [];

  // Find added and unchanged
  clausesB.forEach((bClause) => {
    const isExactMatch = clausesA.includes(bClause);
    if (isExactMatch) {
      if (
        bClause.toLowerCase().includes('lock') ||
        bClause.toLowerCase().includes('density') ||
        bClause.toLowerCase().includes('21mm') ||
        bClause.toLowerCase().includes('saudi') ||
        bClause.toLowerCase().includes('skull')
      ) {
        unchangedLockedRequirements.push(bClause);
      }
    } else {
      // Check if it's a modification of an existing clause (e.g. both start with "lighting:" or "pose:")
      const colonIndex = bClause.indexOf(':');
      const prefix = colonIndex > 0 ? bClause.substring(0, colonIndex).trim() : null;

      const similarA = prefix ? clausesA.find((a) => a.startsWith(prefix)) : null;

      if (similarA) {
        modifiedProperties.push(`${prefix}: ${bClause}`);
        modifiedList.push({ before: similarA, after: bClause });
      } else {
        addedInstructions.push(bClause);
      }
    }
  });

  // Find removed
  clausesA.forEach((aClause) => {
    const isExactMatch = clausesB.includes(aClause);
    if (!isExactMatch) {
      const colonIndex = aClause.indexOf(':');
      const prefix = colonIndex > 0 ? aClause.substring(0, colonIndex).trim() : null;
      const isModified = prefix ? clausesB.some((b) => b.startsWith(prefix)) : false;

      if (!isModified) {
        removedInstructions.push(aClause);
      }
    }
  });

  return {
    versionA: {
      id: 'ver_a',
      name: nameA,
      prompt: promptA,
      timestamp: Date.now() - 3600000
    },
    versionB: {
      id: 'ver_b',
      name: nameB,
      prompt: promptB,
      timestamp: Date.now()
    },
    addedInstructions,
    removedInstructions,
    modifiedProperties,
    unchangedLockedRequirements,
    detailedDiff: {
      added: addedInstructions,
      removed: removedInstructions,
      modified: modifiedList,
      unchangedLocked: unchangedLockedRequirements
    }
  };
}
