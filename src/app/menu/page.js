import FlipNav from "../../components/FlipNav";
import Menu from "../../components/Menu";

export default function MenuPage() {
        return (
                <main style={{ minHeight: "100vh", position: "relative", paddingBottom: "100px" }}>
                        <FlipNav prev="/" />
                        <Menu />
                </main>
        );
}
