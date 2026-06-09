export function PageHeading({ title, description }) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold tracking-tight text-slate-950">
        {title}
      </h1>
      <p className="mt-2 max-w-2xl text-slate-600">{description}</p>
    </div>
  )
}
