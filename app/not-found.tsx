import { Container } from "@/components/design/Container";
import { LinkButton } from "@/components/design/LinkButton";

export default function NotFound() {
  return (
    <Container className="py-24">
      <p className="text-sm font-semibold uppercase tracking-widest text-muted">404</p>
      <h1 className="mt-3 text-4xl font-bold sm:text-5xl">That page is not in the observatory.</h1>
      <p className="prose-mw mt-5 text-muted">
        The address may have a typo, or the page may have moved. Head back to the start and pick a
        topic from there.
      </p>
      <div className="mt-8">
        <LinkButton href="/">Back to the home page</LinkButton>
      </div>
    </Container>
  );
}
