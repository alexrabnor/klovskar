import { bildInfo } from "@/lib/bilder";
import { Zoombar } from "./Zoombar";

/** Zoombar med mått och suddig förhandsbild, hämtade på servern. */
export async function ZoombarMedInfo(props: { namn: string; alt: string; prioritet?: boolean }) {
  return <Zoombar {...props} info={await bildInfo(props.namn)} />;
}
