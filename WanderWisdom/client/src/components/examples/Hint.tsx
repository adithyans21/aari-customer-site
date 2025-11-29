import Hint from "../Hint";

export default function HintExample() {
  return (
    <div className="p-8 bg-background">
      <Hint text="This is a helpful hint that appears when you hover or click the icon. Try hovering for 2 seconds!">
        <span className="text-foreground">Hover or click for a hint</span>
      </Hint>
    </div>
  );
}
