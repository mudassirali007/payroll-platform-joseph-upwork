import PropTypes from "prop-types";

export function ButtonLoader() {
  return (
      <div
          className="ml-2 align-[-0.125em] animate-spin border-2 border-current border-r-transparent border-solid h-3 inline-block motion-reduce:animate-[spin_1.5s_linear_infinite] rounded-full w-3"
          role="status"><span
          className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
      </div>
  );
}


ButtonLoader.displayName = "/src/widgets/loader/button-loader.jsx";

export default ButtonLoader;
