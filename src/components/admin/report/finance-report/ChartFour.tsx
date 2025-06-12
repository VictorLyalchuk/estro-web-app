import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { APP_ENV } from "../../../../env/config.ts";
import {t} from "i18next";

const baseUrl = APP_ENV.BASE_URL;

interface DailyOrderTotalDTO {
  date: string; // Format should be YYYY-MM-DD
  totalOrders: number;
  totalAmount: number;
}

const ChartFour: React.FC = () => {
  const [data, setData] = useState<DailyOrderTotalDTO[]>([]);
  const [, setLoading] = useState<boolean>(true);

  const fetchData = async () => {
    try {
      const dayPromises = [];
      for (let day = 1; day <= 31; day++) {
        dayPromises.push(axios.get<DailyOrderTotalDTO>(`${baseUrl}/api/OrderControllers/GetTotalByDay?day=${day}`));
      }
      const responses = await Promise.all(dayPromises);
      const dailyTotals = responses.map(response => response.data);
      setData(dailyTotals);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch order totals:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Prepare chart data
  const chartData = {
    series: [
      {
        name: t('FinReport_TotalAmount'),
        data: data.map(day => day.totalAmount ?? 0 ),
      },
    ],
    categories: data.map(day => new Date(day.date).getDate().toString()), // Extract day numbers from dates
  };

  const options: ApexOptions = {
    chart: {
      type: 'bar',
    },
    colors: ['#3C50E0'],
    xaxis: {
      categories: [
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '10',
        '11',
        '12',
        '13',
        '14',
        '15',
        '16',
        '17',
        '18',
        '19',
        '20',
        '21',
        '22',
        '23',
        '24',
        '25',
        '26',
        '27',
        '28',
        '29',
        '30',
        '31',
      ],

    },
  };

  return (
      <div>
        <h3>{t('FinReport_OrderTotals')}</h3>
        <ReactApexChart options={options} series={chartData.series} type="bar" height={350} />
      </div>
  );
};

export default ChartFour;