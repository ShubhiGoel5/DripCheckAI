interface FashionCoachCardProps {
  coaching: {
    fashionPrinciples: string[];
    stylingConcepts: string[];
    colorConcepts: string[];
    silhouetteConcepts: string[];
  };
}

export const FashionCoachCard = ({ coaching }: FashionCoachCardProps) => {
  const sections = [
    { title: "Styling", data: coaching.stylingConcepts },
    { title: "Colour", data: coaching.colorConcepts },
    { title: "Shape", data: coaching.silhouetteConcepts },
    { title: "Rules that last", data: coaching.fashionPrinciples },
  ];

  return (
    <div className="grid gap-x-12 gap-y-8 sm:grid-cols-2">
      {sections.map((sec) => (
        <div key={sec.title}>
          <h4 className="font-display text-2xl leading-none">{sec.title}</h4>
          {sec.data && sec.data.length > 0 ? (
            <ul className="mt-3 border-t border-border">
              {sec.data.map((item, i) => (
                <li key={i} className="border-b border-border py-3 text-sm leading-relaxed text-foreground/85">
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm italic text-muted-foreground">Nothing specific for this look.</p>
          )}
        </div>
      ))}
    </div>
  );
};
