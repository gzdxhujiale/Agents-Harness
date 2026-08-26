export interface Heading { text: string; level: number; line: number; }
export interface DocumentSection extends Heading { content: string; comments: string[]; }
export interface DocumentModel { headings: Heading[]; sections: DocumentSection[]; links: string[]; codeBlocks: string[]; comments: string[]; frontmatter?: string; text: string; }
