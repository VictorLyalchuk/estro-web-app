import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import axios from 'axios';
import { APP_ENV } from "../../../../env/config.ts";
import i18next, { t } from "i18next";

interface CategoryData {
  categoryName_en: string;
  categoryName_fr: string;
  categoryName_es: string;
  categoryName_uk: string;
  count: number;
  percentage: number;
}

const baseUrl = APP_ENV.BASE_URL;

const CategoryDistributionChart: React.FC = () => {
  const [data, setData] = useState<CategoryData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<{ value: CategoryData[] }>(`${baseUrl}/api/OrderControllers/GetTopFourCategories`);
        setData(response.data.value); // Adjust according to the actual structure
      } catch (error) {
        console.error('Error fetching category data:', error);
      }
    };

    fetchData();
  }, []);

  // Get the current language
  const currentLanguage = i18next.language;

  // Map category names based on the current language
  const categoryNameField = `name_${currentLanguage}` as keyof CategoryData;

  // Ensure that data is an array before mapping
  const categories = Array.isArray(data) ? data.map((item) => item[categoryNameField] || 'Unknown') : [];
  const series = Array.isArray(data) ? data.map((item) => item.count) : [];


  const options: ApexOptions = {
    chart: {
      type: 'donut',
    },
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    labels: categories, // Dynamically add category labels
    colors: ['#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0'], // Different colors for categories
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

  return (
      <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-6">
        <div className="mb-3 justify-between gap-4 sm:flex">
          <div>
            <h5 className="text-xl font-semibold text-black dark:text-white">
              {t('FinReport_CategoryDistribution')}
            </h5>
          </div>
        </div>

        <div className="mb-2">
          <div id="chartCategory" className="mx-auto flex justify-center">
            <ReactApexChart options={options} series={series} type="donut" />
          </div>
        </div>

        <div className="-mx-8 flex flex-wrap items-center justify-center gap-y-3">
          {data.map((category, index) => (
              <div key={index} className="w-full px-8 sm:w-1/2">
                <div className="flex w-full items-center">
              <span
                  className="mr-2 block h-3 w-full max-w-3 rounded-full"
                  style={{ backgroundColor: options.colors ? options.colors[index] : '#000' }}
              ></span>
                  <p className="flex w-full justify-between text-sm font-medium text-black dark:text-white">
                    <span>{category[categoryNameField] || 'Unknown'}</span>
                    <span>{category.percentage.toFixed(2)}%</span>
                  </p>
                </div>
              </div>
          ))}
        </div>
      </div>
  );
};

export default CategoryDistributionChart;
