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
          className="inline-block rounded-lg border border-purple-500/40 bg-purple-500/10 px-4 py-2 text-sm font-medium text-purple-900 transition-colors hover:bg-purple-500/15 dark:border-purple-500/30 dark:bg-purple-500/20 dark:text-purple-300 dark:hover:bg-purple-500/30"
        >
          {skill}
        </span>
      ))}
    </div>
  )
}
