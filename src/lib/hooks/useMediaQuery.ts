import * as React from "react";

type Size = {
  height: number;
  width: number;
};

const useMediaQuery = (): [number, number] => {
  const [size, setSize] = React.useState<Size>({
    width: 0,
    height: 0,
  });

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const handleResize = () => {
        setSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      };

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  });

  return [size.width, size.height];
};

export default useMediaQuery;
