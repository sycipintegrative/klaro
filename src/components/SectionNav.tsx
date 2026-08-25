type Section = { id: string; label: string }

type Props = {
  sections: readonly Section[]
  activeId: string
}

export function SectionNav({ sections, activeId }: Props) {
  return (
    <nav className="section-nav" aria-label="Form sections">
      <ol>
        {sections.map((section, index) => (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              className={section.id === activeId ? 'is-active' : undefined}
            >
              <span className="section-nav-num" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              {section.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}
