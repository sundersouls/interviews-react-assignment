import { useRef, useCallback } from "react";

export default function ScrollView({
  endReached,
  children,
}: {
  endReached?: () => void;
  children: React.ReactNode;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const onScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el || !endReached) return;

    const { scrollTop, scrollHeight, clientHeight } = el;
    if (scrollHeight - scrollTop - clientHeight < 100) {
      endReached();
    }
  }, [endReached]);

  return (
    <div
      style={{
        display: "flex",
        flexGrow: 1,
        position: "relative",
        width: "100%",
        minHeight: 0,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          position: "absolute",
          inset: 0,
          overflowY: "auto",
        }}
        ref={scrollRef}
        onScroll={onScroll}
      >
        {children}
      </div>
    </div>
  );
}
