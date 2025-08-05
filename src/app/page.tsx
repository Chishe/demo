import ThresholdForm from "@/components/ThresholdForm";
import LineChart from "@/components/LineChart";
import PartTable from "@/components/PartTable";
export default function Home() {
  const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const dataPoints = [12, 19, 3, 5, 2, 3];
  const limitMin = 4;
  const limitMax = 15;
  return (
    <div className="w-full h-[96vh] p-4 box-border pt-20">
      <div className="grid grid-cols-5 grid-rows-7 gap-4 w-full h-full">
        <div className="border-2 border-sky-600 col-span-1 row-span-2 shadow-lg p-2 text-black font-bold flex items-center justify-center rounded-sm">
          <ThresholdForm />
        </div>
        <div className="border-2 border-sky-600  row-span-5 col-start-1 row-start-3 shadow-lg p-6 text-black font-bold flex items-center justify-center rounded-sm"></div>
        <div className="border-2 border-sky-600 col-span-5 row-span-4 col-start-2 row-start-1 shadow-lg p-2 text-black font-bold flex items-center justify-center rounded-sm">
          <LineChart
            labels={labels}
            dataPoints={dataPoints}
            limitMin={limitMin}
            limitMax={limitMax}
          />
        </div>
        <div className="border-2 border-sky-600 col-span-5 row-span-3 col-start-2 row-start-5 shadow-lg p-2 text-black font-bold flex items-center justify-center rounded-sm">
          <PartTable />
        </div>
      </div>
    </div>
  );
}
