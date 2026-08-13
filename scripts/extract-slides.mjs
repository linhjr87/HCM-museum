// Trích chữ từ các file PPTX của môn học ra markdown thô.
// Chạy tay khi cần đối chiếu nội dung: node scripts/extract-slides.mjs
import AdmZip from 'adm-zip';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const SLIDES_DIR = 'E:/01-STUDY/AI-FPT/9.HCM202/slides';
const OUT_DIR = 'docs/content-raw';

const CHAPTERS = {
  'chuong-2': [4, 5, 6],
  'chuong-3': [7, 8, 9, 10, 11, 12],
  'chuong-4': [13, 14, 15, 16, 17],
  'chuong-5': [19, 20, 21, 22, 23, 24],
};

function readDeck(sessionNumber) {
  const zip = new AdmZip(join(SLIDES_DIR, `Session ${sessionNumber}.pptx`));
  const slides = zip
    .getEntries()
    .filter((entry) => /^ppt\/slides\/slide\d+\.xml$/.test(entry.entryName))
    .sort(
      (a, b) =>
        Number(a.entryName.match(/\d+/)[0]) - Number(b.entryName.match(/\d+/)[0]),
    );

  return slides.map((entry, i) => {
    const xml = entry.getData().toString('utf8');
    const text = [...xml.matchAll(/<a:t>(.*?)<\/a:t>/g)]
      .map((match) => match[1])
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();
    return `### Session ${sessionNumber} — slide ${i + 1}\n\n${text}\n`;
  });
}

mkdirSync(OUT_DIR, { recursive: true });

for (const [chapter, sessions] of Object.entries(CHAPTERS)) {
  const body = sessions.flatMap(readDeck).join('\n');
  writeFileSync(join(OUT_DIR, `${chapter}.md`), `# ${chapter}\n\n${body}`, 'utf8');
  console.log(`đã ghi ${OUT_DIR}/${chapter}.md`);
}
