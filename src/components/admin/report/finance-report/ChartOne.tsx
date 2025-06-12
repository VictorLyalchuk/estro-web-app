import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { t } from 'i18next';
import { APP_ENV } from "../../../../env/config.ts";

const baseUrl = APP_ENV.BASE_URL;

const options: ApexOptions = {
  legend: {
    show: false,
    position: 'top',
    horizontalAlign: 'left',
  },
  colors: ['#3C50E0', '#80CAEE'],
  chart: {
    fontFamily: 'Satoshi, sans-serif',
    height: 335,
    type: 'area',
    dropShadow: {
      enabled: true,
      color: '#623CEA14',
      top: 10,
      blur: 4,
      left: 0,
      opacity: 0.1,
    },
    toolbar: {
      show: false,
    },
  },
  responsive: [
    {
      breakpoint: 1024,
      options: {
        chart: {
          height: 300,
        },
      },
    },
    {
      breakpoint: 1366,
      options: {
        chart: {
          height: 350,
        },
      },
    },
  ],
  stroke: {
    width: [2, 2],
    curve: 'straight',
  },
  grid: {
    xaxis: {
      lines: {
        show: true,
      },
    },
    yaxis: {
      lines: {
        show: true,
      },
    },
  },
  dataLabels: {
    enabled: false,
  },
  markers: {
    size: 4,
    colors: '#fff',
    strokeColors: ['#3056D3', '#80CAEE'],
    strokeWidth: 3,
    strokeOpacity: 0.9,
    strokeDashArray: 0,
    fillOpacity: 1,
    discrete: [],
    hover: {
      size: undefined,
      sizeOffset: 5,
    },
  },
  xaxis: {
    type: 'category',
    categories: [
      t('FinReport_January'),
      t('FinReport_February'),
      t('FinReport_March'),
      t('FinReport_April'),
      t('FinReport_May'),
      t('FinReport_June'),
      t('FinReport_July'),
      t('FinReport_August'),
      t('FinReport_September'),
      t('FinReport_October'),
      t('FinReport_November'),
      t('FinReport_December'),
    ],
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    title: {
      style: {
        fontSize: '0px',
      },
    },
    min: 0,
    max: 100000,  // Adjust this max value based on your data
  },
};

interface ChartOneState {
  series: {
    name: string;
    data: number[];
  }[];
}

const ChartOne: React.FC = () => {
  const [state, setState] = useState<ChartOneState>({
    series: [
      {
        name: t('FinReport_TotalAmount'),
        data: Array(12).fill(0), // Initialize with 12 zeros for 12 months
      },
    ],
  });

  const currentYear = new Date().getFullYear();

  const fetchMonthlyData = async () => {
    try {
      const monthPromises = [];
      for (let month = 1; month <= 12; month++) {
        monthPromises.push(axios.get<number>(`${baseUrl}/api/OrderControllers/GetTotalByMonth?month=${month}`));
      }
      const responses = await Promise.all(monthPromises);
      const monthlyTotals = responses.map(response => response.data);
      setState({
        series: [
          {
            name: t('FinReport_TotalAmount'),
            data: monthlyTotals,
          },
        ],
      });
    } catch (error) {
      console.error('Failed to fetch monthly order totals:', error);
    }
  };

  useEffect(() => {
    fetchMonthlyData();
  }, []);

  return (
      <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
        <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
          <div className="flex w-full flex-wrap gap-3 sm:gap-5">
            <div className="flex min-w-47.5">
            <span className="mt-1 mr-2 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-secondary">
              <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-secondary"></span>
            </span>
              <div className="w-full">
                <p className="font-semibold text-secondary">{t('FinReport_TotalSales')}</p>
                <p className="text-sm font-medium">{currentYear}</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div id="chartOne" className="-ml-5">
            <ReactApexChart
                options={options}
                series={state.series}
                type="area"
                height={350}
            />
          </div>
        </div>
      </div>
  );
};

export default ChartOne;