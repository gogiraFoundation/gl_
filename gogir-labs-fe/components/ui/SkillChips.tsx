interface SkillChipsProps {
  skills: string | string[]
  className?: string
}

export function SkillChips({ skills, className = '' }: SkillChipsProps) {
  // Convert string to array if needed
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
          className="inline-block rounded-lg border border-purple-500/30 bg-purple-500/20 px-4 py-2 text-sm font-medium text-purple-300 transition-colors hover:bg-purple-500/30"
        >
          {skill}
        </span>
      ))}
    </div>
  )
}
