import ChartFour from "./ChartFour";
import ChartOne from "./ChartOne";
import ChartThreeGender from "./ChartThreeGender.tsx";
import ChartTwo from "./ChartTwo";
import ChartThreeCategory from "./ChartThreeCategory.tsx";
import ChartThreeProducts from "./ChartThreeProducts.tsx";

const FinancialReports = () => {
  return (
    <>
      <div className="bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5">
          <div className="col-span-12">
            <ChartFour />
          </div>
          <ChartOne />
          <ChartTwo />
          <ChartThreeGender />
          <ChartThreeCategory />
        </div>
        <div className={"mt-7.5"}><ChartThreeProducts /></div>
      </div>
    </>
  );
};

export default FinancialReports;
