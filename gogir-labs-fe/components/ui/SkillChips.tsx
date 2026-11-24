interface SkillChipsProps {
  skills: string | string[]
  className?: string
}

export function SkillChips({ skills, className = '' }: SkillChipsProps) {
  const skillsArray =
    typeof skills === 'string'
      ? skills
          .split(',')
          .map((s) => s.trim())
          .filter((s) => s.length > 0)
      : skills

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {skillsArray.map((skill, index) => (
        <span
          key={index}
          className="inline-block border border-brutal-ink/20 bg-brutal-bg px-3 py-1.5 text-sm font-medium text-brutal-ink"
        >
          {skill}
        </span>
      ))}
    </div>
  )
}
