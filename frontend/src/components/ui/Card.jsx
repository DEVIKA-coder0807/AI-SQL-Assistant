import { motion } from 'framer-motion'

export default function Card({ title, eyebrow, action, children, className = '' }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className={`glass-card rounded-2xl p-5 sm:p-6 ${className}`}
    >
      {title ? (
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            {eyebrow ? <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-accent">{eyebrow}</p> : null}
            <h3 className="text-lg font-semibold text-brand-text sm:text-xl">{title}</h3>
          </div>
          {action}
        </div>
      ) : null}
      {children}
    </motion.section>
  )
}
