export default function ContentBlock({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[#F7F8FA] shadow-sm rounded-md overflow-hidden w-full h-full">
      {children}
    </div>
  );
}
