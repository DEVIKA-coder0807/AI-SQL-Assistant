export default function Card({ title, children, className = '' }) {
  return (
    <section className={`glass-card rounded-[2rem] p-6 ${className}`}>
      {title ? <h3 className="mb-4 text-xl font-semibold text-white">{title}</h3> : null}
      {children}
    </section>
  )
}
