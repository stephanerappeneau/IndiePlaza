interface TabItem {
  label: string;
  content: React.ReactNode;
}

// Define types for the Tab component props
export interface TabsProps {
  tabs: TabItem[];
}
