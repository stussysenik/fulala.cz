import Intro from "../components/Intro";
import FlipNav from "../components/FlipNav";

export default function Home() {
  return (
    <main>
      <FlipNav next="/menu" />
      <Intro />
    </main>
  );
}
