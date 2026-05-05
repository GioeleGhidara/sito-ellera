interface TocItem {
  id: string;
  title: string;
}

const TableOfContents = ({ items }: { items: TocItem[] }) => {
  if (items.length < 3) return null;

  return (
    <nav className="rounded-xl border border-border/60 bg-muted/30 px-5 py-4 space-y-2">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/70">Indice</p>
      <ol className="space-y-1 list-decimal list-inside">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className="text-sm text-accent hover:text-accent/80 hover:underline transition-colors"
            >
              {item.title}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default TableOfContents;
