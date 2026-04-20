import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const root = process.cwd();
const guidesPath = path.join(root, 'src/content/guides');

export async function getAllGuides() {
  const files = fs.readdirSync(guidesPath);

  return files.reduce((allGuides: any[], fileName) => {
    const source = fs.readFileSync(path.join(guidesPath, fileName), 'utf8');
    const { data } = matter(source);

    return [
      {
        ...data,
        slug: fileName.replace('.mdx', ''),
      },
      ...allGuides,
    ];
  }, []);
}

export async function getGuideBySlug(slug: string) {
  const fullPath = path.join(guidesPath, `${slug}.mdx`);
  if (!fs.existsSync(fullPath)) return null;

  const source = fs.readFileSync(fullPath, 'utf8');
  const { data, content: rawContent } = matter(source);

  // Parse `<details>` and `<summary>` via regex and convert to <FaqApp question="...">
  // The \n\n around body ensures that MDX processes the interior as Markdown properly.
  const content = rawContent.replace(/<details[^>]*>\s*<summary>([\s\S]*?)<\/summary>([\s\S]*?)<\/details>/gi, (match, summary, body) => {
    return `<FaqApp question="${summary.trim().replace(/"/g, '&quot;')}">\n\n${body.trim()}\n\n</FaqApp>`;
  });

  return {
    meta: data,
    content,
  };
}
