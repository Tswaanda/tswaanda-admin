import React, { FC, useMemo, useState } from "react";
import { ResponsiveLine } from "@nivo/line";
import { useTheme } from "@mui/material";



const data = {
  monthlyData: {
    'January': { month: 'January', totalSales: 15000, totalUnits: 30 },
    'February': { month: 'February', totalSales: 30000, totalUnits: 60 },
    'March': { month: 'March', totalSales: 45000, totalUnits: 90 },
    'April': { month: 'April', totalSales: 60000, totalUnits: 120 },
    'May': { month: 'May', totalSales: 75000, totalUnits: 150 },
    'June': { month: 'June', totalSales: 65000, totalUnits: 124 },
    'July': { month: 'July', totalSales: 70000, totalUnits: 147 },
    'August': { month: 'August', totalSales: 120000, totalUnits: 240 },
    'September': { month: 'September', totalSales: 135000, totalUnits: 270 },
    'October': { month: 'October', totalSales: 150000, totalUnits: 300 },
  }
};

type Props = {
  view: "sales" | "units";
};


const OverviewChart: FC<Props>  = ({ view }) => {
  const isDashboard = false;
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(false);

  const [totalSalesLine, totalUnitsLine] = useMemo(() => {
    if (!data) return [];

    const { monthlyData } = data;
    const totalSalesLine = {
      id: "totalSales",
      color: theme.palette.secondary.main,
      data: [],
    };
    const totalUnitsLine = {
      id: "totalUnits",
      color: (theme.palette.secondary as any)[600],
      data: [],
    };

    Object.values(monthlyData).reduce(
      (acc, { month, totalSales, totalUnits }) => {
        const curSales = acc.sales + totalSales;
        const curUnits = acc.units + totalUnits;

        // totalSalesLine.data = [
        //   ...totalSalesLine.data,
        //   { x: month, y: curSales },
        // ];
        // totalUnitsLine.data = [
        //   ...totalUnitsLine.data,
        //   { x: month, y: curUnits },
        // ];

        return { sales: curSales, units: curUnits };
      },
      { sales: 0, units: 0 }
    );

    return [[totalSalesLine], [totalUnitsLine]];
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!data || isLoading) return "Loading...";

  return (
    <div className="">

      {/* <ResponsiveLine
      data={view === "sales" ? totalSalesLine : totalUnitsLine}
      theme={{
        axis: {
          domain: {
            line: {
              stroke: theme.palette.secondary[200],
            },
          },
          legend: {
            text: {
              fill: theme.palette.secondary[200],
            },
          },
          ticks: {
            line: {
              stroke: theme.palette.secondary[200],
              strokeWidth: 1,
            },
            text: {
              fill: theme.palette.secondary[200],
            },
          },
        },
        legends: {
          text: {
            fill: theme.palette.secondary[200],
          },
        },
        tooltip: {
          container: {
            color: theme.palette.primary.main,
          },
        },
      }}
      margin={{ top: 20, right: 50, bottom: 50, left: 70 }}
      xScale={{ type: "point" }}
      yScale={{
        type: "linear",
        min: "auto",
        max: "auto",
        stacked: false,
        reverse: false,
      }}
      yFormat=" >-.2f"
      enableArea={isDashboard}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        format: (v) => {
          if (isDashboard) return v.slice(0, 3);
          return v;
        },
        orient: "bottom",
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: isDashboard ? "" : "Month",
        legendOffset: 36,
        legendPosition: "middle",
      }}
      axisLeft={{
        orient: "left",
        tickValues: 5,
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: isDashboard
          ? ""
          : `Total ${view === "sales" ? "Revenue" : "Units"} for Year`,
        legendOffset: -60,
        legendPosition: "middle",
      }}
      enableGridX={false}
      enableGridY={false}
      pointSize={10}
      pointColor={{ theme: "background" }}
      pointBorderWidth={2}
      pointBorderColor={{ from: "serieColor" }}
      pointLabelYOffset={-12}
      useMesh={true}
      legends={
        !isDashboard
          ? [
            {
              anchor: "bottom-right",
              direction: "column",
              justify: false,
              translateX: 30,
              translateY: -40,
              itemsSpacing: 0,
              itemDirection: "left-to-right",
              itemWidth: 80,
              itemHeight: 20,
              itemOpacity: 0.75,
              symbolSize: 12,
              symbolShape: "circle",
              symbolBorderColor: "rgba(0, 0, 0, .5)",
              effects: [
                {
                  on: "hover",
                  style: {
                    itemBackground: "rgba(0, 0, 0, .03)",
                    itemOpacity: 1,
                  },
                },
              ],
            },
          ]
          : undefined
      }
    /> */}
    </div>
  );
};

export default OverviewChart;
