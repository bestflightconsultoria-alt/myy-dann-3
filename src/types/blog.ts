export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: 'Guia do Paciente' | 'Uso Medicinal' | 'Legislação';
  readTime: string;
  date: string;
  author: string;
  tags: string[];
  content: string;
}
