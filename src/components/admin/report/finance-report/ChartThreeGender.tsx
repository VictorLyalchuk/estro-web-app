import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import axios from 'axios';
import { APP_ENV } from "../../../../env/config.ts";
import {t} from "i18next";

interface ChartData {
  womenCount: number;
  menCount: number;
  womenPercentage: number;
  menPercentage: number;
}

const baseUrl = APP_ENV.BASE_URL;

const GenderDistributionChart: React.FC = () => {
  const [data, setData] = useState<ChartData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<ChartData>(`${baseUrl}/api/OrderControllers/GetGenderPercentage`);
        setData(response.data);
      } catch (error) {
        console.error('Error fetching gender data:', error);
      }
    };

    fetchData();
  }, []);

  const options: ApexOptions = {
    chart: {
      type: 'donut',
    },
    colors: ['#775DD0', '#3C50E0'],
    labels: [t('FinReport_Women'), t('FinReport_Men')],
    legend: {
      show: true,
      position: 'bottom',
    },
    plotOptions: {
      pie: {
        donut: {
          size: '65%',
          background: 'transparent',
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      y: {
        formatter: (value: number) => `${value} ${t('FinReport_Orders')}`,
      },
    },
    responsive: [
      {
        breakpoint: 2600,
        options: {
          chart: {
            width: 380,
          },
        },
      },
      {
        breakpoint: 640,
        options: {
          chart: {
            width: 200,
          },
        },
      },
    ],
  };

  // Fallback data if not fetched
  const series = data ? [data.womenCount, data.menCount] : [0, 0];

  return (
      <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-6">
        <div className="mb-3 justify-between gap-4 sm:flex">
          <div>
            <h5 className="text-xl font-semibold text-black dark:text-white">
              {t('FinReport_GenderChoice')}
            </h5>
          </div>
        </div>

        <div className="mb-2">
          <div id="chartThree" className="mx-auto flex justify-center">
            <ReactApexChart
                options={options}
                series={series}
                type="donut"
            />
          </div>
        </div>

        <div className="-mx-8 flex flex-wrap items-center justify-center gap-y-3">
          <div className="w-full px-8 sm:w-1/2">
            <div className="flex w-full items-center">
              <span className="mr-2 block h-3 w-full max-w-3 rounded-full bg-[#3C50E0]"></span>
              <p className="flex w-full justify-between text-sm font-medium text-black dark:text-white">
                <span>{t('FinReport_Men')}</span>
                <span> {data ? `${data.menPercentage.toFixed(2)}%` : '0%'} </span>
              </p>
            </div>
          </div>
          <div className="w-full px-8 sm:w-1/2">
            <div className="flex w-full items-center">
              <span className="mr-2 block h-3 w-full max-w-3 rounded-full bg-[#a172bb]"></span>
              <p className="flex w-full justify-between text-sm font-medium text-black dark:text-white">
                <span>{t('FinReport_Women')}</span>
                <span> {data ? `${data.womenPercentage.toFixed(2)}%` : '0%'} </span>
              </p>
            </div>
          </div>
        </div>
      </div>
  );
};

export default GenderDistributionChart;
