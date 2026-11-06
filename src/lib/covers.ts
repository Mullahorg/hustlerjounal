import image0 from "@/assets/fundi-electrician.webp";
import image1 from "@/assets/furniture-maker.webp";
import image2 from "@/assets/pricing-notebook.webp";
import image3 from "@/assets/escrow-handshake.webp";
import image4 from "@/assets/journal-launch.webp";
import image5 from "@/assets/milestone-payments.webp";
import image6 from "@/assets/verification-certificate.webp";
const covers: Record<string, string> = {
  "/images/fundi-electrician.jpg": image0,
  "/images/furniture-maker.jpg": image1,
  "/images/pricing-notebook.jpg": image2,
  "/images/escrow-handshake.jpg": image3,
  "/images/journal-launch.jpg": image4,
  "/images/milestone-payments.jpg": image5,
  "/images/verification-certificate.jpg": image6,
};
export function resolveCover(url: string | null) { return url ? covers[url] ?? url : null; }
