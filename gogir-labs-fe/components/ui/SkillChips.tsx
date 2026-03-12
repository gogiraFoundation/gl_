interface SkillChipsProps {
  skills: string | string[]
  className?: string
}

export function SkillChips({ skills, className = '' }: SkillChipsProps) {
  // Convert string to array if needed
  const skillsArray = typeof skills === 'string' 
    ? skills.split(',').map(s => s.trim()).filter(s => s.length > 0)
    : skills

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {skillsArray.map((skill, index) => (
        <span
          key={index}
          className="inline-block px-4 py-2 rounded-lg bg-purple-500/20 text-purple-300 text-sm font-medium border border-purple-500/30 hover:bg-purple-500/30 transition-colors"
        >
          {skill}
        </span>
      ))}
    </div>
  )
}

