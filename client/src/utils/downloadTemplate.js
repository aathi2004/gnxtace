/**
 * Generates and triggers an actual browser download for a free template starter package.
 */
export function downloadFreeTemplate(template) {
  const slug = (template.name || 'template')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  const starterKit = {
    templateId: template.id,
    templateName: template.name,
    category: template.category,
    price: "Free",
    license: "MIT Commercial & Personal License",
    description: template.description,
    features: template.features || [],
    tags: template.tags || [],
    repositoryUrl: template.live_demo_url || "https://github.com/form-and-function/starter-kits",
    scaffold: {
      "package.json": {
        name: slug,
        version: "1.0.0",
        private: true,
        type: "module",
        scripts: {
          dev: "vite",
          build: "vite build",
          preview: "vite preview"
        },
        dependencies: {
          react: "^19.0.0",
          "react-dom": "^19.0.0",
          "lucide-react": "^1.0.0",
          tailwindcss: "^4.0.0"
        },
        devDependencies: {
          vite: "^6.0.0",
          "@vitejs/plugin-react": "^4.3.0"
        }
      },
      "README.md": `# ${template.name}\n\n${template.description}\n\n## Category\n${template.category}\n\n## Architecture & Features Included\n${(template.features || []).map((f) => `- ${f}`).join('\n')}\n\n## Technologies\n${(template.tags || []).map((t) => `- ${t}`).join('\n')}\n\n## Quick Start\n\`\`\`bash\nnpm install\nnpm run dev\n\`\`\`\n\nLicense: Perpetual free commercial license provided by Form & Function.\n`
    }
  };

  const jsonString = JSON.stringify(starterKit, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8' });
  const blobUrl = URL.createObjectURL(blob);

  const anchor = document.createElement('a');
  anchor.href = blobUrl;
  anchor.download = `${slug}-starter-kit.json`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(blobUrl);

  return `${slug}-starter-kit.json`;
}
