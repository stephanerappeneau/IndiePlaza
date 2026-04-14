export const SimulatorBodyText = ({
  text,
  className,
}: {
  text: string;
  className?: string;
}) => <div className={`font-light  text-[20px] ${className}`}>{text}</div>;

export const SimulatorTitleText = ({
  text,
  className,
}: {
  text: string;
  className?: string;
}) => <div className={`text-[32px]  font-bold ${className}`}>{text}</div>;
