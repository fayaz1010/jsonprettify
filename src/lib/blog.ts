import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const postsDirectory = path.join(process.cwd(), 'src/app/blog/posts');

export interface PostMeta {
  title: string;
  slug: string;
  date: string;
  excerpt: string;
  author: string;
}

export interface Post extends PostMeta {
  content: string;
}

export function getAllPosts(): PostMeta[] {
  let fileNames: string[];
  try {
    fileNames = fs.readdirSync(postsDirectory).filter((f) => f.endsWith('.md'));
  } catch {
    return [];
  }

  const posts = fileNames.map((fileName) => {
    const filePath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(fileContents);

    return {
      title: data.title,
      slug: data.slug,
      date: data.date,
      excerpt: data.excerpt,
      author: data.author,
    } as PostMeta;
  });

  return posts.sort((a, b) => (a.date > b.date ? -1 : 1));
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const allFiles = fs.readdirSync(postsDirectory).filter((f) => f.endsWith('.md'));

  for (const fileName of allFiles) {
    const filePath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);

    if (data.slug === slug) {
      const processed = await remark().use(html).process(content);

      return {
        title: data.title,
        slug: data.slug,
        date: data.date,
        excerpt: data.excerpt,
        author: data.author,
        content: processed.toString(),
      };
    }
  }

  return null;
}
