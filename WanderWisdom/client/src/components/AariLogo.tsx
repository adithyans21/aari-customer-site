import logoImage from "../../public/aari-lite-bg.png";

interface AariLogoProps {
  className?: string;
  size?: number;
}

export default function AariLogo({ className = "", size = 32 }: AariLogoProps) {
  const height = size;
  const width = Math.round((size * 52) / 32);

  return (
    <img
      src={logoImage}
      alt="Aari Logo"
      width={width}
      height={height}
      className={className}
    />
  );
}
