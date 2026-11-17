interface AIReasoningCardProps {
  explainability: {
    overallExplanation: string;
    scoreDeductionDetails: string;
    scoreImprovementDetails: string;
  };
  strengths: Array<{ title: string; explanation: string }>;
  weaknesses: Array<{ title: string; explanation: string }>;
}

const Column = ({
  heading,
  mark,
  items,
  tone,
}: {
  heading: string;
  mark: string;
  items: Array<{ title: string; explanation: string }>;
  tone?: "signal";
}) => (
  <div>
    <h4 className="label flex items-center gap-2 border-b border-border pb-2 text-foreground">
      <span className={tone === "signal" ? "text-signal" : undefined}>{mark}</span>
      {heading}
    </h4>
    <ol className="divide-y divide-border">
      {items.map((item, idx) => (
        <li key={idx} className="grid grid-cols-[1.75rem_1fr] gap-x-2 py-4">
          <span className="font-mono text-xs text-muted-foreground">{String(idx + 1).padStart(2, "0")}</span>
          <div>
            <p className="text-[15px] font-semibold leading-snug">{item.title}</p>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.explanation}</p>
          </div>
        </li>
      ))}
      {items.length === 0 && <li className="py-4 text-sm text-muted-foreground">Nothing to flag here.</li>}
    </ol>
  </div>
);

/** "What's working / what isn't" plus why the score landed where it did. */
export const AIReasoningCard = ({ explainability, strengths, weaknesses }: AIReasoningCardProps) => (
  <div className="space-y-10">
    <div className="grid gap-10 md:grid-cols-2">
      <Column heading="Working" mark="+" items={strengths} />
      <Column heading="Holding it back" mark="−" items={weaknesses} tone="signal" />
    </div>

    {(explainability.scoreDeductionDetails || explainability.scoreImprovementDetails) && (
      <div className="grid gap-8 border-t border-border pt-6 text-sm leading-relaxed md:grid-cols-2">
        {explainability.scoreImprovementDetails && (
          <div>
            <p className="label mb-2 text-foreground">Where the points came from</p>
            <p className="text-muted-foreground">{explainability.scoreImprovementDetails}</p>
          </div>
        )}
        {explainability.scoreDeductionDetails && (
          <div>
            <p className="label mb-2 text-foreground">Where they were lost</p>
            <p className="text-muted-foreground">{explainability.scoreDeductionDetails}</p>
          </div>
        )}
      </div>
    )}
  </div>
);
