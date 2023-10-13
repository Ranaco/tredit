import * as React from "react";
import { Context } from "@/pages/_app";

const Category: React.FC = () => {
  const { state } = React.useContext(Context);

  React.useEffect(() => {
    if (state !== undefined) {
      console.log(state);
    }
  }, []);
  return (
    <div>
      <span>Category</span>
    </div>
  );
};

export default Category;
