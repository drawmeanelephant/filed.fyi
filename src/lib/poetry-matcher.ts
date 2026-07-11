import { getCollection } from 'astro:content';

function isMascotMatch(poemRef: string, mascot: any): boolean {
  if (!poemRef || !mascot) return false;
  
  const clean = (s: string) => s
    .replace(/^mascots\//i, '')
    .replace(/\.mdx?$/i, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, ' ')
    .trim();
    
  const rClean = clean(poemRef);
  const rTokens = rClean.split(/\s+/).filter(Boolean);
  
  const rLeadingNumber = rTokens.length > 0 && /^\d+$/.test(rTokens[0]) ? rTokens[0] : null;
  if (rLeadingNumber && mascot.data.mascotId && String(mascot.data.mascotId) === rLeadingNumber) {
    return true;
  }
  
  const cleanMascot = (str: string) => clean(str).split(/\s+/).filter(t => !/^\d+$/.test(t) && t !== 'the');
  
  const mascotTokens = [
    mascot.id,
    mascot.data.slug,
    mascot.data.title,
    mascot.data.displayName,
    mascot.data.name,
  ].filter(Boolean).flatMap(cleanMascot);
  
  const poemTextTokens = rTokens.filter(t => !/^\d+$/.test(t) && t !== 'the');
  
  if (poemTextTokens.length > 0 && mascotTokens.length > 0) {
    const allMatch = poemTextTokens.every(pt => mascotTokens.includes(pt));
    if (allMatch) return true;
    
    const titleTokens = cleanMascot(mascot.data.title || mascot.data.displayName || '');
    if (titleTokens.length > 0 && titleTokens.every(tt => poemTextTokens.includes(tt))) {
      return true;
    }
  }
  
  return false;
}

export const getPoemId = (poem: any) => poem.id.split('/').pop()?.replace(/\.mdx?$/, '').toLowerCase().trim() || '';

export async function getMatchingPoetry(entry: any) {
  const entryId = entry?.id;
  const isMascot = entryId ? entryId.startsWith('mascots/') : false;
  const isLorelog = entryId ? entryId.startsWith('lorelog/') : false;

  let matchingHaikus: any[] = [];
  let matchingLimericks: any[] = [];
  let matchingAphorisms: any[] = [];

  if (isMascot && entryId) {
    const mascots = await getCollection('mascots');
    const cleanEntryId = entryId.replace(/^mascots\//, '').replace(/\.mdx?$/, '').toLowerCase().trim();
    const mascotEntry = mascots.find(m => {
      const cleanMId = m.id.replace(/\.mdx?$/, '').toLowerCase().trim();
      const cleanMDataSlug = m.data.slug ? m.data.slug.replace(/^mascots\//, '').toLowerCase().trim() : '';
      return cleanMId === cleanEntryId || cleanMDataSlug === cleanEntryId;
    });

    const [haikus, limericks, aphorisms] = await Promise.all([
      getCollection('haikus'),
      getCollection('limericks'),
      getCollection('aphorisms'),
    ]);

    if (mascotEntry) {
      matchingHaikus = haikus.filter(h => {
        const refs = [(h.data as any).mascotRef, ...((h.data as any).relatedMascots || [])].filter(Boolean);
        return refs.some(ref => isMascotMatch(ref, mascotEntry));
      });

      matchingLimericks = limericks.filter(l => {
        const refs = [(l.data as any).mascotRef, ...((l.data as any).relatedMascots || [])].filter(Boolean);
        return refs.some(ref => isMascotMatch(ref, mascotEntry));
      });

      matchingAphorisms = aphorisms.filter(a => {
        const refs = [(a.data as any).mascotRef, ...((a.data as any).relatedMascots || [])].filter(Boolean);
        return refs.some(ref => isMascotMatch(ref, mascotEntry));
      });
    }
  }

  if (isLorelog && entry) {
    const relatedH = entry.data.relatedHaiku || [];
    const relatedL = entry.data.relatedLimerick || [];

    if (relatedH.length > 0 || relatedL.length > 0) {
      const [haikus, limericks] = await Promise.all([
        getCollection('haikus'),
        getCollection('limericks'),
      ]);

      matchingHaikus = haikus.filter(h => 
        relatedH.some((rh: any) => {
          const rhName = rh.slug.split('/').pop()?.replace(/\.mdx?$/, '').toLowerCase().trim();
          const hName = h.id.split('/').pop()?.replace(/\.mdx?$/, '').toLowerCase().trim();
          return rhName === hName;
        })
      );

      matchingLimericks = limericks.filter(l => 
        relatedL.some((rl: any) => {
          const rlName = rl.slug.split('/').pop()?.replace(/\.mdx?$/, '').toLowerCase().trim();
          const lName = l.id.split('/').pop()?.replace(/\.mdx?$/, '').toLowerCase().trim();
          return rlName === lName;
        })
      );
    }
  }

  const caseNumber = entry?.data?.caseNumber;
  if (caseNumber) {
    const targetCaseNum = String(caseNumber).toUpperCase().trim();
    if (targetCaseNum) {
      const [haikus, limericks, aphorisms] = await Promise.all([
        getCollection('haikus'),
        getCollection('limericks'),
        getCollection('aphorisms'),
      ]);

      const matchFn = (p: any) => {
        const parentRef = p.data?.parentEntry ?? p.data?.relatedLorelog;
        if (!parentRef) return false;
        const refs = [parentRef].flat().filter(Boolean);
        return refs.some((ref: any) => String(ref).toUpperCase().trim() === targetCaseNum);
      };

      const matchedH = haikus.filter(matchFn);
      const matchedL = limericks.filter(matchFn);
      const matchedA = aphorisms.filter(matchFn);

      matchingHaikus = [...new Set([...matchingHaikus, ...matchedH])];
      matchingLimericks = [...new Set([...matchingLimericks, ...matchedL])];
      matchingAphorisms = [...new Set([...matchingAphorisms, ...matchedA])];
    }
  }

  return {
    matchingHaikus,
    matchingLimericks,
    matchingAphorisms,
    isMascot,
    isLorelog,
  };
}
