import Button from '../components/Button'

/** Stand-in for pages that are not built yet. */
export default function ComingSoon({ title }) {
  return (
    <section className="container-studio grid min-h-[60vh] place-content-center text-center">
      <h1 className="font-display text-[36px] font-semibold tracking-[0.06em]">{title}</h1>
      <p className="mt-3 text-mist">This page is coming soon.</p>
      <Button to="/" className="mx-auto mt-8">Back to home</Button>
    </section>
  )
}
