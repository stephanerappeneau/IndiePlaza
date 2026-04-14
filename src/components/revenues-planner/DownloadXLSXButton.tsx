import { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  generateCSV,
  generateMonthlyCSV,
  aggregateMonthlyData,
} from './xlsxUtils';
import { calculateRevenues } from '@/utils/simulatorCalculations';
import { fetchSimulatorParams } from '@/utils/simulator_api';
import { FormValues } from './section/types';

const DownloadXLSXButton = ({
  formValues,
  weeksNumber,
}: {
  formValues: FormValues;
  weeksNumber: number;
}) => {
  const [loading, setLoading] = useState(false);
  const [conversionRateTable, setConversionRateTable] = useState<
    Record<number, number>
  >({});

  useEffect(() => {
    fetchSimulatorParams().then((params) => {
      setConversionRateTable((params as any).conversionRateTable ?? {});
    });
  }, []);

  const handleDownloadCSV = async () => {
    setLoading(true);
    try {
      const xlsx = await import('xlsx');
      const launchDate = new Date(formValues.launchDate);
      const weeklyData = await calculateRevenues(
        formValues,
        weeksNumber,
        conversionRateTable,
      );
      const monthlyData = aggregateMonthlyData(weeklyData, launchDate);
      const weeklyCSVContent = generateCSV(weeklyData, launchDate);
      const monthlyCSVContent = generateMonthlyCSV(monthlyData, launchDate);

      const wb = xlsx.utils.book_new();
      const weeklySheet = xlsx.utils.aoa_to_sheet([]);
      const monthlySheet = xlsx.utils.aoa_to_sheet([]);

      xlsx.utils.sheet_add_aoa(weeklySheet, weeklyCSVContent);
      xlsx.utils.sheet_add_aoa(monthlySheet, monthlyCSVContent);

      weeklySheet['!cols'] = Array(weeklyCSVContent[0].length).fill({
        wch: 20,
      });
      monthlySheet['!cols'] = Array(monthlyCSVContent[0].length).fill({
        wch: 20,
      });

      const currencyFormat = '#,##0';

      weeklyCSVContent.slice(1).forEach((row, rowIndex) => {
        row.forEach((value, colIndex) => {
          const cellAddress = xlsx.utils.encode_cell({
            r: rowIndex + 1,
            c: colIndex,
          });
          if (typeof value === 'number') {
            if (!weeklySheet[cellAddress])
              weeklySheet[cellAddress] = { v: value };
            weeklySheet[cellAddress].t = 'n';
            weeklySheet[cellAddress].z = currencyFormat;
          }
        });
      });

      monthlyCSVContent.slice(1).forEach((row, rowIndex) => {
        row.forEach((value, colIndex) => {
          const cellAddress = xlsx.utils.encode_cell({
            r: rowIndex + 1,
            c: colIndex,
          });
          if (typeof value === 'number') {
            if (!monthlySheet[cellAddress])
              monthlySheet[cellAddress] = { v: value };
            monthlySheet[cellAddress].t = 'n';
            monthlySheet[cellAddress].z = currencyFormat;
          }
        });
      });

      xlsx.utils.book_append_sheet(wb, weeklySheet, 'Weekly Data');
      xlsx.utils.book_append_sheet(wb, monthlySheet, 'Monthly Data');
      xlsx.writeFile(wb, 'revenue_data.xlsx');
    } catch (error) {
      console.error('Error generating revenue data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDownloadCSV}
      disabled={loading}
      className="flex justify-center items-center gap-1 border-2 border-gray-300 py-2 px-2 rounded-3xl min-w-fit w-1/2 hover:opacity-70"
    >
      <Image
        alt="download csv"
        width={20}
        height={20}
        src="/assets/download.svg"
      />
      <p>Export Data</p>
    </button>
  );
};

export default DownloadXLSXButton;
