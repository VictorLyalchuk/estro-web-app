import { ApexOptions } from 'apexcharts';
import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';
import { t } from "i18next";
import { APP_ENV } from "../../../../env/config.ts";

const baseUrl = APP_ENV.BASE_URL;

interface ChartTwoState {
  series: {
    name: string;
    data: number[];
  }[];
}

const options: ApexOptions = {
  colors: ['#3C50E0', '#80CAEE'],
  chart: {
    fontFamily: 'Satoshi, sans-serif',
    type: 'bar',
    height: 335,
    stacked: true,
    toolbar: {
      show: false,
    },
    zoom: {
      enabled: false,
    },
  },
  responsive: [
    {
      breakpoint: 1536,
      options: {
        plotOptions: {
          bar: {
            borderRadius: 0,
            columnWidth: '25%',
          },
        },
      },
    },
  ],
  plotOptions: {
    bar: {
      horizontal: false,
      borderRadius: 0,
      columnWidth: '25%',
      borderRadiusApplication: 'end',
      borderRadiusWhenStacked: 'last',
    },
  },
  dataLabels: {
    enabled: false,
  },
  xaxis: {
    categories: [
      t('FinReport_Monday'),
      t('FinReport_Tuesday'),
      t('FinReport_Wednesday'),
      t('FinReport_Thursday'),
      t('FinReport_Friday'),
      t('FinReport_Saturday'),
      t('FinReport_Sunday'),
    ],
  },
  legend: {
    position: 'top',
    horizontalAlign: 'left',
    fontFamily: 'Satoshi',
    fontWeight: 500,
    fontSize: '14px',
    markers: {
    },
  },
  fill: {
    opacity: 1,
  },
};

const ChartTwo: React.FC = () => {
  const [state, setState] = useState<ChartTwoState>({
    series: [
      {
        name: 'Current Week',
        data: Array(7).fill(0), // Initialize with zeros for current week
      },
      {
        name: 'Previous Week',
        data: Array(7).fill(0), // Initialize with zeros for previous week
      },
    ],
  });
  const [selectedWeek, setSelectedWeek] = useState<'current' | 'previous'>('current');

  const fetchWeeklyData = async (week: 'current' | 'previous') => {
    try {
      const dayPromises = [];
      for (let day = 1; day <= 7; day++) {
        dayPromises.push(
            axios.get<number>(`${baseUrl}/api/OrderControllers/GetTotalByWeek?week=${week}&day=${day}`)
        );
      }
      const responses = await Promise.all(dayPromises);
      const dailyTotals = responses.map(response => response.data);

      setState((prevState) => {
        const updatedSeries = prevState.series.map((seriesItem) => {
          if (seriesItem.name === (week === 'current' ? 'Current Week' : 'Previous Week')) {
            return { ...seriesItem, data: dailyTotals };
          }
          return seriesItem;
        });

        return {
          ...prevState,
          series: updatedSeries,
        };
      });
    } catch (error) {
      console.error(`Failed to fetch ${week} week order totals:`, error);
    }
  };

  useEffect(() => {
    fetchWeeklyData('current');
    fetchWeeklyData('previous');
  }, []);

  const handleWeekChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedWeek(e.target.value as 'current' | 'previous');
  };

  return (
      <div className="col-span-12 rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
        <div className="mb-4 justify-between gap-4 sm:flex">
          <div>
            <h4 className="text-xl font-semibold text-black dark:text-white">
              {t('FinReport_ProfitThisWeek')}
            </h4>
          </div>
          <div>
            <div className="relative z-20 inline-block">
              <select
                  name="#"
                  id="#"
                  className="relative z-20 inline-flex appearance-none bg-transparent py-1 pl-3 pr-8 text-sm font-medium outline-none"
                  onChange={handleWeekChange}
              >
                <option value="current">{t('FinReport_ThisWeek')}</option>
                <option value="previous">{t('FinReport_LastWeek')}</option>
              </select>
              <span className="absolute top-1/2 right-3 z-10 -translate-y-1/2">
              <svg
                  width="10"
                  height="6"
                  viewBox="0 0 10 6"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
              >
                <path
                    d="M0.47072 1.08816C0.47072 1.02932 0.500141 0.955772 0.54427 0.911642C0.647241 0.808672 0.809051 0.808672 0.912022 0.896932L4.85431 4.60386C4.92785 4.67741 5.06025 4.67741 5.14851 4.60386L9.09079 0.896932C9.19376 0.793962 9.35557 0.808672 9.45854 0.911642C9.56151 1.01461 9.5468 1.17642 9.44383 1.27939L5.50155 4.98632C5.22206 5.23639 4.78076 5.23639 4.51598 4.98632L0.558981 1.27939C0.50014 1.22055 0.47072 1.16171 0.47072 1.08816Z"
                    fill="#637381"
                />
              </svg>
            </span>
            </div>
          </div>
        </div>

        <div>
          <div id="chartTwo" className="-ml-5 -mb-9">
            <ReactApexChart
                options={options}
                series={state.series.filter(series => series.name.toLowerCase().includes(selectedWeek))}
                type="bar"
                height={350}
            />
          </div>
        </div>
      </div>
  );
};

export default ChartTwo;